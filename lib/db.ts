import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Initialize database
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'leads.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT,
    llamadas INTEGER,
    ticket INTEGER,
    closingRate REAL,
    revenuePerdido INTEGER,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Lead {
  id?: number;
  nombre: string;
  email: string;
  whatsapp?: string;
  llamadas?: number;
  ticket?: number;
  closingRate?: number;
  revenuePerdido?: number;
  fecha?: string;
}

export const dbOperations = {
  create: (lead: Omit<Lead, 'id' | 'fecha'>) => {
    const stmt = db.prepare(`
      INSERT INTO leads (nombre, email, whatsapp, llamadas, ticket, closingRate, revenuePerdido)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      lead.nombre,
      lead.email,
      lead.whatsapp || null,
      lead.llamadas || null,
      lead.ticket || null,
      lead.closingRate || null,
      lead.revenuePerdido || null
    );
    return { ...lead, id: result.lastInsertRowid };
  },
  
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM leads ORDER BY fecha DESC');
    return stmt.all() as Lead[];
  },
  
  getById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM leads WHERE id = ?');
    return stmt.get(id) as Lead | undefined;
  },
};

export default db;
