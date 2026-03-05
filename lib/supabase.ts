import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ''

// Crear cliente solo si tenemos credenciales
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null as any // Fallback para build sin env vars

export interface Lead {
  id?: string
  nombre: string
  email: string
  whatsapp?: string
  closers: string
  leads_mes: number
  ticket: number
  closing_rate: number
  facturacion_mensual?: number
  revenue_perdido: number
  revenue_recuperable: number
  perfil_cq: string
  roi_multiplier: number
  status: 'nuevo' | 'whatsapp_enviado' | 'email_enviado' | 'contactado'
  created_at?: string
}

export async function saveLead(lead: Lead) {
  if (!supabase) {
    console.warn('Supabase no configurado. Lead no guardado:', lead)
    return { id: 'mock-id', ...lead }
  }
  
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single()

  if (error) {
    console.error('Error saving lead:', error)
    throw error
  }

  return data
}

export async function updateLeadStatus(id: string, status: Lead['status']) {
  if (!supabase) {
    console.warn('Supabase no configurado. Status no actualizado.')
    return
  }
  
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating lead:', error)
  }
}
