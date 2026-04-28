import React from 'react';
import './ExpenseSummary.css';

function ExpenseSummary({ expenses }) {
  // Calculate totals by category
  const summary = {};
  
  expenses.forEach(expense => {
    if (!summary[expense.category]) {
      summary[expense.category] = 0;
    }
    summary[expense.category] += expense.amount;
  });

  // Get Category Emojis
  const categoryEmojis = {
    Food: '🍽️',
    Transport: '🚗',
    Entertainment: '🎬',
    Utilities: '💡',
    Shopping: '🛍️',
    Health: '🏥',
    Other: '📌'
  };

  if (Object.keys(summary).length === 0) {
    return null; // Don't show summary if no expenses
  }

  return (
    <div className="expense-summary">
      <h3>💰 Spending Summary by Category</h3>
      <div className="summary-grid">
        {Object.entries(summary)
          .sort((a, b) => b[1] - a[1]) // Sort by amount descending
          .map(([category, total]) => (
            <div key={category} className="summary-card">
              <div className="summary-emoji">
                {categoryEmojis[category] || '📌'}
              </div>
              <div className="summary-content">
                <div className="summary-category">{category}</div>
                <div className="summary-amount">₹{total.toFixed(2)}</div>
              </div>
              <div className="summary-percentage">
                {(
                  (total / Object.values(summary).reduce((a, b) => a + b, 0)) *
                  100
                ).toFixed(0)}%
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ExpenseSummary;
