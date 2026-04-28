import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch expenses
  const fetchExpenses = async (categoryFilter = 'All') => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/expenses?sort=date_desc`;
      if (categoryFilter !== 'All') {
        url += `&category=${encodeURIComponent(categoryFilter)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      
      const data = await response.json();
      setExpenses(data.expenses || []);

      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.expenses?.map(e => e.category) || [])];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle new expense created
  const handleExpenseCreated = () => {
    fetchExpenses(selectedCategory);
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchExpenses(category);
  };

  // Calculate total
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="app">
      <header className="header">
        <h1>💰 Fenmo - Expense Tracker</h1>
        <p>Track your personal expenses and understand where your money goes</p>
      </header>

      <main className="container">
        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => fetchExpenses(selectedCategory)}>Retry</button>
          </div>
        )}

        <div className="layout">
          <div className="form-section">
            <ExpenseForm 
              onExpenseCreated={handleExpenseCreated}
              apiBaseUrl={API_BASE_URL}
            />
          </div>

          <div className="list-section">
            <div className="list-header">
              <h2>Expenses</h2>
              <div className="controls">
                <select 
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="category-filter"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading expenses...</div>
            ) : expenses.length === 0 ? (
              <div className="empty-state">
                <p>No expenses yet. Add one to get started!</p>
              </div>
            ) : (
              <>
                <ExpenseList expenses={expenses} />
                <div className="total-section">
                  <div className="total">
                    <span>Total: </span>
                    <span className="amount">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
