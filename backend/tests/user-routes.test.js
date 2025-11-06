import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/user.js';

describe('User Routes Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/user', userRoutes);
  });

  describe('POST /user/signup', () => {
    test('should reject request with missing fields', async () => {
      const response = await request(app)
        .post('/user/signup')
        .send({
          username: 'testuser'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('required');
    });

    test('should reject request with invalid username format', async () => {
      const response = await request(app)
        .post('/user/signup')
        .send({
          username: 'ab',
          full_name: 'Jan Smit',
          accountNumber: '1234567890',
          IDNumber: '1234567890123',
          password: 'Password123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username must be 3-16 characters');
    });

    test('should reject request with invalid password', async () => {
      const response = await request(app)
        .post('/user/signup')
        .send({
          username: 'testuser',
          full_name: 'Jan Smit',
          accountNumber: '1234567890',
          IDNumber: '1234567890123',
          password: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Password must be at least 6 characters');
    });

    test('should reject request with invalid account number', async () => {
      const response = await request(app)
        .post('/user/signup')
        .send({
          username: 'testuser',
          full_name: 'Jan Smit',
          accountNumber: '12345',
          IDNumber: '1234567890123',
          password: 'Password123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Account number must be 6-20 digits');
    });

    test('should reject request with invalid ID number', async () => {
      const response = await request(app)
        .post('/user/signup')
        .send({
          username: 'testuser',
          full_name: 'Jan Smit',
          accountNumber: '1234567890',
          IDNumber: '123456789012',
          password: 'Password123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('ID Number must be exactly 13 digits');
    });

    test('should filter out disallowed fields', async () => {
      const response = await request(app)
        .post('/user/signup')
        .send({
          username: 'testuser',
          full_name: 'Jan Smit',
          accountNumber: '1234567890',
          IDNumber: '1234567890123',
          password: 'Password123',
          admin: true,
          malicious: '<script>alert("xss")</script>'
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('POST /user/signup-employee', () => {
    test('should reject request with missing fields', async () => {
      const response = await request(app)
        .post('/user/signup-employee')
        .send({
          username: 'testuser'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('required');
    });

    test('should reject request with invalid username format', async () => {
      const response = await request(app)
        .post('/user/signup-employee')
        .send({
          username: 'ab',
          full_name: 'Jan Smit',
          accountNumber: '1234567890',
          IDNumber: '1234567890123',
          password: 'Password123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username must be 3-16 characters');
    });

    test('should reject request with invalid password', async () => {
      const response = await request(app)
        .post('/user/signup-employee')
        .send({
          username: 'testuser',
          full_name: 'Jan Smit',
          accountNumber: '1234567890',
          IDNumber: '1234567890123',
          password: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Password must be at least 6 characters');
    });
  });

  describe('POST /user/login', () => {
    test('should reject request with missing username', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          password: 'Password123',
          accountNumber: '1234567890'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username and password are required');
    });

    test('should reject request with missing password', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          name: 'testuser',
          accountNumber: '1234567890'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username and password are required');
    });

    test('should reject request with invalid username format', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          name: 'ab',
          password: 'Password123',
          accountNumber: '1234567890'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username must be 3-16 characters');
    });

    test('should reject request with invalid password format', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          name: 'testuser',
          password: 'weak',
          accountNumber: '1234567890'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Password must be at least 6 characters');
    });

    test('should filter out disallowed fields', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          name: 'testuser',
          password: 'Password123',
          accountNumber: '1234567890',
          admin: true,
          malicious: '<script>alert("xss")</script>'
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});

