import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Lazy initialization - only create DB when needed
let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    const dataDir = path.join(process.cwd(), 'data');
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'leads.db');
    db = new Database(dbPath);
    
    // Initialize database
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
  }
  return db;
}

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
    const database = getDb();
    const stmt = database.prepare(`
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
    const database = getDb();
    const stmt = database.prepare('SELECT * FROM leads ORDER BY fecha DESC');
    return stmt.all() as Lead[];
  },
  
  getById: (id: number) => {
    const database = getDb();
    const stmt = database.prepare('SELECT * FROM leads WHERE id = ?');
    return stmt.get(id) as Lead | undefined;
  },
};

export default getDb();
