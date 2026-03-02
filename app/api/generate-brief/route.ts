import { NextResponse } from 'next/server';
import { generateBrief, type GenerateBriefRequest } from '@/lib/glm4';

export async function POST(req: Request) {
  try {
    const body: GenerateBriefRequest = await req.json();
    const { closingRate, ticket, perfilDetectado } = body;
    
    // Validaciones básicas
    if (!closingRate || !ticket || !perfilDetectado) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }
    
    // Generar brief usando GLM-4
    const brief = await generateBrief({
      closingRate,
      ticket,
      perfilDetectado,
    });
    
    return NextResponse.json({ success: true, brief });
  } catch (error) {
    console.error('Error generating brief:', error);
    return NextResponse.json(
      { success: false, error: 'Error generando brief' },
      { status: 500 }
    );
  }
}
