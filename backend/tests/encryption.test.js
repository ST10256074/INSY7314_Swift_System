import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { encrypt, decrypt } from '../utils/encryption.js';

describe('Encryption Utility Tests', () => {
  let originalEnv;

  beforeEach(() => {
    // Store original environment
    originalEnv = process.env.ENCRYPTION_KEY;
    // Set test encryption key
    process.env.ENCRYPTION_KEY = 'test_encryption_key_32_chars_long';
  });

  afterEach(() => {
    // Restore original environment
    process.env.ENCRYPTION_KEY = originalEnv;
  });

  describe('encrypt function', () => {
    test('should encrypt a simple string', async () => {
      const plaintext = 'Hello World';
      const encrypted = await encrypt(plaintext);
      
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(plaintext);
      expect(encrypted).toContain(':');
      expect(encrypted.length).toBeGreaterThan(plaintext.length);
    });

    test('should encrypt sensitive data', async () => {
      const sensitiveData = 'John Doe';
      const encrypted = await encrypt(sensitiveData);
      
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(sensitiveData);
      expect(encrypted).toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
    });

    test('should handle empty string', async () => {
      const result = await encrypt('');
      expect(result).toBe('');
    });

    test('should handle null/undefined input', async () => {
      const resultNull = await encrypt(null);
      const resultUndefined = await encrypt(undefined);
      
      expect(resultNull).toBe(null);
      expect(resultUndefined).toBe(undefined);
    });

    test('should produce different encrypted values for same input', async () => {
      const plaintext = 'Test Data';
      const encrypted1 = await encrypt(plaintext);
      const encrypted2 = await encrypt(plaintext);
      
      // Should be different due to random IV
      expect(encrypted1).not.toBe(encrypted2);
    });

    test('should handle special characters', async () => {
      const specialText = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const encrypted = await encrypt(specialText);
      
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(specialText);
    });
  });

  describe('decrypt function', () => {
    test('should decrypt encrypted string correctly', async () => {
      const plaintext = 'Hello World';
      const encrypted = await encrypt(plaintext);
      const decrypted = await decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });

    test('should decrypt sensitive data correctly', async () => {
      const sensitiveData = 'John Doe';
      const encrypted = await encrypt(sensitiveData);
      const decrypted = await decrypt(encrypted);
      
      expect(decrypted).toBe(sensitiveData);
    });

    test('should handle empty string', async () => {
      const result = await decrypt('');
      expect(result).toBe('');
    });

    test('should handle null/undefined input', async () => {
      const resultNull = await decrypt(null);
      const resultUndefined = await decrypt(undefined);
      
      expect(resultNull).toBe(null);
      expect(resultUndefined).toBe(undefined);
    });

    test('should handle invalid encrypted format', async () => {
      const invalidEncrypted = 'invalid_format_without_colon';
      const result = await decrypt(invalidEncrypted);
      
      expect(result).toBe(invalidEncrypted);
    });

    test('should handle special characters in decryption', async () => {
      const specialText = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const encrypted = await encrypt(specialText);
      const decrypted = await decrypt(encrypted);
      
      expect(decrypted).toBe(specialText);
    });
  });

  describe('encrypt-decrypt round trip', () => {
    test('should maintain data integrity through encrypt-decrypt cycle', async () => {
      const testCases = [
        'Simple text',
        'Text with numbers 12345',
        'Text with special chars !@#$%',
        'Long text that might cause issues with encryption algorithms and should be handled properly',
        'Unicode text: 你好世界 🌍',
        'JSON-like data: {"name": "John", "age": 30}'
      ];

      for (const testCase of testCases) {
        const encrypted = await encrypt(testCase);
        const decrypted = await decrypt(encrypted);
        expect(decrypted).toBe(testCase);
      }
    });

    test('should handle multiple encrypt-decrypt cycles', async () => {
      const plaintext = 'Test Data';
      let current = plaintext;
      
      // Perform multiple encrypt-decrypt cycles
      for (let i = 0; i < 5; i++) {
        const encrypted = await encrypt(current);
        current = await decrypt(encrypted);
        expect(current).toBe(plaintext);
      }
    });
  });

  describe('error handling', () => {
    test('should handle decryption of corrupted data gracefully', async () => {
      const corruptedData = 'corrupted:data:with:multiple:colons';
      
      await expect(decrypt(corruptedData)).rejects.toThrow('Decryption failed');
    });
  });

  describe('security properties', () => {
    test('encrypted data should not contain original text', async () => {
      const plaintext = 'Secret Information';
      const encrypted = await encrypt(plaintext);
      
      // Encrypted data should not contain any part of the original text
      expect(encrypted.toLowerCase()).not.toContain(plaintext.toLowerCase());
    });

    test('should use different IVs for same input', async () => {
      const plaintext = 'Same Input';
      const encrypted1 = await encrypt(plaintext);
      const encrypted2 = await encrypt(plaintext);
      
      // Extract IVs (first part before colon)
      const iv1 = encrypted1.split(':')[0];
      const iv2 = encrypted2.split(':')[0];
      
      expect(iv1).not.toBe(iv2);
    });
  });
});
