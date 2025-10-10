# Backend Testing Suite

## Overview
This directory contains comprehensive unit and integration tests for the backend API, focusing on security-critical components and middleware functionality.

## Test Structure

### ✅ Completed Tests

#### 1. Encryption Utility Tests (`encryption.test.js`)
- **17 tests** covering encryption/decryption functionality
- **85% statement coverage**, **80% branch coverage**
- Tests include:
  - Basic encryption/decryption operations
  - Input validation and edge cases
  - Security properties (different IVs, no plaintext leakage)
  - Error handling for corrupted data
  - Round-trip data integrity

#### 2. Server Middleware Tests (`server.test.js`)
- **20 tests** covering server middleware and security features
- Tests include:
  - Rate limiting functionality
  - CORS configuration
  - Security headers (X-Frame-Options)
  - JSON parsing
  - Health endpoints
  - Error handling
  - Performance testing

### 🔄 In Progress Tests

#### 3. Authentication Route Tests (`auth.test.js`)
- Integration tests for user registration and login
- Input validation testing
- Security feature verification
- Mock database interactions

#### 4. Payment Route Tests (`payments.test.js`)
- Integration tests for payment submission and retrieval
- Data encryption verification
- Input validation testing
- Security feature verification

## Test Configuration

### Jest Setup
- **ES Modules support** with experimental VM modules
- **Environment variable setup** in `setup.js`
- **Coverage thresholds**: 70% for all metrics
- **Test timeout**: 10 seconds

### Environment Variables
Tests use the following environment variables:
- `ENCRYPTION_KEY`: Test encryption key
- `JWT_SECRET`: Test JWT secret
- `ATLAS_URI`: Test MongoDB connection string

## Running Tests

```bash
# Run all tests
npm test

# Run specific test files
npm test -- tests/encryption.test.js
npm test -- tests/server.test.js

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Test Results Summary

### Current Status
- ✅ **37 tests passing** (17 encryption + 20 server)
- ✅ **Encryption utility**: 85% coverage
- ✅ **Server middleware**: Comprehensive testing
- 🔄 **Route testing**: In progress (mocking issues with ES modules)

### Security Testing Coverage
- ✅ **Data encryption/decryption**
- ✅ **Rate limiting**
- ✅ **CORS configuration**
- ✅ **Security headers**
- ✅ **Input validation**
- ✅ **Error handling**

## DevSecOps Integration

These tests are integrated into the CircleCI pipeline and provide:
- **Automated security testing** for critical components
- **Coverage reporting** to ensure code quality
- **Regression testing** for security features
- **Performance validation** for middleware

## Next Steps

1. Fix ES module mocking for route tests
2. Add database integration tests
3. Add end-to-end API testing
4. Implement security scanning integration
5. Add performance benchmarking tests
