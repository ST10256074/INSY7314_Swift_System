import { describe, test, expect } from '@jest/globals';
import { filterPendingPayments, getTopPayments, formatPaymentDisplay } from '../utils/componentUtils.js';

describe('EmployeeHome Component Logic', () => {
  describe('filterPendingPayments', () => {
    test('should filter pending payments correctly', () => {
      const applications = [
        { _id: '1', status: 'pending', amount: 100, currency: 'USD' },
        { _id: '2', status: 'approved', amount: 200, currency: 'EUR' },
        { _id: '3', status: 'pending', amount: 300, currency: 'GBP' },
        { _id: '4', status: 'rejected', amount: 400, currency: 'USD' }
      ];

      const pendingPayments = filterPendingPayments(applications);
      expect(pendingPayments.length).toBe(2);
      expect(pendingPayments[0].status).toBe('pending');
      expect(pendingPayments[1].status).toBe('pending');
    });

    test('should handle empty applications array', () => {
      const applications = [];
      const pendingPayments = filterPendingPayments(applications);
      expect(pendingPayments.length).toBe(0);
    });

    test('should handle applications without status field', () => {
      const applications = [
        { _id: '1', amount: 100 },
        { _id: '2', status: 'pending' }
      ];

      const pendingPayments = filterPendingPayments(applications);
      expect(pendingPayments.length).toBe(1);
    });

    test('should return empty array for null input', () => {
      expect(filterPendingPayments(null)).toEqual([]);
    });
  });

  describe('getTopPayments', () => {
    test('should return top 5 payments', () => {
      const pendingPayments = [
        { _id: '1', status: 'pending' },
        { _id: '2', status: 'pending' },
        { _id: '3', status: 'pending' },
        { _id: '4', status: 'pending' },
        { _id: '5', status: 'pending' },
        { _id: '6', status: 'pending' },
        { _id: '7', status: 'pending' }
      ];

      const top5 = getTopPayments(pendingPayments, 5);
      expect(top5.length).toBe(5);
      expect(top5[0]._id).toBe('1');
      expect(top5[4]._id).toBe('5');
    });

    test('should return empty array for null input', () => {
      expect(getTopPayments(null)).toEqual([]);
    });
  });

  describe('formatPaymentDisplay', () => {
    test('should format payment display string correctly', () => {
      const payment = {
        currency: 'USD',
        amount: 1000,
        recipientName: 'Jan Smit'
      };

      const result = formatPaymentDisplay(payment);
      expect(result).toBe('USD 1000 from Jan Smit');
    });

    test('should handle missing payment fields', () => {
      const payment = {
        currency: 'USD',
        amount: 1000
      };

      const result = formatPaymentDisplay(payment);
      expect(result).toContain('USD');
      expect(result).toContain('N/A');
    });

    test('should return N/A for null payment', () => {
      expect(formatPaymentDisplay(null)).toBe('N/A');
    });
  });
});

