# 📋 Guía de Implementación - Revenue Gap Diagnostic

## ✅ Qué está implementado

### 1. Base de Datos (Supabase)
- Tabla `leads` con todos los campos del diagnóstico
- Tabla `envios` para tracking de WhatsApp/Email
- View `leads_hoy` para dashboard diario
- Row Level Security configurado

### 2. WhatsApp (Maria - TU webhook)
- Integrado con tu webhook existente: `72.61.7.167:18789`
- Mensajes personalizados según el perfil del lead (4 perfiles)
- Formato automático de números internacionales
- Fallback a email si no hay WhatsApp

### 3. Email (Resend)
- Templates HTML responsivos por perfil
- Envío transaccional gratuito (3000/mes)
- Diseño dark mode consistente con la app
- Tracking de envíos

---

## 🚀 Pasos para Activar

### PASO 1: Supabase (Base de Datos)

1. **Crear cuenta gratuita**
   - Ve a https://supabase.com
   - Sign up con GitHub (más rápido)
   - Crea nuevo proyecto (tarda ~2 min en provisionar)

2. **Obtener credenciales**
   - Ve a Project Settings → API
   - Copia `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copia `service_role secret` → `SUPABASE_SERVICE_KEY`

3. **Crear tablas**
   - Ve a SQL Editor → New query
   - Pega el contenido de `supabase/schema.sql`
   - Run → ✅ Listo

### PASO 2: Resend (Emails)

1. **Crear cuenta**
   - Ve a https://resend.com
   - Sign up
   - Ve a API Keys → Create API Key
   - Copia la key → `RESEND_API_KEY`

2. **Verificar dominio (opcional para empezar)**
   - Puedes usar `onboarding@resend.dev` para pruebas
   - Luego verifica tu dominio real en Settings → Domains

### PASO 3: Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tus credenciales
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
RESEND_API_KEY=re_xxxx
MARIA_API_KEY=ClC-2026-d14gn0st1c-m4r14-pr0d
```

### PASO 4: Deploy

**Opción A: Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```
Luego configura las Environment Variables en el dashboard de Vercel.

**Opción B: Netlify**
- Drag & drop de la carpeta `dist` (si usas `output: 'export'` en next.config)
- O conecta el repo Git

---

## 🧪 Testing

### Test 1: Flujo completo
1. Abre el diagnóstico
2. Completa con datos de prueba
3. Ingresa tu WhatsApp real
4. Verifica que llegue el mensaje de Maria

### Test 2: Email fallback
1. Repite sin poner WhatsApp
2. Verifica que llegue el email (revisa spam)

### Test 3: Base de datos
```sql
-- En Supabase SQL Editor
SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;
SELECT * FROM envios ORDER BY created_at DESC LIMIT 5;
```

---

## 📊 Dashboard de Leads

Puedes crear una página simple de admin:

```typescript
// app/admin/page.tsx
import { supabase } from '@/lib/supabase'

export default async function AdminPage() {
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <table>
      {leads?.map(lead => (
        <tr key={lead.id}>
          <td>{lead.nombre}</td>
          <td>${lead.revenue_perdido.toLocaleString()}</td>
          <td>{lead.status}</td>
        </tr>
      ))}
    </table>
  )
}
```

---

## 🐛 Troubleshooting

### "Supabase no configurado"
- Verifica que las env vars estén cargadas
- En desarrollo: reinicia `npm run dev`

### WhatsApp no llega
- Verifica que el número tenga formato internacional (+52...)
- Revisa que el webhook de Maria esté respondiendo
- Mira logs en Vercel: `vercel logs --prod`

### Email va a spam
- Verifica dominio en Resend
- Usa remitente reconocido (tudominio.com)
- Pide a leads que agreguen a contactos

---

## 💰 Costos estimados

| Servicio | Gratis | Pago |
|----------|--------|------|
| Supabase | 500MB, 2M requests | $25/mes después |
| Resend | 3000 emails/mes | $1 por 1000 extra |
| Maria (tu webhook) | Ya lo tienes | Tu infraestructura |
| Vercel | 100GB bandwidth | $20/mes pro |

**Para empezar: $0/mes**

---

## 🔐 Seguridad

- ✅ Service Key de Supabase solo en servidor (API routes)
- ✅ Webhook de Maria protegido con Bearer token
- ✅ Resend API key solo en servidor
- ✅ RLS activado en Supabase

---

## 📝 Próximos pasos opcionales

1. [ ] Crear página `/admin` para ver leads en tiempo real
2. [ ] Agregar notificaciones a tu WhatsApp cuando llegue lead
3. [ ] Exportar leads a CSV/Google Sheets
4. [ ] Webhook a HubSpot/CRM cuando se agende en Calendly

---

¿Preguntas? Revisa los logs en tu plataforma de deploy o consola del navegador.
