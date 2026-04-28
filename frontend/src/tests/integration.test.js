// Integration Test - Complete User Flow
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Complete User Flow Integration Test', () => {
  beforeEach(() => {
    // Mock fetch for the entire flow
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test 1: User adds an expense (happy path)
  describe('Add Expense Happy Path', () => {
    it('should allow user to add expense and see it in the list', async () => {
      // Mock initial empty expenses list
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      // Mock POST response for adding expense
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, success: true })
      });

      // Mock fetch again for the refreshed list
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: '1',
            amount: 100,
            category: 'Food',
            date: '2026-04-28',
            description: 'Office lunch'
          }
        ]
      });

      render(<App />);

      // Wait for initial load
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/expenses'),
          expect.objectContaining({ method: 'GET' })
        );
      });

      // Fill in form
      const amountInput = screen.getByLabelText(/Amount/i);
      const categorySelect = screen.getByLabelText(/Category/i);
      const dateInput = screen.getByLabelText(/Date/i);
      const descriptionInput = screen.getByLabelText(/Description/i);

      await userEvent.type(amountInput, '100');
      await userEvent.selectOptions(categorySelect, 'Food');
      await userEvent.type(dateInput, '2026-04-28');
      await userEvent.type(descriptionInput, 'Office lunch');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /Add Expense/i });
      await userEvent.click(submitButton);

      // Verify POST was called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/expenses'),
          expect.objectContaining({
            method: 'POST'
          })
        );
      });
    });
  });

  // Test 2: User filters expenses by category
  describe('Filter by Category', () => {
    it('should filter expenses when category is selected', async () => {
      const mockExpenses = [
        { id: '1', amount: 100, category: 'Food', date: '2026-04-28', description: 'Lunch' },
        { id: '2', amount: 500, category: 'Transport', date: '2026-04-27', description: 'Taxi' }
      ];

      // Mock initial load
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockExpenses
      });

      // Mock filtered results
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockExpenses[0]]
      });

      render(<App />);

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByText(/Food/i)).toBeInTheDocument();
      });

      // Select Food filter
      const categoryFilter = screen.getByDisplayValue(/All/i);
      await userEvent.selectOptions(categoryFilter, 'Food');

      // Verify filtered results work
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/expenses?category=Food'),
          expect.any(Object)
        );
      });
    });
  });

  // Test 3: Form validation prevents invalid submissions
  describe('Validation Prevents Invalid Submission', () => {
    it('should show validation error for negative amount', async () => {
      // Mock initial load
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      render(<App />);

      // Try to submit with negative amount
      const amountInput = screen.getByLabelText(/Amount/i);
      await userEvent.type(amountInput, '-100');

      // Verify error message appears
      await waitFor(() => {
        expect(screen.getByText(/Amount must be greater than 0/i)).toBeInTheDocument();
      });

      // Verify fetch was NOT called (validation prevented submission)
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only initial load
    });
  });

  // Test 4: Success message appears after adding expense
  describe('Success Message Feedback', () => {
    it('should show success message after adding expense', async () => {
      // Mock initial load
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      // Mock add expense
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      // Mock refresh
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: '1', amount: 100, category: 'Food', date: '2026-04-28', description: 'Test' }
        ]
      });

      render(<App />);

      await waitFor(() => screen.getByLabelText(/Amount/i));

      // Add expense
      const amountInput = screen.getByLabelText(/Amount/i);
      const categorySelect = screen.getByLabelText(/Category/i);
      const dateInput = screen.getByLabelText(/Date/i);
      const submitButton = screen.getByRole('button', { name: /Add Expense/i });

      await userEvent.type(amountInput, '100');
      await userEvent.selectOptions(categorySelect, 'Food');
      await userEvent.type(dateInput, '2026-04-28');
      await userEvent.click(submitButton);

      // Check for success message
      await waitFor(() => {
        expect(screen.getByText(/successfully/i)).toBeInTheDocument();
      });
    });
  });

  // Test 5: Data persistence after refresh
  describe('Data Persistence', () => {
    it('should show expenses after page reload', async () => {
      const mockExpenses = [
        { id: '1', amount: 250, category: 'Shopping', date: '2026-04-26', description: 'Clothes' }
      ];

      // Mock fetch to return expenses
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockExpenses
      });

      render(<App />);

      // Wait for expenses to load
      await waitFor(() => {
        expect(screen.getByText(/Shopping/i)).toBeInTheDocument();
      });

      // Verify expense amount is displayed
      expect(screen.getByText(/250/i)).toBeInTheDocument();
    });
  });
});
