import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

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
    const { nombre, email } = body;
    
    // Validaciones básicas
    if (!nombre || !email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }
    
    // En modo estático, solo logueamos y retornamos éxito
    console.log('Lead capturado (modo estático):', { nombre, email });
    
    return NextResponse.json({
      success: true,
      leadId: 1,
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

// GET endpoint para ver leads
export async function GET() {
  return NextResponse.json({ success: true, leads: [] });
}
