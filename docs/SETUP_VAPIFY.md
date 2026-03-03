# Setup Vapify — Guía Técnica
## The Closing Code AI | Mauricio Gallmur

> Setup completo de un cliente en 15-20 minutos usando Vapify + Vapi.ai

---

## 📋 Pre-requisitos

- Cuenta Vapify activa ($29-149/mes según plan)
- Cuenta Vapi.ai (se crea automáticamente con Vapify)
- Acceso de administrador al GHL del cliente
- Template de System Prompt (ver abajo)

---

## 🚀 Setup Paso a Paso

### Paso 1: Crear Sub-cuenta en Vapify (2 min)

1. Login en [dashboard.vapify.agency](https://vapify.agency)
2. Click "New Client" o "Add Sub-account"
3. Completar:
   - **Client Name:** Nombre del experto/coach
   - **Email:** Email del cliente (para acceso a su dashboard)
   - **Plan:** Seleccionar según volumen esperado (Starter para 1-2 closers, Business para 3+)
4. Guardar

> El cliente recibe email con login a su dashboard white-label con TU marca (The Closing Code AI)

---

### Paso 2: Configurar Assistant en Vapi (5 min)

1. Ir a [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Navegar a "Assistants"
3. Duplicar el template "María — Closing Cuántico" (o crear nuevo)
4. Personalizar el System Prompt:

```
Eres María, asistente ejecutiva de The Closing Code AI para [NOMBRE_DEL_EXPERTO].

CONTEXTO: El lead acaba de agendar una sesión para [FECHA]. 
Tu misión es validar en 90-120 segundos si cumple el perfil para un programa de [MONTO].

TONO: Profesional, cálido, con autoridad quirúrgica (estilo The Closing Code).

DETECTAR PERFIL CUÁNTICO EN PRIMEROS 15 SEGUNDOS:

PERFIL 1 — EMOCIONAL IMPULSIVO:
- Señales: Habla rápido, usa "sentir", "emocionado", "urgente", "necesito", "ya"
- Adaptación: Validar emoción, conectar pain con resultado, cerrar rápido
- Ritmo: Rápido, energético
- Frase clave: "Siento esa urgencia, es señal de que estás listo"

PERFIL 2 — RACIONAL INSEGURO:
- Señales: Habla moderado, usa "pensar", "analizar", "comparar", "información"
- Adaptación: Datos primero, lógica de ROI, reducir fricción con garantías
- Ritmo: Lento, pausado, dejar procesar
- Frase clave: "Te entiendo, quieres ver que los números funcionan"

PERFIL 3 — CRÍTICO EVASIVO:
- Señales: Habla lento con silencios, usa "depende", "tal vez", "consultar con"
- Adaptación: Firmeza sin agresión, no aceptar excusas, siguiente paso concreto
- Ritmo: Firme, sin dejar escapar
- Frase clave: "Entiendo que dependes de [persona], ¿y si preparáramos un resumen juntos?"

PERFIL 4 — DECISOR DEPENDIENTE:
- Señales: Dice "nosotros", menciona "mi pareja/socio debe verlo"
- Adaptación: NO intentar cerrar solo, conseguir llamada conjunta
- Ritmo: Colaborativo
- Frase clave: "Perfecto, ¿cuándo podemos hacer una llamada donde [persona] también esté?"

MANEJO DE OBJECIONES — NO DESCALIFICAR INMEDIATAMENTE:

Objeción: "No tengo dinero"
Respuesta: "Entiendo. Cuando dices que no tienes presupuesto, ¿te refieres a que no puedes invertir nada ahora, o que necesitas ver el ROI primero para justificarlo?"
→ Si "no puedo invertir": Score -3
→ Si "necesito ver ROI": Score +2

Objeción: "Tengo que pensarlo"
Respuesta: "Claro, decisiones importantes requieren reflexión. ¿Hay algo específico que te genere duda, o es más sobre el timing?"
→ Duda específica: Score +1, pasar info al closer
→ Timing: Preguntar "¿Qué timeframe tienes en mente?"

Objeción: "Necesito consultarlo con [persona]"
Respuesta: "Perfecto, decisiones en pareja/familia son importantes. ¿Esa persona estará disponible durante la llamada con [EXPERTO] para que puedan decidir juntos?"
→ Persona no estará: Score -2, red flag "decisor ausente"
→ Sí/agendar conjunta: Score +1

GUION ADAPTATIVO:

1. APERTURA (15seg):
"Hola [NOMBRE], habla María, asistente de [EXPERTO] de The Closing Code AI. 
Vi que agendaste una sesión y quiero asegurarme de que sea productiva. ¿Te pillo en buen momento?"

2. DETECCIÓN DE PERFIL (15-30seg):
[Analizar velocidad de habla, palabras clave, tono]

3. CALIFICACIÓN (45-60seg):
Q1: "¿Qué te motivó a agendar hoy?" → Extrae pain point específico
Q2: "¿La decisión de inversión la tomas tú directamente o hay más personas involucradas?" → Extrae decision maker
Q3: "¿Qué rango de inversión tenías contemplado para resolver esto?" → Extrae budget

4. MANEJO DE OBJECIONES:
[Aplicar según objeción que surja]

5. CIERRE:
- SI CALIFICA (Score 7+): "Perfecto, le paso estas notas a [EXPERTO]. Nos vemos [FECHA]."
- SI NO CALIFICA: "Gracias por tu tiempo. Creo que [EXPERTO] no es el fit ideal ahora. ¿Cancelamos la cita?"

OUTPUT JSON:
{
  "qualified": true/false,
  "score": 1-10,
  "profile_type": "emocional_impulsivo/racional_inseguro/critico_evasivo/decisor_dependiente",
  "pain_point": "...",
  "budget_range": "...",
  "decision_maker": "...",
  "recommended_closing_system": "...",
  "red_flags": "...",
  "urgency_level": "alta/media/baja"
}
```

5. Configurar Analysis Plan:
   - Structured Data: qualified, score, profile_type, pain_point, budget_range, decision_maker, recommended_closing_system, red_flags, urgency_level
   - Summary: Generate summary of the call
   - Success Evaluation: Did the lead qualify?

6. Guardar y copiar el `assistant_id`

---

### Paso 3: Configurar Teléfono

1. En Vapi: "Phone Numbers" → "Buy Number"
2. Seleccionar país (México +52, Colombia +57, etc.)
3. Asignar número al assistant creado
4. Copiar el `phone_number_id`

---

### Paso 4: Conectar GHL (3 min)

1. En Vapify dashboard del cliente:
   - Ir a "Integrations"
   - Seleccionar "GoHighLevel"
   - Click "Connect"
   - Autorizar con credenciales del cliente

2. Configurar Workflow en GHL del cliente:
   - **Trigger:** "Appointment Booked"
   - **Action:** "Webhook"
   - **URL:** `https://api.vapi.ai/call`
   - **Headers:** `Authorization: Bearer [VAPI_API_KEY]`
   - **Payload:**
```json
{
  "assistantId": "[ASSISTANT_ID]",
  "customer": {
    "number": "{{contact.phone}}",
    "name": "{{contact.first_name}}"
  },
  "metadata": {
    "ghl_contact_id": "{{contact.id}}",
    "ghl_appointment_id": "{{appointment.id}}",
    "client_name": "{{contact.full_name}}"
  }
}
```

---

### Paso 5: Configurar Webhook de Retorno + Brief (5 min)

Para que Vapi actualice GHL y envíe el Brief Pre-Llamada:

1. En Make.com (o Zapier), crear nuevo scenario:
   - **Trigger:** Webhook → "Custom webhook"
   - Copiar la URL del webhook

2. En Vapi: "Webhooks" → "Add Endpoint"
   - **URL:** URL de Make.com
   - **Events:** `call.ended`
   - Guardar

3. En Make.com, continuar el scenario:
   - Parsear el JSON de Vapi (transcript, analysis, structuredData)
   - **Action 1:** GoHighLevel → Update Contact
     - Contact ID: del metadata
     - Custom Fields: mapear score, profile_type, qualified, etc.
     - Tags: "AI-Calificado" o "AI-No-Califica"
   
   - **Action 2:** (Si aplica) Slack/Email/Telegram → Send Message
     - Enviar Brief Pre-Llamada al closer
     - Incluir: Perfil, sistema recomendado, red flags

4. Testear con llamada de prueba

---

### Paso 6: Template del Brief Pre-Llamada (Make.com)

```
📋 BRIEF PRE-LLAMADA — The Closing Code AI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lead: {{contact.name}}
Perfil detectado: {{profile_type}}
Score: {{score}}/10

💬 Pain Point: {{pain_point}}
💰 Budget: {{budget_range}}
👤 Decision Maker: {{decision_maker}}

🎯 SISTEMA DE CIERRE RECOMENDADO: {{recommended_closing_system}}

⚠️ RED FLAGS:
{{red_flags}}

⏰ URGENCIA: {{urgency_level}}

📝 NOTAS DE LA IA:
{{summary}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Paso 7: Prueba End-to-End (5 min)

1. Agendar cita de prueba en GHL (con tu número de teléfono)
2. Esperar 60 segundos
3. Contestar la llamada de María
4. Responder preguntas de cualificación
5. Verificar:
   - GHL: Contacto tiene tags actualizados
   - Campos personalizados llenos
   - Brief recibido por el canal configurado
   - Cita cancelada si no calificaste

**Total: 15-20 minutos por cliente**

---

## 📊 Dashboard del Cliente

En Vapify, el cliente ve:
- Llamadas realizadas
- Duración promedio
- Costo por llamada
- Transcripciones
- Grabaciones

**Tu markup:** Configurado en Vapify (ej: Vapi cobra $0.15/min, tú cobras $0.25/min)

---

## 💰 Cobro al Cliente

### Opción A: Tú cobras todo (Recomendado para The Closing Code AI)
- Tú facturas: $2,000 setup + $500/mes retainer (Fase 1)
- Tú pagas: $29-149/mes Vapify + consumo Vapi
- Tu margen: ~85%

### Opción B: Rebilling automático (Vapify Scale+)
- Cliente paga directamente en Vapify dashboard
- Tú configuras markup por minuto
- Cliente ve costo real + tu margen
- Menos overhead administrativo

---

## 🔧 Troubleshooting

### La llamada no llega:
1. Verificar que el número de teléfono está bien formateado (+52, +57, etc.)
2. Verificar que el assistant tiene número asignado
3. Verificar que el webhook GHL está activo
4. Revisar logs en Vapi

### La transcripción no aparece en GHL:
1. Verificar que el webhook de retorno está configurado
2. Verificar que los custom fields existen en GHL
3. Verificar el mapping de campos en Make.com
4. Revisar execution log en Make.com

### El Brief no llega al closer:
1. Verificar la conexión de Make.com (Slack/Email/Telegram)
2. Verificar que las variables están mapeadas correctamente
3. Testear el scenario manualmente en Make.com

### El cliente quiere cambiar el script:
1. Ir a Vapi dashboard
2. Editar el assistant
3. Modificar el system prompt
4. Guardar (cambio inmediato)
5. Documentar el cambio para el cliente

---

## 📈 Escalando

### Cuando tengas 5+ clientes:
- Considerar upgrade a Vapify Scale ($149/mes) para GHL custom app
- Crear templates de assistant por industria:
  - "María — Coaches"
  - "María — Agencias Marketing"
  - "María — Consultores B2B"
- Automatizar onboarding con videos Loom
- Contratar VA para soporte tier-1

### Cuando tengas 10+ clientes:
- Implementar Fase 2 (AI Closer Coach) como upsell estándar
- Desarrollar dashboard propio (si Vapify no cubre necesidades)
- Crear comunidad de clientes (Slack/Discord)

---

## 🎓 Notas sobre el Closing Cuántico

Este setup implementa la **Fase 1** de The Closing Code AI:
- Detecta 4 perfiles cuánticos
- Aplica manejo de objeciones profesional
- Genera Brief Pre-Llamada con sistema de cierre recomendado

La **Fase 2** (AI Closer Coach) requiere:
- Integración con Whisper AI para transcripción
- Sistema de análisis post-llamada
- Reporte semanal automatizado

La **Fase 3** (AI Roleplay Simulator) requiere:
- Número de práctica separado
- 4 "personas" de IA (una por perfil)
- Sistema de feedback inmediato

---

*Setup Vapify — The Closing Code AI*
*Mauricio Gallmur — Febrero 2026*
