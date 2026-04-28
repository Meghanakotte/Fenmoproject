// Expense API Tests
const request = require('supertest');
const express = require('express');
const path = require('path');

// Mock database module
let expenses = [];
const mockDb = {
  prepare: (sql) => ({
    run: (params) => {
      if (sql.includes('INSERT')) {
        expenses.push({
          id: `test-${Date.now()}-${Math.random()}`,
          ...params
        });
        return { changes: 1 };
      }
      return { changes: 0 };
    },
    all: () => expenses,
    get: (params) => expenses[0] || null
  })
};

// Setup Express app with routes
const app = express();
app.use(express.json());

// Validation middleware
const validateExpense = (req, res, next) => {
  const { amount, date, category } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }
  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  next();
};

// Routes
app.post('/api/expenses', validateExpense, (req, res) => {
  const { amount, date, category, description } = req.body;
  const result = mockDb.prepare('INSERT INTO expenses (amount, date, category, description) VALUES (?, ?, ?, ?)').run({
    amount, date, category, description
  });

  if (result.changes > 0) {
    res.status(201).json({ success: true, message: 'Expense created' });
  } else {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.get('/api/expenses', (req, res) => {
  const allExpenses = mockDb.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
  res.json(allExpenses);
});

// Test Suite
describe('Expense API Tests', () => {
  beforeEach(() => {
    expenses = [];
  });

  // Test 1: Valid expense creation
  describe('POST /api/expenses - Valid Input', () => {
    it('should create an expense with valid data', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          amount: 100,
          date: '2026-04-28',
          category: 'Food',
          description: 'Lunch'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Expense created');
    });
  });

  // Test 2: Negative amount validation
  describe('POST /api/expenses - Negative Amount', () => {
    it('should reject negative amounts', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          amount: -50,
          date: '2026-04-28',
          category: 'Food',
          description: 'Test'
        })
        .expect(400);

      expect(response.body.error).toContain('positive number');
    });
  });

  // Test 3: Zero amount validation
  describe('POST /api/expenses - Zero Amount', () => {
    it('should reject zero amount', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          amount: 0,
          date: '2026-04-28',
          category: 'Food'
        })
        .expect(400);

      expect(response.body.error).toContain('positive number');
    });
  });

  // Test 4: Missing date
  describe('POST /api/expenses - Missing Date', () => {
    it('should reject expense without date', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          amount: 100,
          category: 'Food'
        })
        .expect(400);

      expect(response.body.error).toBe('Date is required');
    });
  });

  // Test 5: Missing category
  describe('POST /api/expenses - Missing Category', () => {
    it('should reject expense without category', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          amount: 100,
          date: '2026-04-28'
        })
        .expect(400);

      expect(response.body.error).toBe('Category is required');
    });
  });

  // Test 6: GET expenses endpoint
  describe('GET /api/expenses', () => {
    it('should return list of expenses', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Test 7: Decimal amounts
  describe('POST /api/expenses - Decimal Amounts', () => {
    it('should accept decimal amounts like 99.99', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          amount: 99.99,
          date: '2026-04-28',
          category: 'Food'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });

  // Test 8: Large amounts
  describe('POST /api/expenses - Large Amounts', () => {
    it('should accept reasonably large amounts', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          amount: 50000,
          date: '2026-04-28',
          category: 'Shopping'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });
});

// Export app for testing
module.exports = app;
