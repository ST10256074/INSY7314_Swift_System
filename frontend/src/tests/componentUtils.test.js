import { describe, test, expect } from '@jest/globals';
import { processPaymentResponse, filterPendingPayments, getTopPayments, validatePaymentId, formatPaymentDisplay } from '../utils/componentUtils.js';

describe('Component Utility Functions', () => {
  describe('processPaymentResponse', () => {
    test('should return application from response', () => {
      const response = { application: { id: '123', status: 'pending' } };
      const result = processPaymentResponse(response);
      expect(result.id).toBe('123');
      expect(result.status).toBe('pending');
    });

    test('should return response directly if no application field', () => {
      const response = { id: '123', status: 'pending' };
      const result = processPaymentResponse(response);
      expect(result.id).toBe('123');
    });

    test('should return null for null response', () => {
      expect(processPaymentResponse(null)).toBeNull();
    });
  });

  describe('filterPendingPayments', () => {
    test('should filter pending payments', () => {
      const applications = [
        { _id: '1', status: 'pending' },
        { _id: '2', status: 'approved' },
        { _id: '3', status: 'pending' }
      ];
      const result = filterPendingPayments(applications);
      expect(result.length).toBe(2);
      expect(result[0].status).toBe('pending');
    });

    test('should return empty array for null input', () => {
      expect(filterPendingPayments(null)).toEqual([]);
    });

    test('should return empty array for empty array', () => {
      expect(filterPendingPayments([])).toEqual([]);
    });
  });

  describe('getTopPayments', () => {
    test('should return top 5 payments', () => {
      const payments = [
        { _id: '1' }, { _id: '2' }, { _id: '3' },
        { _id: '4' }, { _id: '5' }, { _id: '6' }
      ];
      const result = getTopPayments(payments, 5);
      expect(result.length).toBe(5);
    });

    test('should return empty array for null input', () => {
      expect(getTopPayments(null)).toEqual([]);
    });
  });

  describe('validatePaymentId', () => {
    test('should validate correct payment ID', () => {
      expect(validatePaymentId('12345')).toBe(true);
      expect(validatePaymentId('abc123')).toBe(true);
    });

    test('should reject invalid payment IDs', () => {
      expect(validatePaymentId('')).toBe(false);
      expect(validatePaymentId(null)).toBe(false);
      expect(validatePaymentId(undefined)).toBe(false);
    });
  });

  describe('formatPaymentDisplay', () => {
    test('should format payment display string', () => {
      const payment = {
        currency: 'USD',
        amount: 1000,
        recipientName: 'Jan Smit'
      };
      const result = formatPaymentDisplay(payment);
      expect(result).toBe('USD 1000 from Jan Smit');
    });

    test('should handle missing fields', () => {
      const payment = { currency: 'USD' };
      const result = formatPaymentDisplay(payment);
      expect(result).toContain('USD');
      expect(result).toContain('N/A');
    });

    test('should return N/A for null payment', () => {
      expect(formatPaymentDisplay(null)).toBe('N/A');
    });
  });
});

