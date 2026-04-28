import React, { useState } from 'react';
import './ExpenseForm.css';

function ExpenseForm({ onExpenseCreated, apiBaseUrl }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '', // Changed from 'Food' to empty
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : parseFloat(value)) : value
    }));
    setError(null);
    
    // Real-time validation
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    
    if (name === 'amount') {
      const amount = parseFloat(value);
      if (value === '') {
        errors.amount = 'Amount is required';
      } else if (isNaN(amount)) {
        errors.amount = 'Amount must be a number';
      } else if (amount <= 0) {
        errors.amount = 'Amount must be greater than 0';
      } else if (amount > 1000000) {
        errors.amount = 'Amount seems too large';
      } else {
        delete errors.amount;
      }
    } else if (name === 'date') {
      if (!value) {
        errors.date = 'Date is required';
      } else {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate > today) {
          errors.date = 'Date cannot be in the future';
        } else {
          delete errors.date;
        }
      }
    } else if (name === 'category') {
      if (!value) {
        errors.category = 'Category is required';
      } else {
        delete errors.category;
      }
    }
    
    setFieldErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // Validate all fields
    const newErrors = {};
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: formData.amount,
          category: formData.category,
          description: formData.description,
          date: formData.date,
          idempotency_key: `${Date.now()}-${Math.random()}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create expense');
      }

      setSuccess(true);
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setFieldErrors({});

      setTimeout(() => setSuccess(false), 3000);
      onExpenseCreated();
    } catch (err) {
      setError(err.message);
      console.error('Error creating expense:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>Add New Expense</h2>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">✓ Expense added successfully!</div>}

      <div className="form-group">
        <label htmlFor="amount">Amount (₹)</label>
        <input
          type="number"
          id="amount"
          name="amount"
          min="0.01"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
          className={fieldErrors.amount ? 'input-error' : ''}
        />
        {fieldErrors.amount && <div className="field-error">{fieldErrors.amount}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className={fieldErrors.category ? 'input-error' : ''}
        >
          <option value="" disabled>Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {fieldErrors.category && <div className="field-error">{fieldErrors.category}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className={fieldErrors.date ? 'input-error' : ''}
        />
        {fieldErrors.date && <div className="field-error">{fieldErrors.date}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description (Optional)</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., Lunch at restaurant"
        />
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}

export default ExpenseForm;
