import { describe, test, expect } from '@jest/globals';
import { getStatusColor, getStatusIcon, formatDate, formatAmount } from '../utils/paymentUtils.js';

describe('InspectPayment Utility Functions', () => {
  describe('getStatusColor', () => {
    test('should return correct color for approved status', () => {
      expect(getStatusColor('approved')).toBe('status-approved');
      expect(getStatusColor('APPROVED')).toBe('status-approved');
    });

    test('should return correct color for rejected status', () => {
      expect(getStatusColor('rejected')).toBe('status-rejected');
    });

    test('should return correct color for pending status', () => {
      expect(getStatusColor('pending')).toBe('status-pending');
    });

    test('should return unknown for invalid status', () => {
      expect(getStatusColor('invalid')).toBe('status-unknown');
      expect(getStatusColor(null)).toBe('status-unknown');
    });
  });

  describe('getStatusIcon', () => {
    test('should return correct icon for approved status', () => {
      expect(getStatusIcon('approved')).toBe('✓');
    });

    test('should return correct icon for rejected status', () => {
      expect(getStatusIcon('rejected')).toBe('✗');
    });

    test('should return correct icon for pending status', () => {
      expect(getStatusIcon('pending')).toBe('⏳');
    });
  });

  describe('formatDate', () => {
    test('should format valid date string', () => {
      const result = formatDate('2025-11-05T12:00:00Z');
      expect(result).toContain('2025');
      expect(result).not.toBe('N/A');
      expect(result).not.toBe('Invalid Date');
    });

    test('should return N/A for null or undefined', () => {
      expect(formatDate(null)).toBe('N/A');
      expect(formatDate(undefined)).toBe('N/A');
      expect(formatDate('')).toBe('N/A');
    });

    test('should handle invalid date strings', () => {
      expect(formatDate('not-a-date')).toBe('Invalid Date');
    });
  });

  describe('formatAmount', () => {
    test('should format amount with currency', () => {
      const result = formatAmount(1000, 'USD');
      expect(result).toContain('1,000');
      expect(result).toContain('$');
    });

    test('should return N/A for null or undefined amount', () => {
      expect(formatAmount(null)).toBe('N/A');
      expect(formatAmount(undefined)).toBe('N/A');
      expect(formatAmount(0)).toBe('N/A');
    });

    test('should use default USD currency when not provided', () => {
      const result = formatAmount(500);
      expect(result).toContain('$');
    });
  });
});

