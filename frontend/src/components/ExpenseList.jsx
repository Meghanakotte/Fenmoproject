import React, { useState } from 'react';
import './ExpenseList.css';

function ExpenseList({ expenses, onDelete, onDeleteSuccess, apiBaseUrl }) {
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

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

  const handleDelete = async (expenseId) => {
    if (showConfirm !== expenseId) {
      setShowConfirm(expenseId);
      return;
    }

    setDeletingId(expenseId);
    try {
      const response = await fetch(`${apiBaseUrl}/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      setShowConfirm(null);
      onDelete?.(expenseId);
      onDeleteSuccess?.();
    } catch (err) {
      alert('Error deleting expense: ' + err.message);
      setShowConfirm(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="expense-list">
      <table className="expenses-table">
        <thead>
          <tr>
            <th className="amount-col">Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
            <th className="action-col">Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id} className="expense-row">
              <td className="amount-col">
                <span className="amount">₹{expense.amount.toFixed(2)}</span>
              </td>
              <td className="category-col">
                <span className="category-badge">
                  {getCategoryEmoji(expense.category)} {expense.category}
                </span>
              </td>
              <td className="date-col">{formatDate(expense.date)}</td>
              <td className="description-col">
                {expense.description || '-'}
              </td>
              <td className="action-col">
                {showConfirm === expense.id ? (
                  <div className="delete-confirm">
                    <span>Sure?</span>
                    <button
                      className="delete-btn delete-confirm-btn"
                      onClick={() => handleDelete(expense.id)}
                      disabled={deletingId === expense.id}
                    >
                      {deletingId === expense.id ? 'Deleting...' : 'Yes'}
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setShowConfirm(null)}
                      disabled={deletingId === expense.id}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(expense.id)}
                    title="Delete this expense"
                  >
                    🗑️ Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;
