const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../expenses.db');

let db = null;
let SQL = null;

async function initializeDatabase() {
  try {
    SQL = await initSqlJs();
    
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }

    // Create table if not exists
    db.run(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        idempotency_key TEXT UNIQUE
      )
    `);

    saveDatabase();
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

function getDatabase() {
  return db;
}

function getSaveDatabase() {
  return saveDatabase;
}

module.exports = {
  initializeDatabase,
  getDatabase,
  saveDatabase: getSaveDatabase,
  SQL
};
