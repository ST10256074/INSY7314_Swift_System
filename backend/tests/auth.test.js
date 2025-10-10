import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock the database connection
jest.mock('../db/conn.js', () => ({
  default: {
    collection: jest.fn(() => ({
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn()
    }))
  }
}));

// Mock encryption utilities
jest.mock('../utils/encryption.js', () => ({
  encrypt: jest.fn((text) => Promise.resolve(`encrypted_${text}`)),
  decrypt: jest.fn((text) => Promise.resolve(text.replace('encrypted_', '')))
}));

// Import after mocking
import db from '../db/conn.js';
import { encrypt, decrypt } from '../utils/encryption.js';

// Create a test app
const app = express();
app.use(express.json());

// Mock user routes for testing
const mockUserRoutes = express.Router();

// Mock signup endpoint
mockUserRoutes.post('/signup', async (req, res) => {
  try {
    // Input validation
    const allowedFields = ["username", "full_name", "accountNumber", "IDNumber", "password"];
    Object.keys(req.body).forEach(key => {
      if (!allowedFields.includes(key)) {
        delete req.body[key];
      }
    });

    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    const fullNameRegex = /^[a-zA-Z .,'-]{2,50}$/;
    const accountNumberRegex = /^\d{6,20}$/;
    const idNumberRegex = /^\d{13}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    const { username, full_name, accountNumber, IDNumber, password } = req.body;

    if (!username || !full_name || !accountNumber || !IDNumber || !password) {
      return res.status(400).send('All fields (username, full name, account number, ID number, password) are required');
    }

    if (!usernameRegex.test(username)) {
      return res.status(400).send('Username must be 3-16 characters and contain only letters, numbers, or underscores');
    }
    if (!fullNameRegex.test(full_name)) {
      return res.status(400).send('Full name contains invalid characters');
    }
    if (!accountNumberRegex.test(accountNumber)) {
      return res.status(400).send('Account number must be 6-20 digits');
    }
    if (!idNumberRegex.test(IDNumber)) {
      return res.status(400).send('ID number must be exactly 13 digits');
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).send('Password must be at least 6 characters with at least one letter and one number');
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Encrypt sensitive data
    const encryptedFullName = await encrypt(full_name);
    const encryptedAccountNumber = await encrypt(accountNumber);
    const encryptedIDNumber = await encrypt(IDNumber);

    // Create user
    const user = {
      username,
      full_name: encryptedFullName,
      accountNumber: encryptedAccountNumber,
      IDNumber: encryptedIDNumber,
      password: hashedPassword,
      userType: 'User',
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(user);
    
    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertedId
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('Internal server error');
  }
});

// Mock login endpoint
mockUserRoutes.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    // Find user
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, userType: user.userType },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal server error');
  }
});

app.use('/user', mockUserRoutes);

describe('Authentication Routes Tests', () => {
  let mockCollection;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock collection
    mockCollection = {
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn()
    };
    
    db.collection.mockReturnValue(mockCollection);
    
    // Set test environment
    process.env.JWT_SECRET = 'test_jwt_secret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('POST /user/signup', () => {
    test('should create user with valid data', async () => {
      const userData = {
        username: 'testuser',
        full_name: 'John Doe',
        accountNumber: '1234567890',
        IDNumber: '1234567890123',
        password: 'Password123'
      };

      mockCollection.findOne.mockResolvedValue(null); // User doesn't exist
      mockCollection.insertOne.mockResolvedValue({ insertedId: '507f1f77bcf86cd799439011' });

      const response = await request(app)
        .post('/user/signup')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.userId).toBe('507f1f77bcf86cd799439011');
      expect(encrypt).toHaveBeenCalledTimes(3); // full_name, accountNumber, IDNumber
    });

    test('should reject signup with missing fields', async () => {
      const userData = {
        username: 'testuser',
        full_name: 'John Doe'
        // Missing accountNumber, IDNumber, password
      };

      const response = await request(app)
        .post('/user/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.text).toContain('All fields are required');
    });

    test('should reject signup with invalid username', async () => {
      const userData = {
        username: 'ab', // Too short
        full_name: 'John Doe',
        accountNumber: '1234567890',
        IDNumber: '1234567890123',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/user/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username must be 3-16 characters');
    });

    test('should reject signup with invalid password', async () => {
      const userData = {
        username: 'testuser',
        full_name: 'John Doe',
        accountNumber: '1234567890',
        IDNumber: '1234567890123',
        password: 'weak' // Too weak
      };

      const response = await request(app)
        .post('/user/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.text).toContain('Password must be at least 6 characters');
    });

    test('should reject signup with existing username', async () => {
      const userData = {
        username: 'existinguser',
        full_name: 'John Doe',
        accountNumber: '1234567890',
        IDNumber: '1234567890123',
        password: 'Password123'
      };

      mockCollection.findOne.mockResolvedValue({ username: 'existinguser' }); // User exists

      const response = await request(app)
        .post('/user/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username already exists');
    });

    test('should filter out disallowed fields', async () => {
      const userData = {
        username: 'testuser',
        full_name: 'John Doe',
        accountNumber: '1234567890',
        IDNumber: '1234567890123',
        password: 'Password123',
        maliciousField: 'should be removed',
        admin: true // Should be filtered out
      };

      mockCollection.findOne.mockResolvedValue(null);
      mockCollection.insertOne.mockResolvedValue({ insertedId: '507f1f77bcf86cd799439011' });

      const response = await request(app)
        .post('/user/signup')
        .send(userData);

      expect(response.status).toBe(201);
      expect(mockCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testuser',
          full_name: 'encrypted_John Doe',
          accountNumber: 'encrypted_1234567890',
          IDNumber: 'encrypted_1234567890123'
        })
      );
    });
  });

  describe('POST /user/login', () => {
    test('should login with valid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'Password123'
      };

      const hashedPassword = await bcrypt.hash('Password123', 10);
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        password: hashedPassword,
        userType: 'User'
      };

      mockCollection.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/user/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe('testuser');
    });

    test('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({ username: 'testuser' }); // Missing password

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username and password are required');
    });

    test('should reject login with invalid username', async () => {
      const loginData = {
        username: 'nonexistent',
        password: 'Password123'
      };

      mockCollection.findOne.mockResolvedValue(null); // User not found

      const response = await request(app)
        .post('/user/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.text).toContain('Invalid credentials');
    });

    test('should reject login with invalid password', async () => {
      const loginData = {
        username: 'testuser',
        password: 'WrongPassword'
      };

      const hashedPassword = await bcrypt.hash('Password123', 10);
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        password: hashedPassword,
        userType: 'User'
      };

      mockCollection.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/user/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.text).toContain('Invalid credentials');
    });
  });

  describe('Input Validation', () => {
    test('should validate account number format', async () => {
      const userData = {
        username: 'testuser',
        full_name: 'John Doe',
        accountNumber: '123', // Too short
        IDNumber: '1234567890123',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/user/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.text).toContain('Account number must be 6-20 digits');
    });

    test('should validate ID number format', async () => {
      const userData = {
        username: 'testuser',
        full_name: 'John Doe',
        accountNumber: '1234567890',
        IDNumber: '123456789', // Too short
        password: 'Password123'
      };

      const response = await request(app)
        .post('/user/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.text).toContain('ID number must be exactly 13 digits');
    });

    test('should validate full name format', async () => {
      const userData = {
        username: 'testuser',
        full_name: 'John123Doe', // Contains numbers
        accountNumber: '1234567890',
        IDNumber: '1234567890123',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/user/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.text).toContain('Full name contains invalid characters');
    });
  });
});
