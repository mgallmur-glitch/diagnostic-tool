import { NextResponse } from 'next/server'
import { supabase, saveLead, updateLeadStatus } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Configuración del webhook de Maria (OpenClaw)
const OPENCLAW_WEBHOOK_URL = process.env.OPENCLAW_WEBHOOK_URL || 'http://72.61.7.167:18789/hooks/agent'
const OPENCLAW_WEBHOOK_TOKEN = process.env.OPENCLAW_WEBHOOK_TOKEN || ''

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      nombre,
      email,
      whatsapp,
      closers,
      leads,
      ticket,
      closingRate,
      facturacionMensual,
      revenuePerdido,
      revenueRecuperable,
      perfilCQ,
      roiMultiplier,
    } = body

    // Validaciones básicas
    if (!nombre || !email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    // 1. GUARDAR EN BASE DE DATOS
    const lead = await saveLead({
      nombre,
      email,
      whatsapp: whatsapp || null,
      closers: closers || 'Solo yo',
      leads_mes: leads || 42,
      ticket: ticket || 6000,
      closing_rate: closingRate || 0.18,
      facturacion_mensual: facturacionMensual || null,
      revenue_perdido: revenuePerdido || 0,
      revenue_recuperable: revenueRecuperable || 0,
      perfil_cq: perfilCQ || 'critico',
      roi_multiplier: roiMultiplier || 10,
      status: 'nuevo',
    })

    // 2. ENVIAR WHATSAPP (si proporcionó número)
    let whatsappStatus = 'skipped'
    if (whatsapp && whatsapp.length > 8) {
      try {
        whatsappStatus = await enviarWhatsAppMaria({
          leadId: lead.id,
          nombre,
          whatsapp,
          revenuePerdido,
          perfilCQ,
          closingRate,
          ticket,
        })
      } catch (error) {
        console.error('Error enviando WhatsApp:', error)
        whatsappStatus = 'error'
      }
    }

    // 3. ENVIAR EMAIL (si no se envió WhatsApp o como backup)
    let emailStatus = 'skipped'
    if (!whatsapp || whatsappStatus !== 'sent') {
      try {
        emailStatus = await enviarEmailResend({
          leadId: lead.id,
          nombre,
          email,
          revenuePerdido,
          revenueRecuperable,
          perfilCQ,
          roiMultiplier,
        })
      } catch (error) {
        console.error('Error enviando email:', error)
        emailStatus = 'error'
      }
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      whatsappStatus,
      emailStatus,
    })

  } catch (error) {
    console.error('Error capturing lead:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

async function enviarWhatsAppMaria({
  leadId,
  nombre,
  whatsapp,
  revenuePerdido,
  perfilCQ,
  closingRate,
  ticket,
}: {
  leadId: string
  nombre: string
  whatsapp: string
  revenuePerdido: number
  perfilCQ: string
  closingRate: number
  ticket: number
}) {
  // Formatear número a E.164 (+51987654321)
  let numeroFormateado = whatsapp.replace(/[\s\-\(\)]/g, '')
  
  // Si empieza con 00, reemplazar por +
  if (numeroFormateado.startsWith('00')) {
    numeroFormateado = '+' + numeroFormateado.slice(2)
  }
  
  // Si no empieza con +, detectar país por prefijo o usar +51 (Perú por defecto para LatAm)
  if (!numeroFormateado.startsWith('+')) {
    // Si empieza con 51 (Perú), 52 (México), 54 (Argentina), 57 (Colombia), etc.
    const prefijosLatam = ['51', '52', '54', '55', '56', '57', '58']
    const tienePrefijo = prefijosLatam.some(p => numeroFormateado.startsWith(p))
    
    if (tienePrefijo && numeroFormateado.length >= 11) {
      // Ya tiene prefijo de país sin el +
      numeroFormateado = '+' + numeroFormateado
    } else {
      // Asumir Perú por defecto si no tiene prefijo claro
      numeroFormateado = '+51' + numeroFormateado.replace(/^0/, '')
    }
  }
  
  const numeroFinal = numeroFormateado

  // Construir mensaje según el perfil detectado
  const mensajesPerfil: Record<string, string> = {
    emocional: `¡Hola ${nombre}! 👋\n\nDetectamos que tu equipo deja **$${revenuePerdido.toLocaleString()} al mes** sobre la mesa por falta de información antes de las llamadas.\n\nCon un closing rate del ${Math.round(closingRate * 100)}% en tickets de $${ticket.toLocaleString()}, tienes potencial inmediato de mejora.\n\n¿Quieres que agendemos 30 minutos para mostrarte exactamente dónde está el gap? → https://calendly.com/mgallmur/45`,
    
    racional: `Hola ${nombre},\n\nBasado en tu diagnóstico:\n📊 Revenue Gap: $${revenuePerdido.toLocaleString()}/mes\n📈 Closing rate actual: ${Math.round(closingRate * 100)}%\n🎯 Potencial con sistema: 35%\n\nTu perfil (${perfilCQ}) indica que necesitas datos concretos antes de decidir. Aquí los tienes.\n\n¿Te gustaría ver el análisis completo en una llamada? → https://calendly.com/mgallmur/45`,
    
    critico: `${nombre},\n\nTu diagnóstico está listo.\n\nGap identificado: $${revenuePerdido.toLocaleString()}/mes\nProblema principal: Tu closer improvisa porque no tiene información del perfil del lead.\n\nNo es un problema de habilidad. Es un problema de sistema.\n\nSi quieres ver cómo se soluciona: https://calendly.com/mgallmur/45`,
    
    decisor: `Hola ${nombre},\n\nSegún tus números, estás perdiendo aproximadamente $${revenuePerdido.toLocaleString()} mensuales en oportunidades de cierre.\n\nEsto suele pasar cuando el equipo crece pero los procesos no escalan.\n\n¿Tienes 30 min esta semana para revisar cómo otros equipos de ${ticket >= 10000 ? 'high-ticket' : 'tu tamaño'} resolvieron esto? → https://calendly.com/mgallmur/45`,
  }

  const mensaje = mensajesPerfil[perfilCQ] || mensajesPerfil.critico

  const response = await fetch(OPENCLAW_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENCLAW_WEBHOOK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: mensaje,
      agentId: 'maria',
      deliver: true,
      channel: 'whatsapp',
      to: numeroFinal,
      wakeMode: 'now',
      timeoutSeconds: 60,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Maria webhook error:', errorText)
    throw new Error(`Webhook error: ${response.status}`)
  }

  // Actualizar status en DB
  await updateLeadStatus(leadId, 'whatsapp_enviado')
  
  // Registrar envío
  if (supabase) {
    await supabase.from('envios').insert([{
      lead_id: leadId,
      canal: 'whatsapp',
      status: 'enviado',
    }])
  }

  return 'sent'
}

async function enviarEmailResend({
  leadId,
  nombre,
  email,
  revenuePerdido,
  revenueRecuperable,
  perfilCQ,
  roiMultiplier,
}: {
  leadId: string
  nombre: string
  email: string
  revenuePerdido: number
  revenueRecuperable: number
  perfilCQ: string
  roiMultiplier: number
}) {
  if (!resend) {
    console.warn('RESEND no configurado')
    return 'skipped_no_key'
  }

  const { data, error } = await resend.emails.send({
    from: 'The Closing Code <hola@theclosingcode.ai>',
    to: email,
    subject: `${nombre}, tu equipo deja $${revenuePerdido.toLocaleString()}/mes sobre la mesa`,
    html: generarEmailTemplate({
      nombre,
      revenuePerdido,
      revenueRecuperable,
      perfilCQ,
      roiMultiplier,
    }),
  })

  if (error) {
    console.error('Resend error:', error)
    
    // Registrar error
    if (supabase) {
      await supabase.from('envios').insert([{
        lead_id: leadId,
        canal: 'email',
        status: 'error',
        error_msg: error.message,
      }])
    }
    
    throw error
  }

  // Actualizar status en DB
  await updateLeadStatus(leadId, 'email_enviado')
  
  // Registrar envío
  if (supabase) {
    await supabase.from('envios').insert([{
      lead_id: leadId,
      canal: 'email',
      status: 'enviado',
    }])
  }

  return 'sent'
}

function generarEmailTemplate({
  nombre,
  revenuePerdido,
  revenueRecuperable,
  perfilCQ,
  roiMultiplier,
}: {
  nombre: string
  revenuePerdido: number
  revenueRecuperable: number
  perfilCQ: string
  roiMultiplier: number
}) {
  const perfiles: Record<string, { titulo: string; desc: string }> = {
    emocional: {
      titulo: 'El potencial está ahí, falta el sistema',
      desc: 'Tu equipo tiene la energía, pero pierde tiempo con leads que no deberían estar en las llamadas.',
    },
    racional: {
      titulo: 'Los números no mienten',
      desc: 'Analizamos tu operación y el gap es significativo. Aquí tienes los datos para decidir.',
    },
    critico: {
      titulo: 'No es un problema de habilidad',
      desc: 'Tu closer sabe cerrar. El problema es que improvisa porque no tiene información antes de la llamada.',
    },
    decisor: {
      titulo: 'Tu equipo necesita un sistema que escale',
      desc: 'A medida que creces, los procesos manuales se convierten en cuellos de botella.',
    },
  }

  const perfil = perfiles[perfilCQ] || perfiles.critico

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu diagnóstico está listo</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #060610; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #060610;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.05) 100%); border: 1px solid rgba(0,212,255,0.2); border-radius: 24px; padding: 40px;">
          
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Hola ${nombre},</h1>
              <p style="color: #B0C4D8; font-size: 16px; margin-top: 10px;">Tu diagnóstico de Revenue Gap está listo</p>
            </td>
          </tr>
          
          <tr>
            <td style="background: rgba(255,56,96,0.1); border: 1px solid rgba(255,56,96,0.3); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="color: #FF3860; font-size: 14px; margin: 0 0 8px;">Revenue Gap Detectado</p>
              <p style="color: #FF3860; font-size: 42px; font-weight: bold; margin: 0;">$${revenuePerdido.toLocaleString()}</p>
              <p style="color: #B0C4D8; font-size: 14px; margin: 8px 0 0;">por mes</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 24px 0;">
              <h2 style="color: #fbbf24; font-size: 20px; margin: 0 0 12px;">${perfil.titulo}</h2>
              <p style="color: #B0C4D8; font-size: 16px; line-height: 1.6; margin: 0;">${perfil.desc}</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 24px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px;">
                    <p style="color: #6B8299; font-size: 12px; margin: 0 0 4px;">Revenue recuperable estimado</p>
                    <p style="color: #00D084; font-size: 24px; font-weight: bold; margin: 0;">$${revenueRecuperable.toLocaleString()}/mes</p>
                  </td>
                </tr>
                <tr><td height="12"></td></tr>
                <tr>
                  <td style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px;">
                    <p style="color: #6B8299; font-size: 12px; margin: 0 0 4px;">ROI proyectado</p>
                    <p style="color: #fbbf24; font-size: 24px; font-weight: bold; margin: 0;">${roiMultiplier}x${roiMultiplier >= 20 ? '+' : ''}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 24px 0; text-align: center;">
              <a href="https://calendly.com/mgallmur/45" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                Agendar llamada de análisis →
              </a>
            </td>
          </tr>
          
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="color: #6B8299; font-size: 12px; text-align: center; margin: 0;">
                Solo 3 cupos disponibles esta semana<br>
                Implementación en 7 días hábiles
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
