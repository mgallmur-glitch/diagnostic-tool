# Fase 3 — AI Roleplay Simulator
## Sistema de Práctica Infinita con IA

> **Documentación técnica completa para implementar el simulador de roleplay con IA usando Vapify + Vapi.ai + OpenClaw (Jarvis)**

---

## 🎯 VISIÓN GENERAL

La **Fase 3** de The Closing Code AI transforma la **Sesión 2** del programa original (Roleplay Estratégico) en un **sistema automatizado e infinito**.

**El problema que resuelve:**
- Los closers necesitan practicar objetiones reales sin arriesgar deals
- Los entrenamientos tradicionales son caros ($1K+/hr con coach humano)
- No hay forma de practicar 24/7 con perfiles específicos

**La solución:**
Un sistema donde el closer llama a un número de teléfono, la IA simula uno de los 4 perfiles cuánticos con objeciones reales, y Jarvis analiza el desempeño contra la metodología Closing Cuántico.

---

## 🏗️ ARQUITECTURA TÉCNICA

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   CLOSER        │────▶│   Vapi.ai        │────▶│   Whisper AI    │
│   (llama)       │     │   (IA prospecto) │     │   (transcripción)│
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                                                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   REPORTE       │◀────│   JARVIS         │◀────│   ANÁLISIS      │
│   (Telegram/GHL)│     │   (OpenClaw)     │     │   (Closing      │
│                 │     │                  │     │   Cuántico)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Stack Tecnológico:

| Componente | Herramienta | Costo |
|------------|-------------|-------|
| Motor de voz AI | Vapi.ai | ~$0.05-0.10/min |
| White-label | Vapify | $29-149/mes (ya pagado) |
| Transcripción | Whisper AI (Open Source) | $0 (VPS propio) |
| Análisis | Jarvis (OpenClaw + Claude) | API key Anthropic |
| Entrega reporte | Telegram Bot / GHL / Email | Gratis |

---

## 🔧 IMPLEMENTACIÓN PASO A PASO

### PASO 1: Crear 4 Assistants en Vapi.ai (via Vapify)

Para cada perfil cuántico, creamos un assistant separado con su propio número de teléfono.

---

#### Assistant #1: "Emocional Impulsivo"

**System Prompt:**
```
Eres un prospecto tipo "Emocional Impulsivo" en una llamada de ventas.

CARACTERÍSTICAS:
- Hablas rápido, con entusiasmo
- Tomas decisiones basadas en emoción, no lógica
- Temes perderte la oportunidad (FOMO intenso)
- Respondes a la urgencia y escasez
- Dices cosas como "¡Esto es exactamente lo que necesito!", "¿Cuándo podemos empezar?"

COMPORTAMIENTO:
- Muestra interés genuino y emoción por el programa
- Pregunta "¿Cuánto cuesta?" temprano en la llamada
- Si el closer maneja bien la urgencia, te emocionas más
- Si el closer es lento/lógico, te frustras y pierdes interés

OBJECIONES TÍPICAS:
- "¿Puedo empezar mañana mismo?" (urgencia falsa)
- "Dame un descuento si pago hoy" (negociación emocional)
- "No necesito pensarlo, pero..." (duda disfrazada)

META: Ser emocional, impulsivo, pero descubrir si el closer puede manejar tu energía y cerrar SIN que te arrepientas después.
```

**Número de teléfono:** +52-XXX-XXX-0001 (ejemplo México)

---

#### Assistant #2: "Racional Inseguro"

**System Prompt:**
```
Eres un prospecto tipo "Racional Inseguro" en una llamada de ventas.

CARACTERÍSTICAS:
- Hablas pausado, medido
- Necesitas datos, números, evidencia antes de decidir
- Tienes miedo de tomar la decisión equivocada
- Comparas con otras opciones constantemente
- Dices "necesito pensarlo", "déjame ver los números"

COMPORTAMIENTO:
- Preguntas por casos de estudio, testimonios, data
- Necesitas ver ROI calculado específicamente
- Mencionas que estás "viendo otras opciones"
- Te resistes a comprometerte rápido

OBJECIONES TÍPICAS:
- "Necesito ver casos de estudio de alguien en mi industria"
- "¿Cuál es el ROI exacto en 90 días?"
- "Estoy comparando con otra opción más barata"
- "Déjame consultarlo con mi socio/contador"

META: Ser escéptico, pedir data, y ver si el closer puede darte SEGURIDAD lógica para decidir.
```

**Número de teléfono:** +52-XXX-XXX-0002 (ejemplo México)

---

#### Assistant #3: "Crítico Evasivo"

**System Prompt:**
```
Eres un prospecto tipo "Crítico Evasivo" en una llamada de ventas.

CARACTERÍSTICAS:
- Pones objeciones constantemente
- Desvías la conversación
- Nunca dices "no" directamente, pero nunca dices "sí"
- Buscas excusas para no decidir
- Eres educado pero evasivo

COMPORTAMIENTO:
- Cada vez que el closer pregunta algo, tú pones una objeción
- Cambias de tema cuando te presionan
- Dices "suena interesante, pero..." seguido de excusa
- Nunca comprometes fecha, dinero, o decisión

OBJECIONES TÍPICAS:
- "Suena bien, pero necesito consultar con mi equipo"
- "El timing no es ideal ahora, estamos en temporada alta"
- "No sé si estamos listos para este nivel de inversión"
- "¿Y si no funciona para nuestro caso específico?"
- "Déjame pensarlo y te llamo" (nunca llamas)

META: Ser evasivo, poner objeciones, y ver si el closer puede mantenerte en la llamada y avanzar hacia un compromiso CONCRETO.
```

**Número de teléfono:** +52-XXX-XXX-0003 (ejemplo México)

---

#### Assistant #4: "Decisor Dependiente"

**System Prompt:**
```
Eres un prospecto tipo "Decisor Dependiente" en una llamada de ventas.

CARACTERÍSTICAS:
- NO tienes poder de decisión real
- Constantemente mencionas "mi socio", "mi esposa", "mi jefe"
- Eres entusiasta pero incapaz de comprometerte
- Necesitas la aprobación de alguien más

COMPORTAMIENTO:
- Muestras interés genuino: "¡Esto es perfecto para nosotros!"
- Pero cuando viene el cierre: "Tengo que consultar con [persona]"
- Intentas ser el "intermediario" entre el vendedor y el decisor
- No puedes comprometer fecha, dinero, ni siguiente paso sin el otro

OBJECIONES TÍPICAS:
- "Me encanta, pero mi socio tiene que verlo"
- "Mi esposa maneja las finanzas, necesito hablarlo con ella"
- "No puedo decidir sin consultar al equipo"
- "¿Puedes enviarme un resumen para mostrarle a mi jefe?"

META: Ser entusiasta pero dependiente, y ver si el closer puede identificar que NO eres el decisor y navegar hacia conseguir al verdadero decisor en la llamada.
```

**Número de teléfono:** +52-XXX-XXX-0004 (ejemplo México)

---

### PASO 2: Configurar el Flujo de Práctica

#### A. Asignación de Perfiles

**Manual (para empezar):**
- Lunes: Emocional Impulsivo
- Martes: Racional Inseguro
- Miércoles: Crítico Evasivo
- Jueves: Decisor Dependiente
- Viernes: Perfil aleatorio / más débil del closer

**Automatizado (futuro):**
- Jarvis asigna según análisis de debilidades del closer
- Si el closer tiene 30% éxito con Crítico Evasivo → más práctica ahí

#### B. Estructura de la Sesión (15-20 minutos)

**Minuto 0-2:** Apertura y calentamiento
- IA: "Hola, ¿con quién hablo?"
- Closer: Presentación, establecer rapport

**Minuto 2-5:** Discovery y detección de pain
- Closer: Preguntas de cualificación
- IA: Responde según perfil (emocional, racional, etc.)

**Minuto 5-12:** Presentación y objeciones
- Closer: Presenta la oferta
- IA: Lanza 2-3 objeciones del Closing Cuántico
- Ejemplo Crítico Evasivo: "Suena caro", "Necesito consultar", "Timing no es ideal"

**Minuto 12-18:** Cierre o manejo de objeciones
- Closer: Intenta cerrar o conseguir siguiente paso
- IA: Resiste, evade, o muestra interés según perfil

**Minuto 18-20:** Conclusión
- Closer: Compromete siguiente paso o cierra
- IA: Colgar o aceptar/rechazar según desempeño

---

### PASO 3: Análisis Post-Sesión con Jarvis

#### A. Configurar Webhook en Vapi

1. En Vapi dashboard: Webhooks → Add Endpoint
2. URL: `https://tu-webhook-openclaw.com/analyze-roleplay`
3. Events: `call.ended`
4. Payload incluye: transcript completo, recording URL, metadata

#### B. Skill de Jarvis (OpenClaw)

**Nombre:** `analyze_roleplay`

**Trigger:** Llega transcript de llamada de roleplay

**Prompt del Skill:**
```
Analiza esta transcripción de roleplay de closing:

TRANSCRIPCIÓN:
{{transcript}}

PERFIL ASIGNADO: {{profile_type}}
CLOSER: {{closer_name}}
FECHA: {{date}}

INSTRUCCIONES DE ANÁLISIS:

1. IDENTIFICAR PERFIL DETECTADO
   - ¿El closer identificó correctamente el perfil del prospecto?
   - ¿Usó el lenguaje adecuado para ese perfil?

2. EVALUAR SISTEMA DE CIERRE USADO
   - ¿Qué sistema de cierre aplicó? (Si Yo Te Garantizo, Del 1 al 10, etc.)
   - ¿Era el sistema correcto para el perfil?
   - Ejemplo de error: "Usó 'Benjamin Franklin' (lógico) con Emocional Impulsivo"

3. DETECTAR ERRORES ESPECÍFICOS
   - Busca timestamps de errores críticos
   - Ejemplo: "Minuto 4:30 - El prospecto dijo 'necesito pensarlo' y el closer aceptó en lugar de usar 'Del 1 al 10'"

4. EVALUAR MANEJO DE OBJECIONES
   - ¿Cuántas objeciones lanzó la IA?
   - ¿Cuántas manejó correctamente el closer?
   - ¿Cuáles falló y por qué?

5. PUNTUACIÓN GLOBAL
   - Score 1-10 del desempeño
   - Comparación con sesiones anteriores (si hay historial)

6. RECOMENDACIONES ESPECÍFICAS
   - Qué practicar en la siguiente sesión
   - Qué técnica repasar
   - Link al recurso correspondiente del Closing Cuántico

FORMATO DE REPORTE:

📊 REPORTE DE PRÁCTICA — {{closer_name}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Perfil practicado: {{profile_type}}
Duración: {{duration}} minutos
Score: X/10

✅ LO QUE HIZO BIEN:
• [Lista]

❌ ERRORES DETECTADOS:
• Minuto X:XX — [Error específico] → [Corrección]

📚 RECOMENDACIÓN:
Practicar [técnica específica] en tu próxima sesión.

Recurso recomendado: [link al módulo del Closing Cuántico]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### C. Entrega del Reporte

**Opción 1 — Telegram (para closer directo):**
- Bot de Telegram envía reporte formateado
- Incluye audio de la llamada (si aplica)

**Opción 2 — GHL (para dueño de negocio):**
- Actualiza contacto del closer en GHL
- Nota con reporte en campo personalizado
- Tag: "Roleplay completado - {{fecha}}"

**Opción 3 — Email (B2C closers freelance):**
- Email automático con reporte
- Incluye link a dashboard con historial

---

## 💰 MODELO DE PRECIOS

### B2B — Infoproductor (para su equipo)

| Plan | Precio | Incluye |
|------|--------|---------|
| **Roleplay Básico** | +$500/mes | 10 sesiones/mes, 4 perfiles, reporte básico |
| **Roleplay Pro** | +$1,000/mes | Sesiones ilimitadas, análisis Jarvis detallado, seguimiento de mejora |
| **Roleplay Elite** | +$2,000/mes | Ilimitado + 1 sesión mensual revisión con Gallmur |

**Costo real:**
- Vapi.ai: ~$0.08/min × 20 min × 10 sesiones = $16/mes por closer
- Vapify: Ya incluido en costo fijo
- Jarvis/Claude API: ~$5-10/mes en tokens

**Margen:** 85-95%

---

### B2C — Closers Freelance

| Plan | Precio | Incluye |
|------|--------|---------|
| **Práctica Básica** | $97/mes | 5 sesiones/mes, 1 perfil a elección |
| **Práctica Completa** | $197/mes | 12 sesiones/mes, todos los perfiles, reporte Jarvis |

**Target:** Closers que quieren mejorar sin pagar $1K/hr a un coach

**Value prop:** "Practica con los 4 perfiles difíciles 24/7 por menos de lo que cuesta 1 hora con un coach humano"

---

## 📊 METRICS DE ÉXITO (KPIs)

Para medir el éxito del Roleplay Simulator:

### Métricas del Sistema:
- **Sesiones completadas/mes:** Objetivo 100% de asignadas
- **Duración promedio:** 15-20 minutos (óptimo)
- **Tasa de error detectada:** Cuántos errores encuentra Jarvis por sesión
- **Tiempo de análisis:** <5 minutos desde colgar a reporte listo

### Métricas del Closer:
- **Score promedio:** Debe subir semana a semana
- **Errores recurrentes:** Deben disminuir con la práctica
- **Confianza self-reported:** Encuesta post-sesión (1-10)
- **Mejora en closing rate real:** Comparar antes/después de 30 días de práctica

### Métricas de Negocio:
- **Adopción B2B:** % de clientes Fase 1 que hacen upsell a Fase 3
- **Churn B2C:** <10% mensual es saludable
- **LTV B2C:** $97-197 × 12 meses = $1,164-2,364 por closer
- **CAC B2C:** Objetivo <$30 (contenido orgánico + referrals)

---

## 🚀 ROADMAP DE IMPLEMENTACIÓN

### Fase 0 — MVP (Semanas 1-2)
- [ ] Configurar 1 assistant (Emocional Impulsivo)
- [ ] Probar con 1 closer del equipo de Gallmur
- [ ] Manual: Gallmur asigna el perfil y revisa el transcript
- [ ] Reporte manual por Telegram

### Fase 1 — Automatización Básica (Semanas 3-4)
- [ ] Configurar los 4 assistants
- [ ] Crear skill básica de Jarvis para análisis
- [ ] Automatizar envío de reporte por Telegram
- [ ] Testear con 3-5 closers

### Fase 2 — Producto Completo (Mes 2)
- [ ] Dashboard de métricas del closer
- [ ] Sistema de asignación automática de perfiles
- [ ] Integración con GHL para B2B
- [ ] Landing page para venta B2C

### Fase 3 — Escala (Mes 3+)
- [ ] Onboarding automatizado B2C
- [ ] Comunidad de closers practicando
- [ ] Leaderboards y gamificación
- [ ] Certificaciones "Closing Cuántico"

---

## ⚠️ CONSIDERACIONES TÉCNICAS

### Limitaciones actuales de Vapi.ai:
1. **Voz:** Limitado a voces disponibles en ElevenLabs (buenas, pero no perfectas)
2. **Latencia:** Puede haber 1-2 segundos de delay en respuestas
3. **Emociones:** La IA no "siente" realmente, simula basada en prompt

**Mitigaciones:**
- Disclaimer: "Esta es una simulación con IA, no reemplaza llamadas reales"
- Actualizar prompts regularmente para mejorar realismo
- Combinar con llamadas reales grabadas (Fase 2)

### Costos a escala:
- 100 closers B2C × 12 sesiones × 20 min × $0.08/min = **$1,920/mes** en Vapi
- Ingresos: 100 × $197 = **$19,700/mes**
- Margen: **90%** (antes de otros costos)

---

## 🎯 INTEGRACIÓN CON FASE 1 Y 2

### Flujo completo del cliente:

```
MES 1-2: Fase 1 (Instant Qualifier)
        ↓
El cliente ve que sus closers cierran más leads calificados
        ↓
MES 2-3: Upsell a Fase 2 (AI Closer Coach)
        ↓
Detectan que closers cometen errores tácticos específicos
        ↓
MES 3+: Upsell a Fase 3 (AI Roleplay Simulator)
        ↓
Closers practican los perfiles donde más fallan
        ↓
RESULTADO: Closing rate del equipo sube 20-40%
```

### Estrategia de venta cruzada:
- Desde Fase 1: "Tus closers reciben leads calificados, pero ¿están cerrando al máximo?"
- Desde Fase 2: "Veo que tu closer falla con Crítico Evasivo. ¿Quiere practicarlo 10 veces esta semana?"

---

## 📚 RECURSOS ADICIONALES

- **Documentación Vapi:** https://docs.vapi.ai
- **OpenClaw Docs:** https://docs.openclaw.ai
- **Whisper AI:** https://github.com/openai/whisper
- **ElevenLabs Voices:** https://elevenlabs.io/voice-library

---

*Fase 3 — AI Roleplay Simulator*
*The Closing Code AI | Mauricio Gallmur*
*"La práctica perfecta hace al closer perfecto"*
