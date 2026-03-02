import { BENCHMARKS } from './benchmarks'

export interface DiagnosticoInput {
  leads: number
  ticket: number
  closingRate: number      // 0-1
  closers: string
}

export interface DiagnosticoOutput {
  // Revenue
  revenueActual: number
  revenuePotencial: number
  revenuePerdido: number
  revenueRecuperable: number  // conservador: 60% del gap

  // Deals
  dealsActuales: number
  dealsPotenciales: number
  dealsPerdidos: number

  // Tasa potencial (calculada, no pedida)
  tasaPotencial: number

  // Distribución del problema
  pctSinCalificar: number
  pctPerfilMismatch: number
  pctSinBrief: number

  // Problema principal (para personalizar el brief)
  problemaPrincipal: 'calificacion' | 'mismatch' | 'brief'

  // Tiempo
  horasPerdidas: number

  // ROI del sistema
  costoSistema: number
  roiMultiplier: number

  // Perfil del Closing Cuántico asignado
  perfilCQ: 'emocional' | 'racional' | 'critico' | 'decisor'
}

export function calculateRevenueGap(input: DiagnosticoInput): DiagnosticoOutput {
  const { leads, ticket, closingRate, closers } = input

  const tasaPotencial = BENCHMARKS.tasaPotencial(ticket, closingRate)
  const dist = BENCHMARKS.distribucion(closingRate)

  const dealsActuales = leads * closingRate
  const dealsPotenciales = leads * tasaPotencial
  const dealsPerdidos = dealsPotenciales - dealsActuales

  const revenueActual = dealsActuales * ticket
  const revenuePotencial = dealsPotenciales * ticket
  const revenuePerdido = dealsPerdidos * ticket
  const revenueRecuperable = Math.round(revenuePerdido * 0.60)

  const horasPerdidas = BENCHMARKS.horasPerdidas(leads, closingRate)

  const costoSistema = 500
  const roiMultiplier = Math.round(revenueRecuperable / costoSistema)

  // Problema principal = el de mayor porcentaje
  const problemaPrincipal =
    dist.sinCalificar >= dist.perfilMismatch && dist.sinCalificar >= dist.sinBrief
      ? 'calificacion'
      : dist.perfilMismatch >= dist.sinBrief
        ? 'mismatch'
        : 'brief'

  // Perfil del Closing Cuántico asignado al lead
  // (no al prospecto — al DUEÑO del negocio que hace el diagnóstico)
  // Lógica: según combinación de ticket + closing rate + tamaño del equipo
  const perfilCQ: DiagnosticoOutput['perfilCQ'] =
    ticket > 10000 && closingRate < 0.20 ? 'racional' :  // ticket alto, cierra poco → analiza mucho, inseguro
    closingRate < 0.15                   ? 'emocional' :  // cierra muy poco → impulsivo, sin sistema
    closers === '4+'                      ? 'decisor'  :  // equipo grande → necesita consultar
                                           'critico'      // closing rate medio → ya lo intentó antes

  return {
    revenueActual: Math.round(revenueActual),
    revenuePotencial: Math.round(revenuePotencial),
    revenuePerdido: Math.round(revenuePerdido),
    revenueRecuperable,
    dealsActuales: Math.round(dealsActuales),
    dealsPotenciales: Math.round(dealsPotenciales),
    dealsPerdidos: Math.round(dealsPerdidos),
    tasaPotencial,
    pctSinCalificar: dist.sinCalificar,
    pctPerfilMismatch: dist.perfilMismatch,
    pctSinBrief: dist.sinBrief,
    problemaPrincipal,
    horasPerdidas,
    costoSistema,
    roiMultiplier,
    perfilCQ
  }
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
