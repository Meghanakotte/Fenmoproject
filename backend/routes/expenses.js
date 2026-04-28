const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDatabase, saveDatabase: getSaveDb } = require('../db/database');

// POST /api/expenses - Create a new expense
router.post('/expenses', (req, res) => {
  const { amount, category, description, date, idempotency_key } = req.body;

  // Validation
  if (!amount || !category || !date) {
    return res.status(400).json({ error: 'Missing required fields: amount, category, date' });
  }

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  try {
    const db = getDatabase();
    
    // Check idempotency
    if (idempotency_key) {
      const results = db.exec(
        'SELECT * FROM expenses WHERE idempotency_key = ?',
        [idempotency_key]
      );
      if (results.length > 0 && results[0].values.length > 0) {
        const row = results[0].values[0];
        return res.status(200).json({ 
          message: 'Expense already created', 
          expense: {
            id: row[0],
            amount: row[1],
            category: row[2],
            description: row[3],
            date: row[4],
            created_at: row[5]
          }
        });
      }
    }

    const id = uuidv4();
    const created_at = new Date().toISOString();

    db.run(
      'INSERT INTO expenses (id, amount, category, description, date, created_at, idempotency_key) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, amount, category, description || '', date, created_at, idempotency_key || null]
    );

    getSaveDb()();

    res.status(201).json({
      message: 'Expense created successfully',
      expense: { id, amount, category, description, date, created_at }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create expense', message: err.message });
  }
});

// GET /api/expenses - Get all expenses with optional filtering and sorting
router.get('/expenses', (req, res) => {
  const { category, sort } = req.query;
  
  try {
    const db = getDatabase();
    let query = 'SELECT id, amount, category, description, date, created_at FROM expenses';
    const params = [];

    // Filter by category
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    // Sort by date (newest first by default)
    if (sort === 'date_desc' || !sort) {
      query += ' ORDER BY date DESC';
    } else if (sort === 'date_asc') {
      query += ' ORDER BY date ASC';
    }

    const results = db.exec(query, params);
    let expenses = [];

    if (results.length > 0) {
      expenses = results[0].values.map(row => ({
        id: row[0],
        amount: row[1],
        category: row[2],
        description: row[3],
        date: row[4],
        created_at: row[5]
      }));
    }

    res.json({ expenses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses', message: err.message });
  }
});

module.exports = router;
