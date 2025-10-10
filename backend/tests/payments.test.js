import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';

// Mock the database connection
jest.mock('../db/conn.js', () => ({
  default: {
    collection: jest.fn(() => ({
      findOne: jest.fn(),
      insertOne: jest.fn(),
      find: jest.fn(() => ({
        toArray: jest.fn()
      }))
    }))
  }
}));

// Mock encryption utilities
jest.mock('../utils/encryption.js', () => ({
  encrypt: jest.fn((text) => Promise.resolve(`encrypted_${text}`)),
  decrypt: jest.fn((text) => Promise.resolve(text.replace('encrypted_', '')))
}));

// Mock checkAuth middleware
jest.mock('../check-auth.js', () => {
  return jest.fn((req, res, next) => {
    // Mock authenticated user
    req.user = {
      id: '507f1f77bcf86cd799439011',
      username: 'testuser',
      userType: 'User'
    };
    next();
  });
});

// Import after mocking
import db from '../db/conn.js';
import { encrypt, decrypt } from '../utils/encryption.js';

// Create a test app
const app = express();
app.use(express.json());

// Mock payment routes for testing
const mockPaymentRoutes = express.Router();

// Mock checkAuth middleware for testing
const mockCheckAuth = (req, res, next) => {
  req.user = {
    id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    userType: 'User'
  };
  next();
};

mockPaymentRoutes.use(mockCheckAuth);

// Mock submit payment endpoint
mockPaymentRoutes.post('/submit', async (req, res) => {
  try {
    // Input validation
    const allowedFields = ["recipientName", "accountNumber", "swiftCode", "amount", "currency", "paymentProvider"];
    Object.keys(req.body).forEach(key => {
      if (!allowedFields.includes(key)) {
        delete req.body[key];
      }
    });

    const recipientNameRegex = /^[a-zA-Z0-9 .,'-]{2,50}$/;
    const accountNumberRegex = /^\d{6,20}$/;
    const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    const currencyRegex = /^[A-Z]{3}$/;
    const paymentProviderRegex = /^[a-zA-Z0-9 .,'-]{2,50}$/;

    const {
      recipientName,
      accountNumber,
      swiftCode,
      amount,
      currency,
      paymentProvider
    } = req.body;

    // Validate required fields
    if (!recipientName || !accountNumber || !swiftCode || !amount || !currency || !paymentProvider) {
      return res.status(400).json({ 
        message: 'All fields are required: recipientName, accountNumber, swiftCode, amount, currency, paymentProvider' 
      });
    }

    // Regex validation
    if (!recipientNameRegex.test(recipientName)) {
      return res.status(400).json({ message: 'Invalid recipient name format' });
    }
    if (!accountNumberRegex.test(accountNumber)) {
      return res.status(400).json({ message: 'Invalid account number format' });
    }
    if (!swiftCodeRegex.test(swiftCode)) {
      return res.status(400).json({ message: 'Invalid SWIFT code format' });
    }
    if (!amountRegex.test(amount)) {
      return res.status(400).json({ message: 'Invalid amount format' });
    }
    if (!currencyRegex.test(currency)) {
      return res.status(400).json({ message: 'Invalid currency format' });
    }
    if (!paymentProviderRegex.test(paymentProvider)) {
      return res.status(400).json({ message: 'Invalid payment provider format' });
    }

    // Encrypt sensitive data
    const encryptedRecipientName = await encrypt(recipientName);
    const encryptedAccountNumber = await encrypt(accountNumber);
    const encryptedSwiftCode = await encrypt(swiftCode);
    const encryptedAmount = await encrypt(amount);
    const encryptedCurrency = await encrypt(currency);
    const encryptedPaymentProvider = await encrypt(paymentProvider);

    // Create payment application
    const paymentApplication = {
      submittedBy: req.user.id,
      recipientName: encryptedRecipientName,
      accountNumber: encryptedAccountNumber,
      swiftCode: encryptedSwiftCode,
      amount: encryptedAmount,
      currency: encryptedCurrency,
      paymentProvider: encryptedPaymentProvider,
      status: 'pending',
      submittedAt: new Date(),
      submittedByName: null,
      reviewedAt: null,
      reviewedBy: null,
      reviewerName: null,
      reviewComments: null
    };

    const result = await db.collection('payment_applications').insertOne(paymentApplication);
    
    res.status(201).json({
      message: 'Payment application submitted successfully',
      applicationId: result.insertedId
    });
  } catch (error) {
    console.error('Payment submission error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Mock get my applications endpoint
mockPaymentRoutes.get('/my-applications', async (req, res) => {
  try {
    const applications = await db.collection('payment_applications')
      .find({ submittedBy: req.user.id })
      .toArray();

    // Decrypt sensitive data for response
    const decryptedApplications = await Promise.all(
      applications.map(async (app) => ({
        ...app,
        recipientName: await decrypt(app.recipientName),
        accountNumber: await decrypt(app.accountNumber),
        swiftCode: await decrypt(app.swiftCode),
        amount: await decrypt(app.amount),
        currency: await decrypt(app.currency),
        paymentProvider: await decrypt(app.paymentProvider)
      }))
    );

    res.json({
      message: 'Applications retrieved successfully',
      applications: decryptedApplications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use('/payments', mockPaymentRoutes);

describe('Payment Routes Tests', () => {
  let mockCollection;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock collection
    mockCollection = {
      findOne: jest.fn(),
      insertOne: jest.fn(),
      find: jest.fn(() => ({
        toArray: jest.fn()
      }))
    };
    
    db.collection.mockReturnValue(mockCollection);
  });

  describe('POST /payments/submit', () => {
    test('should submit payment with valid data', async () => {
      const paymentData = {
        recipientName: 'John Doe',
        accountNumber: '1234567890',
        swiftCode: 'ABCDUS33',
        amount: '1000.50',
        currency: 'USD',
        paymentProvider: 'Bank of America'
      };

      mockCollection.insertOne.mockResolvedValue({ insertedId: '507f1f77bcf86cd799439012' });

      const response = await request(app)
        .post('/payments/submit')
        .send(paymentData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Payment application submitted successfully');
      expect(response.body.applicationId).toBe('507f1f77bcf86cd799439012');
      expect(encrypt).toHaveBeenCalledTimes(6); // All sensitive fields
    });

    test('should reject payment with missing fields', async () => {
      const paymentData = {
        recipientName: 'John Doe',
        accountNumber: '1234567890'
        // Missing other required fields
      };

      const response = await request(app)
        .post('/payments/submit')
        .send(paymentData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('All fields are required');
    });

    test('should reject payment with invalid SWIFT code', async () => {
      const paymentData = {
        recipientName: 'John Doe',
        accountNumber: '1234567890',
        swiftCode: 'INVALID', // Invalid SWIFT code
        amount: '1000.50',
        currency: 'USD',
        paymentProvider: 'Bank of America'
      };

      const response = await request(app)
        .post('/payments/submit')
        .send(paymentData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid SWIFT code format');
    });

    test('should reject payment with invalid amount', async () => {
      const paymentData = {
        recipientName: 'John Doe',
        accountNumber: '1234567890',
        swiftCode: 'ABCDUS33',
        amount: 'invalid_amount', // Invalid amount
        currency: 'USD',
        paymentProvider: 'Bank of America'
      };

      const response = await request(app)
        .post('/payments/submit')
        .send(paymentData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid amount format');
    });

    test('should reject payment with invalid currency', async () => {
      const paymentData = {
        recipientName: 'John Doe',
        accountNumber: '1234567890',
        swiftCode: 'ABCDUS33',
        amount: '1000.50',
        currency: 'INVALID', // Invalid currency
        paymentProvider: 'Bank of America'
      };

      const response = await request(app)
        .post('/payments/submit')
        .send(paymentData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid currency format');
    });

    test('should filter out disallowed fields', async () => {
      const paymentData = {
        recipientName: 'John Doe',
        accountNumber: '1234567890',
        swiftCode: 'ABCDUS33',
        amount: '1000.50',
        currency: 'USD',
        paymentProvider: 'Bank of America',
        maliciousField: 'should be removed',
        admin: true // Should be filtered out
      };

      mockCollection.insertOne.mockResolvedValue({ insertedId: '507f1f77bcf86cd799439012' });

      const response = await request(app)
        .post('/payments/submit')
        .send(paymentData);

      expect(response.status).toBe(201);
      expect(mockCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientName: 'encrypted_John Doe',
          accountNumber: 'encrypted_1234567890',
          swiftCode: 'encrypted_ABCDUS33',
          amount: 'encrypted_1000.50',
          currency: 'encrypted_USD',
          paymentProvider: 'encrypted_Bank of America',
          status: 'pending'
        })
      );
    });
  });

  describe('GET /payments/my-applications', () => {
    test('should retrieve user applications', async () => {
      const mockApplications = [
        {
          _id: '507f1f77bcf86cd799439012',
          submittedBy: '507f1f77bcf86cd799439011',
          recipientName: 'encrypted_John Doe',
          accountNumber: 'encrypted_1234567890',
          swiftCode: 'encrypted_ABCDUS33',
          amount: 'encrypted_1000.50',
          currency: 'encrypted_USD',
          paymentProvider: 'encrypted_Bank of America',
          status: 'pending',
          submittedAt: new Date()
        }
      ];

      mockCollection.find().toArray.mockResolvedValue(mockApplications);

      const response = await request(app)
        .get('/payments/my-applications');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Applications retrieved successfully');
      expect(response.body.applications).toHaveLength(1);
      expect(response.body.applications[0].recipientName).toBe('John Doe');
      expect(decrypt).toHaveBeenCalledTimes(6); // All encrypted fields
    });

    test('should return empty array when no applications', async () => {
      mockCollection.find().toArray.mockResolvedValue([]);

      const response = await request(app)
        .get('/payments/my-applications');

      expect(response.status).toBe(200);
      expect(response.body.applications).toHaveLength(0);
    });

    test('should handle database errors gracefully', async () => {
      mockCollection.find().toArray.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/payments/my-applications');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('Input Validation', () => {
    test('should validate recipient name format', async () => {
      const paymentData = {
        recipientName: 'John123Doe', // Contains numbers
        accountNumber: '1234567890',
        swiftCode: 'ABCDUS33',
        amount: '1000.50',
        currency: 'USD',
        paymentProvider: 'Bank of America'
      };

      const response = await request(app)
        .post('/payments/submit')
        .send(paymentData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid recipient name format');
    });

    test('should validate account number format', async () => {
      const paymentData = {
        recipientName: 'John Doe',
        accountNumber: '123', // Too short
        swiftCode: 'ABCDUS33',
        amount: '1000.50',
        currency: 'USD',
        paymentProvider: 'Bank of America'
      };

      const response = await request(app)
        .post('/payments/submit')
        .send(paymentData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid account number format');
    });

    test('should validate payment provider format', async () => {
      const paymentData = {
        recipientName: 'John Doe',
        accountNumber: '1234567890',
        swiftCode: 'ABCDUS33',
        amount: '1000.50',
        currency: 'USD',
        paymentProvider: 'Bank@#$%' // Invalid characters
      };

      const response = await request(app)
        .post('/payments/submit')
        .send(paymentData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid payment provider format');
    });
  });

  describe('Security Features', () => {
    test('should encrypt all sensitive payment data', async () => {
      const paymentData = {
        recipientName: 'John Doe',
        accountNumber: '1234567890',
        swiftCode: 'ABCDUS33',
        amount: '1000.50',
        currency: 'USD',
        paymentProvider: 'Bank of America'
      };

      mockCollection.insertOne.mockResolvedValue({ insertedId: '507f1f77bcf86cd799439012' });

      await request(app)
        .post('/payments/submit')
        .send(paymentData);

      expect(encrypt).toHaveBeenCalledWith('John Doe');
      expect(encrypt).toHaveBeenCalledWith('1234567890');
      expect(encrypt).toHaveBeenCalledWith('ABCDUS33');
      expect(encrypt).toHaveBeenCalledWith('1000.50');
      expect(encrypt).toHaveBeenCalledWith('USD');
      expect(encrypt).toHaveBeenCalledWith('Bank of America');
    });

    test('should decrypt data when retrieving applications', async () => {
      const mockApplications = [
        {
          _id: '507f1f77bcf86cd799439012',
          submittedBy: '507f1f77bcf86cd799439011',
          recipientName: 'encrypted_John Doe',
          accountNumber: 'encrypted_1234567890',
          swiftCode: 'encrypted_ABCDUS33',
          amount: 'encrypted_1000.50',
          currency: 'encrypted_USD',
          paymentProvider: 'encrypted_Bank of America',
          status: 'pending'
        }
      ];

      mockCollection.find().toArray.mockResolvedValue(mockApplications);

      const response = await request(app)
        .get('/payments/my-applications');

      expect(decrypt).toHaveBeenCalledWith('encrypted_John Doe');
      expect(decrypt).toHaveBeenCalledWith('encrypted_1234567890');
      expect(decrypt).toHaveBeenCalledWith('encrypted_ABCDUS33');
      expect(decrypt).toHaveBeenCalledWith('encrypted_1000.50');
      expect(decrypt).toHaveBeenCalledWith('encrypted_USD');
      expect(decrypt).toHaveBeenCalledWith('encrypted_Bank of America');
    });
  });
});
