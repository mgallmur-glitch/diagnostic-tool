import { NextResponse } from 'next/server';
import { generateBrief, type GenerateBriefRequest } from '@/lib/glm4';

export async function POST(req: Request) {
  try {
    const body: GenerateBriefRequest = await req.json();
    const { input, output } = body;
    
    // Validaciones básicas
    if (!input || !output) {
      return NextResponse.json(
        { success: false, error: 'Datos de diagnóstico requeridos' },
        { status: 400 }
      );
    }
    
    // Validar campos requeridos en input
    if (!input.leads || !input.ticket || !input.closingRate || !input.closers) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos del input son requeridos' },
        { status: 400 }
      );
    }
    
    // Generar brief usando GLM-4
    const brief = await generateBrief({ input, output });
    
    return NextResponse.json({ success: true, brief });
  } catch (error) {
    console.error('Error generating brief:', error);
    return NextResponse.json(
      { success: false, error: 'Error generando brief' },
      { status: 500 }
    );
  }
}
