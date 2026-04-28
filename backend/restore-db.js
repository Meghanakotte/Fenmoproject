const initSqlJs = require('sql.js');
const fs = require('fs');

async function populateDB() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  
  // Create table
  db.run(`
    CREATE TABLE expenses (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      idempotency_key TEXT UNIQUE
    )
  `);
  
  // Add test expenses
  const expenses = [
    ['exp-1', 150, 'Food', 'Lunch', '2026-04-28', '2026-04-28T10:00:00Z', null],
    ['exp-2', 250, 'Food', 'Dinner', '2026-04-28', '2026-04-28T11:00:00Z', null],
    ['exp-3', 150, 'Entertainment', 'Movie', '2026-04-28', '2026-04-28T12:00:00Z', null],
    ['exp-4', 250, 'Food', 'Groceries', '2026-04-28', '2026-04-28T13:00:00Z', null],
    ['exp-5', 250.50, 'Food', 'Cafe', '2026-04-28', '2026-04-28T14:00:00Z', null],
    ['exp-6', 500, 'Transport', 'Uber', '2026-04-27', '2026-04-27T10:00:00Z', null],
    ['exp-7', 500, 'Transport', 'Taxi', '2026-04-27', '2026-04-27T11:00:00Z', null],
    ['exp-8', 150, 'Transport', 'Bus', '2026-04-27', '2026-04-27T12:00:00Z', null],
    ['exp-9', 1200, 'Shopping', 'Clothes', '2026-04-26', '2026-04-26T10:00:00Z', null],
    ['exp-10', 1200, 'Shopping', 'Books', '2026-04-26', '2026-04-26T11:00:00Z', null],
    ['exp-11', 100, 'Utilities', 'Electricity', '2026-04-25', '2026-04-25T10:00:00Z', null],
    ['exp-12', 200, 'Health', 'Medicine', '2026-04-24', '2026-04-24T10:00:00Z', null],
  ];
  
  expenses.forEach(exp => {
    db.run(
      'INSERT INTO expenses (id, amount, category, description, date, created_at, idempotency_key) VALUES (?, ?, ?, ?, ?, ?, ?)',
      exp
    );
  });
  
  // Save to file
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync('./expenses.db', buffer);
  
  console.log('✅ Database restored with 12 test expenses!');
}

populateDB();
