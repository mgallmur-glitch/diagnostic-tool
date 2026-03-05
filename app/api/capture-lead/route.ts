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
          leads: leads || 42,
          closers: closers || 'Solo yo',
          ticket: ticket || 6000,
          closingRate: closingRate || 0.18,
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
  leads,
  closers,
  ticket,
  closingRate,
}: {
  leadId: string
  nombre: string
  whatsapp: string
  revenuePerdido: number
  leads: number
  closers: string
  ticket: number
  closingRate: number
}) {
  // Formatear número a E.164 (+51987654321)
  let numeroFormateado = whatsapp.replace(/[\s\-\(\)]/g, '')
  
  if (numeroFormateado.startsWith('00')) {
    numeroFormateado = '+' + numeroFormateado.slice(2)
  }
  
  if (!numeroFormateado.startsWith('+')) {
    const prefijosLatam = ['51', '52', '54', '55', '56', '57', '58']
    const tienePrefijo = prefijosLatam.some(p => numeroFormateado.startsWith(p))
    
    if (tienePrefijo && numeroFormateado.length >= 11) {
      numeroFormateado = '+' + numeroFormateado
    } else {
      numeroFormateado = '+51' + numeroFormateado.replace(/^0/, '')
    }
  }
  
  const numeroFinal = numeroFormateado

  // Calcular revenues
  const revenueActualNum = Math.round(leads * ticket * closingRate)
  const revenueConSistemaNum = Math.round(leads * ticket * 0.35)
  
  // FIX: Gap nunca negativo (si closing rate > 35%, gap = 0)
  const gapNum = Math.max(0, revenueConSistemaNum - revenueActualNum)
  
  // Formatear a USD
  const formatUSD = (num: number) => `$${num.toLocaleString('en-US')}`
  const revenueActual = formatUSD(revenueActualNum)
  const revenueConSistema = formatUSD(revenueConSistemaNum)
  const gap = formatUSD(gapNum)

  // Payload exacto según especificación de OpenClaw
  const payload = {
    nombre,
    leads,
    ticket,
    closingRate: Math.round(closingRate * 100),
    closers,
    revenueActual,
    revenueConSistema,
    gap,
    phone: numeroFinal,
  }

  console.log('Enviando payload a OpenClaw:', JSON.stringify(payload, null, 2))

  const response = await fetch(OPENCLAW_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENCLAW_WEBHOOK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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
  // Perfiles del Closing Cuántico - usados solo para el email
  // (El Brief Preview sí usa estos perfiles como demo del producto)
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
