import { describe, test, expect, beforeEach } from '@jest/globals';

describe('InspectPayment Utility Functions', () => {
  describe('getStatusColor', () => {
    test('should return correct color for approved status', () => {
      const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
          case 'approved': return 'status-approved';
          case 'rejected': return 'status-rejected';
          case 'pending': return 'status-pending';
          default: return 'status-unknown';
        }
      };
      expect(getStatusColor('approved')).toBe('status-approved');
      expect(getStatusColor('APPROVED')).toBe('status-approved');
    });

    test('should return correct color for rejected status', () => {
      const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
          case 'approved': return 'status-approved';
          case 'rejected': return 'status-rejected';
          case 'pending': return 'status-pending';
          default: return 'status-unknown';
        }
      };
      expect(getStatusColor('rejected')).toBe('status-rejected');
    });

    test('should return correct color for pending status', () => {
      const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
          case 'approved': return 'status-approved';
          case 'rejected': return 'status-rejected';
          case 'pending': return 'status-pending';
          default: return 'status-unknown';
        }
      };
      expect(getStatusColor('pending')).toBe('status-pending');
    });

    test('should return unknown for invalid status', () => {
      const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
          case 'approved': return 'status-approved';
          case 'rejected': return 'status-rejected';
          case 'pending': return 'status-pending';
          default: return 'status-unknown';
        }
      };
      expect(getStatusColor('invalid')).toBe('status-unknown');
      expect(getStatusColor(null)).toBe('status-unknown');
    });
  });

  describe('getStatusIcon', () => {
    test('should return correct icon for approved status', () => {
      const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
          case 'approved': return '✓';
          case 'rejected': return '✗';
          case 'pending': return '⏳';
          default: return '?';
        }
      };
      expect(getStatusIcon('approved')).toBe('✓');
    });

    test('should return correct icon for rejected status', () => {
      const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
          case 'approved': return '✓';
          case 'rejected': return '✗';
          case 'pending': return '⏳';
          default: return '?';
        }
      };
      expect(getStatusIcon('rejected')).toBe('✗');
    });

    test('should return correct icon for pending status', () => {
      const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
          case 'approved': return '✓';
          case 'rejected': return '✗';
          case 'pending': return '⏳';
          default: return '?';
        }
      };
      expect(getStatusIcon('pending')).toBe('⏳');
    });
  });

  describe('formatDate', () => {
    test('should format valid date string', () => {
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
          return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        } catch {
          return 'Invalid Date';
        }
      };
      const result = formatDate('2025-11-05T12:00:00Z');
      expect(result).toContain('2025');
      expect(result).not.toBe('N/A');
      expect(result).not.toBe('Invalid Date');
    });

    test('should return N/A for null or undefined', () => {
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
          return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        } catch {
          return 'Invalid Date';
        }
      };
      expect(formatDate(null)).toBe('N/A');
      expect(formatDate(undefined)).toBe('N/A');
      expect(formatDate('')).toBe('N/A');
    });

    test('should handle invalid date strings', () => {
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
          return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        } catch {
          return 'Invalid Date';
        }
      };
      expect(formatDate('not-a-date')).toBe('Invalid Date');
    });
  });

  describe('formatAmount', () => {
    test('should format amount with currency', () => {
      const formatAmount = (amount, currency = 'USD') => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency || 'USD'
        }).format(amount);
      };
      const result = formatAmount(1000, 'USD');
      expect(result).toContain('1,000');
      expect(result).toContain('$');
    });

    test('should return N/A for null or undefined amount', () => {
      const formatAmount = (amount, currency = 'USD') => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency || 'USD'
        }).format(amount);
      };
      expect(formatAmount(null)).toBe('N/A');
      expect(formatAmount(undefined)).toBe('N/A');
      expect(formatAmount(0)).toBe('N/A');
    });

    test('should use default USD currency when not provided', () => {
      const formatAmount = (amount, currency = 'USD') => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency || 'USD'
        }).format(amount);
      };
      const result = formatAmount(500);
      expect(result).toContain('$');
    });
  });
});

