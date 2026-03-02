export interface DiagnosticInput {
  llamadas: number;
  ticket: number;
  closingRate: number;
  closers?: string;
}

export interface DiagnosticResult {
  llamadas: number;
  ticket: number;
  closingRate: number;
  dealsActuales: number;
  dealsPotenciales: number;
  dealsPerdidos: number;
  revenuePerdido: number;
  benchmark: number;
  pctNoCalificados: number;
  pctPerfilMismatch: number;
  pctSinBrief: number;
  horasPerdidas: number;
  costoSistema: number;
  roiMultiplier: number;
  revenueRecuperable: number;
}

export function calculateRevenueGap(input: DiagnosticInput): DiagnosticResult {
  const { llamadas, ticket, closingRate, closers } = input;
  const closingRateDecimal = closingRate / 100;
  
  // Benchmark dinámico basado en el closing rate actual
  const benchmark = closingRateDecimal < 0.15 ? 0.28 :
                    closingRateDecimal < 0.25 ? 0.32 :
                    closingRateDecimal < 0.35 ? 0.38 : 0.42;
  
  // Cálculo central
  const dealsActuales = llamadas * closingRateDecimal;
  const dealsPotenciales = llamadas * benchmark;
  const dealsPerdidos = dealsPotenciales - dealsActuales;
  const revenuePerdido = dealsPerdidos * ticket;
  
  // Distribución del problema (dinámica según closing rate)
  const pctNoCalificados = closingRateDecimal < 0.15 ? 0.45 :
                           closingRateDecimal < 0.25 ? 0.38 : 0.28;
  
  const pctPerfilMismatch = 0.24; // constante — siempre presente
  const pctSinBrief = 1 - pctNoCalificados - pctPerfilMismatch;
  
  // Tiempo perdido por el closer
  const horasPerdidas = Math.round(dealsPerdidos * 0.5 * 13.5);
  
  // ROI del sistema
  const costoSistema = 500; // retainer mensual
  const roiMultiplier = Math.round(revenuePerdido / costoSistema);
  const revenueRecuperable = Math.round(revenuePerdido * 0.6);
  
  return {
    llamadas,
    ticket,
    closingRate: closingRateDecimal,
    dealsActuales,
    dealsPotenciales,
    dealsPerdidos,
    revenuePerdido,
    benchmark,
    pctNoCalificados,
    pctPerfilMismatch,
    pctSinBrief,
    horasPerdidas,
    costoSistema,
    roiMultiplier,
    revenueRecuperable,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
