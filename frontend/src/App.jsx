import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]); // Track unfiltered expenses for summary
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
      // Always fetch all expenses (unfiltered for summary)
      const allResponse = await fetch(`${API_BASE_URL}/expenses?sort=date_desc`);
      if (!allResponse.ok) {
        throw new Error('Failed to fetch expenses');
      }
      
      const allData = await allResponse.json();
      const allExpensesData = allData.expenses || [];
      setAllExpenses(allExpensesData); // Store all for summary

      // Apply category filter for display
      let filteredExpenses = allExpensesData;
      if (categoryFilter !== 'All') {
        filteredExpenses = allExpensesData.filter(e => e.category === categoryFilter);
      }
      setExpenses(filteredExpenses);

      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(allExpensesData?.map(e => e.category) || [])];
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

            {/* Show summary only when viewing all expenses */}
            {selectedCategory === 'All' && allExpenses.length > 0 && (
              <ExpenseSummary expenses={allExpenses} />
            )}

            {loading ? (
              <div className="loading">Loading expenses...</div>
            ) : expenses.length === 0 ? (
              <div className="empty-state">
                <p>No expenses yet. Add one to get started!</p>
              </div>
            ) : (
              <>
                <ExpenseList 
                  expenses={expenses}
                  onDelete={handleExpenseCreated}
                  onDeleteSuccess={handleExpenseCreated}
                  apiBaseUrl={API_BASE_URL}
                />
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
