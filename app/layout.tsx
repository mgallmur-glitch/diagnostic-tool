import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Revenue Gap Diagnostic | The Closing Code AI',
  description: 'Descubre en 90 segundos cuánto revenue deja tu equipo sobre la mesa. Diagnóstico gratuito para infoproductores con equipos de closers.',
  keywords: ['sales gap', 'diagnostic', 'closers', 'infoproductor', 'revenue', 'AI', 'ventas', 'high ticket', 'closing'],
  openGraph: {
    title: 'Revenue Gap Diagnostic | The Closing Code AI',
    description: 'Descubre cuánto revenue pierde tu equipo cada mes. 90 segundos. 3 preguntas. Tu número real.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'The Closing Code AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revenue Gap Diagnostic | The Closing Code AI',
    description: 'Descubre cuánto revenue pierde tu equipo cada mes. 90 segundos. 3 preguntas. Tu número real.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
