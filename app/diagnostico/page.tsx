'use client';

import { useState } from 'react';
import { calculateRevenueGap, formatCurrency, formatPercent, type DiagnosticInput, type DiagnosticResult } from '@/lib/calculations';

// Screen components (placeholder for now)
function PreHeroScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-void)] p-4">
      <div className="text-center max-w-4xl">
        <div className="text-8xl font-bold text-[var(--color-error)] mb-8">
          $0... $1,200... $4,800... $12,000... $31,000...
        </div>
        <p className="text-2xl text-[var(--color-white)] mb-8">
          Cada mes que pasa sin un sistema,<br />
          este es el revenue que tu equipo no cierra.
        </p>
        <button
          onClick={onNext}
          className="px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-[var(--glow-blue)]"
        >
          CALCULAR MI NÚMERO →
        </button>
      </div>
    </div>
  );
}

function HeroScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-void)] p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,102,255,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(0,212,255,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(0,64,204,0.10)_0%,transparent_60%),var(--color-void)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          <span className="text-[var(--color-white)]">TU CLOSER NO TIENE UN PROBLEMA DE ACTITUD.</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]">
            TIENE UN PROBLEMA DE ARQUITECTURA.
          </span>
        </h1>
        
        <p className="text-xl text-[var(--color-mist)] mb-12">
          Cada semana, tu equipo improvisa en llamadas<br />
          que ya debería saber cómo ganar.<br />
          Calculamos el costo exacto de esa improvisación.
        </p>
        
        <p className="text-lg text-[var(--color-accent)] mb-8 font-semibold">
          90 segundos. 3 preguntas. Tu número real.
        </p>
        
        <button
          onClick={onNext}
          className="px-10 py-5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold rounded-full text-xl hover:scale-105 transition-transform shadow-[var(--glow-blue)]"
        >
          CALCULAR MI REVENUE GAP →
        </button>
        
        <div className="mt-12 text-[var(--color-fog)] text-sm">
          ✓ Gratis   ✓ Sin registro previo   ✓ Resultado inmediato
        </div>
      </div>
    </div>
  );
}

function CalculadoraScreen({ onNext, onInput }: { onNext: (input: DiagnosticInput) => void, onInput: (input: Partial<DiagnosticInput>) => void }) {
  const [llamadas, setLlamadas] = useState(47);
  const [ticket, setTicket] = useState(5000);
  const [closingRate, setClosingRate] = useState(18);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-void)] p-4">
      <div className="max-w-2xl w-full bg-[rgba(0,102,255,0.06)] backdrop-blur-[20px] border border-[rgba(0,212,255,0.12)] rounded-[20px] p-8 shadow-[var(--shadow-glass)]">
        <h2 className="text-3xl font-bold text-[var(--color-white)] mb-8 text-center">
          Responde 3 preguntas rápidas
        </h2>
        
        {/* Pregunta 1 */}
        <div className="mb-10">
          <label className="block text-[var(--color-white)] font-semibold mb-4">
            ¿Cuántas llamadas de venta hace tu equipo al mes?
          </label>
          <input
            type="range"
            min="10"
            max="200"
            value={llamadas}
            onChange={(e) => { setLlamadas(Number(e.target.value)); onInput({ llamadas: Number(e.target.value) }); }}
            className="w-full h-2 bg-[var(--color-deep)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
          />
          <div className="text-2xl font-bold text-[var(--color-accent)] mt-2 text-center">
            {llamadas} llamadas/mes
          </div>
        </div>
        
        {/* Pregunta 2 */}
        <div className="mb-10">
          <label className="block text-[var(--color-white)] font-semibold mb-4">
            ¿Cuál es el ticket promedio de tu oferta?
          </label>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={ticket}
            onChange={(e) => { setTicket(Number(e.target.value)); onInput({ ticket: Number(e.target.value) }); }}
            className="w-full h-2 bg-[var(--color-deep)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
          />
          <div className="text-2xl font-bold text-[var(--color-accent)] mt-2 text-center">
            ${ticket.toLocaleString()}
          </div>
        </div>
        
        {/* Pregunta 3 */}
        <div className="mb-10">
          <label className="block text-[var(--color-white)] font-semibold mb-4">
            ¿Qué porcentaje de esas llamadas cierra tu equipo?
          </label>
          <input
            type="range"
            min="5"
            max="45"
            value={closingRate}
            onChange={(e) => { setClosingRate(Number(e.target.value)); onInput({ closingRate: Number(e.target.value) }); }}
            className="w-full h-2 bg-[var(--color-deep)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
          />
          <div className="text-2xl font-bold text-[var(--color-accent)] mt-2 text-center">
            {closingRate}%
          </div>
          <p className="text-[var(--color-fog)] text-sm mt-2 text-center">
            Benchmarks: Sin sistema: 11-18% | Con brief: 25-32% | Con sistema completo: 35-45%
          </p>
        </div>
        
        <button
          onClick={() => onNext({ llamadas, ticket, closingRate })}
          className="w-full px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-[var(--glow-blue)]"
        >
          ANALIZAR MI SISTEMA →
        </button>
        
        <p className="mt-6 text-[var(--color-fog)] text-xs text-center">
          🔒 Tu información es confidencial y no se comparte.
        </p>
      </div>
    </div>
  );
}

function GateScreen({ onNext }: { onNext: (data: { nombre: string, email: string, whatsapp: string }) => void }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-void)] p-4">
      <div className="max-w-md w-full bg-[rgba(0,102,255,0.06)] backdrop-blur-[20px] border border-[rgba(0,212,255,0.12)] rounded-[20px] p-8 shadow-[var(--shadow-glass)]">
        <h2 className="text-2xl font-bold text-[var(--color-white)] mb-6 text-center">
          🔍 Tu diagnóstico está listo.
        </h2>
        
        <p className="text-[var(--color-mist)] mb-8 text-center">
          Detectamos un Revenue Gap en tu sistema de ventas.<br />
          Para mostrarte el análisis completo, necesitamos tu email.
        </p>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(0,212,255,0.15)] rounded-lg text-[var(--color-white)] focus:border-[rgba(0,102,255,0.60)] focus:shadow-[0_0_0_3px_rgba(0,102,255,0.15)] outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(0,212,255,0.15)] rounded-lg text-[var(--color-white)] focus:border-[rgba(0,102,255,0.60)] focus:shadow-[0_0_0_3px_rgba(0,102,255,0.15)] outline-none"
          />
          <input
            type="tel"
            placeholder="WhatsApp (opcional)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(0,212,255,0.15)] rounded-lg text-[var(--color-white)] focus:border-[rgba(0,102,255,0.60)] focus:shadow-[0_0_0_3px_rgba(0,102,255,0.15)] outline-none"
          />
        </div>
        
        <button
          onClick={() => onNext({ nombre, email, whatsapp })}
          disabled={!nombre || !email}
          className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-[var(--glow-blue)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          VER MI DIAGNÓSTICO COMPLETO →
        </button>
        
        <p className="mt-6 text-[var(--color-fog)] text-xs text-center">
          🔒 Sin spam. Solo recibirás el diagnóstico y seguimiento personalizado.
        </p>
      </div>
    </div>
  );
}

function DiagnosticoScreen({ result }: { result: DiagnosticResult }) {
  return (
    <div className="min-h-screen bg-[var(--color-void)] p-4">
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-3xl font-bold text-[var(--color-white)] mb-8 text-center">
          📊 DIAGNÓSTICO DE SISTEMA DE VENTAS
        </h2>
        
        {/* Revenue Gap Card */}
        <div className="bg-[rgba(0,102,255,0.10)] backdrop-blur-[30px] border border-[rgba(0,212,255,0.25)] rounded-[20px] p-8 mb-8 shadow-[0_0_40px_rgba(0,102,255,0.15),0_16px_64px_rgba(0,0,0,0.5)]">
          <h3 className="text-2xl font-bold text-[var(--color-error)] mb-6">
            🔴 REVENUE GAP DETECTADO
          </h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-[var(--color-mist)]">Tu equipo cierra:</span>
              <span className="font-bold text-[var(--color-white)]">{formatCurrency(result.dealsActuales * result.ticket)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-mist)]">Tu equipo PODRÍA cerrar:</span>
              <span className="font-bold text-[var(--color-white)]">{formatCurrency(result.dealsPotenciales * result.ticket)}</span>
            </div>
            <div className="border-t border-[var(--color-ghost)] pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-error)] font-semibold">💸 Diferencia:</span>
                <span className="text-4xl font-bold text-[var(--color-error)]">{formatCurrency(result.revenuePerdido)}/mes</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Problem Breakdown */}
        <div className="bg-[rgba(0,102,255,0.06)] backdrop-blur-[20px] border border-[rgba(0,212,255,0.12)] rounded-[20px] p-8 mb-8">
          <h3 className="text-2xl font-bold text-[var(--color-white)] mb-6">
            ❓ ¿POR QUÉ OCURRE ESTE GAP?
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[var(--color-mist)]">LEADS SIN CALIFICAR</span>
                <span className="font-bold text-[var(--color-white)]">{formatPercent(result.pctNoCalificados)}</span>
              </div>
              <p className="text-[var(--color-fog)] text-sm mb-2">
                Tu closer recibe prospectos sin contexto y los primeros 8 minutos se van en descubrir si vale la pena hablar con ellos.
              </p>
              <div className="w-full bg-[var(--color-deep)] rounded-full h-3">
                <div className="bg-[var(--color-primary)] h-3 rounded-full" style={{ width: `${result.pctNoCalificados * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[var(--color-mist)]">PERFIL MISMATCH</span>
                <span className="font-bold text-[var(--color-white)]">{formatPercent(result.pctPerfilMismatch)}</span>
              </div>
              <p className="text-[var(--color-fog)] text-sm mb-2">
                Tu closer usa la misma estrategia con todos los prospectos. Un Racional Inseguro necesita lógica. Un Emocional Impulsivo necesita velocidad.
              </p>
              <div className="w-full bg-[var(--color-deep)] rounded-full h-3">
                <div className="bg-[var(--color-warning)] h-3 rounded-full" style={{ width: `${result.pctPerfilMismatch * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[var(--color-mist)]">SIN BRIEF PRE-LLAMADA</span>
                <span className="font-bold text-[var(--color-white)]">{formatPercent(result.pctSinBrief)}</span>
              </div>
              <p className="text-[var(--color-fog)] text-sm mb-2">
                {result.horasPerdidas} horas semanales perdidas en llamadas que tu closer podría haber ganado si hubiera llegado preparado.
              </p>
              <div className="w-full bg-[var(--color-deep)] rounded-full h-3">
                <div className="bg-[var(--color-accent)] h-3 rounded-full" style={{ width: `${result.pctSinBrief * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* ROI */}
        <div className="bg-[rgba(255,184,0,0.10)] backdrop-blur-[30px] border border-[rgba(255,184,0,0.40)] rounded-[20px] p-8">
          <h3 className="text-2xl font-bold text-[var(--color-gold)] mb-6">
            📊 TU ROI PROYECTADO
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-[var(--color-mist)]">Inversión mensual en el sistema:</span>
              <span className="font-bold text-[var(--color-white)]">${result.costoSistema}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-mist)]">Revenue adicional proyectado:</span>
              <span className="font-bold text-[var(--color-success)]">{formatCurrency(result.revenueRecuperable)}</span>
            </div>
            <div className="border-t border-[rgba(255,184,0,0.20)] pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-gold)] font-semibold">ROI:</span>
                <span className="text-3xl font-bold text-[var(--color-gold)]">{result.roiMultiplier}x</span>
              </div>
            </div>
            <p className="text-[var(--color-fog)] text-sm mt-4">
              ⏱ Tiempo de implementación: 7 días
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefPreviewScreen() {
  return (
    <div className="min-h-screen bg-[var(--color-void)] p-4">
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-3xl font-bold text-[var(--color-white)] mb-8 text-center">
          📋 ESTO ES LO QUE TU CLOSER RECIBIRÍA<br />15 MINUTOS ANTES DE SU PRÓXIMA LLAMADA:
        </h2>
        
        <div className="bg-[rgba(0,102,255,0.12)] backdrop-blur-[30px] border border-[rgba(0,212,255,0.25)] rounded-[20px] p-8 shadow-[0_0_60px_rgba(0,102,255,0.20)]">
          <div className="border-b border-[var(--color-ghost)] pb-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[var(--color-accent)]">⚡ BRIEF PRE-LLAMADA — The Closing Code AI</h3>
              <span className="text-[var(--color-fog)] text-sm">──────────────────────────</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <span className="text-[var(--color-mist)] block mb-1">PROSPECTO:</span>
              <span className="text-[var(--color-white)] font-semibold">Carlos M. | 📞 En 15 minutos</span>
            </div>
            
            <div className="bg-[rgba(0,212,255,0.10)] border-l-4 border-[var(--color-accent)] p-4 rounded-r-lg">
              <span className="text-[var(--color-accent)] font-bold block mb-2">🎯 PERFIL DETECTADO: RACIONAL INSEGURO</span>
              <span className="text-[var(--color-white)] block mb-2">QUÉ LO MUEVE:</span>
              <p className="text-[var(--color-mist)] text-sm">
                Ha invertido antes y no obtuvo resultados. Hace muchas preguntas. No teme pagar — teme equivocarse.
              </p>
            </div>
            
            <div className="bg-[rgba(255,56,96,0.10)] border-l-4 border-[var(--color-error)] p-4 rounded-r-lg">
              <span className="text-[var(--color-error)] font-bold block mb-2">⚠️ ERROR A EVITAR:</span>
              <p className="text-[var(--color-white)] text-sm">
                No uses emoción. Cada argumento emocional lo aleja más. Necesita lógica y estructura.
              </p>
            </div>
            
            <div className="bg-[rgba(0,208,132,0.10)] border-l-4 border-[var(--color-success)] p-4 rounded-r-lg">
              <span className="text-[var(--color-success)] font-bold block mb-2">✅ ESTRATEGIA RECOMENDADA:</span>
              <p className="text-[var(--color-white)] text-sm">
                Valida cada pregunta con calma. Pregunta: "¿Qué tendría que pasar para que te sientas seguro de avanzar?" Deja que él defina sus criterios de decisión.
              </p>
            </div>
            
            <div>
              <span className="text-[var(--color-mist)] block mb-1">🔒 CIERRE RECOMENDADO:</span>
              <span className="text-[var(--color-white)]">Benjamin Franklin (pros vs contras en vivo) o Del 1 al 10 para medir temperatura.</span>
            </div>
            
            <div>
              <span className="text-[var(--color-mist)] block mb-1">📌 OBJECIÓN MÁS PROBABLE:</span>
              <span className="text-[var(--color-white)]">"Déjame pensarlo"</span>
              <p className="text-[var(--color-mist)] text-sm mt-1">→ Respuesta: "Claro. Antes de irnos, ¿qué es exactamente lo que tienes que pensar?"</p>
            </div>
          </div>
        </div>
        
        <p className="text-center text-[var(--color-fog)] mt-6">
          ☝️ Este brief se genera automáticamente para CADA lead, CADA llamada. Sin trabajo manual.
        </p>
      </div>
    </div>
  );
}

function CTAScreen({ revenuePerdido }: { revenuePerdido: number }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-void)] p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          💡 EL PROBLEMA NO ES TU CLOSER.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
            ES QUE NO TIENE UN SISTEMA.
          </span>
        </h2>
        
        <p className="text-xl text-[var(--color-mist)] mb-12">
          Tu equipo tiene el potencial de cerrar<br />
          <span className="text-[var(--color-success)] font-bold text-2xl">{formatCurrency(revenuePerdido * 0.6)}</span><br />
          más este mes. Con el sistema correcto y 7 días de setup.
        </p>
        
        <button className="px-10 py-5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold rounded-full text-xl hover:scale-105 transition-transform shadow-[var(--glow-blue)]">
          QUIERO ARREGLAR ESTO EN MI NEGOCIO →
        </button>
        
        <p className="mt-6 text-[var(--color-fog)] text-sm">
          Agenda una llamada de diagnóstico gratuita (30 min — cupos limitados esta semana)
        </p>
        
        <div className="mt-12 border-t border-[var(--color-ghost)] pt-8">
          <p className="text-[var(--color-mist)] mb-4">O si prefieres, comparte este diagnóstico:</p>
          <button className="px-6 py-3 bg-[rgba(0,102,255,0.10)] border border-[rgba(0,212,255,0.20)] text-[var(--color-accent)] rounded-full hover:scale-105 transition-transform">
            📤 Compartir mi Revenue Gap
          </button>
          <p className="mt-4 text-[var(--color-fog)] text-sm">
            "Descubrí que pierdo {formatCurrency(revenuePerdido)}/mes. Tú también?"
          </p>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function DiagnosticPage() {
  const [screen, setScreen] = useState(0);
  const [input, setInput] = useState<Partial<DiagnosticInput>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  
  const handleNext = () => setScreen(screen + 1);
  
  const handleCalculadoraSubmit = (data: DiagnosticInput) => {
    setInput(data);
    const calcResult = calculateRevenueGap(data);
    setResult(calcResult);
    handleNext();
  };
  
  const handleGateSubmit = (data: { nombre: string, email: string, whatsapp: string }) => {
    setInput({ ...input, ...data });
    // TODO: Send to API
    handleNext();
  };
  
  return (
    <>
      {screen === 0 && <PreHeroScreen onNext={handleNext} />}
      {screen === 1 && <HeroScreen onNext={handleNext} />}
      {screen === 2 && <CalculadoraScreen onNext={handleCalculadoraSubmit} onInput={setInput} />}
      {screen === 3 && <GateScreen onNext={handleGateSubmit} />}
      {screen === 4 && result && <DiagnosticoScreen result={result} onNext={handleNext} />}
      {screen === 5 && <BriefPreviewScreen onNext={handleNext} />}
      {screen === 6 && result && <CTAScreen revenuePerdido={result.revenuePerdido} />}
    </>
  );
}
