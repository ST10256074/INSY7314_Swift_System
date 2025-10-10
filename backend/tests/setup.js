// Test setup file to configure environment variables and global test settings
import { jest } from '@jest/globals';

// Set up test environment variables
process.env.ENCRYPTION_KEY = 'test_encryption_key_32_chars_long';
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.ATLAS_URI = 'mongodb://localhost:27017/test_db';

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Uncomment the following lines to suppress console output during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set test timeout
jest.setTimeout(10000);
