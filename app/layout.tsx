import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sales Gap Diagnostic | The Closing Code AI',
  description: 'Descubre en 90 segundos cuánto revenue deja tu equipo sobre la mesa. Diagnóstico gratuito para infoproductores con equipos de closers.',
  keywords: ['sales gap', 'diagnostic', 'closers', 'infoproductor', 'revenue', 'AI', 'ventas', 'high ticket'],
  openGraph: {
    title: 'Sales Gap Diagnostic | The Closing Code AI',
    description: 'Descubre cuánto revenue pierde tu equipo cada mes. 90 segundos. 3 preguntas. Tu número real.',
    type: 'website',
    locale: 'es_MX',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
