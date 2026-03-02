import { NextResponse } from 'next/server';
import { dbOperations, type Lead } from '@/lib/db';
import { sendDiagnosticEmail } from '@/lib/email';

interface CaptureLeadRequest {
  nombre: string;
  email: string;
  whatsapp?: string;
  llamadas?: number;
  ticket?: number;
  closingRate?: number;
  revenuePerdido?: number;
}

export async function POST(req: Request) {
  try {
    const body: CaptureLeadRequest = await req.json();
    const { nombre, email, whatsapp, llamadas, ticket, closingRate, revenuePerdido } = body;
    
    // Validaciones básicas
    if (!nombre || !email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }
    
    // Guardar en SQLite
    const lead = dbOperations.create({
      nombre,
      email,
      whatsapp,
      llamadas,
      ticket,
      closingRate,
      revenuePerdido,
    });
    
    // Enviar email
    if (revenuePerdido) {
      await sendDiagnosticEmail({
        to: email,
        nombre,
        revenuePerdido,
        // TODO: Generar PDF y añadir URL
      });
    }
    
    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Lead capturado exitosamente',
    });
  } catch (error) {
    console.error('Error capturing lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error capturando lead' },
      { status: 500 }
    );
  }
}

// GET endpoint para ver leads (protegido en producción)
export async function GET() {
  try {
    const leads = dbOperations.getAll();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Error obteniendo leads' },
      { status: 500 }
    );
  }
}
