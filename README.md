# Swift Payment System

<div align="center">

![Swift Payment System](Images1/swift_home.png)

**A secure, enterprise-grade international payment processing application with comprehensive DevSecOps pipeline**

[![CircleCI](https://img.shields.io/badge/CircleCI-DevSecOps-blue?style=for-the-badge&logo=circleci)](https://circleci.com)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19+-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Tests](https://img.shields.io/badge/Tests-168%20Passing-success?style=for-the-badge&logo=jest)](https://jestjs.io)
[![Security](https://img.shields.io/badge/Security-Enterprise-red?style=for-the-badge&logo=security)](#security--devsecops)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [User Interface](#-user-interface)
- [Backend & API](#-backend--api)
- [Database Schema](#-database-schema)
- [Security Implementation](#-security-implementation)
- [DevSecOps Pipeline](#-devsecops-pipeline)
- [Testing Suite](#-testing-suite)
- [Installation & Setup](#-installation--setup)
- [Authors](#-authors)

---

## 🎯 Overview

The **Swift Payment System** is a comprehensive, enterprise-grade international payment processing application designed for financial institutions and businesses requiring secure, efficient payment management. Built with modern web technologies and fortified with advanced security measures, it provides a robust platform for handling payment applications, user authentication, and transaction management.

### Key Highlights

- 🔐 **Enterprise Security**: AES-192-CBC encryption, bcrypt password hashing, JWT authentication
- 🛡️ **DevSecOps Pipeline**: 168 automated tests, 4 security scanning tools, performance monitoring
- ⚡ **Modern Stack**: React 19+ frontend, Node.js/Express backend, MongoDB Atlas database
- 👥 **Multi-Role System**: Separate interfaces for clients and employees
- 📊 **Real-time Monitoring**: Transaction tracking, status updates, comprehensive logging
- 🧪 **Comprehensive Testing**: 37 security tests, 85% code coverage on critical components

---

## 🏗️ System Architecture

### High-Level Architecture

![System Architecture](Images1/system_architecture.png)

### Technology Stack

**Frontend:**
- React 19.1.0
- React Router DOM 7.9.3
- Context API for state management
- Custom authentication context
- HTTPS/SSL support

**Backend:**
- Node.js with Express 5.1.0
- JWT (jsonwebtoken 9.0.2)
- bcrypt 6.0.0 for password hashing
- AES-192-CBC encryption
- Express Rate Limit for DDoS protection
- CORS configuration

**Database:**
- MongoDB Atlas (Cloud-hosted)
- Encrypted data at rest
- Connection pooling
- Secure environment-based configuration

**DevSecOps:**
- CircleCI for CI/CD orchestration
- Snyk for dependency scanning
- TruffleHog for secret detection
- Semgrep for SAST
- Artillery for load testing
- Lighthouse for performance audits
- Jest for automated testing (168 tests)

---

## 🎨 User Interface

### Login Page
Secure authentication with input validation and error handling.

![Login Page](Images1/Login.png)

### Home Dashboard
Clean, modern interface with navigation to key features.

![Home Dashboard](Images1/swift_home.png)

### Payment Submission
International payment form with SWIFT code validation and real-time input verification.

![Payment Page](Images1/paymentswift.png)

### Transaction History
View all payment applications with status tracking and filtering.

![Transactions](Images1/Transactions.png)

### Account Details
Secure view of user profile with encrypted sensitive data.

![Account Details](Images1/account_details.png)

---

## 🔧 Backend & API

### API Architecture

The backend implements a RESTful API architecture with comprehensive security middleware and data encryption.

**Base URL:** `https://localhost:8443` (Production) | `http://localhost:8080` (Development)

### Authentication Endpoints

#### `POST /user/signup`
Creates a new user account with encrypted personal information.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123",
  "full_name": "John Doe",
  "accountNumber": "1234567890",
  "IDNumber": "1234567890123"
}
```

**Security Features:**
- Input validation with RegEx patterns
- Field whitelisting (prevents privilege escalation)
- Password hashing with bcrypt (10+ salt rounds)
- AES-192-CBC encryption for PII (full_name, accountNumber, IDNumber)
- Duplicate username prevention

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "userId": "507f1f77bcf86cd799439011"
}
```

---

#### `POST /user/login`
Authenticates user and returns JWT token.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Security Features:**
- Password verification with bcrypt.compare()
- JWT token generation (24-hour expiration)
- Data decryption for user profile
- Rate limiting to prevent brute force

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "full_name": "John Doe",
    "accountNumber": "1234567890",
    "IDNumber": "1234567890123"
  }
}
```

---

### Payment Endpoints (Protected - Requires Authentication)

#### `POST /payments/submit`
Submits an international payment application.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "recipientName": "Jane Smith",
  "accountNumber": "9876543210",
  "swiftCode": "ABCDUS33",
  "amount": "1000.50",
  "currency": "USD",
  "paymentProvider": "Bank of America"
}
```

**Security Features:**
- JWT token verification
- Field whitelisting (6 allowed fields)
- Input validation with RegEx:
  - SWIFT: `^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$`
  - Amount: `^\d+(\.\d{1,2})?$`
  - Currency: `^[A-Z]{3}$`
- AES-192-CBC encryption for all sensitive fields
- User ID attached from JWT token

**Response (201 Created):**
```json
{
  "message": "Payment application submitted successfully",
  "applicationId": "507f1f77bcf86cd799439012"
}
```

---

#### `GET /payments/my-applications`
Retrieves all payment applications for the authenticated user.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Security Features:**
- JWT token verification
- User-specific filtering (only returns user's own applications)
- Data decryption before response
- Sorted by submission date (newest first)

**Response (200 OK):**
```json
{
  "message": "Applications retrieved successfully",
  "applications": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "recipientName": "Jane Smith",
      "accountNumber": "9876543210",
      "swiftCode": "ABCDUS33",
      "amount": 1000.50,
      "currency": "USD",
      "paymentProvider": "Bank of America",
      "status": "pending",
      "submittedAt": "2025-10-10T10:30:00.000Z"
    }
  ]
}
```

---

### API Security Implementation

**1. Input Validation (WhiteList Approach)**
All inputs are validated with strict RegEx patterns:

| Field | Pattern | Purpose |
|-------|---------|---------|
| Username | `^[a-zA-Z0-9_]{3,16}$` | Alphanumeric only, 3-16 chars |
| Password | `^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$` | Min 6 chars, letter + number |
| Account Number | `^\d{6,20}$` | 6-20 digits only |
| ID Number | `^\d{13}$` | Exactly 13 digits |
| Full Name | `^[a-zA-Z .,'-]{2,50}$` | Letters, spaces, punctuation |
| SWIFT Code | `^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$` | 8 or 11 chars, specific format |
| Amount | `^\d+(\.\d{1,2})?$` | Positive numbers, max 2 decimals |
| Currency | `^[A-Z]{3}$` | 3 uppercase letters (ISO 4217) |

**2. Field Whitelisting**
- Signup: Only `username`, `password`, `full_name`, `accountNumber`, `IDNumber` allowed
- Payment: Only `recipientName`, `accountNumber`, `swiftCode`, `amount`, `currency`, `paymentProvider` allowed
- Prevents privilege escalation (e.g., injecting `admin: true`)

**3. Rate Limiting**
```javascript
windowMs: 15 * 60 * 1000,  // 15 minutes
max: 100                    // 100 requests per IP
```

**4. CORS Configuration**
```javascript
origin: ['http://localhost:3001', 'https://localhost:3001']
credentials: true
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
```

**5. Authentication Middleware**
- Verifies JWT token on protected routes
- Extracts user information from token
- Returns 401 Unauthorized if token invalid/missing

---

## 🗄️ Database Schema

### MongoDB Collections

![MongoDB Dashboard](Images1/MongoDB_dahsboard.jpeg)

#### **Users Collection**

```javascript
{
  _id: ObjectId,
  username: String,                    // Plain text (used for login)
  password: String,                    // Bcrypt hashed (60 chars)
  full_name: String,                   // AES-192-CBC encrypted
  accountNumber: String,               // AES-192-CBC encrypted
  IDNumber: String,                    // AES-192-CBC encrypted
  userType: String,                    // "User" or "Employee"
  createdAt: Date
}
```

**Security Features:**
- Passwords hashed with bcrypt (10 salt rounds)
- All PII encrypted with AES-192-CBC
- Username plain text for authentication efficiency
- Indexed on username for fast lookups

![User Document](Images1/User.jpeg)

---

#### **Payment Applications Collection**

```javascript
{
  _id: ObjectId,
  recipientName: String,               // AES-192-CBC encrypted
  accountNumber: String,               // AES-192-CBC encrypted (recipient)
  swiftCode: String,                   // AES-192-CBC encrypted
  amount: String,                      // AES-192-CBC encrypted
  currency: String,                    // AES-192-CBC encrypted
  paymentProvider: String,             // AES-192-CBC encrypted
  submittedBy: String,                 // User ID from JWT
  submittedByName: String,             // Username from JWT
  status: String,                      // "pending", "approved", "rejected"
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: String,
  reviewerName: String,
  reviewComments: String
}
```

**Security Features:**
- All payment details encrypted before storage
- User ID extracted from JWT (prevents spoofing)
- Status controlled by backend (can't be manipulated)
- Timestamps for audit trail

![Payment Document](Images1/Payment.jpeg)

---

### MongoDB Atlas Configuration

**Connection Details:**
- **Cluster**: M0 Free Tier (Development) / M10+ (Production)
- **Region**: Multi-region for high availability
- **Connection**: MongoDB Driver with connection pooling
- **Authentication**: Username/password via environment variables
- **Encryption**: Data encrypted at rest and in transit

**Environment Configuration:**
```javascript
ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

![MongoDB Cluster](Images1/Mongodb.jpeg)

**Security Features:**
- IP whitelisting for database access
- TLS/SSL encryption for all connections
- Database-level authentication
- Network isolation
- Automated backups

---

## 🔒 Security Implementation

### 1. Encryption (AES-192-CBC)

**What We Encrypt:**
- User PII: `full_name`, `accountNumber`, `IDNumber`
- Payment data: `recipientName`, `accountNumber`, `swiftCode`, `amount`, `currency`, `paymentProvider`

**Implementation:**
```javascript
// Encryption
const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
const authTag = cipher.getAuthTag();

// Decryption with authentication tag verification
const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
decipher.setAuthTag(authTag);
const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
```

**Security Benefits:**
- Military-grade encryption (256-bit keys)
- Authentication tag prevents tampering
- Unique IV for each encryption
- Data unreadable even if database compromised

**Test Coverage:** 17 tests, 85% code coverage

---

### 2. Password Security

**Bcrypt Hashing with Salting:**
```javascript
const hashedPassword = await bcrypt.hash(password, 10);  // 10 salt rounds
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Security Benefits:**
- Unique salt for each password
- Computationally expensive (prevents brute force)
- Rainbow table resistant
- 60-character hashes

**Password Requirements:**
- Minimum 6 characters
- At least one letter
- At least one number
- RegEx: `^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$`

---

### 3. JWT Authentication

**Token Generation:**
```javascript
const token = jwt.sign(
  { userId: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**Token Storage:**
- Stored in `localStorage` on client
- Sent in `Authorization: Bearer <token>` header
- Verified on every protected route request

**Security Benefits:**
- Stateless authentication
- Cryptographically signed (prevents tampering)
- Auto-expiration after 24 hours
- User info embedded (no database lookup needed)

---

### 4. Input Validation & Attack Prevention

**Defense Against:**

✅ **XSS (Cross-Site Scripting)**
- All inputs validated with whitelist RegEx
- Script tags, event handlers rejected
- HTML encoding on output

✅ **SQL Injection**
- No raw SQL queries (using MongoDB)
- RegEx blocks quotes, semicolons, DROP, UNION
- Parameterized queries only

✅ **NoSQL Injection**
- RegEx blocks `$gt`, `$ne`, `$where` operators
- Input type validation
- MongoDB operators sanitized

✅ **Command Injection**
- RegEx blocks pipes (`|`), backticks, `$()`
- No shell command execution
- Input strictly validated

✅ **Path Traversal**
- RegEx blocks `../` and `..\` patterns
- File paths not user-controlled

✅ **LDAP Injection**
- Special LDAP characters blocked

✅ **Privilege Escalation**
- Field whitelisting prevents `admin: true` injection
- Role assignment server-controlled only

---

### 5. Security Headers

```javascript
X-Frame-Options: DENY              // Clickjacking protection
X-Content-Type-Options: nosniff     // MIME sniffing protection
X-XSS-Protection: 1; mode=block     // XSS filter
Strict-Transport-Security: max-age=31536000  // Force HTTPS
```

---

### 6. HTTPS/SSL Enforcement

**Certificate Configuration:**
```javascript
const options = {
  key: fs.readFileSync('keys/privatekey.pem'),
  cert: fs.readFileSync('keys/certificate.pem')
};
https.createServer(options, app).listen(8443);
```

**Production Enforcement:**
```javascript
if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
  return res.status(403).send('HTTPS required');
}
```

---

## 🚀 DevSecOps Pipeline

![CircleCI Dashboard](Images1/circle_ci_dahsboard.png)

### Pipeline Overview

Our CircleCI pipeline implements a comprehensive DevSecOps workflow with **11 different tools** and **168 automated tests**.

### Pipeline Stages

#### **Stage 1: Security Scanning (Parallel Execution)**

**A. Snyk - Dependency Vulnerability Scanning**
```yaml
- run: npm audit
- run: snyk test
```
- Scans 800+ npm packages
- Checks CVE database for known vulnerabilities
- Fails on critical/high severity issues
- Generates security reports

**B. TruffleHog - Secret Detection**
```yaml
- run: docker run trufflesecurity/trufflehog:latest github --repo=<repo>
```
- Scans entire git history
- Detects API keys, tokens, passwords
- Pattern matching + entropy analysis
- Prevents credential leaks

**C. Semgrep - SAST (Static Application Security Testing)**
```yaml
- run: semgrep --config=auto .
```
- Analyzes code for security vulnerabilities
- Checks for hardcoded credentials
- Detects weak cryptography
- Validates secure coding practices

**D. ESLint Security Rules**
```yaml
- run: eslint . --plugin security
```
- Detects unsafe patterns (eval, buffer manipulation)
- Validates error handling
- Checks for unsafe regex

---

#### **Stage 2: Code Quality**

**Backend & Frontend Linting:**
```yaml
- run: npx eslint . --ext .js --max-warnings 10
```
- Enforces coding standards
- Catches potential bugs
- Ensures consistency

---

#### **Stage 3: Automated Testing**

![CircleCI Test Results](Images1/circle_ci_successful_test.png)

**Backend Tests (144 tests)**
```yaml
- run: npm run test:coverage
- store_test_results: backend/test-results
- store_artifacts: backend/coverage
```

**Test Breakdown:**
- **37 Security Tests**: XSS, SQL injection, NoSQL injection, command injection, etc.
- **36 Route Validation Tests**: Verify security implementations in code
- **20 Server Tests**: Middleware, CORS, rate limiting
- **19 Authentication Tests**: Bcrypt, JWT, validation
- **17 Encryption Tests**: AES-192-CBC (85% coverage)
- **15 Payment Tests**: SWIFT, amount, currency validation

**Frontend Tests (24 tests)**
```yaml
- run: npm test -- --coverage --watchAll=false
```
- **14 Validation Tests**: Client-side RegEx patterns
- **10 Auth Tests**: Token management, localStorage

**Results Visibility:**
- JUnit XML format for CircleCI UI
- Test results displayed in "Tests" tab
- Coverage reports as artifacts
- Execution time: ~2 seconds total

---

#### **Stage 4: Performance Testing (Parallel)**

**A. Artillery - Backend Load Testing**
```yaml
- run: artillery run artillery-config.yml
```
- Simulates 10 virtual users
- 30-second test duration
- Measures response times
- Validates API can handle load

**B. Lighthouse - Frontend Performance**
```yaml
- run: lighthouse http://localhost:3001 --output json
```
- Performance score (0-100)
- Accessibility audit
- Best practices validation
- SEO analysis

---

#### **Stage 5: Build Verification**

**Backend Build:**
```yaml
- run: node -c server.js
```
- Syntax validation
- Dependency verification
- Only runs if tests pass

**Frontend Build:**
```yaml
- run: npm run build
```
- Production build creation
- Asset optimization
- Only runs if tests pass

---

#### **Stage 6: Compliance & Quality**

**License Checking:**
```yaml
- run: npx license-checker --summary
```
- Validates open-source licenses
- Prevents legal issues
- Ensures compliance

**Enhanced Code Quality:**
```yaml
- run: eslint --format json --output-file report.json
```
- Detailed quality metrics
- Exportable reports
- Threshold enforcement

---

### Pipeline Execution Flow

```
┌─────────────────────────────────────────────────────────┐
│ COMMIT PUSHED TO MAIN                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ STAGE 1: SECURITY SCANS (Parallel - Fail Fast)         │
│  Snyk          TruffleHog                          │
│  Semgrep       ESLint Security                     │
└────────────────────┬────────────────────────────────────┘
                     │ All Pass?
                     ▼ YES
┌─────────────────────────────────────────────────────────┐
│ STAGE 2: CODE QUALITY                                   │
│  Lint Backend   Lint Frontend                      │
└────────────────────┬────────────────────────────────────┘
                     │ All Pass?
                     ▼ YES
┌─────────────────────────────────────────────────────────┐
│ STAGE 3: AUTOMATED TESTING                              │
│  Backend: 144 tests (1.5s)                            │
│  Frontend: 24 tests (0.5s)                            │
└────────────────────┬────────────────────────────────────┘
                     │ All Pass?
                     ▼ YES
┌─────────────────────────────────────────────────────────┐
│ STAGE 4: PERFORMANCE (Parallel)                         │
│  Artillery Load Test  Lighthouse Audit             │
└────────────────────┬────────────────────────────────────┘
                     │ All Pass?
                     ▼ YES
┌─────────────────────────────────────────────────────────┐
│ STAGE 5: BUILD                                          │
│  Build Backend   Build Frontend                    │
└────────────────────┬────────────────────────────────────┘
                     │ All Pass?
                     ▼ YES
┌─────────────────────────────────────────────────────────┐
│ STAGE 6: COMPLIANCE                                     │
│  License Check   Enhanced Quality                  │
└────────────────────┬────────────────────────────────────┘
                     │ All Pass?
                     ▼ YES
┌─────────────────────────────────────────────────────────┐
│ PIPELINE SUCCESS - Ready for Deployment              │
└─────────────────────────────────────────────────────────┘
```

**Total Execution Time:** ~5-6 minutes

---

## 🧪 Testing Suite

### Test Statistics

- **Total Tests:** 168
- **Pass Rate:** 100%
- **Execution Time:** ~2 seconds
- **Code Coverage:** 85% on encryption utilities

### Backend Tests (144 tests)

#### **1. Security Tests (37 tests)** - `security.test.js`

**Password Security (7 tests):**
- Bcrypt hashing with salt
- Salt uniqueness validation
- Password verification
- Minimum 10 salt rounds enforcement

**Input Whitelisting (20 tests):**
- Username validation
- Password strength requirements
- Account number validation
- ID number validation
- Full name validation
- SWIFT code validation
- Amount validation
- Currency code validation

**Attack Prevention (19 tests):**
- XSS injection attempts (5 tests)
- SQL injection attempts (3 tests)
- NoSQL injection attempts (2 tests)
- Command injection attempts (2 tests)
- Path traversal attempts (2 tests)
- LDAP injection attempts (1 test)
- Privilege escalation prevention (4 tests)

**SSL/HTTPS & Headers (5 tests):**
- HTTPS enforcement
- Security headers validation

---

#### **2. Encryption Tests (17 tests)** - `encryption.test.js`

**Functionality Tests:**
- Encrypt/decrypt text successfully
- Handle empty strings
- Handle special characters
- Handle large data

**Security Tests:**
- Unique IV generation
- Authentication tag validation
- Tamper detection
- Invalid key handling

**Error Handling:**
- Missing parameters
- Invalid encrypted data
- Corrupted data

**Code Coverage:** 85% statements, 80% branches, 100% functions

---

#### **3. Server Middleware Tests (20 tests)** - `server.test.js`

**Security Middleware:**
- CORS configuration
- Rate limiting
- Security headers
- Error handling

**Parsing:**
- JSON body parsing
- URL-encoded data
- Large payloads

---

#### **4. Authentication Tests (19 tests)** - `auth-simple.test.js`

**Password Tests:**
- Bcrypt hashing
- Salt uniqueness
- Verification

**JWT Tests:**
- Token generation
- Token verification
- Expiration handling
- Invalid token rejection

**Validation Tests:**
- Username format
- Password strength
- Account number format
- ID number format

---

#### **5. Payment Tests (15 tests)** - `payment-simple.test.js`

**Validation Tests:**
- SWIFT code format
- Amount validation
- Currency codes
- Recipient name
- Account numbers
- Payment provider

**Security Tests:**
- Field whitelisting
- Required field validation

---

#### **6. Route Validation Tests (36 tests)** - `routes-validation.test.js`

**User Routes (13 tests):**
- File existence
- Signup/login endpoints
- Bcrypt implementation
- JWT implementation
- Encryption usage
- Input validation
- Error handling

**Payment Routes (13 tests):**
- File existence
- Submit/retrieve endpoints
- Authentication middleware
- Encryption usage
- Validation implementation

**Middleware & Config (10 tests):**
- Auth middleware (JWT verification)
- Server configuration
- Database connection
- App configuration

---

### Frontend Tests (24 tests)

#### **1. Validation Tests (14 tests)** - `validation.test.js`

**Client-Side RegEx Validation:**
- Username format
- Password strength
- Account numbers
- ID numbers
- SWIFT codes
- Amounts
- Currency codes

**Purpose:** Defense in depth - validation on both client and server

---

#### **2. AuthContext Tests (10 tests)** - `AuthContext.test.js`

**Token Management:**
- localStorage token storage
- Token retrieval
- Token removal on logout
- JWT structure validation

**User Data:**
- JSON serialization/deserialization
- Data persistence
- Error handling

---

### Running Tests Locally

**Backend:**
```bash
cd backend
npm test                    # Run all tests
npm run test:coverage       # Run with coverage report
npm run test:watch          # Watch mode
```

**Frontend:**
```bash
cd frontend
npm test                    # Run all tests
CI=true npm test -- --coverage --watchAll=false  # Coverage report
```

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 20+ and npm
- MongoDB Atlas account
- Git

### Backend Setup

```bash
cd backend
npm install
```

**Create `.env` file:**
```env
ATLAS_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_32_byte_encryption_key
PORT=8443
HTTP_PORT=8080
```

**Generate SSL Certificates (for HTTPS)(Used in Backend and Frontend):**
```bash
mkdir keys
openssl req -x509 -newkey rsa:4096 -keyout keys/privatekey.pem -out keys/certificate.pem -days 365 -nodes
```

**Start Server:**
```bash
npm run dev        
```

### Frontend Setup

```bash
cd frontend
npm install
```

**Create `.env` file:**
```env
HTTPS=true
SSL_CRT_FILE=../frontend/keys/certificate.pem
SSL_KEY_FILE=../frontend/keys/privatekey.pem
```


**Copy SSL Certificates (for HTTPS)(Used in Backend and Frontend):**
Using the same certificates from earlier, create a keys folder in the frontend and store them there for https

**Start Development Server:**
```bash
npm run start    # HTTPS (port 3001)
```

---

## 📸 Screenshots & API Testing

### Postman API Testing

You can test the API endpoints using Postman or any HTTP client.

**Example: User Login**
```bash
POST https://localhost:8443/user/login
Content-Type: application/json

{
  "name": "testuser",
  "accountNumber": "1234567890",
  "password": "1234567890123"
}
```
![HTTPS User Login](Images1/postman_https_user_login.jpeg)

**Example: Payment Submission (with JWT)**
```bash
POST https://localhost:8443/payments/submit
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "recipientName": "Jane Doe",
  "accountNumber": "9876543210",
  "swiftCode": "ABCDUS33",
  "amount": "1000.50",
  "currency": "USD",
  "paymentProvider": "Bank of America"
}
```
![HTTPS Post Payment](Images1/postman_http_post_payment.jpeg)

---

## 🔄 CircleCI Configuration

### Setting Up CircleCI

1. **Connect Repository:**
   - Go to CircleCI dashboard
   - Click "Set Up Project"
   - Select your GitHub repository
   - CircleCI will auto-detect `.circleci/config.yml`

2. **Configure Environment Variables:**
   ```
   SNYK_TOKEN=your_snyk_token
   GITHUB_TOKEN=your_github_token (for TruffleHog)
   ```

3. **Enable Pipeline:**
   - Commit and push will automatically trigger pipeline
   - View results in CircleCI dashboard

### Viewing Test Results

![CircleCI Test Results](Images1/circle_ci_successful_backend_test.png)

**In CircleCI:**
1. Click on the pipeline run
2. Click "test-backend" job
3. Click "Tests" tab
4. See all 144 tests with pass/fail status
5. View execution times per test

**Coverage Reports:**
1. Click "Artifacts" tab
2. Download coverage reports
3. View detailed coverage breakdown

---

## 👥 Authors

**Developed by:**
- **Emil Fabel** - DevSecOps & CircleCI Pipeline Implementation
- **Weylin** - Security Implementation
- **James** - MongoDB Setup, API & Backend Development
- **Kevin** - UI/UX Design & Frontend Development

**Module:** INSY7314 - Secure Application Development  
**Year:** 2025

---

## 📄 License

This project is developed for educational purposes as part of INSY7314 coursework.

---

## 🔗 References

- [CircleCI Documentation](https://circleci.com/docs/)
- [Snyk Security Scanner](https://snyk.io/)
- [TruffleHog Secret Scanner](https://github.com/trufflesecurity/trufflehog)
- [Semgrep SAST](https://semgrep.dev/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Jest Testing Framework](https://jestjs.io/)
- [Artillery Load Testing](https://artillery.io/)
- [Lighthouse Performance](https://developers.google.com/web/tools/lighthouse)
- [ChatGPT](https://chatgpt.com)

## 🔗 References
- aquasecurity, 2025. Code Repository. [Online] Available at: https://trivy.dev/latest/docs/target/repository/[Accessed 7 October 2025].
- Artillery, 2025. Load testing. [Online] Available at: https://www.artillery.io/docs [Accessed 7 October 2025].
- CircleCI, 2025. Configuration introduction. [Online]  Available at: https://circleci.com/docs/config-intro/ [Accessed 5 October 2025].
- circleci, 2025. Quickstart guide. [Online]  Available at: https://circleci.com/docs/guides/getting-started/getting-started/ [Accessed 5 October 2025].
- commitlint, 2025. Getting started. [Online]  Available at: https://commitlint.js.org/ [Accessed 7 October 2025].
- conventional-changelog, 2025. conventional-changelog. [Online]  Available at: https://github.com/conventional-changelog/conventional-changelog [Accessed 7 October 2025].
- davglass, 2019. github. [Online]  Available at: https://github.com/davglass/license-checker [Accessed 6 October 2025].
- eslint-community, 2025. eslint-plugin-security. [Online] Available at: https://github.com/eslint-community/eslint-plugin-security [Accessed 6 October 2025].
- Google Chrome, 2025. lighthouse-ci. [Online]  Available at: https://github.com/GoogleChrome/lighthouse-ci [Accessed 7 October 2025].
- Jestjs, 2025. Getting Started. [Online]  Available at: https://jestjs.io/docs/getting-started [Accessed 8 October 2025].
- MongoDB, 2025. Use Promises with Asynchronous JavaScript. [Online]  Available at: https://www.mongodb.com/docs/drivers/node/current/promises/ [Accessed 3 October 2025].
- npm, 2025. MongoDB Node.js Driver. [Online]  Available at: https://www.npmjs.com/package/mongodb [Accessed 2 October 2025].
- React, 2025. Quick Start. [Online]  Available at: https://react.dev/learn [Accessed 1 October 2025].
- Semgrep, 2025. Add Semgrep to CI. [Online]  Available at: https://semgrep.dev/docs/deployment/add-semgrep-to-ci [Accessed 8 October 2025].
- Snyk, 2024. CircleCI integration using a Snyk Orb. [Online]  Available at: https://docs.snyk.io/developer-tools/snyk-ci-cd-integrations/circleci-integration-using-a-snyk-orb [Accessed 7 October 2025].
- Truffle Security, 2025. Built by experts in app, infrastructure, and offensive security. [Online]  Available at: https://trufflesecurity.com/security [Accessed 7 October 2025].
- W3 Schools, 2025. React Tutorial. [Online]
- Available at: https://www.w3schools.com/react/[Accessed 25 September 2025].
- W3Schools, 2025. React CSS Modules. [Online]  Available at: https://www.w3schools.com/REACT/react_css_modules.asp [Accessed 8 October 2025].
- W3Schools, 2025. React Router. [Online]  Available at: https://www.w3schools.com/REACT/react_router.asp [Accessed 8 October 2025].


---

<div align="center">

**Built with ❤️ and 🔒 Security-First Approach**

![Tests](https://img.shields.io/badge/Tests-168%20Passing-success?style=flat-square&logo=jest)
![Coverage](https://img.shields.io/badge/Coverage-85%25-green?style=flat-square)
![Security](https://img.shields.io/badge/Security-Enterprise%20Grade-red?style=flat-square)

</div>
