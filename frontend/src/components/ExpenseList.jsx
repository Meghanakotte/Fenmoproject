import React from 'react';
import './ExpenseList.css';

function ExpenseList({ expenses }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-IN', options);
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Food': '🍽️',
      'Transport': '🚗',
      'Entertainment': '🎬',
      'Utilities': '💡',
      'Shopping': '🛍️',
      'Health': '🏥',
      'Other': '📌',
    };
    return emojiMap[category] || '💰';
  };

  return (
    <div className="expense-list">
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th className="amount-col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id} className="expense-row">
              <td className="date-col">{formatDate(expense.date)}</td>
              <td className="category-col">
                <span className="category-badge">
                  {getCategoryEmoji(expense.category)} {expense.category}
                </span>
              </td>
              <td className="description-col">
                {expense.description || '-'}
              </td>
              <td className="amount-col">
                <span className="amount">₹{expense.amount.toFixed(2)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;
