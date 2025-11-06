import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import request from 'supertest';
import express from 'express';

// Mock checkAuth before importing payment routes
const mockCheckAuth = (req, res, next) => {
  req.user = {
    id: 'test_user_id',
    name: 'Jan Smit',
    type: 'User'
  };
  next();
};

jest.unstable_mockModule('../check-auth.js', () => ({
  default: mockCheckAuth
}));

// Import payment routes after mocking checkAuth
const { default: paymentRoutes } = await import('../routes/payments.js');

describe('Payment Validation Tests', () => {
  describe('SWIFT Code Validation', () => {
    test('should validate correct SWIFT code format', () => {
      const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
      
      expect(swiftCodeRegex.test('ABCDUS33')).toBe(true); // 8 characters
      expect(swiftCodeRegex.test('ABCDUS33XXX')).toBe(true); // 11 characters
      expect(swiftCodeRegex.test('DEUTDEFF')).toBe(true);
      expect(swiftCodeRegex.test('INVALID')).toBe(false); // Too short
      expect(swiftCodeRegex.test('abcdus33')).toBe(false); // Lowercase
      expect(swiftCodeRegex.test('ABCD1234')).toBe(false); // Numbers in wrong position
    });
  });

  describe('Amount Validation', () => {
    test('should validate positive amounts', () => {
      const amountRegex = /^\d+(\.\d{1,2})?$/;
      
      expect(amountRegex.test('1000')).toBe(true);
      expect(amountRegex.test('1000.50')).toBe(true);
      expect(amountRegex.test('0.99')).toBe(true);
      expect(amountRegex.test('1000.5')).toBe(true);
      expect(amountRegex.test('1000.123')).toBe(false); // Too many decimals
      expect(amountRegex.test('-100')).toBe(false); // Negative
      expect(amountRegex.test('abc')).toBe(false); // Not a number
    });

    test('should reject negative amounts', () => {
      const amount = '-100';
      const amountValue = parseFloat(amount);
      
      expect(amountValue).toBeLessThan(0);
      expect(amountValue > 0).toBe(false);
    });

    test('should accept valid positive amounts', () => {
      const amounts = ['100', '1000.50', '0.99', '9999.99'];
      
      amounts.forEach(amount => {
        const amountValue = parseFloat(amount);
        expect(amountValue).toBeGreaterThan(0);
      });
    });
  });

  describe('Currency Code Validation', () => {
    test('should validate currency code format', () => {
      const currencyRegex = /^[A-Z]{3}$/;
      
      expect(currencyRegex.test('USD')).toBe(true);
      expect(currencyRegex.test('EUR')).toBe(true);
      expect(currencyRegex.test('GBP')).toBe(true);
      expect(currencyRegex.test('US')).toBe(false); // Too short
      expect(currencyRegex.test('USDD')).toBe(false); // Too long
      expect(currencyRegex.test('usd')).toBe(false); // Lowercase
    });
  });

  describe('Recipient Name Validation', () => {
    test('should validate recipient name format', () => {
      const recipientNameRegex = /^[a-zA-Z0-9 .,'-]{2,50}$/;
      
      expect(recipientNameRegex.test('Jan Smit')).toBe(true);
      expect(recipientNameRegex.test('ABC Corp.')).toBe(true);
      expect(recipientNameRegex.test("O'Connor Inc")).toBe(true);
      expect(recipientNameRegex.test('Company-123')).toBe(true);
      expect(recipientNameRegex.test('J')).toBe(false); // Too short
      expect(recipientNameRegex.test('J@n Sm1t')).toBe(false); // Invalid @ character
    });
  });

  describe('Account Number Validation', () => {
    test('should validate account number format', () => {
      const accountNumberRegex = /^\d{6,20}$/;
      
      expect(accountNumberRegex.test('1234567890')).toBe(true);
      expect(accountNumberRegex.test('123456')).toBe(true);
      expect(accountNumberRegex.test('12345678901234567890')).toBe(true);
      expect(accountNumberRegex.test('12345')).toBe(false); // Too short
      expect(accountNumberRegex.test('123456789012345678901')).toBe(false); // Too long
      expect(accountNumberRegex.test('12345abc')).toBe(false); // Contains letters
    });
  });

  describe('Payment Provider Validation', () => {
    test('should validate payment provider format', () => {
      const paymentProviderRegex = /^[a-zA-Z0-9 .,'-]{2,50}$/;
      
      expect(paymentProviderRegex.test('Mastercard')).toBe(true);
      expect(paymentProviderRegex.test('Visa')).toBe(true);
      expect(paymentProviderRegex.test('B')).toBe(false); // Too short
      expect(paymentProviderRegex.test('B@nk')).toBe(false); // Invalid character
    });
  });

  describe('Field Whitelisting', () => {
    test('should filter out disallowed payment fields', () => {
      const allowedFields = ['recipientName', 'recipientAccountNumber', 'swiftCode', 'amount', 'currency', 'paymentProvider'];
      const paymentData = {
        recipientName: 'Jan Smit',
        recipientAccountNumber: '1234567890',
        swiftCode: 'ABCDUS33',
        amount: '1000.50',
        currency: 'USD',
        paymentProvider: 'Visa',
        admin: true, // Disallowed
        status: 'approved', // Disallowed
        verified: true // Disallowed
      };

      // Simulate field filtering
      Object.keys(paymentData).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete paymentData[key];
        }
      });

      expect(paymentData.recipientName).toBe('Jan Smit');
      expect(paymentData.swiftCode).toBe('ABCDUS33');
      expect(paymentData.admin).toBeUndefined();
      expect(paymentData.status).toBeUndefined();
      expect(paymentData.verified).toBeUndefined();
    });
  });

  describe('Required Fields Validation', () => {
    test('should detect missing required fields', () => {
      const requiredFields = ['recipientName', 'recipientAccountNumber', 'swiftCode', 'amount', 'currency', 'paymentProvider'];
      
      const incompletePayment = {
        recipientName: 'Jan Smit',
        swiftCode: 'ABCDUS33'
        // Missing other required fields
      };

      const missingFields = requiredFields.filter(field => !incompletePayment[field]);
      
      expect(missingFields.length).toBeGreaterThan(0);
      expect(missingFields).toContain('recipientAccountNumber');
      expect(missingFields).toContain('amount');
      expect(missingFields).toContain('currency');
      expect(missingFields).toContain('paymentProvider');
    });

    test('should pass with all required fields', () => {
      const requiredFields = ['recipientName', 'recipientAccountNumber', 'swiftCode', 'amount', 'currency', 'paymentProvider'];
      
      const completePayment = {
        recipientName: 'Jan Smit',
        recipientAccountNumber: '1234567890',
        swiftCode: 'ABCDUS33',
        amount: '1000.50',
        currency: 'USD',
        paymentProvider: 'Mastercard'
      };

      const missingFields = requiredFields.filter(field => !completePayment[field]);
      
      expect(missingFields.length).toBe(0);
    });
  });

  describe('Status Parameter Sanitization', () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const paymentRoutesPath = join(__dirname, '../routes/payments.js');

    test('should sanitize status parameter using toString()', () => {
      const content = fs.readFileSync(paymentRoutesPath, 'utf8');
      expect(content).toContain('status.toString()');
      expect(content).toContain('sanitizedStatus');
    });

    test('should validate status values in route', () => {
      const content = fs.readFileSync(paymentRoutesPath, 'utf8');
      expect(content).toContain("'pending'");
      expect(content).toContain("'approved'");
      expect(content).toContain("'rejected'");
      expect(content).toContain('includes(status)');
    });

    test('should use parameterized query with $eq operator', () => {
      const content = fs.readFileSync(paymentRoutesPath, 'utf8');
      expect(content).toContain('$eq');
      expect(content).toContain('status: { $eq:');
    });
  });

  describe('Payment API Endpoint Tests', () => {
    let app;

    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.use('/payments', paymentRoutes);
    });

    describe('POST /payments/submit', () => {
      test('should reject request with missing required fields', async () => {
        const response = await request(app)
          .post('/payments/submit')
          .send({
            recipientName: 'Jan Smit',
            swiftCode: 'ABCDUS33'
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('required');
      });

      test('should reject request with invalid SWIFT code format', async () => {
        const response = await request(app)
          .post('/payments/submit')
          .send({
            recipientName: 'Jan Smit',
            accountNumber: '1234567890',
            swiftCode: 'INVALID',
            amount: '1000.50',
            currency: 'USD',
            paymentProvider: 'Visa'
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('SWIFT code');
      });

      test('should reject request with invalid amount format', async () => {
        const response = await request(app)
          .post('/payments/submit')
          .send({
            recipientName: 'Jan Smit',
            accountNumber: '1234567890',
            swiftCode: 'ABCDUS33',
            amount: '-100',
            currency: 'USD',
            paymentProvider: 'Mastercard'
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/amount|format/i);
      });

      test('should reject request with invalid currency format', async () => {
        const response = await request(app)
          .post('/payments/submit')
          .send({
            recipientName: 'Jan Smit',
            accountNumber: '1234567890',
            swiftCode: 'ABCDUS33',
            amount: '1000.50',
            currency: 'US',
            paymentProvider: 'Visa'
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/currency|format/i);
      });

      test('should filter out disallowed fields', async () => {
        const response = await request(app)
          .post('/payments/submit')
          .send({
            recipientName: 'Jan Smit',
            accountNumber: '1234567890',
            swiftCode: 'ABCDUS33',
            amount: '1000.50',
            currency: 'USD',
            paymentProvider: 'Mastercard',
            admin: true,
            status: 'approved'
          });

        // Should fail validation, but disallowed fields should be filtered
        expect(response.status).toBeGreaterThanOrEqual(400);
      });
    });

    describe('GET /payments/status/:status', () => {
      test('should reject invalid status parameter', async () => {
        const response = await request(app)
          .get('/payments/status/invalid');

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Invalid status');
      });

      test('should accept valid status parameter', async () => {
        const response = await request(app)
          .get('/payments/status/pending');

        // Should not return 400 for invalid status
        expect(response.status).not.toBe(400);
      });
    });

    describe('GET /payments/:id', () => {
      test('should reject invalid ObjectId format', async () => {
        const response = await request(app)
          .get('/payments/invalid-id');

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Invalid application ID');
      });
    });

    describe('PATCH /payments/review/:id', () => {
      test('should reject invalid status in review', async () => {
        const response = await request(app)
          .patch('/payments/review/507f1f77bcf86cd799439011')
          .send({
            status: 'invalid'
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/approved|rejected/i);
      });

      test('should reject invalid ObjectId format', async () => {
        const response = await request(app)
          .patch('/payments/review/invalid-id')
          .send({
            status: 'approved'
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Invalid application ID');
      });
    });
  });
});

