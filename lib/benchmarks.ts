// lib/benchmarks.ts
// Benchmarks del Closing Cuántico para LatAm high-ticket

export const BENCHMARKS = {
  // Tasa potencial alcanzable con el sistema completo
  tasaPotencial: (ticket: number, closingRate: number): number => {
    // Base según ticket
    const base =
      ticket < 2000  ? 0.32 :
      ticket < 5000  ? 0.35 :
      ticket < 10000 ? 0.38 :
      ticket < 20000 ? 0.40 :
                       0.35  // tickets muy altos = proceso más largo, tasa menor

    // Ajuste: si ya están cerca del benchmark, el delta es menor
    // (no prometemos pasar de 30% a 38% — solo de 18% a 35%)
    const delta = base - closingRate
    if (delta < 0.05) return closingRate + 0.05  // mínimo 5 puntos de mejora
    return base
  },

  // Distribución del problema según closing rate
  // (cuanto más bajo el closing rate, más peso a calificación)
  distribucion: (closingRate: number): {
    sinCalificar: number,
    perfilMismatch: number,
    sinBrief: number
  } => {
    if (closingRate <= 0.12) return {
      sinCalificar: 0.52,   // el problema dominante es calificación
      perfilMismatch: 0.22,
      sinBrief: 0.26
    }
    if (closingRate <= 0.20) return {
      sinCalificar: 0.40,
      perfilMismatch: 0.26,
      sinBrief: 0.34
    }
    if (closingRate <= 0.28) return {
      sinCalificar: 0.28,
      perfilMismatch: 0.30,
      sinBrief: 0.42
    }
    // Closing rate alto: el problema principal es perfil mismatch
    return {
      sinCalificar: 0.20,
      perfilMismatch: 0.38,
      sinBrief: 0.42
    }
  },

  // Horas perdidas por semana (dato del business plan)
  horasPerdidas: (leads: number, closingRate: number): number => {
    const llamadasPerdidas = leads * (1 - closingRate)
    const minutosPromedioPorLlamadaPerdida = 32  // dato real de closers sin brief
    return Math.round((llamadasPerdidas * minutosPromedioPorLlamadaPerdida) / 60)
  }
}
