'use client';

import { useState, useEffect, useMemo } from 'react';
import { calculateRevenueGap, formatCurrency, formatPercent, type DiagnosticoInput, type DiagnosticoOutput } from '@/lib/calculations';
import { getMockBrief, type GeneratedBrief } from '@/lib/glm4';

// ============================================
// UTILITY COMPONENTS
// ============================================

function AnimatedNumber({ value, prefix = '', suffix = '', duration = 2000 }: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(value * easeOut));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

function ProgressBar({ value, color = 'blue', animated = false }: { 
  value: number; 
  color?: 'blue' | 'gold' | 'green' | 'red';
  animated?: boolean;
}) {
  const colors = {
    blue: 'from-[#3b82f6] to-[#60a5fa]',
    gold: 'from-[#f59e0b] to-[#fbbf24]',
    green: 'from-[#10b981] to-[#34d399]',
    red: 'from-[#ef4444] to-[#f87171]',
  };
  
  return (
    <div className="w-full bg-[rgba(255,255,255,0.08)] rounded-full h-2.5 overflow-hidden">
      <div 
        className={`h-full rounded-full bg-gradient-to-r ${colors[color]} ${animated ? 'animate-pulse' : ''}`}
        style={{ width: `${Math.min(value * 100, 100)}%`, transition: 'width 1s ease-out' }}
      />
    </div>
  );
}

function GlowOrb({ color, size, position, delay = 0 }: { 
  color: 'blue' | 'purple' | 'cyan';
  size: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
}) {
  const colors = {
    blue: 'rgba(59, 130, 246, 0.3)',
    purple: 'rgba(139, 92, 246, 0.25)',
    cyan: 'rgba(0, 212, 255, 0.2)',
  };
  
  return (
    <div 
      className="absolute rounded-full blur-[80px] animate-pulse pointer-events-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colors[color]} 0%, transparent 70%)`,
        ...position,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// ============================================
// SCREEN 1: PRE-HERO (Mejorado con insight de horas)
// ============================================

function PreHeroScreen({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);
  const insights = [
    { hours: 0, cost: 0 },
    { hours: 4, cost: 1200 },
    { hours: 12, cost: 3600 },
    { hours: 19, cost: 5700 },
    { hours: 26, cost: 7800 },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => s < insights.length - 1 ? s + 1 : s);
    }, 800);
    return () => clearInterval(interval);
  }, []);
  
  const current = insights[step];
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <GlowOrb color="blue" size={600} position={{ top: '-200px', right: '-200px' }} />
      <GlowOrb color="purple" size={400} position={{ bottom: '-100px', left: '-100px' }} delay={2} />
      
      <div className="text-center max-w-3xl relative z-10 px-4">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] text-[#60a5fa] px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-[#00D084] rounded-full animate-pulse"></span>
            Diseñado para equipos de ventas de 1-3 closers
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Tu closer trabajó <span className="text-gradient-premium">40 horas</span> esta semana.
        </h1>
        
        <div className="bg-gradient-to-br from-[rgba(59,130,246,0.1)] to-[rgba(139,92,246,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 sm:p-8 mb-8">
          <p className="text-xl sm:text-2xl text-[#B0C4D8] mb-4">
            <span className="text-gradient-premium font-bold text-3xl sm:text-4xl">
              <AnimatedNumber value={current.hours} />
            </span> de esas horas fueron con leads que <span className="text-[#FF3860] font-bold">NUNCA</span> fueron a comprar.
          </p>
          <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
            <p className="text-lg text-[#B0C4D8]">
              Costo de esas horas: <span className="text-[#FF3860] font-bold text-2xl">${current.cost.toLocaleString()}</span> en comisiones por filtrar manualmente.
            </p>
          </div>
        </div>
        
        <button
          onClick={onNext}
          className="btn-premium px-12 py-6 rounded-full text-xl font-bold text-white shadow-[0_0_60px_rgba(59,130,246,0.4)]"
        >
          Descubrir mi número exacto →
        </button>
        
        <p className="mt-6 text-[#6B8299] text-sm">
          Promedio descubierto: <span className="text-white font-semibold">$41,200/mes</span> dejado sobre la mesa
        </p>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 2: HERO (Con social proof mejorado)
// ============================================

function HeroScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(59,130,246,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(139,92,246,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(0,212,255,0.08)_0%,transparent_60%)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] text-[#60a5fa] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 bg-[#00D084] rounded-full animate-pulse"></span>
          Diagnóstico en 90 segundos
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="text-white">Tu closer improvisa porque no tiene información.</span>
          <br />
          <span className="bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]">
            No porque no sepa cerrar.
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-[#B0C4D8] mb-4 max-w-2xl mx-auto leading-relaxed">
          La IA filtra y prepara. Tu closer ejecuta. Sin el sistema, pierde 60% del tiempo con leads equivocados. 
          Calculamos cuánto te cuesta esa falta de información.
        </p>
        
        <div className="bg-gradient-to-r from-[rgba(0,208,132,0.1)] to-[rgba(0,208,132,0.05)] border border-[rgba(0,208,132,0.2)] rounded-xl p-4 mb-8 max-w-lg mx-auto">
          <p className="text-[#00D084] text-sm">
            💡 El sistema no cierra por ti. Te da inteligencia para que tu closer cierre más, si tiene la habilidad.
          </p>
        </div>
        
        <button
          onClick={onNext}
          className="btn-premium px-12 py-6 rounded-full text-xl font-bold text-white shadow-[0_0_60px_rgba(59,130,246,0.4)]"
        >
          Calcular mi Revenue Gap →
        </button>
        
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[#6B8299] text-sm">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00D084]"></span> Gratis</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00D084]"></span> Sin registro</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00D084]"></span> Resultado inmediato</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 3: CALCULADORA (Con gráfico en tiempo real)
// ============================================

function CalculadoraScreen({ onNext, onInput }: { 
  onNext: (input: DiagnosticoInput) => void; 
  onInput: (input: Partial<DiagnosticoInput>) => void;
}) {
  const [leads, setLeads] = useState(42);
  const [ticket, setTicket] = useState(6000);
  const [closingRate, setClosingRate] = useState(18);
  const [facturacionMensual, setFacturacionMensual] = useState(50000);
  
  // Cálculo en tiempo real para el gráfico
  const resultado = useMemo(() => {
    const actual = leads * ticket * (closingRate / 100);
    const potencial = leads * ticket * 0.35; // 35% es el benchmark con sistema
    const gap = potencial - actual;
    return { actual, potencial, gap };
  }, [leads, ticket, closingRate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <GlowOrb color="blue" size={500} position={{ top: '-150px', left: '-150px' }} />
      <GlowOrb color="purple" size={400} position={{ bottom: '-100px', right: '-100px' }} delay={1} />
      
      <div className="max-w-3xl w-full bg-gradient-to-br from-[rgba(59,130,246,0.1)] to-[rgba(139,92,246,0.05)] backdrop-blur-xl border border-[rgba(0,212,255,0.15)] rounded-[24px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative z-10">
        <div className="flex items-center justify-between mb-6">
          <span className="inline-flex items-center gap-2 bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] text-[#60a5fa] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Paso 1 de 3
          </span>
          <span className="text-[#6B8299] text-sm">90 segundos totales</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          Cuéntanos sobre tu operación
        </h2>
        
        {/* GRÁFICO EN TIEMPO REAL */}
        <div className="bg-[rgba(0,0,0,0.2)] rounded-xl p-4 sm:p-6 mb-8 border border-[rgba(255,255,255,0.05)]">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[#6B8299] text-xs mb-1">Cierras hoy</p>
              <p className="text-white font-bold text-lg sm:text-xl">{formatCurrency(resultado.actual)}</p>
            </div>
            <div>
              <p className="text-[#6B8299] text-xs mb-1">Si tu closer ejecuta*</p>
              <p className="text-[#00D084] font-bold text-lg sm:text-xl">{formatCurrency(resultado.potencial)}</p>
            </div>
            <div>
              <p className="text-[#6B8299] text-xs mb-1">Gap mensual</p>
              <p className="text-[#FF3860] font-bold text-lg sm:text-xl">{formatCurrency(resultado.gap)}</p>
            </div>
          </div>
          
          {/* Visualización de barras */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#6B8299] w-16">Actual</span>
              <div className="flex-1">
                <ProgressBar value={closingRate / 100} color="blue" animated />
              </div>
              <span className="text-xs text-white w-12 text-right">{closingRate}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#6B8299] w-16">Con info*</span>
              <div className="flex-1">
                <ProgressBar value={0.35} color="green" />
              </div>
              <span className="text-xs text-[#00D084] w-12 text-right">35%</span>
            </div>
          </div>
          <p className="text-[#6B8299] text-xs mt-2">*El sistema entrega información. Tu closer debe ejecutar. No garantizamos cierres.</p>
        </div>
        
        {/* SLIDERS */}
        <div className="space-y-6">
          <div>
            <label className="flex justify-between text-white font-medium mb-3 text-sm sm:text-base">
              <span>¿Cuántos leads calificados al mes?</span>
              <span className="text-[#00D4FF] font-bold">{leads} leads</span>
            </label>
            <input
              type="range" min="5" max="300" value={leads}
              onChange={(e) => { const v = Number(e.target.value); setLeads(v); onInput({ leads: v }); }}
              className="w-full"
            />
            <p className="text-[#6B8299] text-xs mt-2">Los que realmente tienen llamada agendada</p>
          </div>
          
          <div>
            <label className="flex justify-between text-white font-medium mb-3 text-sm sm:text-base">
              <span>¿Ticket promedio?</span>
              <span className="text-[#00D4FF] font-bold">${ticket.toLocaleString()}</span>
            </label>
            <input
              type="range" min="1000" max="50000" step="1000" value={ticket}
              onChange={(e) => { const v = Number(e.target.value); setTicket(v); onInput({ ticket: v }); }}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="flex justify-between text-white font-medium mb-3 text-sm sm:text-base">
              <span>¿Closing rate actual?</span>
              <span className="text-[#00D4FF] font-bold">{closingRate}%</span>
            </label>
            <input
              type="range" min="5" max="50" value={closingRate}
              onChange={(e) => { const v = Number(e.target.value); setClosingRate(v); onInput({ closingRate: v / 100 }); }}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-2 text-[#6B8299]">
              <span className="text-[#FF3860]">Sin sistema: 11-18%</span>
              <span className="text-[#fbbf24]">Con brief: 26-32%</span>
              <span className="text-[#00D084]">Sistema completo: 35-45%</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <label className="flex justify-between text-white font-medium mb-3 text-sm sm:text-base">
              <span>¿Facturación mensual actual de tu negocio?</span>
              <span className="text-[#00D4FF] font-bold">${facturacionMensual.toLocaleString()}</span>
            </label>
            <input
              type="range" min="20000" max="200000" step="10000" value={facturacionMensual}
              onChange={(e) => { const v = Number(e.target.value); setFacturacionMensual(v); onInput({ facturacionMensual: v }); }}
              className="w-full"
            />
            <p className="text-[#6B8299] text-xs mt-2">Para calificar tu perfil de negocio (no afecta el cálculo del gap)</p>
          </div>
        </div>
        
        <button
          onClick={() => onNext({ leads, ticket, closingRate: closingRate / 100, closers: 'Solo yo', facturacionMensual })}
          className="w-full mt-8 py-4 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-bold rounded-full text-lg hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(59,130,246,0.4)]"
        >
          Ver mi diagnóstico completo →
        </button>
      </div>
    </div>
  );
}


// ============================================
// SCREEN 4: GATE UNIFICADO (Email + Datos en un paso)
// ============================================

const countryCodes = [
  { code: '+1', flag: '🇺🇸', name: 'USA/Canadá', country: 'US' },
  { code: '+52', flag: '🇲🇽', name: 'México', country: 'MX' },
  { code: '+51', flag: '🇵🇪', name: 'Perú', country: 'PE' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina', country: 'AR' },
  { code: '+55', flag: '🇧🇷', name: 'Brasil', country: 'BR' },
  { code: '+56', flag: '🇨🇱', name: 'Chile', country: 'CL' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia', country: 'CO' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela', country: 'VE' },
  { code: '+34', flag: '🇪🇸', name: 'España', country: 'ES' },
  { code: '+44', flag: '🇬🇧', name: 'Reino Unido', country: 'GB' },
  { code: '+33', flag: '🇫🇷', name: 'Francia', country: 'FR' },
  { code: '+49', flag: '🇩🇪', name: 'Alemania', country: 'DE' },
  { code: '+39', flag: '🇮🇹', name: 'Italia', country: 'IT' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal', country: 'PT' },
  { code: '+61', flag: '🇦🇺', name: 'Australia', country: 'AU' },
  { code: '+86', flag: '🇨🇳', name: 'China', country: 'CN' },
  { code: '+91', flag: '🇮🇳', name: 'India', country: 'IN' },
  { code: '+81', flag: '🇯🇵', name: 'Japón', country: 'JP' },
  { code: '+7', flag: '🇷🇺', name: 'Rusia', country: 'RU' },
  { code: '+27', flag: '🇿🇦', name: 'Sudáfrica', country: 'ZA' },
  { code: '+90', flag: '🇹🇷', name: 'Turquía', country: 'TR' },
  { code: '+971', flag: '🇦🇪', name: 'Emiratos Árabes', country: 'AE' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina', country: 'AR' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador', country: 'EC' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay', country: 'PY' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay', country: 'UY' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia', country: 'BO' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica', country: 'CR' },
  { code: '+507', flag: '🇵🇦', name: 'Panamá', country: 'PA' },
  { code: '+503', flag: '🇸🇻', name: 'El Salvador', country: 'SV' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala', country: 'GT' },
  { code: '+504', flag: '🇭🇳', name: 'Honduras', country: 'HN' },
  { code: '+505', flag: '🇳🇮', name: 'Nicaragua', country: 'NI' },
  { code: '+1809', flag: '🇩🇴', name: 'Rep. Dominicana', country: 'DO' },
  { code: '+53', flag: '🇨🇺', name: 'Cuba', country: 'CU' },
  { code: '+212', flag: '🇲🇦', name: 'Marruecos', country: 'MA' },
  { code: '+20', flag: '🇪🇬', name: 'Egipto', country: 'EG' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria', country: 'NG' },
  { code: '+254', flag: '🇰🇪', name: 'Kenia', country: 'KE' },
  { code: '+62', flag: '🇮🇩', name: 'Indonesia', country: 'ID' },
  { code: '+66', flag: '🇹🇭', name: 'Tailandia', country: 'TH' },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam', country: 'VN' },
  { code: '+63', flag: '🇵🇭', name: 'Filipinas', country: 'PH' },
  { code: '+64', flag: '🇳🇿', name: 'Nueva Zelanda', country: 'NZ' },
  { code: '+46', flag: '🇸🇪', name: 'Suecia', country: 'SE' },
  { code: '+47', flag: '🇳🇴', name: 'Noruega', country: 'NO' },
  { code: '+45', flag: '🇩🇰', name: 'Dinamarca', country: 'DK' },
  { code: '+358', flag: '🇫🇮', name: 'Finlandia', country: 'FI' },
  { code: '+31', flag: '🇳🇱', name: 'Países Bajos', country: 'NL' },
  { code: '+32', flag: '🇧🇪', name: 'Bélgica', country: 'BE' },
  { code: '+41', flag: '🇨🇭', name: 'Suiza', country: 'CH' },
  { code: '+43', flag: '🇦🇹', name: 'Austria', country: 'AT' },
  { code: '+48', flag: '🇵🇱', name: 'Polonia', country: 'PL' },
  { code: '+420', flag: '🇨🇿', name: 'Rep. Checa', country: 'CZ' },
  { code: '+36', flag: '🇭🇺', name: 'Hungría', country: 'HU' },
  { code: '+30', flag: '🇬🇷', name: 'Grecia', country: 'GR' },
  { code: '+972', flag: '🇮🇱', name: 'Israel', country: 'IL' },
  { code: '+98', flag: '🇮🇷', name: 'Irán', country: 'IR' },
  { code: '+966', flag: '🇸🇦', name: 'Arabia Saudita', country: 'SA' },
  { code: '+60', flag: '🇲🇾', name: 'Malasia', country: 'MY' },
  { code: '+65', flag: '🇸🇬', name: 'Singapur', country: 'SG' },
  { code: '+82', flag: '🇰🇷', name: 'Corea del Sur', country: 'KR' },
  { code: '+886', flag: '🇹🇼', name: 'Taiwán', country: 'TW' },
  { code: '+852', flag: '🇭🇰', name: 'Hong Kong', country: 'HK' },
];

function GateScreen({ onNext, resultado }: { 
  onNext: (data: { nombre: string; email: string; whatsapp: string; closers: string }) => void;
  resultado: DiagnosticoOutput;
}) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+52');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [closers, setClosers] = useState('Solo yo');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!email || !nombre) return;
    setLoading(true);
    // Combinar código de país + número
    const fullWhatsapp = phoneNumber ? `${countryCode}${phoneNumber.replace(/\s/g, '')}` : '';
    await new Promise(r => setTimeout(r, 500));
    onNext({ nombre, email, whatsapp: fullWhatsapp, closers });
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <GlowOrb color="blue" size={500} position={{ top: '-150px', right: '-150px' }} />
      
      <div className="max-w-md w-full bg-gradient-to-br from-[rgba(59,130,246,0.1)] to-[rgba(139,92,246,0.05)] backdrop-blur-xl border border-[rgba(0,212,255,0.15)] rounded-[24px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[rgba(59,130,246,0.2)] to-[rgba(139,92,246,0.1)] rounded-full mb-4 border border-[rgba(59,130,246,0.3)]">
            <span className="text-3xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Tu Revenue Gap está listo</h2>
          <p className="text-[#B0C4D8] text-sm">
            Descubrimos un gap de <span className="text-[#FF3860] font-bold text-lg">{formatCurrency(resultado.revenuePerdido)}</span>/mes
          </p>
        </div>
        
        <div className="bg-[rgba(255,56,96,0.1)] border border-[rgba(255,56,96,0.2)] rounded-xl p-4 mb-6">
          <p className="text-[#FF3860] text-sm text-center">
            ⚠️ Esto representa <strong>{formatCurrency(resultado.revenuePerdido * 12)}</strong> al año dejados sobre la mesa
          </p>
        </div>
        
        <p className="text-[#B0C4D8] text-sm mb-4 text-center">
          Completa tus datos para ver el diagnóstico completo con el brief de ejemplo:
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="text-[#B0C4D8] text-xs mb-1 block">Tu nombre *</label>
            <input
              type="text"
              placeholder="Ej: Carlos"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(0,212,255,0.2)] rounded-xl text-white placeholder-[#6B8299] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.2)] outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="text-[#B0C4D8] text-xs mb-1 block">Email *</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(0,212,255,0.2)] rounded-xl text-white placeholder-[#6B8299] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.2)] outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="text-[#B0C4D8] text-xs mb-1 block">WhatsApp</label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(0,212,255,0.2)] rounded-xl text-white focus:border-[#3b82f6] outline-none transition-all text-sm"
                style={{ minWidth: '130px' }}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#1a1a2e] text-white">
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="55 1234 5678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9\s]/g, ''))}
                className="flex-1 px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(0,212,255,0.2)] rounded-xl text-white placeholder-[#6B8299] focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.2)] outline-none transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="text-[#B0C4D8] text-xs mb-2 block">Closers en tu equipo</label>
            <div className="grid grid-cols-4 gap-2">
              {['Solo yo', '1 closer', '2-3', '4+'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setClosers(opt)}
                  className={`py-2 rounded-lg text-sm transition-all ${
                    closers === opt
                      ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold shadow-[0_4px_15px_rgba(59,130,246,0.4)]'
                      : 'bg-[rgba(255,255,255,0.04)] text-[#B0C4D8] hover:bg-[rgba(59,130,246,0.15)] border border-[rgba(0,212,255,0.1)]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!email || !nombre || loading}
            className="w-full py-4 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-bold rounded-full text-lg hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Cargando...' : 'Ver mi diagnóstico completo →'}
          </button>
        </div>
        
        <p className="mt-4 text-[#6B8299] text-xs text-center">
          🔒 Sin spam. Solo recibirás el diagnóstico.
        </p>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 5: DIAGNÓSTICO COMPLETO (Con personalización)
// ============================================

function DiagnosticoScreen({ 
  resultado, 
  input,
  nombre,
  onNext 
}: { 
  resultado: DiagnosticoOutput;
  input: DiagnosticoInput;
  nombre: string;
  onNext: () => void;
}) {
  const horasPorLlamada = 0.75; // 45 minutos
  const horasTotales = input.leads * horasPorLlamada;
  const leadsSinPotencial = Math.round(input.leads * resultado.pctSinCalificar);
  const horasPerdidas = Math.round(leadsSinPotencial * horasPorLlamada);
  const costoHorasPerdidas = Math.round(horasPerdidas * 50); // $50/hora promedio
  
  // Calcular escenarios
  const escenarioActual = {
    leads: input.leads,
    closingRate: input.closingRate,
    cerrados: Math.round(input.leads * input.closingRate),
    revenue: input.leads * input.closingRate * input.ticket,
  };
  
  const escenarioConSistema = {
    leads: input.leads * 0.7, // 30% filtrados
    closingRate: 0.35,
    cerrados: Math.round(input.leads * 0.7 * 0.35),
    revenue: input.leads * 0.7 * 0.35 * input.ticket,
  };
  
  const cierresAdicionales = escenarioConSistema.cerrados - escenarioActual.cerrados;
  
  return (
    <div className="min-h-screen p-4 sm:p-6 relative overflow-hidden pb-24">
      <GlowOrb color="blue" size={600} position={{ top: '-200px', right: '-200px' }} />
      <GlowOrb color="purple" size={400} position={{ bottom: '-100px', left: '-100px' }} delay={2} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[rgba(255,56,96,0.15)] border border-[rgba(255,56,96,0.3)] text-[#FF3860] px-4 py-2 rounded-full text-sm font-medium">
            🔴 Revenue Gap Confirmado
          </span>
          {nombre && (
            <p className="text-white text-lg mt-4">
              {nombre}, descubrimos cuánto deja tu equipo sobre la mesa
            </p>
          )}
        </div>
        
        {/* CARD PRINCIPAL */}
        <div className="bg-gradient-to-br from-[rgba(255,56,96,0.1)] to-[rgba(255,56,96,0.05)] backdrop-blur-xl border border-[rgba(255,56,96,0.2)] rounded-[24px] p-6 sm:p-8 mb-6 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_60px_rgba(255,56,96,0.1)]">
          <h2 className="text-center text-white text-lg mb-4">Dinero que tu equipo deja sobre la mesa</h2>
          <div className="text-center">
            <span className="text-5xl sm:text-6xl font-bold text-[#FF3860] drop-shadow-[0_0_30px_rgba(255,56,96,0.3)]">
              {formatCurrency(resultado.revenuePerdido)}
            </span>
            <span className="text-[#B0C4D8] text-xl">/mes</span>
          </div>
          <p className="text-center text-[#B0C4D8] mt-2">
            = {formatCurrency(resultado.revenuePerdido * 12)} al año
          </p>
        </div>
        
        {/* TU EQUIPO EN NÚMEROS */}
        <div className="bg-gradient-to-br from-[rgba(59,130,246,0.08)] to-[rgba(139,92,246,0.04)] backdrop-blur-xl border border-[rgba(0,212,255,0.1)] rounded-[24px] p-6 mb-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            📊 Tu Equipo en Números
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{input.leads}</p>
              <p className="text-xs text-[#6B8299]">Llamadas/mes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">45 min</p>
              <p className="text-xs text-[#6B8299]">Tiempo promedio</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{Math.round(horasTotales)} hrs</p>
              <p className="text-xs text-[#6B8299]">Totales en llamadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#00D084]">{escenarioActual.cerrados}</p>
              <p className="text-xs text-[#6B8299]">Cierres/mes</p>
            </div>
          </div>
          
          <div className="bg-[rgba(255,56,96,0.08)] border border-[rgba(255,56,96,0.15)] rounded-xl p-4">
            <p className="text-[#FF3860] text-sm">
              ⚠️ <strong>{formatPercent(resultado.pctSinCalificar)}</strong> de ese tiempo ({horasPerdidas} horas) 
              fue con leads sin potencial de compra.
            </p>
            <p className="text-[#B0C4D8] text-sm mt-2">
              💸 Costo de esas {horasPerdidas} horas: <span className="text-[#FF3860] font-bold">${costoHorasPerdidas.toLocaleString()}</span> en comisiones pagadas a prospectos que nunca cerraron.
            </p>
          </div>
        </div>
        
        {/* COMPARATIVA DE ESCENARIOS */}
        <div className="bg-gradient-to-br from-[rgba(0,208,132,0.08)] to-[rgba(0,208,132,0.04)] backdrop-blur-xl border border-[rgba(0,208,132,0.15)] rounded-[24px] p-6 mb-6">
          <h3 className="text-white font-bold mb-4">📈 El sistema no cierra por ti. Te da ventaja.</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[rgba(0,0,0,0.2)] rounded-xl p-4 border border-[rgba(255,255,255,0.05)]">
              <p className="text-[#6B8299] text-xs uppercase tracking-wider mb-2">Sin información (Ahora)</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#B0C4D8]">Leads sin calificar:</span> <span className="text-white">{escenarioActual.leads}/mes</span></div>
                <div className="flex justify-between"><span className="text-[#B0C4D8]">Tiempo perdido:</span> <span className="text-white">60% promedio</span></div>
                <div className="flex justify-between"><span className="text-[#B0C4D8]">Cierres actuales:</span> <span className="text-white">{escenarioActual.cerrados}/mes</span></div>
                <div className="flex justify-between pt-2 border-t border-[rgba(255,255,255,0.1)]"><span className="text-[#B0C4D8]">Revenue:</span> <span className="text-white font-bold">{formatCurrency(escenarioActual.revenue)}</span></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[rgba(0,208,132,0.15)] to-[rgba(0,208,132,0.05)] rounded-xl p-4 border border-[rgba(0,208,132,0.2)]">
              <p className="text-[#00D084] text-xs uppercase tracking-wider mb-2">Con inteligencia* (Proyección)</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#B0C4D8]">Leads calificados:</span> <span className="text-white">{Math.round(escenarioConSistema.leads)}/mes</span></div>
                <div className="flex justify-between"><span className="text-[#B0C4D8]">Tiempo optimizado:</span> <span className="text-[#00D084]">100% en buenos leads</span></div>
                <div className="flex justify-between"><span className="text-[#B0C4D8]">Si tu closer ejecuta:</span> <span className="text-[#00D084]">~{escenarioConSistema.cerrados}/mes</span></div>
                <div className="flex justify-between pt-2 border-t border-[rgba(0,208,132,0.2)]"><span className="text-[#B0C4D8]">Revenue potencial:</span> <span className="text-[#00D084] font-bold">{formatCurrency(escenarioConSistema.revenue)}</span></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center bg-[rgba(0,0,0,0.2)] rounded-lg p-3">
            <p className="text-white text-sm">
              Diferencia potencial: <span className="text-[#00D084] font-bold text-lg">{cierresAdicionales > 0 ? '+' : ''}{cierresAdicionales} cierres</span> si tu closer ejecuta bien
              {cierresAdicionales > 0 && <span className="text-[#6B8299]"> (1 cierre adicional cada {Math.max(1, Math.round(30 / cierresAdicionales))} días)</span>}
            </p>
          </div>
          
          <p className="text-[#6B8299] text-xs mt-3 text-center">
            *El sistema filtra y prepara. El cierre depende 100% de tu closer y su habilidad.
          </p>
        </div>
        
        {/* INSIGHT OCULTO */}
        <div className="bg-gradient-to-r from-[rgba(251,191,36,0.1)] to-[rgba(251,191,36,0.05)] backdrop-blur-xl border border-[rgba(251,191,36,0.2)] rounded-[24px] p-6 mb-6">
          <h3 className="text-[#fbbf24] font-bold mb-3 flex items-center gap-2">
            💡 Insight Oculto
          </h3>
          <p className="text-[#B0C4D8] text-sm leading-relaxed">
            {nombre ? `${nombre}, tu` : 'Tu'} closer está hablando con <span className="text-white font-bold">{leadsSinPotencial} leads/mes</span> que NO deberían estar en sus llamadas.
          </p>
          <p className="text-[#B0C4D8] text-sm mt-2 leading-relaxed">
            Si los filtraras ANTES, tu closer tendría tiempo para <span className="text-[#00D084] font-bold">{Math.round(leadsSinPotencial * 0.3)} llamadas más</span> con leads calificados.
          </p>
          <div className="mt-3 pt-3 border-t border-[rgba(251,191,36,0.2)]">
            <p className="text-[#fbbf24] text-sm font-medium">
              Ahorro en tiempo/comisiones: {formatCurrency(costoHorasPerdidas)}/mes
            </p>
            <p className="text-[#6B8299] text-xs mt-1">
              El sistema te da tiempo e información. El cierre sigue dependiendo de tu closer.
            </p>
          </div>
        </div>
        
        {/* BREAKDOWN DE PROBLEMAS */}
        <div className="bg-gradient-to-br from-[rgba(59,130,246,0.08)] to-[rgba(139,92,246,0.04)] backdrop-blur-xl border border-[rgba(0,212,255,0.1)] rounded-[24px] p-6 mb-6">
          <h3 className="text-white font-bold mb-4">❓ ¿Por qué ocurre este gap?</h3>
          
          {[
            { label: 'Leads sin calificar', pct: resultado.pctSinCalificar, desc: 'Tu closer recibe prospectos sin contexto y pierde 8 minutos iniciales descubriendo si vale la pena hablar.', color: 'blue' },
            { label: 'Perfil mismatch', pct: resultado.pctPerfilMismatch, desc: 'Tu closer usa la misma estrategia con todos. Un Racional necesita lógica, un Emocional necesita velocidad.', color: 'gold' },
            { label: 'Sin brief pre-llamada', pct: resultado.pctSinBrief, desc: `${resultado.horasPerdidas} horas semanales perdidas en llamadas que podría haber ganado si llegara preparado.`, color: 'green' },
          ].map((item, i) => (
            <div key={i} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-2">
                <span className="text-[#B0C4D8] text-xs uppercase tracking-wide">{item.label}</span>
                <span className="text-white font-bold">{formatPercent(item.pct)}</span>
              </div>
              <ProgressBar value={item.pct} color={item.color as any} />
              <p className="text-[#6B8299] text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        
        {/* ROI */}
        <div className="bg-gradient-to-br from-[rgba(251,191,36,0.1)] to-[rgba(251,191,36,0.05)] backdrop-blur-xl border border-[rgba(251,191,36,0.2)] rounded-[24px] p-6 mb-8">
          <h3 className="text-[#fbbf24] font-bold mb-4">📊 Tu ROI Proyectado</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-[#B0C4D8]">Inversión mensual:</span> <span className="text-white">${resultado.costoSistema}</span></div>
            <div className="flex justify-between"><span className="text-[#B0C4D8]">Revenue recuperable:</span> <span className="text-[#00D084] font-bold">{formatCurrency(resultado.revenueRecuperable)}</span></div>
            <div className="flex justify-between pt-2 border-t border-[rgba(251,191,36,0.2)]">
              <span className="text-[#fbbf24] font-semibold">ROI:</span>
              <span className="text-[#fbbf24] font-bold text-2xl">{resultado.roiMultiplier}x{resultado.roiMultiplier >= 20 ? '+' : ''}</span>
            </div>
          </div>
          <div className="bg-[rgba(0,0,0,0.2)] rounded-lg p-3 mt-4 border border-[rgba(251,191,36,0.1)]">
            <p className="text-[#fbbf24] text-xs">
              ⚠️ Este ROI depende 100% de la ejecución de tu closer. El sistema entrega información, el cierre es responsabilidad de tu equipo.
            </p>
          </div>
          <p className="text-[#6B8299] text-xs mt-3">⏱ Implementación: 7 días</p>
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <button
            onClick={onNext}
            className="px-10 py-5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-bold rounded-full text-xl hover:scale-105 transition-all shadow-[0_0_60px_rgba(59,130,246,0.4)]"
          >
            Ver el brief pre-llamada →
          </button>
        </div>
      </div>
    </div>
  );
}


// ============================================
// SCREEN 7: BRIEF PREVIEW (UI de chat realista)
// ============================================

function BriefPreviewScreen({ 
  brief, 
  input,
  perfilCQ
}: { 
  brief: GeneratedBrief | null;
  input: DiagnosticoInput;
  perfilCQ?: string;
}) {
  const [showBrief, setShowBrief] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowBrief(true), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  if (!showBrief || !brief) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <GlowOrb color="blue" size={500} position={{ top: '-150px', left: '-150px' }} />
        
        <div className="text-center relative z-10">
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[rgba(59,130,246,0.2)] to-[rgba(139,92,246,0.1)] rounded-full flex items-center justify-center border border-[rgba(59,130,246,0.3)]">
              <div className="w-3 h-3 bg-[#3b82f6] rounded-full animate-ping"></div>
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-[#3b82f6] rounded-full animate-ping opacity-20"></div>
          </div>
          <p className="text-white text-xl font-medium">María está analizando el perfil...</p>
          <p className="text-[#6B8299] text-sm mt-2">Generando brief personalizado</p>
          
          <div className="mt-6 flex justify-center gap-1">
            <span className="w-2 h-2 bg-[#3b82f6] rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-[#3b82f6] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
            <span className="w-2 h-2 bg-[#3b82f6] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 sm:p-6 relative overflow-hidden pb-24">
      <GlowOrb color="blue" size={600} position={{ top: '-200px', right: '-200px' }} />
      
      <div className="max-w-md mx-auto relative z-10">
        <h2 className="text-xl font-bold text-white mb-2 text-center">
          Así llegaría el brief a tu closer:
        </h2>
        {perfilCQ && (
          <p className="text-center text-[#6B8299] text-sm mb-6">
            Perfil detectado: <span className="text-[#00D4FF] capitalize">{perfilCQ.replace('_', ' ')}</span>
          </p>
        )}
        
        {/* UI DE CHAT */}
        <div className="bg-[#0f0f1a] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.05)]">
          {/* Header */}
          <div className="bg-[#1a1a2e] px-4 py-3 flex items-center gap-3 border-b border-[rgba(255,255,255,0.05)]">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">María (IA)</p>
              <p className="text-[#00D084] text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#00D084] rounded-full"></span>
                En línea
              </p>
            </div>
            <span className="text-[#6B8299] text-xs">Ahora</span>
          </div>
          
          {/* Mensaje */}
          <div className="p-4 space-y-3">
            <div className="bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.2)] rounded-2xl rounded-tl-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚡</span>
                <span className="text-[#00D4FF] font-bold text-sm">BRIEF PRE-LLAMADA</span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="bg-[rgba(0,212,255,0.1)] border-l-3 border-[#00D4FF] rounded-r-lg p-3">
                  <p className="text-[#00D4FF] font-bold text-xs mb-1">🎯 PERFIL DETECTADO</p>
                  <p className="text-white">{brief.perfil}</p>
                </div>
                
                <div>
                  <p className="text-[#6B8299] text-xs mb-1">💡 QUÉ LO MUEVE</p>
                  <p className="text-[#B0C4D8]">{brief.queLoMueve}</p>
                </div>
                
                <div className="bg-[rgba(255,56,96,0.1)] border-l-3 border-[#FF3860] rounded-r-lg p-3">
                  <p className="text-[#FF3860] font-bold text-xs mb-1">⚠️ ERROR A EVITAR</p>
                  <p className="text-white">{brief.errorAEvitar}</p>
                </div>
                
                <div className="bg-[rgba(0,208,132,0.1)] border-l-3 border-[#00D084] rounded-r-lg p-3">
                  <p className="text-[#00D084] font-bold text-xs mb-1">✅ ESTRATEGIA</p>
                  <p className="text-white">{brief.estrategia}</p>
                </div>
                
                <div>
                  <p className="text-[#6B8299] text-xs mb-1">🔒 CIERRE RECOMENDADO</p>
                  <p className="text-[#fbbf24] font-medium">{brief.cierre}</p>
                </div>
                
                <div className="pt-2 border-t border-[rgba(255,255,255,0.1)]">
                  <p className="text-[#6B8299] text-xs mb-1">📌 OBJECIÓN PROBABLE</p>
                  <p className="text-white">"{brief.objecionProbable}"</p>
                  <p className="text-[#B0C4D8] text-xs mt-1">→ {brief.respuesta}</p>
                </div>
              </div>
            </div>
            
            <p className="text-[#6B8299] text-xs text-center">
              Este brief se generó en 3 segundos para este lead específico.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a
            href="https://calendly.com/mgallmur/45"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-bold rounded-full text-lg hover:scale-105 transition-all shadow-[0_0_60px_rgba(59,130,246,0.4)]"
          >
            Quiero esto en mi equipo →
          </a>
        </div>
      </div>
    </div>
  );
}


// ============================================
// SCREEN 8: CTA FINAL (Con Calendly, escasez, share)
// ============================================

function CTAScreen({ revenuePerdido }: { revenuePerdido: number }) {
  const [copied, setCopied] = useState(false);
  const slotsDisponibles = 3; // Esto podría venir de una API
  const proximoSlot = "Martes 4 de marzo";
  
  const handleShare = () => {
    const text = `Descubrí que pierdo ${formatCurrency(revenuePerdido)}/mes en mi equipo de ventas. ¿Tú también? Descúbrelo gratis aquí: https://mgallmur-glitch.github.io/instant-qualifier/diagnostico`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <GlowOrb color="blue" size={600} position={{ top: '-200px', right: '-200px' }} />
      <GlowOrb color="purple" size={400} position={{ bottom: '-100px', left: '-100px' }} delay={2} />
      
      <div className="max-w-2xl mx-auto text-center relative z-10 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          <span className="text-white">El problema no es tu closer.</span>
          <br />
          <span className="bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
            Es que no tiene un sistema.
          </span>
        </h2>
        
        <p className="text-lg sm:text-xl text-[#B0C4D8] mb-8">
          Tu equipo tiene el potencial de cerrar<br />
          <span className="text-[#00D084] font-bold text-2xl sm:text-3xl">{formatCurrency(revenuePerdido * 0.6)}</span> más este mes.
          <br />
          <span className="text-[#6B8299]">Con el sistema correcto y 7 días de implementación.</span>
        </p>
        
        {/* CARD DE ESCASEZ */}
        <div className="bg-gradient-to-br from-[rgba(255,56,96,0.15)] to-[rgba(255,56,96,0.05)] backdrop-blur-xl border border-[rgba(255,56,96,0.3)] rounded-[24px] p-6 mb-8 shadow-[0_0_60px_rgba(255,56,96,0.2)]">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-3 h-3 bg-[#FF3860] rounded-full animate-pulse"></span>
            <span className="text-[#FF3860] font-bold text-lg">Solo {slotsDisponibles} cupos disponibles esta semana</span>
          </div>
          
          <div className="flex justify-center gap-4 text-sm mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">2</p>
              <p className="text-[#6B8299]">Implementaciones en curso</p>
            </div>
            <div className="w-px bg-[rgba(255,255,255,0.1)]"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#00D084]">{slotsDisponibles}</p>
              <p className="text-[#6B8299]">Slots disponibles</p>
            </div>
          </div>
          
          <p className="text-[#B0C4D8] text-sm">
            Próximo slot disponible: <span className="text-white font-semibold">{proximoSlot}</span>
          </p>
        </div>
        
        {/* CTA PRINCIPAL CON CALENDLY */}
        <div className="bg-gradient-to-br from-[rgba(59,130,246,0.2)] to-[rgba(139,92,246,0.1)] backdrop-blur-xl border border-[rgba(59,130,246,0.3)] rounded-[24px] p-6 mb-6 shadow-[0_0_60px_rgba(59,130,246,0.3)]">
          <h3 className="text-xl font-bold text-white mb-4">
            Agendar llamada de diagnóstico gratuito
          </h3>
          
          <div className="space-y-2 text-[#B0C4D8] text-sm mb-6">
            <p>✓ 30 minutos de análisis de tu operación</p>
            <p>✓ Demo del sistema con tus números reales</p>
            <p>✓ Plan de implementación personalizado</p>
            <p>✓ Sin compromiso</p>
          </div>
          
          <a
            href="https://calendly.com/mgallmur/45"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb] text-white font-bold rounded-full text-xl hover:scale-105 transition-all shadow-[0_0_60px_rgba(59,130,246,0.5)]"
          >
            Agendar mi llamada →
          </a>
          
          <p className="mt-4 text-[#6B8299] text-xs">
            Cupos limitados · Implementación en 7 días
          </p>
        </div>
        
        {/* COMPARTIR */}
        <div className="border-t border-[rgba(255,255,255,0.1)] pt-6">
          <p className="text-[#B0C4D8] mb-4 text-sm">¿Conoces a alguien con un equipo de closers? Comparte esto:</p>
          
          <button
            onClick={handleShare}
            className="px-6 py-3 bg-[rgba(59,130,246,0.1)] border border-[rgba(0,212,255,0.2)] text-[#00D4FF] rounded-full hover:scale-105 transition-all text-sm"
          >
            {copied ? '✓ ¡Copiado!' : '📤 Copiar para compartir'}
          </button>
          
          <p className="mt-3 text-[#6B8299] text-xs max-w-md mx-auto">
            "Descubrí que pierdo {formatCurrency(revenuePerdido)}/mes en mi equipo de ventas. ¿Tú también?"
          </p>
        </div>
      </div>
    </div>
  );
}


// ============================================
// MAIN COMPONENT
// ============================================

export default function DiagnosticPage() {
  const [screen, setScreen] = useState(0);
  const [input, setInput] = useState<Partial<DiagnosticoInput>>({});
  const [result, setResult] = useState<DiagnosticoOutput | null>(null);
  const [brief, setBrief] = useState<GeneratedBrief | null>(null);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleNext = () => setScreen(s => s + 1);
  
  const handleCalculadoraSubmit = (data: DiagnosticoInput) => {
    setInput(data);
    const calcResult = calculateRevenueGap(data);
    setResult(calcResult);
    handleNext();
  };
  
  const handleGateSubmit = async (data: { 
    nombre: string; 
    email: string; 
    whatsapp: string; 
    closers: string;
  }) => {
    setIsLoading(true);
    setNombre(data.nombre);
    setEmail(data.email);
    
    // Actualizar input con closers y nombre
    const fullInput: DiagnosticoInput = {
      leads: input.leads || 42,
      ticket: input.ticket || 6000,
      closingRate: input.closingRate || 0.18,
      closers: data.closers,
      facturacionMensual: input.facturacionMensual,
      nombre: data.nombre,
    };
    setInput(fullInput);
    
    // Recalcular con closers actualizado
    const calcResult = calculateRevenueGap(fullInput);
    setResult(calcResult);
    
    // Capturar lead en backend (con envío de WhatsApp/Email)
    try {
      const response = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre,
          email: data.email,
          whatsapp: data.whatsapp,
          closers: data.closers,
          leads: fullInput.leads,
          ticket: fullInput.ticket,
          closingRate: fullInput.closingRate,
          facturacionMensual: fullInput.facturacionMensual,
          revenuePerdido: calcResult.revenuePerdido,
          revenueRecuperable: calcResult.revenueRecuperable,
          perfilCQ: calcResult.perfilCQ,
          roiMultiplier: calcResult.roiMultiplier,
        }),
      });
      
      const result = await response.json();
      console.log('Lead captured:', result);
      
      // Mostrar mensaje según el canal usado
      if (result.whatsappStatus === 'sent') {
        console.log('✅ WhatsApp enviado a', data.whatsapp);
      } else if (result.emailStatus === 'sent') {
        console.log('✅ Email enviado a', data.email);
      }
    } catch (error) {
      console.error('Error capturing lead:', error);
    }
    
    setIsLoading(false);
    handleNext();
  };
  
  const handleVerBrief = async () => {
    if (!result || !input.leads) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input: input as DiagnosticoInput, 
          output: result 
        }),
      });
      const data = await response.json();
      setBrief(data.brief);
    } catch (error) {
      console.error('Error generating brief:', error);
      // Fallback
      setBrief(getMockBrief({ 
        input: input as DiagnosticoInput, 
        output: result 
      }));
    }
    
    setIsLoading(false);
    handleNext();
  };
  
  // Loading overlay
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060610]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Procesando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-[#060610] text-white overflow-x-hidden">
      {screen === 0 && <PreHeroScreen onNext={handleNext} />}
      {screen === 1 && <HeroScreen onNext={handleNext} />}
      {screen === 2 && (
        <CalculadoraScreen 
          onNext={handleCalculadoraSubmit} 
          onInput={(partial) => setInput(prev => ({ ...prev, ...partial }))} 
        />
      )}
      {screen === 3 && result && (
        <GateScreen 
          onNext={handleGateSubmit} 
          resultado={result}
        />
      )}
      {screen === 4 && result && input && (
        <DiagnosticoScreen 
          resultado={result} 
          input={input as DiagnosticoInput}
          nombre={nombre}
          onNext={handleVerBrief}
        />
      )}
      {screen === 5 && (
        <BriefPreviewScreen 
          brief={brief}
          input={input as DiagnosticoInput}
          perfilCQ={result?.perfilCQ}
        />
      )}
      {screen === 6 && result && (
        <CTAScreen revenuePerdido={result.revenuePerdido} />
      )}
    </main>
  );
}
