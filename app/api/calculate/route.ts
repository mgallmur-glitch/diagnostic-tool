import { NextResponse } from 'next/server';
import { calculateRevenueGap, type DiagnosticInput } from '@/lib/calculations';

export async function POST(req: Request) {
  try {
    const body: DiagnosticInput = await req.json();
    const result = calculateRevenueGap(body);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error calculating revenue gap:', error);
    return NextResponse.json(
      { success: false, error: 'Error calculating revenue gap' },
      { status: 500 }
    );
  }
}
