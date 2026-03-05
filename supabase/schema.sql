-- ============================================
-- SCHEMA PARA DIAGNOSTIC TOOL
-- Ejecutar en SQL Editor de Supabase
-- ============================================

-- Eliminar políticas existentes si las hay (para evitar errores)
DROP POLICY IF EXISTS "Allow insert from app" ON leads;
DROP POLICY IF EXISTS "Allow select for admin" ON leads;

-- Tabla principal de leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  closers TEXT NOT NULL,
  
  -- Datos del diagnóstico
  leads_mes INTEGER NOT NULL,
  ticket INTEGER NOT NULL,
  closing_rate DECIMAL(5,2) NOT NULL,
  facturacion_mensual INTEGER,
  
  -- Resultados
  revenue_perdido INTEGER NOT NULL,
  revenue_recuperable INTEGER NOT NULL,
  perfil_cq TEXT NOT NULL CHECK (perfil_cq IN ('emocional', 'racional', 'critico', 'decisor')),
  roi_multiplier INTEGER NOT NULL,
  
  -- Tracking
  status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'whatsapp_enviado', 'email_enviado', 'contactado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

-- Políticas RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: Solo insertar (para la app)
CREATE POLICY "Allow insert from app" ON leads
  FOR INSERT WITH CHECK (true);

-- Política: Solo lectura para admin (tú)
CREATE POLICY "Allow select for admin" ON leads
  FOR SELECT USING (true);

-- ============================================
-- TABLA DE ENVÍOS (para tracking)
-- ============================================

DROP POLICY IF EXISTS "Allow insert envios" ON envios;

CREATE TABLE IF NOT EXISTS envios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  canal TEXT NOT NULL CHECK (canal IN ('whatsapp', 'email')),
  status TEXT NOT NULL CHECK (status IN ('pendiente', 'enviado', 'error')),
  error_msg TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_envios_lead ON envios(lead_id);

-- Política para envios
ALTER TABLE envios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert envios" ON envios
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select envios" ON envios
  FOR SELECT USING (true);

-- ============================================
-- VIEW: Leads del día (para dashboard)
-- ============================================

DROP VIEW IF EXISTS leads_hoy;

CREATE VIEW leads_hoy AS
SELECT 
  id,
  nombre,
  email,
  whatsapp,
  revenue_perdido,
  perfil_cq,
  status,
  created_at
FROM leads
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
