import { NextResponse } from 'next/server';
import { calculateRevenueGap, type DiagnosticoInput } from '@/lib/calculations';

// export const dynamic = 'force-static';

export async function POST(req: Request) {
  try {
    const body: DiagnosticoInput = await req.json();
    const { leads, ticket, closingRate, closers } = body;
    
    // Validaciones básicas
    if (!leads || !ticket || !closingRate || !closers) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }
    
    // Calcular revenue gap
    const result = calculateRevenueGap({ leads, ticket, closingRate, closers });
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error calculating revenue gap:', error);
    return NextResponse.json(
      { success: false, error: 'Error calculando revenue gap' },
      { status: 500 }
    );
  }
}
