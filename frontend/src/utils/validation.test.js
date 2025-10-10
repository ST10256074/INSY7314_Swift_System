import { describe, test, expect } from '@jest/globals';

describe('Frontend Input Validation', () => {
  describe('Username Validation', () => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

    test('should validate correct username format', () => {
      expect(usernameRegex.test('validuser')).toBe(true);
      expect(usernameRegex.test('user123')).toBe(true);
      expect(usernameRegex.test('test_user')).toBe(true);
    });

    test('should reject invalid username format', () => {
      expect(usernameRegex.test('ab')).toBe(false); // Too short
      expect(usernameRegex.test('user@name')).toBe(false); // Invalid char
      expect(usernameRegex.test('<script>')).toBe(false); // XSS attempt
    });
  });

  describe('Password Validation', () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    test('should validate strong passwords', () => {
      expect(passwordRegex.test('Password123')).toBe(true);
      expect(passwordRegex.test('Test1234')).toBe(true);
    });

    test('should reject weak passwords', () => {
      expect(passwordRegex.test('12345')).toBe(false); // Too short
      expect(passwordRegex.test('password')).toBe(false); // No number
      expect(passwordRegex.test('12345678')).toBe(false); // No letter
    });
  });

  describe('Account Number Validation', () => {
    const accountNumberRegex = /^\d{6,20}$/;

    test('should validate correct account numbers', () => {
      expect(accountNumberRegex.test('1234567890')).toBe(true);
      expect(accountNumberRegex.test('123456')).toBe(true);
    });

    test('should reject invalid account numbers', () => {
      expect(accountNumberRegex.test('12345')).toBe(false); // Too short
      expect(accountNumberRegex.test('12345abc')).toBe(false); // Has letters
    });
  });

  describe('ID Number Validation', () => {
    const idNumberRegex = /^\d{13}$/;

    test('should validate correct ID numbers', () => {
      expect(idNumberRegex.test('1234567890123')).toBe(true);
    });

    test('should reject invalid ID numbers', () => {
      expect(idNumberRegex.test('123456789012')).toBe(false); // Too short
      expect(idNumberRegex.test('12345678901ab')).toBe(false); // Has letters
    });
  });

  describe('SWIFT Code Validation', () => {
    const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

    test('should validate correct SWIFT codes', () => {
      expect(swiftCodeRegex.test('ABCDUS33')).toBe(true);
      expect(swiftCodeRegex.test('DEUTDEFF')).toBe(true);
    });

    test('should reject invalid SWIFT codes', () => {
      expect(swiftCodeRegex.test('invalid')).toBe(false); // Lowercase
      expect(swiftCodeRegex.test('ABC123')).toBe(false); // Too short
    });
  });

  describe('Amount Validation', () => {
    const amountRegex = /^\d+(\.\d{1,2})?$/;

    test('should validate correct amounts', () => {
      expect(amountRegex.test('100')).toBe(true);
      expect(amountRegex.test('1000.50')).toBe(true);
      expect(amountRegex.test('0.99')).toBe(true);
    });

    test('should reject invalid amounts', () => {
      expect(amountRegex.test('-100')).toBe(false); // Negative
      expect(amountRegex.test('abc')).toBe(false); // Not a number
      expect(amountRegex.test('100.123')).toBe(false); // Too many decimals
    });
  });

  describe('Currency Code Validation', () => {
    const currencyRegex = /^[A-Z]{3}$/;

    test('should validate correct currency codes', () => {
      expect(currencyRegex.test('USD')).toBe(true);
      expect(currencyRegex.test('EUR')).toBe(true);
      expect(currencyRegex.test('GBP')).toBe(true);
    });

    test('should reject invalid currency codes', () => {
      expect(currencyRegex.test('US')).toBe(false); // Too short
      expect(currencyRegex.test('usd')).toBe(false); // Lowercase
      expect(currencyRegex.test('USDD')).toBe(false); // Too long
    });
  });
});

