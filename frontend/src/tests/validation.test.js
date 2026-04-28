// Frontend Form Validation Tests
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseForm from '../components/ExpenseForm';

describe('ExpenseForm - Field Level Validation', () => {
  const mockOnExpenseCreated = jest.fn();
  const mockApiBaseUrl = 'http://localhost:5000/api';

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test 1: Renders form correctly
  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      render(
        <ExpenseForm
          onExpenseCreated={mockOnExpenseCreated}
          apiBaseUrl={mockApiBaseUrl}
        />
      );

      expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Add Expense/i })).toBeInTheDocument();
    });
  });

  // Test 2: Negative amount validation
  describe('Negative Amount Validation', () => {
    it('should show error for negative amount', async () => {
      render(
        <ExpenseForm
          onExpenseCreated={mockOnExpenseCreated}
          apiBaseUrl={mockApiBaseUrl}
        />
      );

      const amountInput = screen.getByLabelText(/Amount/i);
      await userEvent.type(amountInput, '-50');

      await waitFor(() => {
        expect(screen.getByText(/Amount must be greater than 0/i)).toBeInTheDocument();
      });
    });
  });

  // Test 3: Zero amount validation
  describe('Zero Amount Validation', () => {
    it('should show error for zero amount', async () => {
      render(
        <ExpenseForm
          onExpenseCreated={mockOnExpenseCreated}
          apiBaseUrl={mockApiBaseUrl}
        />
      );

      const amountInput = screen.getByLabelText(/Amount/i);
      await userEvent.type(amountInput, '0');

      await waitFor(() => {
        expect(screen.getByText(/Amount must be greater than 0/i)).toBeInTheDocument();
      });
    });
  });

  // Test 4: Valid amount clears error
  describe('Valid Amount Clears Error', () => {
    it('should clear error when valid amount is entered', async () => {
      render(
        <ExpenseForm
          onExpenseCreated={mockOnExpenseCreated}
          apiBaseUrl={mockApiBaseUrl}
        />
      );

      const amountInput = screen.getByLabelText(/Amount/i);
      
      // First type invalid amount
      await userEvent.type(amountInput, '-50');
      await waitFor(() => {
        expect(screen.getByText(/Amount must be greater than 0/i)).toBeInTheDocument();
      });

      // Clear and type valid amount
      await userEvent.clear(amountInput);
      await userEvent.type(amountInput, '100');

      await waitFor(() => {
        expect(screen.queryByText(/Amount must be greater than 0/i)).not.toBeInTheDocument();
      });
    });
  });

  // Test 5: Missing amount prevents submission
  describe('Missing Amount Prevents Submission', () => {
    it('should prevent submission without amount', async () => {
      render(
        <ExpenseForm
          onExpenseCreated={mockOnExpenseCreated}
          apiBaseUrl={mockApiBaseUrl}
        />
      );

      const submitButton = screen.getByRole('button', { name: /Add Expense/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Amount must be greater than 0/i)).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // Test 6: Successful submission
  describe('Successful Expense Creation', () => {
    it('should submit valid expense and clear form', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, success: true })
      });

      render(
        <ExpenseForm
          onExpenseCreated={mockOnExpenseCreated}
          apiBaseUrl={mockApiBaseUrl}
        />
      );

      const amountInput = screen.getByLabelText(/Amount/i);
      const categorySelect = screen.getByLabelText(/Category/i);
      const dateInput = screen.getByLabelText(/Date/i);
      const submitButton = screen.getByRole('button', { name: /Add Expense/i });

      await userEvent.type(amountInput, '100');
      await userEvent.selectOptions(categorySelect, 'Food');
      await userEvent.type(dateInput, '2026-04-28');

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/expenses'),
          expect.objectContaining({
            method: 'POST'
          })
        );
      });

      expect(mockOnExpenseCreated).toHaveBeenCalled();
    });
  });

  // Test 7: Error message display
  describe('Error Message Display', () => {
    it('should display network error on fetch failure', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <ExpenseForm
          onExpenseCreated={mockOnExpenseCreated}
          apiBaseUrl={mockApiBaseUrl}
        />
      );

      const amountInput = screen.getByLabelText(/Amount/i);
      const categorySelect = screen.getByLabelText(/Category/i);
      const dateInput = screen.getByLabelText(/Date/i);
      const submitButton = screen.getByRole('button', { name: /Add Expense/i });

      await userEvent.type(amountInput, '100');
      await userEvent.selectOptions(categorySelect, 'Food');
      await userEvent.type(dateInput, '2026-04-28');

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Error/i)).toBeInTheDocument();
      });
    });
  });

  // Test 8: Large valid amount
  describe('Large Amount Support', () => {
    it('should accept large amounts', async () => {
      render(
        <ExpenseForm
          onExpenseCreated={mockOnExpenseCreated}
          apiBaseUrl={mockApiBaseUrl}
        />
      );

      const amountInput = screen.getByLabelText(/Amount/i);
      await userEvent.type(amountInput, '999999');

      await waitFor(() => {
        expect(screen.queryByText(/Amount must be greater than 0/i)).not.toBeInTheDocument();
      });
    });
  });

  // Test 9: Decimal amounts
  describe('Decimal Amount Support', () => {
    it('should accept decimal amounts', async () => {
      render(
        <ExpenseForm
          onExpenseCreated={mockOnExpenseCreated}
          apiBaseUrl={mockApiBaseUrl}
        />
      );

      const amountInput = screen.getByLabelText(/Amount/i);
      await userEvent.type(amountInput, '99.99');

      await waitFor(() => {
        expect(screen.queryByText(/Amount must be greater than 0/i)).not.toBeInTheDocument();
      });
    });
  });

  // Test 10: Form fields have correct input types
  describe('Input Type Validation', () => {
    it('should have correct input types for all fields', () => {
      render(
        <ExpenseForm
          onExpenseCreated={mockOnExpenseCreated}
          apiBaseUrl={mockApiBaseUrl}
        />
      );

      const amountInput = screen.getByLabelText(/Amount/i);
      const dateInput = screen.getByLabelText(/Date/i);

      expect(amountInput).toHaveAttribute('type', 'number');
      expect(dateInput).toHaveAttribute('type', 'date');
    });
  });
});
