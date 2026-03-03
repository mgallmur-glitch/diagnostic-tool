'use client';

import { useState, useEffect } from 'react';
import { calculateRevenueGap, formatCurrency, formatPercent, type DiagnosticoInput, type DiagnosticoOutput } from '@/lib/calculations';

// PreHero Screen - Premium $100k
function PreHeroScreen({ onNext }: { onNext: () => void }) {
  const [count, setCount] = useState(0);
  const amounts = [0, 1200, 4800, 12000, 31000];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= amounts.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute w-[600px] h-[600px] top-[-200px] right-[-200px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)] blur-[80px] animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bottom-[-100px] left-[-100px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.25)_0%,transparent_70%)] blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="text-center max-w-4xl relative z-10 px-4">
        <div className="text-5xl sm:text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          ${amounts[count].toLocaleString()}...
        </div>
        <p className="text-lg sm:text-xl md:text-2xl text-[#B0C4D8] mb-8 max-w-2xl mx-auto leading-relaxed">
          Cada mes que pasa sin un sistema,<br />
          <span className="text-white font-semibold">este es el revenue que tu equipo no cierra.</span>
        </p>
        <button
          onClick={onNext}
          className="px-10 py-5 rounded-full text-lg font-bold text-white bg-gradient-to-r from-[#3b82f6] to-[#2563eb] shadow-[0_4px_25px_rgba(59,130,246,0.5),0_0_50px_rgba(59,130,246,0.25)] hover:scale-105 transition-all"
        >
          Calcular mi número →
        </button>
      </div>
    </div>
  );
}

// Hero Screen - Premium
function HeroScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(59,130,246,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(139,92,246,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(0,212,255,0.08)_0%,transparent_60%)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <span className="inline-block bg-gradient-to-r from-[rgba(59,130,246,0.15)] to-[rgba(139,92,246,0.1)] text-[#60a5fa] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border border-[rgba(59,130,246,0.25)] mb-6">
          Diagnóstico en 90 segundos
        </span>
        
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 leading-tight">
          <span className="text-white">Tu closer no tiene un problema de actitud.</span>
          <br />
          <span className="bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            Tiene un problema de arquitectura.
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-[#B0C4D8] mb-6 max-w-2xl mx-auto leading-relaxed">
          Cada semana, tu equipo improvisa en llamadas que ya debería saber cómo cerrar.
          Calculamos el costo exacto de esa improvisación.
        </p>
        
        <p className="text-[#00D4FF] mb-10 font-semibold text-lg">
          90 segundos · 3 preguntas · Tu número real
        </p>
        
        <button
          onClick={onNext}
          className="px-10 sm:px-12 py-5 sm:py-6 rounded-full text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb] shadow-[0_4px_25px_rgba(59,130,246,0.5),0_0_50px_rgba(59,130,246,0.25)] hover:scale-105 transition-all relative overflow-hidden"
        >
          Calcular mi Revenue Gap →
        </button>
        
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[#6B8299] text-sm">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D084]"></span>
            Gratis
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D084]"></span>
            Sin registro
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D084]"></span>
            Resultado inmediato
          </span>
        </div>
      </div>
    </div>
  );
}


// Calculadora Screen - Premium
function CalculadoraScreen({ onNext, onInput }: { onNext: (input: DiagnosticoInput) => void, onInput: (input: Partial<DiagnosticoInput>) => void }) {
  const [leads, setLeads] = useState(42);
  const [ticket, setTicket] = useState(6000);
  const [closingRate, setClosingRate] = useState(18);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute w-[500px] h-[500px] top-[-150px] left-[-150px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,transparent_70%)] blur-[80px]" />
      <div className="absolute w-[400px] h-[400px] bottom-[-100px] right-[-100px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)] blur-[80px]" />
      
      <div className="max-w-2xl w-full bg-gradient-to-br from-[rgba(59,130,246,0.1)] to-[rgba(139,92,246,0.05)] backdrop-blur-[20px] border border-[rgba(0,212,255,0.15)] rounded-[24px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(59,130,246,0.1)] relative z-10">
        <span className="inline-block bg-gradient-to-r from-[rgba(59,130,246,0.15)] to-[rgba(139,92,246,0.1)] text-[#60a5fa] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-[rgba(59,130,246,0.25)] mb-4">
          Paso 1 de 3
        </span>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
          Responde 3 preguntas rápidas
        </h2>
        
        {/* Pregunta 1 */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
            ¿Cuántos leads calificados llegan a tu closer al mes?
          </label>
          <p className="text-[#6B8299] text-xs sm:text-sm mb-4">(Los que realmente tienen una llamada agendada)</p>
          <input
            type="range"
            min="5"
            max="300"
            value={leads}
            onChange={(e) => { setLeads(Number(e.target.value)); onInput({ leads: Number(e.target.value) }); }}
            className="w-full h-2 bg-[rgba(59,130,246,0.2)] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
          />
          <div className="text-xl sm:text-2xl font-bold text-[#00D4FF] mt-3 text-center">
            {leads} leads/mes
          </div>
        </div>
        
        {/* Pregunta 2 */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-4 text-sm sm:text-base">
            ¿Cuál es el ticket promedio de tu oferta?
          </label>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={ticket}
            onChange={(e) => { setTicket(Number(e.target.value)); onInput({ ticket: Number(e.target.value) }); }}
            className="w-full h-2 bg-[rgba(59,130,246,0.2)] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
          />
          <div className="text-xl sm:text-2xl font-bold text-[#00D4FF] mt-3 text-center">
            ${ticket.toLocaleString()}
          </div>
        </div>
        
        {/* Pregunta 3 */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
            ¿Qué porcentaje de esos leads cierra tu equipo hoy?
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={closingRate}
            onChange={(e) => { setClosingRate(Number(e.target.value)); onInput({ closingRate: Number(e.target.value) / 100 }); }}
            className="w-full h-2 bg-[rgba(59,130,246,0.2)] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
          />
          <div className="text-xl sm:text-2xl font-bold text-[#00D4FF] mt-3 text-center">
            {closingRate}%
          </div>
          <p className="text-[#6B8299] text-xs mt-3 text-center">
            📊 Benchmarks LatAm high-ticket:<br />
            <span className="text-[#FF3860]">Sin sistema: 11%-18%</span> | 
            <span className="text-[#FFB800]">Con brief: 26%-32%</span> | 
            <span className="text-[#00D084]">Sistema completo: 35%-45%</span>
          </p>
        </div>
        
        <button
          onClick={() => onNext({ leads, ticket, closingRate: closingRate / 100, closers: 'Solo yo' })}
          className="w-full px-8 py-4 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-bold rounded-full text-base sm:text-lg hover:scale-[1.02] transition-all shadow-[0_4px_25px_rgba(59,130,246,0.5)]"
        >
          Calcular mi diagnóstico →
        </button>
        
        <p className="mt-4 text-[#6B8299] text-xs text-center">
          🔒 Tu información es confidencial y no se comparte.
        </p>
      </div>
    </div>
  );
}


// Gate Screen - Premium
function GateScreen({ onNext }: { onNext: (data: { nombre: string, email: string, whatsapp: string, closers: string }) => void }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [closers, setClosers] = useState('Solo yo');
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute w-[500px] h-[500px] top-[-150px] right-[-150px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,transparent_70%)] blur-[80px]" />
      
      <div className="max-w-md w-full bg-gradient-to-br from-[rgba(59,130,246,0.1)] to-[rgba(139,92,246,0.05)] backdrop-blur-[20px] border border-[rgba(0,212,255,0.15)] rounded-[24px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(59,130,246,0.1)] relative z-10">
        <span className="inline-block bg-gradient-to-r from-[rgba(59,130,246,0.15)] to-[rgba(139,92,246,0.1)] text-[#60a5fa] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-[rgba(59,130,246,0.25)] mb-4">
          Paso 2 de 3
        </span>
        
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">
          🔍 Tu diagnóstico está listo.
        </h2>
        
        <p className="text-[#B0C4D8] mb-6 text-center text-sm sm:text-base">
          Detectamos un Revenue Gap en tu sistema de ventas.<br />
          Para mostrarte el análisis completo, necesitamos tu email.
        </p>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(0,212,255,0.15)] rounded-lg text-white placeholder-[#6B8299] focus:border-[rgba(59,130,246,0.5)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] outline-none transition-all"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(0,212,255,0.15)] rounded-lg text-white placeholder-[#6B8299] focus:border-[rgba(59,130,246,0.5)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] outline-none transition-all"
          />
          <input
            type="tel"
            placeholder="WhatsApp (opcional)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(0,212,255,0.15)] rounded-lg text-white placeholder-[#6B8299] focus:border-[rgba(59,130,246,0.5)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] outline-none transition-all"
          />
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Closers en tu equipo:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Solo yo', '1 closer', '2-3', '4+'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setClosers(option)}
                  className={`px-2 py-2 text-xs sm:text-sm rounded-lg transition-all ${
                    closers === option
                      ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold shadow-[0_4px_15px_rgba(59,130,246,0.4)]'
                      : 'bg-[rgba(255,255,255,0.04)] text-[#B0C4D8] hover:bg-[rgba(59,130,246,0.15)] border border-[rgba(0,212,255,0.1)]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onNext({ nombre, email, whatsapp, closers })}
          disabled={!nombre || !email}
          className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-bold rounded-full text-base hover:scale-[1.02] transition-all shadow-[0_4px_25px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Ver mi diagnóstico completo →
        </button>
        
        <p className="mt-4 text-[#6B8299] text-xs text-center">
          🔒 Sin spam. Solo recibirás el diagnóstico y seguimiento personalizado.
        </p>
      </div>
    </div>
  );
}


// Diagnostico Screen - Premium
function DiagnosticoScreen({ result, onNext }: { result: DiagnosticoOutput; onNext: () => void }) {
  return (
    <div className="min-h-screen p-4 sm:p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute w-[600px] h-[600px] top-[-200px] right-[-200px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-[80px]" />
      <div className="absolute w-[400px] h-[400px] bottom-[-100px] left-[-100px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] blur-[80px]" />
      
      <div className="max-w-4xl mx-auto py-6 sm:py-8 relative z-10">
        <span className="inline-block bg-gradient-to-r from-[rgba(59,130,246,0.15)] to-[rgba(139,92,246,0.1)] text-[#60a5fa] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-[rgba(59,130,246,0.25)] mb-4">
          Paso 3 de 3
        </span>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
          📊 Diagnóstico de Sistema de Ventas
        </h2>
        
        {/* Revenue Gap Card */}
        <div className="bg-gradient-to-br from-[rgba(59,130,246,0.15)] to-[rgba(139,92,246,0.08)] backdrop-blur-[30px] border border-[rgba(0,212,255,0.25)] rounded-[24px] p-6 sm:p-8 mb-6 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_60px_rgba(59,130,246,0.15)]">
          <h3 className="text-xl sm:text-2xl font-bold text-[#FF3860] mb-6">
            🔴 Revenue Gap Detectado
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-[#B0C4D8] text-sm sm:text-base">Tu equipo cierra:</span>
              <span className="font-bold text-white text-base sm:text-lg">{formatCurrency(result.revenueActual)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#B0C4D8] text-sm sm:text-base">Tu equipo PODRÍA cerrar:</span>
              <span className="font-bold text-white text-base sm:text-lg">{formatCurrency(result.revenuePotencial)}</span>
            </div>
            <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[#FF3860] font-semibold text-sm sm:text-base">💸 Diferencia:</span>
                <span className="text-2xl sm:text-4xl font-bold text-[#FF3860]">{formatCurrency(result.revenuePerdido)}/mes</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Problem Breakdown */}
        <div className="bg-gradient-to-br from-[rgba(59,130,246,0.08)] to-[rgba(139,92,246,0.04)] backdrop-blur-[20px] border border-[rgba(0,212,255,0.12)] rounded-[24px] p-6 sm:p-8 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
            ❓ ¿Por qué ocurre este gap?
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[#B0C4D8] text-xs sm:text-sm uppercase tracking-wide">Leads sin calificar</span>
                <span className="font-bold text-white">{formatPercent(result.pctSinCalificar)}</span>
              </div>
              <p className="text-[#6B8299] text-xs sm:text-sm mb-2">
                Tu closer recibe prospectos sin contexto y los primeros 8 minutos se van en descubrir si vale la pena hablar con ellos.
              </p>
              <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-2">
                <div className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] h-2 rounded-full transition-all duration-1000" style={{ width: `${result.pctSinCalificar * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[#B0C4D8] text-xs sm:text-sm uppercase tracking-wide">Perfil mismatch</span>
                <span className="font-bold text-white">{formatPercent(result.pctPerfilMismatch)}</span>
              </div>
              <p className="text-[#6B8299] text-xs sm:text-sm mb-2">
                Tu closer usa la misma estrategia con todos los prospectos. Un Racional Inseguro necesita lógica. Un Emocional Impulsivo necesita velocidad.
              </p>
              <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-2">
                <div className="bg-gradient-to-r from-[#FFB800] to-[#f59e0b] h-2 rounded-full transition-all duration-1000" style={{ width: `${result.pctPerfilMismatch * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[#B0C4D8] text-xs sm:text-sm uppercase tracking-wide">Sin brief pre-llamada</span>
                <span className="font-bold text-white">{formatPercent(result.pctSinBrief)}</span>
              </div>
              <p className="text-[#6B8299] text-xs sm:text-sm mb-2">
                {result.horasPerdidas} horas semanales perdidas en llamadas que tu closer podría haber ganado si hubiera llegado preparado.
              </p>
              <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-2">
                <div className="bg-gradient-to-r from-[#00D4FF] to-[#00b8d4] h-2 rounded-full transition-all duration-1000" style={{ width: `${result.pctSinBrief * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* ROI */}
        <div className="bg-gradient-to-br from-[rgba(255,184,0,0.12)] to-[rgba(255,184,0,0.05)] backdrop-blur-[30px] border border-[rgba(255,184,0,0.3)] rounded-[24px] p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-[#FFB800] mb-6">
            📊 Tu ROI Proyectado
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#B0C4D8] text-sm sm:text-base">Inversión mensual en el sistema:</span>
              <span className="font-bold text-white">${result.costoSistema}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#B0C4D8] text-sm sm:text-base">Revenue adicional proyectado:</span>
              <span className="font-bold text-[#00D084]">{formatCurrency(result.revenueRecuperable)}</span>
            </div>
            <div className="border-t border-[rgba(255,184,0,0.2)] pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[#FFB800] font-semibold text-sm sm:text-base">ROI:</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#FFB800]">{result.roiMultiplier}x</span>
              </div>
            </div>
            <p className="text-[#6B8299] text-xs sm:text-sm mt-2">
              ⏱ Tiempo de implementación: 7 días
            </p>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={onNext}
            className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-bold rounded-full text-base sm:text-xl hover:scale-105 transition-all shadow-[0_4px_25px_rgba(59,130,246,0.5)]"
          >
            Ver el brief pre-llamada →
          </button>
        </div>
      </div>
    </div>
  );
}


// Brief Preview Screen - Premium
function BriefPreviewScreen({ brief }: { brief: any }) {
  if (!brief) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute w-[500px] h-[500px] top-[-150px] left-[-150px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-[80px]" />
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
          <p className="text-white">Generando brief con IA...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 sm:p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute w-[600px] h-[600px] top-[-200px] right-[-200px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_70%)] blur-[80px]" />
      
      <div className="max-w-4xl mx-auto py-6 sm:py-8 relative z-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
          📋 Esto es lo que tu closer recibiría<br className="hidden sm:block" /> 15 minutos antes de su próxima llamada:
        </h2>
        
        <div className="bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(139,92,246,0.06)] backdrop-blur-[30px] border border-[rgba(0,212,255,0.2)] rounded-[24px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_60px_rgba(59,130,246,0.15)]">
          <div className="border-b border-[rgba(255,255,255,0.1)] pb-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#00D4FF]">⚡ Brief Pre-Llamada — The Closing Code AI</h3>
              <span className="text-[#6B8299] text-xs sm:text-sm">──────────────────────────</span>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-[rgba(0,212,255,0.1)] to-transparent border-l-4 border-[#00D4FF] p-4 rounded-r-lg">
              <span className="text-[#00D4FF] font-bold block mb-2 text-sm sm:text-base">🎯 {brief.perfil}</span>
              <span className="text-white block mb-2 text-xs sm:text-sm uppercase tracking-wide">Qué lo mueve:</span>
              <p className="text-[#B0C4D8] text-sm">
                {brief.queLoMueve}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-[rgba(255,56,96,0.1)] to-transparent border-l-4 border-[#FF3860] p-4 rounded-r-lg">
              <span className="text-[#FF3860] font-bold block mb-2 text-sm sm:text-base">⚠️ Error a evitar:</span>
              <p className="text-white text-sm">
                {brief.errorAEvitar}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-[rgba(0,208,132,0.1)] to-transparent border-l-4 border-[#00D084] p-4 rounded-r-lg">
              <span className="text-[#00D084] font-bold block mb-2 text-sm sm:text-base">✅ Estrategia recomendada:</span>
              <p className="text-white text-sm">
                {brief.estrategia}
              </p>
            </div>
            
            <div className="pt-2">
              <span className="text-[#6B8299] block mb-1 text-xs sm:text-sm">🔒 Cierre recomendado:</span>
              <span className="text-white text-sm">{brief.cierre}</span>
            </div>
            
            <div className="pt-2">
              <span className="text-[#6B8299] block mb-1 text-xs sm:text-sm">📌 Objeción más probable:</span>
              <span className="text-white text-sm">{brief.objecionProbable}</span>
              <p className="text-[#B0C4D8] text-xs sm:text-sm mt-1">→ Respuesta: {brief.respuesta}</p>
            </div>
          </div>
        </div>
        
        <p className="text-center text-[#6B8299] mt-6 text-xs sm:text-sm">
          ☝️ Este brief se genera automáticamente para CADA lead, CADA llamada. Sin trabajo manual.
        </p>
      </div>
    </div>
  );
}


// CTA Screen - Premium
function CTAScreen({ revenuePerdido }: { revenuePerdido: number }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute w-[600px] h-[600px] top-[-200px] right-[-200px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,transparent_70%)] blur-[80px] animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bottom-[-100px] left-[-100px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)] blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
          <span className="text-white">💡 El problema no es tu closer.</span>
          <br />
          <span className="bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
            Es que no tiene un sistema.
          </span>
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-[#B0C4D8] mb-8 sm:mb-12">
          Tu equipo tiene el potencial de cerrar<br />
          <span className="text-[#00D084] font-bold text-xl sm:text-2xl md:text-3xl">{formatCurrency(revenuePerdido * 0.6)}</span><br />
          más este mes. Con el sistema correcto y 7 días de setup.
        </p>
        
        <div className="bg-gradient-to-br from-[rgba(59,130,246,0.15)] to-[rgba(139,92,246,0.1)] backdrop-blur-[30px] border border-[rgba(59,130,246,0.3)] rounded-[24px] p-6 sm:p-8 mb-6 sm:mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_60px_rgba(59,130,246,0.2)]">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
            ¿Quieres arreglar esto en tu negocio?
          </h3>
          
          <a 
            href="https://calendly.com/mgallmur/45"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb] text-white font-bold rounded-full text-base sm:text-xl hover:scale-105 transition-all shadow-[0_4px_30px_rgba(59,130,246,0.6),0_0_60px_rgba(59,130,246,0.35)]"
          >
            Agendar llamada de diagnóstico →
          </a>
          
          <p className="mt-4 text-[#6B8299] text-xs sm:text-sm">
            30 minutos · Sin costo · Cupos limitados esta semana
          </p>
        </div>
        
        <div className="mt-8 sm:mt-12 border-t border-[rgba(255,255,255,0.1)] pt-6 sm:pt-8">
          <p className="text-[#B0C4D8] mb-4 text-sm sm:text-base">O si prefieres, comparte este diagnóstico:</p>
          <button 
            onClick={() => {
              const text = `Descubrí que pierdo ${formatCurrency(revenuePerdido)}/mes en mi equipo de ventas. ¿Tú también? Descúbrelo gratis aquí: https://mgallmur-glitch.github.io/instant-qualifier/diagnostico`;
              navigator.clipboard.writeText(text);
              alert('¡Texto copiado al portapapeles!');
            }}
            className="px-6 py-3 bg-[rgba(59,130,246,0.1)] border border-[rgba(0,212,255,0.2)] text-[#00D4FF] rounded-full hover:scale-105 transition-all text-sm sm:text-base"
          >
            📤 Compartir mi Revenue Gap
          </button>
          <p className="mt-4 text-[#6B8299] text-xs sm:text-sm">
            "Descubrí que pierdo {formatCurrency(revenuePerdido)}/mes. ¿Tú también?"
          </p>
        </div>
      </div>
    </div>
  );
}


// Main component
export default function DiagnosticPage() {
  const [screen, setScreen] = useState(0);
  const [input, setInput] = useState<Partial<DiagnosticoInput>>({});
  const [result, setResult] = useState<DiagnosticoOutput | null>(null);
  const [brief, setBrief] = useState<any>(null);
  
  const handleNext = () => setScreen(screen + 1);
  
  const handleCalculadoraSubmit = async (data: DiagnosticoInput) => {
    setInput(data);
    const calcResult = calculateRevenueGap(data);
    setResult(calcResult);
    handleNext();
  };
  
  const handleDiagnosticoComplete = async () => {
    if (result && input.closers) {
      const fullInput: DiagnosticoInput = {
        leads: input.leads || 42,
        ticket: input.ticket || 6000,
        closingRate: input.closingRate || 0.18,
        closers: input.closers
      };
      
      try {
        const response = await fetch('/api/generate-brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: fullInput, output: result }),
        });
        const data = await response.json();
        setBrief(data);
      } catch (error) {
        console.error('Error generating brief:', error);
        // Fallback brief
        setBrief({
          perfil: "Racional Inseguro",
          queLoMueve: "Necesita validación externa, comparativas y datos concretos. No se decide solo.",
          errorAEvitar: "No presionar para cerrar rápido. No usar urgencia artificial. No dejarlo 'pensarlo'.",
          estrategia: "Mostrar casos de estudios similares al suyo. Ofrecer garantía clara. Dejar que él llegue a la conclusión.",
          cierre: "Cierre de Consenso: '¿Ves cómo esto resuelve [problema específico que mencionó]?'",
          objecionProbable: "'Déjame pensarlo' / 'Necesito hablarlo con mi socio'",
          respuesta: "'Perfecto. ¿Qué información específica necesitas para tomar la decisión? Te la envío ahora mismo.'"
        });
      }
    }
    handleNext();
  };
  
  const handleGateSubmit = async (data: { nombre: string, email: string, whatsapp: string, closers: string }) => {
    setInput({ ...input, ...data });
    
    // Capture lead
    try {
      await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre,
          email: data.email,
          whatsapp: data.whatsapp,
          closers: data.closers,
          leads: input.leads,
          ticket: input.ticket,
          closingRate: input.closingRate,
        }),
      });
    } catch (error) {
      console.error('Error capturing lead:', error);
    }
    
    handleNext();
  };
  
  return (
    <>
      {screen === 0 && <PreHeroScreen onNext={handleNext} />}
      {screen === 1 && <HeroScreen onNext={handleNext} />}
      {screen === 2 && <CalculadoraScreen onNext={handleCalculadoraSubmit} onInput={setInput} />}
      {screen === 3 && <GateScreen onNext={handleGateSubmit} />}
      {screen === 4 && result && <DiagnosticoScreen result={result} onNext={handleDiagnosticoComplete} />}
      {screen === 5 && <BriefPreviewScreen brief={brief} />}
      {screen === 6 && result && <CTAScreen revenuePerdido={result.revenuePerdido} />}
    </>
  );
}
