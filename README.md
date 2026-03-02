# Sales Gap Diagnostic Tool

**The Closing Code AI — Versión 1.0**

Una herramienta interactiva que ayuda a infoproductores a descubrir cuánto revenue pierde su equipo de ventas por falta de un sistema de closing estructurado.

---

## 🚀 Características

- ✅ **Diagnóstico interactivo en 90 segundos**: 3 preguntas simples
- ✅ **Cálculo inteligente del Revenue Gap**: Basado en benchmarks reales de la industria
- ✅ **Briefs dinámicos generados por IA**: Usando GLM-4 de Alibaba Cloud
- ✅ **Captura de leads automática**: SQLite + email automatizado con Resend
- ✅ **Estética Stark-Blue Glassmorphism**: Diseño premium alineado con la marca
- ✅ **SEO optimizado**: Metadata completa para redes sociales

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: API Routes de Next.js (serverless)
- **Base de datos**: SQLite (better-sqlite3)
- **Email**: Resend API
- **LLM**: GLM-4 via DashScope (Alibaba Cloud)
- **Hosting**: Vercel (recomendado)

---

## 📦 Instalación

### Requisitos previos

- Node.js 18+ 
- npm o yarn
- Cuenta en Vercel (opcional, para deploy)

### Pasos de instalación

1. **Clonar o copiar el proyecto**
```bash
cd /a0/usr/workdir/diagnostic-tool
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de ambiente**

Copia el archivo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Configura las siguientes variables:
```env
# Email service (Resend) - Obtén API key en https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# LLM API (DashScope / Alibaba Cloud) - Obtén API key en https://dashscope.console.aliyun.com/
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Nota**: Sin estas keys, el sistema funcionará con:
- Briefs de ejemplo (mocks)
- Email deshabilitado (se mostrará warning en consola)

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🚀 Despliegue en Vercel

### Preparación

1. **Subir el código a Git** (recomendado)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <tu-repo>
git push -u origin main
```

2. **Importar en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Importa tu repo de Git
   - Vercel detectará Next.js automáticamente

3. **Configurar variables de ambiente en Vercel**
   - En Settings > Environment Variables
   - Agrega: `RESEND_API_KEY` y `DASHSCOPE_API_KEY`
   - Selecciona: Production, Preview, Development

4. **Deploy**
   - Click en "Deploy"
   - Espera ~2 minutos
   - Tu app estará en `https://<tu-proyecto>.vercel.app`

---

## 📁 Estructura del Proyecto

```
diagnostic-tool/
├── app/                    # Páginas y rutas de API
│   ├── diagnostico/        # Página del diagnóstico
│   ├── api/                # API Routes
│   │   ├── calculate/      # Cálculo del revenue gap
│   │   ├── generate-brief/ # Generación de briefs con IA
│   │   └── capture-lead/   # Captura de leads + email
│   ├── layout.tsx          # Layout principal + SEO metadata
│   ├── globals.css         # Variables CSS de marca
│   └── page.tsx            # Redirección a /diagnostico
├── components/             # Componentes React (opcional)
│   └── screens/            # Screens individuales (separadas de page.tsx)
├── lib/                    # Utilidades y wrappers
│   ├── calculations.ts     # Lógica de cálculo del revenue gap
│   ├── glm4.ts            # Wrapper de GLM-4 (DashScope)
│   ├── email.ts           # Wrapper de Resend
│   └── db.ts              # Wrapper de SQLite
├── data/                   # Base de datos SQLite (generada automáticamente)
│   └── leads.db           # Leads capturados
├── public/                 # Archivos estáticos
└── ... (archivos de configuración)
```

---

## 🔧 Configuración de Opciones

### Personalizar emails (lib/email.ts)

Edita `lib/email.ts` para personalizar:
- Remitente (from address)
- Templates HTML
- Asunto de emails

### Personalizar briefs (lib/glm4.ts)

Edita `lib/glm4.ts` para personalizar:
- Prompt del sistema
- Mocks de briefs
- Perfiles del Closing Cuántico

### Personalizar estilos (app/globals.css)

Edita `app/globals.css` para personalizar:
- Colores de marca
- Tipografías
- Sombras y efectos

---

## 📊 Uso de la Base de Datos (SQLite)

### Ver todos los leads

Crea un endpoint admin simple en `app/api/admin/leads/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';

export async function GET() {
  const leads = dbOperations.getAll();
  return NextResponse.json({ leads });
}
```

### Exportar a CSV

Usa SQLite CLI directamente:
```bash
sqlite3 data/leads.db "SELECT * FROM leads" > leads.csv
```

---

## 📈 Analytics y Métricas

### Vercel Analytics (gratis)

El proyecto ya incluye `@vercel/analytics`. Solo necesitas:

1. Agregar a `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

2. Instalar:
```bash
npm install @vercel/analytics
```

### Métricas personalizadas

Agrega tracking en cada screen para medir:
- Tasa de abandono por step
- Tasa de conversión de leads
- Revenue gap promedio

---

## 🐛 Troubleshooting

### Error: "RESEND_API_KEY not configured"

El email no se enviará, pero el resto funcionará. Configura la key en `.env.local`.

### Error: "GLM-4 API error"

El sistema usará briefs de ejemplo (mocks). Verifica tu `DASHSCOPE_API_KEY`.

### Error: "SQLite database not found"

La carpeta `data/` debe existir. El sistema la creará automáticamente en el primer uso.

### Warning: "@import rules must precede all rules"

Es un warning menor de Tailwind. No afecta la funcionalidad. Arreglar moviendo el `@import` al principio de `globals.css`.

---

## 📝 Roadmap de Mejoras Futuras

- [ ] Generar PDF del diagnóstico (usando jsPDF)
- [ ] Panel admin para ver leads
- [ ] Integración con GoHighLevel (GHL)
- [ ] Calendario incrustado (Cal.com)
- [ ] A/B testing de headlines
- [ ] Soporte multi-idioma
- [ ] Animaciones 3D con Three.js
- [ ] Integración con WhatsApp Business API

---

## 🤝 Contribuciones

Este es un proyecto interno de The Closing Code AI. Para contribuir, contacta a Mauricio Gallmur.

---

## 📄 Licencia

Propiedad de The Closing Code AI © 2026. Todos los derechos reservados.

---

## 👤 Autor

**Mauricio Gallmur**
Arquitecto de Sistemas de Closing IA
[LinkedIn](https://linkedin.com/in/mauriciogallmur)

---

## 🆘 Soporte

Para soporte técnico, contacta a:
Email: mauricio@theclosingcodeai.com
