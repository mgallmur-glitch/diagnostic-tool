# Configuración del Webhook OpenClaw / María

Documentación técnica para la integración del Revenue Gap Diagnostic con el agente María via OpenClaw.

---

## URL del Webhook

```
POST http://72.61.7.167:18789/hooks/agent
```

---

## Headers Requeridos

```json
{
  "Authorization": "Bearer ClC-2026-d14gn0st1c-m4r14-pr0d",
  "Content-Type": "application/json"
}
```

---

## Formato del Payload

El payload debe incluir los siguientes campos:

```json
{
  "message": "string - Instrucciones y datos para María",
  "agentId": "maria",
  "deliver": true,
  "channel": "whatsapp",
  "to": "string - número en formato E.164 (+51987654321)",
  "wakeMode": "now",
  "timeoutSeconds": 60
}
```

---

## Estructura del Mensaje

El campo `message` debe contener todos los datos del diagnóstico para que María pueda personalizar la respuesta:

### Template del mensaje:

```
Lead nuevo en el diagnóstico:
- Nombre: {nombre}
- Leads al mes: {leads}
- Ticket promedio: {ticket}
- Closing rate actual: {closingRate}%
- Closers en equipo: {closers}
- Revenue actual: {revenueActual}
- Revenue con sistema (35%): {revenueConSistema}
- Revenue Gap: {gap}/mes
- WhatsApp: {to}

Salúdalo por su nombre, confirma su Revenue Gap exacto, y según su tamaño de equipo ({closers}) envíale el insight personalizado con el CTA a Calendly.
```

---

## Ejemplo Completo

### Request:

```bash
curl -X POST http://72.61.7.167:18789/hooks/agent \
  -H "Authorization: Bearer ClC-2026-d14gn0st1c-m4r14-pr0d" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Lead nuevo en el diagnóstico:\n- Nombre: Carlos\n- Leads al mes: 42\n- Ticket promedio: 6000\n- Closing rate actual: 18%\n- Closers en equipo: Solo yo\n- Revenue actual: $45,360\n- Revenue con sistema (35%): $88,200\n- Revenue Gap: $42,840/mes\n- WhatsApp: +51987654321\n\nSalúdalo por su nombre, confirma su Revenue Gap exacto, y según su tamaño de equipo (Solo yo) envíale el insight personalizado con el CTA a Calendly.",
    "agentId": "maria",
    "deliver": true,
    "channel": "whatsapp",
    "to": "+51987654321",
    "wakeMode": "now",
    "timeoutSeconds": 60
  }'
```

### Campos dinámicos:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `nombre` | Nombre del lead | "Carlos" |
| `leads` | Número de leads al mes | 42 |
| `ticket` | Ticket promedio en USD | 6000 |
| `closingRate` | Closing rate actual en % | 18 |
| `closers` | Tamaño del equipo | "Solo yo", "1 closer", "2-3", "4+" |
| `revenueActual` | Revenue actual formateado | "$45,360" |
| `revenueConSistema` | Revenue potencial al 35% | "$88,200" |
| `gap` | Revenue gap formateado | "$42,840" |
| `to` | Número WhatsApp E.164 | "+51987654321" |

---

## Formato del Número (E.164)

El número debe estar en formato E.164 internacional:

```
+[código de país][número local]
```

### Ejemplos:

| País | Número local | Formato E.164 |
|------|--------------|---------------|
| Perú | 987654321 | +51987654321 |
| México | 55 1234 5678 | +525512345678 |
| Argentina | 11 1234 5678 | +541112345678 |
| Colombia | 310 1234567 | +573101234567 |
| Chile | 9 1234 5678 | +56912345678 |

---

## Variaciones del Mensaje según Tamaño de Equipo

María debe adaptar el mensaje según el campo `closers`:

| Valor de `closers` | Enfoque del mensaje |
|--------------------|---------------------|
| "Solo yo" | "Veo que tú mismo cierras — esto te da el brief antes de cada llamada tuya." |
| "1 closer" | "Con un solo closer, cada llamada perdida duele directo en el P&L." |
| "2-3" | "Con tu equipo de closers, este sistema es un multiplicador inmediato." |
| "4+" | "Con ese equipo, el sistema estandariza la inteligencia en cada llamada." |

---

## Troubleshooting

### Error: No llega el mensaje

1. Verificar que el número esté en formato E.164
2. Confirmar que el token de autorización sea correcto
3. Revisar que el payload incluya todos los campos requeridos
4. Verificar logs de OpenClaw en `http://72.61.7.167:18789/`

### Error: María no responde

1. Confirmar que `agentId` sea exactamente "maria"
2. Verificar que `deliver` sea `true`
3. Confirmar que `channel` sea "whatsapp"
4. Revisar que el mensaje no exceda los límites de caracteres

---

## Notas Importantes

- El campo `message` es la instrucción que recibe María para generar la respuesta
- No enviar datos crudos sin el campo `message` - María necesita contexto
- El número en `to` y en el mensaje debe ser el mismo
- Usar `wakeMode: "now"` para envío inmediato

---

## Archivos Relacionados

- `app/api/capture-lead/route.ts` - Implementación del webhook en el backend
- `.env.local` - Variables de entorno (OPENCLAW_WEBHOOK_URL, OPENCLAW_WEBHOOK_TOKEN)
