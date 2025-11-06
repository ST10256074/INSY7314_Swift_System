import { describe, test, expect } from '@jest/globals';
import { validateUserInput, sanitizeUserInput } from '../utils/validation.js';

describe('User Input Validation', () => {
  describe('validateUserInput', () => {
    test('should validate correct user input', () => {
      const result = validateUserInput('testuser', 'Jan Smit', '1234567890', '1234567890123', 'Password123');
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('should reject missing fields', () => {
      const result = validateUserInput('', 'Jan Smit', '1234567890', '1234567890123', 'Password123');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should reject invalid username', () => {
      const result = validateUserInput('ab', 'Jan Smit', '1234567890', '1234567890123', 'Password123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Username must be 3-16 characters and contain only letters, numbers, or underscores');
    });

    test('should reject invalid full name', () => {
      const result = validateUserInput('testuser', 'J@n', '1234567890', '1234567890123', 'Password123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Full name contains invalid characters');
    });

    test('should reject invalid account number', () => {
      const result = validateUserInput('testuser', 'Jan Smit', '12345', '1234567890123', 'Password123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Account number must be 6-20 digits');
    });

    test('should reject invalid ID number', () => {
      const result = validateUserInput('testuser', 'Jan Smit', '1234567890', '123456789012', 'Password123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID Number must be exactly 13 digits');
    });

    test('should reject invalid password', () => {
      const result = validateUserInput('testuser', 'Jan Smit', '1234567890', '1234567890123', 'weak');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 6 characters and contain at least one letter and one number');
    });
  });

  describe('sanitizeUserInput', () => {
    test('should keep only allowed fields', () => {
      const input = {
        username: 'testuser',
        full_name: 'Jan Smit',
        accountNumber: '1234567890',
        IDNumber: '1234567890123',
        password: 'Password123',
        admin: true,
        status: 'approved'
      };

      const sanitized = sanitizeUserInput(input);
      expect(sanitized.username).toBe('testuser');
      expect(sanitized.full_name).toBe('Jan Smit');
      expect(sanitized.admin).toBeUndefined();
      expect(sanitized.status).toBeUndefined();
    });

    test('should handle empty input', () => {
      const sanitized = sanitizeUserInput({});
      expect(Object.keys(sanitized).length).toBe(0);
    });

    test('should filter out disallowed fields', () => {
      const input = {
        username: 'testuser',
        malicious: '<script>alert("xss")</script>',
        admin: true
      };

      const sanitized = sanitizeUserInput(input);
      expect(sanitized.username).toBe('testuser');
      expect(sanitized.malicious).toBeUndefined();
      expect(sanitized.admin).toBeUndefined();
    });
  });
});

