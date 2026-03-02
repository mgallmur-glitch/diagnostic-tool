import { Resend } from 'resend';

// Initialize Resend only if API key is available
let resend: Resend | null = null;

if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.length > 10) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export interface EmailData {
  to: string;
  nombre: string;
  revenuePerdido: number;
  pdfUrl?: string;
}

export async function sendDiagnosticEmail({ to, nombre, revenuePerdido, pdfUrl }: EmailData) {
  try {
    if (!resend) {
      console.warn('RESEND_API_KEY not configured, skipping email send');
      return { success: false, message: 'Email not configured' };
    }
    
    const formattedRevenue = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(revenuePerdido);
    
    const { data, error } = await resend.emails.send({
      from: 'Mauricio Gallmur <mauricio@theclosingcodeai.com>',
      to: [to],
      subject: `Tu Revenue Gap Diagnostic: ${formattedRevenue}/mes`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0066FF;">Hola ${nombre},</h1>
          
          <p style="color: #B0C4D8; font-size: 16px;">
            Aquí está tu diagnóstico completo del Sales Gap.
          </p>
          
          <div style="background: rgba(0, 102, 255, 0.10); border: 2px solid rgba(0, 212, 255, 0.25); border-radius: 20px; padding: 30px; margin: 30px 0;">
            <h2 style="color: #FF3860; margin: 0 0 20px 0;">🔴 REVENUE GAP DETECTADO</h2>
            <p style="color: #FFFFFF; font-size: 24px; font-weight: bold; margin: 0;">
              ${formattedRevenue}/mes
            </p>
          </div>
          
          <p style="color: #B0C4D8; font-size: 14px;">
            Tu equipo tiene el potencial de cerrar este revenue adicional cada mes con el sistema correcto.
          </p>
          
          ${pdfUrl ? `
          <div style="margin: 30px 0; text-align: center;">
            <a href="${pdfUrl}" style="background: linear-gradient(135deg, #0066FF 0%, #0040CC 100%); color: white; padding: 15px 30px; border-radius: 100px; text-decoration: none; font-weight: bold; display: inline-block;">
              Descargar PDF del Diagnóstico
            </a>
          </div>
          ` : ''}
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #2A3A4A;">
            <p style="color: #6B8299; font-size: 14px; margin: 0 0 10px 0;">
              ¿Quieres arreglar esto en tu negocio?
            </p>
            <a href="https://theclosingcodeai.com/agenda" style="color: #00D4FF; text-decoration: none; font-weight: bold;">
              Agenda una llamada gratuita de 30 minutos →
            </a>
          </div>
          
          <p style="color: #6B8299; font-size: 12px; margin-top: 40px;">
            Mauricio Gallmur | The Closing Code AI<br />
            Arquitecto de Sistemas de Closing IA
          </p>
        </div>
      `,
    });
    
    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Exception sending email:', error);
    return { success: false, error };
  }
}
