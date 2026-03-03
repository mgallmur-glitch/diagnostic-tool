import { NextResponse } from 'next/server';
import { getMockBrief, type GenerateBriefRequest } from '@/lib/glm4';

export const dynamic = 'force-static';

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
    
    // En modo estático, usar mock brief
    const brief = getMockBrief({ input, output });
    
    return NextResponse.json({ success: true, brief });
  } catch (error) {
    console.error('Error generating brief:', error);
    return NextResponse.json(
      { success: false, error: 'Error generando brief' },
      { status: 500 }
    );
  }
}
