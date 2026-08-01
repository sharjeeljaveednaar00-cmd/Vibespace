import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const db = new Database(path.join(__dirname, 'vibespace.db'));

db.pragma('journal_mode = WAL');

// ---- Schema ----
// Kept intentionally minimal for phase 1 (auth + profile).
// Add tables here as later phases wire up posts, matches, gifts, vault, etc.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    bio TEXT DEFAULT '',
    interests TEXT DEFAULT '[]',
    vibe_coins INTEGER DEFAULT 500,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
