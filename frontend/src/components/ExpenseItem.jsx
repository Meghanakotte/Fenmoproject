import React, { useState } from 'react';
import './ExpenseItem.css';

const categoryEmojis = {
  Food: '🍽️',
  Transport: '🚗',
  Entertainment: '🎬',
  Utilities: '💡',
  Shopping: '🛍️',
  Health: '🏥',
  Other: '📌'
};

const categoryColors = {
  Food: '#FF6B6B',
  Transport: '#4ECDC4',
  Entertainment: '#FFE66D',
  Utilities: '#95E1D3',
  Shopping: '#F38181',
  Health: '#AA96DA',
  Other: '#FCBAD3'
};

function ExpenseItem({ expense, onDelete, onDeleteSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${expense.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      setShowConfirm(false);
      onDelete?.(expense.id);
      onDeleteSuccess?.();
    } catch (err) {
      alert('Error deleting expense: ' + err.message);
      setShowConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const emoji = categoryEmojis[expense.category] || '📌';
  const color = categoryColors[expense.category] || '#666';

  return (
    <div className="expense-item" style={{ borderLeftColor: color }}>
      <div className="expense-item-header">
        <div className="expense-item-category">
          <span className="emoji" style={{ fontSize: '1.5rem' }}>{emoji}</span>
          <div className="category-info">
            <div className="category-name">{expense.category}</div>
            <div className="expense-date">{formatDate(expense.date)}</div>
          </div>
        </div>
        <div className="expense-item-amount" style={{ color }}>
          ₹{expense.amount.toFixed(2)}
        </div>
      </div>

      {expense.description && (
        <div className="expense-description">{expense.description}</div>
      )}

      <div className="expense-item-footer">
        <div className="delete-section">
          {showConfirm ? (
            <div className="confirm-delete">
              <span className="confirm-text">Delete this expense?</span>
              <button
                className="btn-delete-confirm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                className="btn-delete-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn-delete"
              onClick={handleDelete}
              title="Delete this expense"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseItem;
