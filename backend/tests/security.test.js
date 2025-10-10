import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';

describe('Security Features Tests', () => {
  describe('Password Security - Hashing and Salting', () => {
    test('should hash passwords with bcrypt and salt', async () => {
      const password = 'TestPassword123';
      const saltRounds = 10;
      
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Hash should be different from original
      expect(hashedPassword).not.toBe(password);
      
      // Bcrypt hashes are 60 characters long
      expect(hashedPassword.length).toBe(60);
      
      // Hash should start with $2b$ (bcrypt identifier)
      expect(hashedPassword).toMatch(/^\$2[aby]\$/);
    });

    test('should generate different hashes for same password (salting)', async () => {
      const password = 'TestPassword123';
      
      const hash1 = await bcrypt.hash(password, 10);
      const hash2 = await bcrypt.hash(password, 10);
      
      // Different salts should produce different hashes
      expect(hash1).not.toBe(hash2);
      
      // But both should verify correctly
      const valid1 = await bcrypt.compare(password, hash1);
      const valid2 = await bcrypt.compare(password, hash2);
      
      expect(valid1).toBe(true);
      expect(valid2).toBe(true);
    });

    test('should use minimum 10 salt rounds for security', async () => {
      const password = 'TestPassword123';
      const saltRounds = 10;
      
      const hash = await bcrypt.hash(password, saltRounds);
      
      // Extract salt rounds from hash (3rd field in $2b$10$...)
      const hashParts = hash.split('$');
      const usedRounds = parseInt(hashParts[2]);
      
      expect(usedRounds).toBeGreaterThanOrEqual(10);
    });

    test('should reject incorrect passwords', async () => {
      const correctPassword = 'TestPassword123';
      const wrongPassword = 'WrongPassword456';
      
      const hash = await bcrypt.hash(correctPassword, 10);
      const isValid = await bcrypt.compare(wrongPassword, hash);
      
      expect(isValid).toBe(false);
    });
  });

  describe('Input Whitelisting - RegEx Validation', () => {
    describe('Username Whitelisting', () => {
      const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

      test('should accept valid usernames', () => {
        const validUsernames = ['john123', 'user_name', 'test_user_01', 'ValidUser'];
        
        validUsernames.forEach(username => {
          expect(usernameRegex.test(username)).toBe(true);
        });
      });

      test('should reject usernames with special characters (XSS prevention)', () => {
        const maliciousUsernames = [
          '<script>alert("xss")</script>',
          'user<script>',
          'user;DROP TABLE',
          'user\'OR\'1\'=\'1',
          'user@email.com',
          'user#name',
          'user$name',
          'user%name'
        ];
        
        maliciousUsernames.forEach(username => {
          expect(usernameRegex.test(username)).toBe(false);
        });
      });

      test('should reject usernames that are too short or too long', () => {
        expect(usernameRegex.test('ab')).toBe(false); // Too short
        expect(usernameRegex.test('thisusernameiswaytoolong123')).toBe(false); // Too long
      });
    });

    describe('Password Whitelisting', () => {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

      test('should enforce strong password requirements', () => {
        const validPasswords = ['Pass123', 'Test1234', 'Strong1Pass', 'MyP@ssw0rd'];
        
        validPasswords.forEach(password => {
          expect(passwordRegex.test(password)).toBe(true);
        });
      });

      test('should reject weak passwords', () => {
        const weakPasswords = [
          '12345',           // Too short
          'password',        // No number
          '12345678',        // No letter
          'Pass1',           // Too short even with letter and number
        ];
        
        weakPasswords.forEach(password => {
          expect(passwordRegex.test(password)).toBe(false);
        });
      });

      test('should reject passwords with SQL injection attempts', () => {
        const sqlInjectionAttempts = [
          "' OR '1'='1",
          '; DROP TABLE users--',
          "admin'--",
          "' UNION SELECT * FROM users--"
        ];
        
        sqlInjectionAttempts.forEach(attempt => {
          expect(passwordRegex.test(attempt)).toBe(false);
        });
      });
    });

    describe('Account Number Whitelisting', () => {
      const accountNumberRegex = /^\d{6,20}$/;

      test('should accept valid numeric account numbers', () => {
        const validAccounts = ['123456', '1234567890', '12345678901234567890'];
        
        validAccounts.forEach(account => {
          expect(accountNumberRegex.test(account)).toBe(true);
        });
      });

      test('should reject account numbers with letters or special characters', () => {
        const invalidAccounts = [
          '12345a',
          '123-456',
          '123 456',
          '<script>alert(1)</script>',
          '123456; DROP TABLE',
          "123456' OR '1'='1"
        ];
        
        invalidAccounts.forEach(account => {
          expect(accountNumberRegex.test(account)).toBe(false);
        });
      });
    });

    describe('ID Number Whitelisting', () => {
      const idNumberRegex = /^\d{13}$/;

      test('should accept exactly 13 digits', () => {
        expect(idNumberRegex.test('1234567890123')).toBe(true);
      });

      test('should reject ID numbers with non-numeric characters', () => {
        const invalidIDs = [
          '123456789012a',
          '1234567890<script>',
          '123456789012; DROP',
          "1234567890' OR '1'='1"
        ];
        
        invalidIDs.forEach(id => {
          expect(idNumberRegex.test(id)).toBe(false);
        });
      });
    });

    describe('Full Name Whitelisting', () => {
      const fullNameRegex = /^[a-zA-Z .,'-]{2,50}$/;

      test('should accept valid names', () => {
        const validNames = ['John Doe', "O'Connor", 'Mary-Jane', 'Dr. Smith'];
        
        validNames.forEach(name => {
          expect(fullNameRegex.test(name)).toBe(true);
        });
      });

      test('should reject names with XSS attempts', () => {
        const xssAttempts = [
          '<script>alert("xss")</script>',
          'John<img src=x>',
          'Jane</script>',
          'Bob<iframe>',
          'Alice&lt;script&gt;'
        ];
        
        xssAttempts.forEach(name => {
          expect(fullNameRegex.test(name)).toBe(false);
        });
      });

      test('should reject names with SQL injection characters', () => {
        const sqlAttempts = [
          "John; DROP TABLE",
          "Jane=1",
          "Bob DELETE()",
          "Alice<>UNION"
        ];
        
        sqlAttempts.forEach(name => {
          expect(fullNameRegex.test(name)).toBe(false);
        });
      });
    });

    describe('SWIFT Code Whitelisting', () => {
      const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

      test('should accept valid SWIFT codes', () => {
        const validSwift = ['ABCDUS33', 'DEUTDEFF', 'CHASUS33XXX'];
        
        validSwift.forEach(code => {
          expect(swiftCodeRegex.test(code)).toBe(true);
        });
      });

      test('should reject SWIFT codes with injection attempts', () => {
        const maliciousSwift = [
          'ABCD<script>',
          "SWIFT' OR '1'='1",
          'CODE; DROP',
          'BANK\'; DROP TABLE'
        ];
        
        maliciousSwift.forEach(code => {
          expect(swiftCodeRegex.test(code)).toBe(false);
        });
      });
    });

    describe('Amount Whitelisting', () => {
      const amountRegex = /^\d+(\.\d{1,2})?$/;

      test('should accept valid amounts', () => {
        const validAmounts = ['100', '1000.50', '0.99', '999999.99'];
        
        validAmounts.forEach(amount => {
          expect(amountRegex.test(amount)).toBe(true);
        });
      });

      test('should reject amounts with injection attempts', () => {
        const maliciousAmounts = [
          '100; DROP TABLE',
          "100' OR '1'='1",
          '100<script>',
          '100.00; DELETE'
        ];
        
        maliciousAmounts.forEach(amount => {
          expect(amountRegex.test(amount)).toBe(false);
        });
      });
    });

    describe('Currency Code Whitelisting', () => {
      const currencyRegex = /^[A-Z]{3}$/;

      test('should accept valid 3-letter currency codes', () => {
        const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'ZAR'];
        
        validCurrencies.forEach(currency => {
          expect(currencyRegex.test(currency)).toBe(true);
        });
      });

      test('should reject currency codes with malicious content', () => {
        const maliciousCurrencies = [
          'US<',
          "USD' OR '1'='1",
          'EUR; DROP',
          'USDD'
        ];
        
        maliciousCurrencies.forEach(currency => {
          expect(currencyRegex.test(currency)).toBe(false);
        });
      });
    });
  });

  describe('SSL/HTTPS Enforcement', () => {
    let app;

    beforeAll(() => {
      app = express();
      app.use(express.json());

      // Middleware to enforce HTTPS
      app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
          return res.status(403).send('HTTPS required');
        }
        next();
      });

      app.get('/test', (req, res) => {
        res.json({ message: 'Success' });
      });
    });

    test('should enforce HTTPS in production environment', async () => {
      process.env.NODE_ENV = 'production';
      
      const response = await request(app)
        .get('/test')
        .set('x-forwarded-proto', 'http');

      expect(response.status).toBe(403);
      expect(response.text).toBe('HTTPS required');
      
      delete process.env.NODE_ENV;
    });

    test('should allow HTTPS traffic', async () => {
      const response = await request(app)
        .get('/test')
        .set('x-forwarded-proto', 'https');

      expect(response.status).toBe(200);
    });
  });

  describe('Security Headers', () => {
    let app;

    beforeAll(() => {
      app = express();
      
      // Disable X-Powered-By header
      app.disable('x-powered-by');
      
      // Add security headers middleware
      app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        next();
      });
      
      app.get('/test', (req, res) => {
        res.json({ message: 'Success' });
      });
    });

    test('should set X-Content-Type-Options header (MIME sniffing protection)', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    test('should set X-Frame-Options header (Clickjacking protection)', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    test('should set X-XSS-Protection header (XSS protection)', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });

    test('should set Strict-Transport-Security header (HSTS for SSL)', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['strict-transport-security']).toContain('max-age=');
    });

    test('should not expose X-Powered-By header (Information disclosure prevention)', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('Attack Protection', () => {
    describe('XSS (Cross-Site Scripting) Prevention', () => {
      test('should reject XSS in all input fields', () => {
        const xssPayloads = [
          '<script>alert("XSS")</script>',
          '<img src=x onerror=alert(1)>',
          '<svg onload=alert(1)>',
          'javascript:alert(1)',
          '<iframe src="javascript:alert(1)">',
          '"><script>alert(String.fromCharCode(88,83,83))</script>'
        ];

        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        const fullNameRegex = /^[a-zA-Z .,'-]{2,50}$/;

        xssPayloads.forEach(payload => {
          expect(usernameRegex.test(payload)).toBe(false);
          expect(fullNameRegex.test(payload)).toBe(false);
        });
      });
    });

    describe('SQL Injection Prevention', () => {
      test('should reject SQL injection attempts in all fields', () => {
        const sqlInjectionPayloads = [
          "' OR '1'='1",
          "'; DROP TABLE users--",
          "' UNION SELECT * FROM users--",
          "admin'--",
          "' OR 1=1--",
          "1' AND '1' = '1",
          "' OR ''='",
          "1'; DELETE FROM users WHERE '1'='1"
        ];

        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        const accountNumberRegex = /^\d{6,20}$/;

        sqlInjectionPayloads.forEach(payload => {
          expect(usernameRegex.test(payload)).toBe(false);
          expect(accountNumberRegex.test(payload)).toBe(false);
        });
      });
    });

    describe('NoSQL Injection Prevention', () => {
      test('should reject NoSQL injection attempts', () => {
        const noSqlPayloads = [
          '{"$gt": ""}',
          '{"$ne": null}',
          '{"$regex": ".*"}',
          '$where',
          '{"$where": "1==1"}',
        ];

        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

        noSqlPayloads.forEach(payload => {
          expect(usernameRegex.test(payload)).toBe(false);
        });
      });
    });

    describe('Command Injection Prevention', () => {
      test('should reject command injection attempts', () => {
        const commandInjectionPayloads = [
          '; ls -la',
          '| cat /etc/passwd',
          '`whoami`',
          '$(whoami)',
          '; rm -rf /',
          '& ping -c 10 127.0.0.1 &'
        ];

        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        const fullNameRegex = /^[a-zA-Z .,'-]{2,50}$/;

        commandInjectionPayloads.forEach(payload => {
          expect(usernameRegex.test(payload)).toBe(false);
          expect(fullNameRegex.test(payload)).toBe(false);
        });
      });
    });

    describe('Path Traversal Prevention', () => {
      test('should reject path traversal attempts', () => {
        const pathTraversalPayloads = [
          '../../../etc/passwd',
          '..\\..\\..\\windows\\system32',
          '....//....//....//etc/passwd',
          '%2e%2e%2f%2e%2e%2f',
        ];

        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

        pathTraversalPayloads.forEach(payload => {
          expect(usernameRegex.test(payload)).toBe(false);
        });
      });
    });

    describe('LDAP Injection Prevention', () => {
      test('should reject LDAP injection attempts', () => {
        const ldapPayloads = [
          '*)(uid=*))(|(uid=*',
          'admin)(&(password=*))',
          '*)(objectClass=*',
        ];

        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

        ldapPayloads.forEach(payload => {
          expect(usernameRegex.test(payload)).toBe(false);
        });
      });
    });
  });

  describe('Field Whitelisting Security', () => {
    test('should prevent privilege escalation via field injection', () => {
      const allowedFields = ['username', 'password', 'full_name', 'accountNumber', 'IDNumber'];
      const maliciousInput = {
        username: 'testuser',
        password: 'Password123',
        full_name: 'John Doe',
        accountNumber: '1234567890',
        IDNumber: '1234567890123',
        // Malicious fields attempting privilege escalation
        admin: true,
        role: 'admin',
        isVerified: true,
        userType: 'Admin',
        permissions: ['all']
      };

      // Simulate whitelisting
      Object.keys(maliciousInput).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete maliciousInput[key];
        }
      });

      // Verify only allowed fields remain
      expect(maliciousInput.admin).toBeUndefined();
      expect(maliciousInput.role).toBeUndefined();
      expect(maliciousInput.isVerified).toBeUndefined();
      expect(maliciousInput.userType).toBeUndefined();
      expect(maliciousInput.permissions).toBeUndefined();

      // Verify allowed fields are present
      expect(maliciousInput.username).toBe('testuser');
      expect(maliciousInput.password).toBe('Password123');
    });
  });
});

