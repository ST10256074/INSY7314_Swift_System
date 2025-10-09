# Swift Payment System

<div align="center">

![Swift Payment System](Images1/swift_home.png)

**A secure, enterprise-grade payment processing application with comprehensive DevSecOps pipeline**

[![CircleCI](https://img.shields.io/badge/CircleCI-DevSecOps-blue?style=for-the-badge&logo=circleci)](https://circleci.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Security](https://img.shields.io/badge/Security-Enterprise-red?style=for-the-badge&logo=security)](SECURITY.md)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Security & DevSecOps](#security--devsecops)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The **Swift Payment System** is a comprehensive, enterprise-grade payment processing application designed for financial institutions and businesses requiring secure, efficient payment management. Built with modern web technologies and fortified with advanced security measures, it provides a robust platform for handling payment applications, user authentication, and transaction management.

### Key Highlights

- **🔐 Enterprise Security**: JWT authentication, role-based access control, and comprehensive security scanning
- **⚡ Modern Stack**: React 18+ frontend, Node.js/Express backend, MongoDB database
- **🛡️ DevSecOps Pipeline**: Automated security scanning, code quality checks, and continuous integration
- **👥 Multi-Role System**: Separate interfaces for clients and employees with distinct permissions
- **📊 Real-time Monitoring**: Transaction tracking, status updates, and comprehensive logging

![Application Overview](Images1/swift_home.png)

## ✨ Features

### 🔑 Authentication & Authorization
- **Secure Login System**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Separate user types (Client/Employee) with appropriate permissions
- **Session Management**: Secure token storage and automatic session handling
- **Logout Confirmation**: User-friendly logout process with confirmation modal

![Authentication Flow](Images1/Login.png)

### 💳 Payment Processing
- **Payment Applications**: Comprehensive form for submitting payment requests
- **Multi-Currency Support**: Support for various currencies and payment providers
- **SWIFT Integration**: International payment processing with SWIFT codes
- **Status Tracking**: Real-time payment status updates (Pending/Approved/Rejected)

![Payment Interface](Images1/paymentswift.png)

### 📊 Transaction Management
- **Transaction History**: Complete transaction history for authenticated users
- **Filtering & Search**: Advanced filtering by status, date, and amount
- **Real-time Updates**: Live status updates and transaction notifications
- **Export Capabilities**: Transaction data export for reporting

![Transaction Dashboard](Images1/Transactions.png)

### 🛡️ Security Features
- **Input Validation**: Comprehensive server-side and client-side validation
- **SQL Injection Prevention**: Parameterized queries and input sanitization
- **XSS Protection**: Content Security Policy and input encoding
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Rate Limiting**: Protection against brute force attacks

## 🏗️ Architecture

### System Architecture

![System Architecture Diagram](Images1/paymentswift.png)

The Swift Payment System follows a comprehensive security-focused architecture with distinct layers:

**Client Side (Blue):** User interface for payment transactions, authentication, and transaction management.

**Employee Side (Orange):** Administrative interface for transaction approval, user management, and system oversight.

**Database Layer (Green):** Secure data storage with encryption, hashed passwords, parameterized queries, and input sanitization.

**SWIFT Layer (Red):** International payment processing with encryption, authentication, access control, and validation.

**Security Considerations:** The system addresses multiple attack vectors including SQL injection, DDoS, session jacking, clickjacking, and man-in-the-middle attacks through comprehensive security measures across all layers.

### Security Framework Implementation

The Swift Payment System implements a multi-layered security framework based on industry best practices:

#### **Authentication & Authorization Layer**
- **JWT Token Management**: Secure token generation, validation, and expiration
- **Role-Based Access Control**: Separate permissions for clients and employees
- **Password Security**: bcrypt hashing with salt rounds for secure password storage
- **Session Management**: Automatic token refresh and secure logout procedures

#### **Data Protection Layer**
- **Encryption at Rest**: AES-192-CBC encryption for sensitive payment data
- **Encryption in Transit**: HTTPS/TLS for all communications
- **Key Management**: Secure key derivation using scrypt algorithm
- **Data Sanitization**: Input validation and sanitization across all endpoints

#### **Network Security Layer**
- **CORS Protection**: Configured cross-origin resource sharing policies
- **Rate Limiting**: Protection against brute force and DDoS attacks
- **Security Headers**: Helmet.js implementation for comprehensive header protection
- **Input Validation**: Express-validator for preventing injection attacks

#### **Database Security Layer**
- **NoSQL Injection Prevention**: Parameterized queries and input sanitization
- **Connection Security**: Encrypted connections to MongoDB Atlas
- **Access Control**: Database-level authentication and authorization
- **Audit Logging**: Comprehensive logging of all database operations

### Technology Stack

| Component | Technology | Version | Security Features |
|-----------|------------|---------|-------------------|
| **Frontend** | React | 18+ | XSS protection, CSRF tokens, Content Security Policy |
| **Backend** | Node.js | 18+ | Secure runtime environment, memory protection |
| **Framework** | Express.js | 5+ | Helmet.js security headers, rate limiting |
| **Database** | MongoDB Atlas | 6+ | Encryption at rest, network isolation, authentication |
| **Authentication** | JWT + bcrypt | 9+ | Token-based auth, password hashing with salt |
| **Encryption** | Node.js Crypto | Built-in | AES-192-CBC encryption, scrypt key derivation |
| **Validation** | Express Validator | Latest | Input sanitization, SQL injection prevention |
| **CORS** | cors | 2.8+ | Cross-origin request protection |
| **Styling** | CSS3 | Latest | Responsive design and UI |
| **CI/CD** | CircleCI | Latest | Automated security scanning, dependency auditing |

### Security NPM Packages

| Package | Purpose | Security Against |
|---------|---------|------------------|
| **bcrypt** | Password hashing | Brute force attacks, rainbow table attacks |
| **jsonwebtoken** | JWT authentication | Session hijacking, unauthorized access |
| **helmet** | Security headers | XSS, clickjacking, MIME sniffing |
| **express-rate-limit** | Rate limiting | DDoS attacks, brute force attempts |
| **cors** | CORS configuration | Cross-origin attacks, unauthorized domains |
| **express-validator** | Input validation | SQL injection, XSS, data corruption |
| **dotenv** | Environment variables | Credential exposure, configuration leaks |
| **mongodb** | Database driver | NoSQL injection, connection hijacking |
| **crypto** | Built-in encryption | Data interception, man-in-the-middle attacks |

## 🛡️ Security & DevSecOps

### Security Measures

Our application implements multiple layers of security to ensure data protection and system integrity:

#### 🔐 Authentication Security
- **JWT Tokens**: Secure, stateless authentication with configurable expiration
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Session Management**: Automatic token refresh and secure logout
- **Role-Based Access**: Granular permissions based on user roles

#### 🛡️ Application Security
- **Input Validation**: Comprehensive validation on both client and server
- **CORS Protection**: Configured cross-origin resource sharing policies
- **Rate Limiting**: Protection against brute force and DDoS attacks
- **Error Handling**: Secure error messages without information leakage

#### 🔍 Security Scanning Pipeline

Our CircleCI DevSecOps pipeline includes comprehensive security scanning:

![DevSecOps Successful Pipeline](Images1/circle_ci_successful_test.png)

| Security Check | Tool | Purpose |
|----------------|------|---------|
| **Dependency Audit** | npm audit | Vulnerability scanning for dependencies |
| **Static Analysis** | ESLint Security | Code-level security issue detection |
| **Secrets Detection** | TruffleHog | Hardcoded secrets and credentials |
| **License Compliance** | license-checker | Open source license compliance |
| **Code Quality** | ESLint | Code quality and best practices |

### DevSecOps Pipeline

```yaml
# CircleCI Pipeline Stages
Security Scanning:
  - npm audit (Backend & Frontend)
  - SAST with ESLint Security Plugin
  - Secrets Detection with TruffleHog
  - License Compliance Checking

Code Quality:
  - ESLint for Backend
  - React Linting for Frontend
  - Parallel execution for efficiency

Testing:
  - Backend Unit Tests
  - Frontend Tests with Coverage
  - Integration Testing

Building:
  - Backend Syntax Validation
  - Frontend Production Build
  - Artifact Generation
```

![CircleCI Dashboard](Images1/circle_ci_dashboard.png)

## 🗄️ Database Architecture & MongoDB Implementation

### Database Overview

The Swift Payment System uses **MongoDB Atlas** as its primary database, providing a robust, scalable, and secure document-based storage solution. The database is designed with security, performance, and data integrity as core principles.

![MongoDB Atlas Overview](Images1/MongoDB_dahsboard.jpeg)

#### **Database Configuration**
- **Platform**: MongoDB Atlas (Cloud-hosted)
- **Cluster**: hartsCluster
- **Database Name**: `users`
- **Data Size**: 74.13 KB (current usage)
- **Collections**: 2 (users, payment_applications)
- **Connection**: Secure connection string with authentication
- **Encryption**: Encryption at rest and in transit
- **Backup**: Automated daily backups with point-in-time recovery
- **Monitoring**: Real-time performance monitoring and alerts

### Database Collections

#### **1. Users Collection (`users`)**

The users collection stores all user account information with comprehensive security measures and field-level encryption:

![MongoDB Users Collection](Images1/User.jpeg)

**Real Implementation Example:**
```javascript
{
  _id: ObjectId("68e78255dba82da91175cb33"),    // Unique document identifier
  username: "888James",                         // Unique username (indexed)
  full_name: "58351fcb8e27a6c743b1acle7483901:76697200247a9bc5df258f1d22de54ef", // Encrypted full name
  accountNumber: "aa5a8748a4440e9cd1c870940e327a51:d98ed41203045ebbf7ed62ddcbacfdca", // Encrypted account number
  IDNumber: "f6deba474e0a6001f3bc7d57844ef722:56532616309841ed2a6cba439a6bf803", // Encrypted ID number
  password: "$2b$10$uZJ69Vtu/3Gb90g7INDty0gVwxMdOcitowzol/iondK16avh5MXti", // bcrypt hashed password
  userType: "User"                             // "User" (Client) or "Employee"
}
```

**Security Features Implemented:**
- **Field-Level Encryption**: Sensitive fields (full_name, accountNumber, IDNumber) are encrypted using AES-192-CBC
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Unique Constraints**: username and accountNumber are unique across the collection

**Indexes:**
- `username` (Unique)
- `email` (Unique)
- `accountNumber` (Unique)
- `userType`
- `createdAt`

#### **2. Payment Applications Collection (`payment_applications`)**

Stores all payment transaction data with comprehensive audit trails and field-level encryption:

![MongoDB Payment Applications Collection](Images1/Payment.jpeg)

**Real Implementation Example:**
```javascript
{
  _id: ObjectId("68e78d77c2aba86fbf30660e"),
  submittedBy: "68e78255dba82da91175cb33",           // Reference to User._id
  recipientName: "aa602cb8377b13181bf19197e697d3a8:5dcb2708d02fa9b094600bca83411fef", // Encrypted recipient name
  accountNumber: "07a7c6361c2177d7194b2e542188dabc:ea662c961365f12600eca27d037e483b", // Encrypted account number
  swiftCode: "cdaf082deb3a60652d886f424ec6473c:384e6f77bf4ef895f6b2d8ab1a91d979", // Encrypted SWIFT code
  amount: "5280eb837d704fa6b08c97ce4e6acbfd:4c8874f046c680a44886de90fdab9916", // Encrypted amount
  currency: "5a713554b32835baed5e5a40fb8fa87a:537b2617c5376fb5e90924e446c4b5e4", // Encrypted currency
  paymentProvider: "2ea51e514b4600a4ca8bcf1d932a3e93:a60ae7c7354c53aaa1cdc0bf7d597b23", // Encrypted provider
  status: "pending",                                 // "Pending", "Approved", "Rejected"
  submittedAt: "2025-10-09T10:24:55.030+00:00",     // Submission timestamp
  submittedByName: null,                             // Employee name (if applicable)
  reviewedAt: null,                                  // Review timestamp
  reviewedBy: null,                                  // Employee who reviewed
  reviewerName: null,                                // Reviewer name
  reviewComments: null                               // Employee review comments
}
```

**Security Features Implemented:**
- **Field-Level Encryption**: All sensitive payment data is encrypted using AES-192-CBC encryption
- **Data Integrity**: Complete audit trail with timestamps and user references
- **Status Tracking**: Comprehensive status management for payment workflow

**Indexes:**
- `submittedBy`
- `status`
- `submittedAt` (Descending)
- `reviewedBy`
- `recipientAccountNumber`
- `swiftCode`

#### **3. Audit Logs Collection (`audit_logs`)**

Comprehensive logging for security and compliance:

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439014"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  action: "login",
  timestamp: ISODate("2024-01-20T14:22:00Z"),
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  sessionId: "sess_abc123def456",
  details: {
    success: true,
    loginMethod: "password",
    location: "New York, NY, USA"
  },
  riskScore: 1.2,
  flagged: false
}
```

### Database Security Implementation

#### **1. Authentication & Authorization**
- **Database User Authentication**: Separate database users with minimal required permissions
- **Role-Based Access**: Different access levels for application, admin, and read-only users
- **IP Whitelisting**: Restricted access to specific IP addresses
- **Network Security**: VPC peering and private endpoints

#### **2. Data Encryption**
- **Encryption at Rest**: AES-256 encryption for all stored data
- **Encryption in Transit**: TLS 1.2+ for all database connections
- **Field-Level Encryption**: Sensitive fields encrypted with application-level keys
- **Key Management**: Secure key rotation and management

#### **3. Data Validation & Integrity**
- **Schema Validation**: MongoDB schema validation rules
- **Data Type Enforcement**: Strict data type checking
- **Referential Integrity**: Application-level foreign key constraints
- **Data Sanitization**: Input validation and sanitization

#### **4. Backup & Recovery**
- **Automated Backups**: Daily automated backups with 30-day retention
- **Point-in-Time Recovery**: Restore to any point within backup retention period
- **Cross-Region Replication**: Data replicated across multiple regions
- **Disaster Recovery**: Comprehensive disaster recovery procedures

### Database Performance & Monitoring

#### **Performance Optimization**
- **Indexing Strategy**: Optimized indexes for query performance
- **Query Optimization**: Efficient query patterns and aggregation pipelines
- **Connection Pooling**: Optimized connection pool management
- **Caching**: Application-level caching for frequently accessed data

#### **Monitoring & Alerting**
- **Performance Metrics**: Real-time database performance monitoring
- **Query Analysis**: Slow query identification and optimization
- **Resource Usage**: CPU, memory, and storage monitoring
- **Alert System**: Automated alerts for performance issues

### Database Relationships & Data Flow

![MongoDB Collections Overview](Images1/Mongodb.jpeg)

**Database Statistics:**
- **Database**: users
- **Collections**: 2
- **Storage Size**: 36KB
- **Logical Data Size**: 672B
- **Total Documents**: 1 payment application
- **Indexes Total Size**: 36KB

#### **Relationship Mapping**
- **One-to-Many**: Users → Payment Applications (one user can have multiple payments)
- **One-to-Many**: Users → Audit Logs (one user can have multiple log entries)
- **Many-to-One**: Payment Applications → Users (many payments belong to one user)
- **Many-to-One**: Payment Applications → Users (many payments reviewed by one employee)

#### **Data Flow Architecture**
1. **User Registration**: Creates user document in `users` collection
2. **Payment Submission**: Creates payment document with user reference
3. **Employee Review**: Updates payment status and adds review information
4. **Audit Logging**: Records all actions in `audit_logs` collection
5. **Data Retrieval**: Optimized queries with proper indexing

### Database Connection & Configuration

#### **Connection String Format**
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&appName=ClusterName
```

#### **Connection Options**
- **Retry Writes**: Automatic retry for write operations
- **Write Concern**: Majority write concern for data durability
- **Read Preference**: Primary read preference for consistency
- **Connection Timeout**: 30-second connection timeout
- **Socket Timeout**: 60-second socket timeout

#### **Environment Configuration**
```env
ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/users?retryWrites=true&w=majority&appName=ClusterName
DB_NAME=users
CONNECTION_POOL_SIZE=10
MAX_IDLE_TIME=30000
```

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "name": "username",
  "password": "userpassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "username",
    "full_name": "Full Name",
    "userType": "User"
  }
}
```

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "newuser",
  "full_name": "Full Name",
  "IDNumber": "123456789",
  "accountNumber": "1234567890",
  "password": "securepassword"
}
```

### Payment Endpoints

#### POST `/api/payments/submit`
Submit a new payment application.

**Headers:** `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "recipientName": "John Doe",
  "recipientAccountNumber": "9876543210",
  "amount": 1000.00,
  "currency": "USD",
  "paymentProvider": "Bank Transfer",
  "swiftCode": "CHASUS33",
  "notes": "Payment for services"
}
```

#### GET `/api/payments/my-applications`
Get current user's payment applications.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "message": "Your payment applications retrieved successfully",
  "applications": [
    {
      "_id": "app_id",
      "recipientName": "John Doe",
      "amount": 1000.00,
      "status": "Pending",
      "submittedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/payments/pending` (Employee Only)
Get all pending payment applications for review.

**Headers:** `Authorization: Bearer <jwt_token>`

### API Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

![API Documentation](Images1/Payment.jpeg)

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** 6+ (local or cloud instance)
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ST10256074/INSY7314_Swift_System.git
   cd INSY7314_Swift_System
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create backend/.env file
   echo "MONGODB_URI=mongodb://localhost:27017/swift_payment_system" > backend/.env
   echo "JWT_SECRET=your_jwt_secret_here" >> backend/.env
   ```

4. **Start the application**
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm start
   
   # Terminal 2: Start frontend
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Environment Configuration

#### Backend Environment Variables

```env
# Database (MongoDB Atlas)
ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=ClusterName

# Authentication
JWT_SECRET=your_secure_jwt_secret_here

# Encryption
ENCRYPTION_KEY=your_encryption_key_here_32_chars

# Server
PORT=8080
NODE_ENV=development
```


![Installation Guide](Images1/Logn.png)

## 💻 Usage

### For Clients

1. **Registration**: Create an account with your personal information
2. **Login**: Access your secure dashboard
3. **Submit Payments**: Use the payment form to submit payment requests
4. **Track Transactions**: Monitor your payment status and history
5. **Account Management**: Update your profile and preferences

### For Employees

1. **Login**: Access the employee portal with your credentials
2. **Review Payments**: Examine pending payment applications
3. **Approve/Reject**: Make decisions on payment requests
4. **User Management**: Handle user accounts and permissions
5. **Reporting**: Generate reports and analytics

### User Interface Guide

![User Interface](Images1/account_detals.png)

## 🔧 Development

### Project Structure

```
INSY7314_Swift_System/
├── backend/                 # Node.js backend
│   ├── routes/             # API route handlers
│   ├── db/                 # Database connection and models
│   ├── middleware/         # Custom middleware
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── utils/          # Utility functions
│   │   └── App.js          # Main app component
│   └── public/             # Static assets
├── .circleci/              # CI/CD configuration
├── Images1/               # Documentation screenshots
└── README.md               # This file
```

### Development Workflow

1. **Feature Development**
   ```bash
   # Create feature branch
   git checkout -b feature/new-feature
   
   # Make changes and test locally
   npm run dev
   
   # Commit changes
   git add .
   git commit -m "Add new feature"
   ```

2. **Code Quality**
   ```bash
   # Run linting
   npm run lint
   
   # Run tests
   npm test
   
   # Check security
   npm audit
   ```

3. **Pull Request**
   ```bash
   # Push to remote
   git push origin feature/new-feature
   
   # Create pull request on GitHub
   # CircleCI will automatically run tests
   ```

### Code Standards

- **ESLint**: Enforced code style and best practices
- **Prettier**: Consistent code formatting
- **Security**: Regular security audits and scanning
- **Testing**: Unit tests for critical functionality
- **Documentation**: Comprehensive inline and external documentation

![Development Workflow](Images1/circle_ci_dahsboard.png)

## 🧪 Testing

### Test Coverage

Our application includes comprehensive testing at multiple levels:

#### Backend Testing
```bash
cd backend
npm test
```

#### Frontend Testing
```bash
cd frontend
npm test
```

#### Integration Testing
```bash
# Run full test suite
npm run test:integration
```

### Test Types

| Test Type | Coverage | Purpose |
|-----------|----------|---------|
| **Unit Tests** | 80%+ | Individual component testing |
| **Integration Tests** | 70%+ | API endpoint testing |
| **E2E Tests** | 60%+ | Full user workflow testing |
| **Security Tests** | 90%+ | Security vulnerability testing |

![Test Coverage](Images1/circle_ci_successful_test.png)

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export MONGODB_URI=your_production_mongodb_uri
   export JWT_SECRET=your_production_jwt_secret
   ```

2. **Build Application**
   ```bash
   # Build frontend
   cd frontend
   npm run build
   
   # The build artifacts will be in frontend/build/
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   npm start
   ```

### Docker Deployment (Optional)

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

### CI/CD Pipeline

Our CircleCI pipeline automatically:
- Runs security scans
- Executes tests
- Builds the application
- Deploys to staging/production

![Deployment Pipeline](Images1/Transacions.png)


## 👥 Authors

- **Emil Fabel** - *Initial work and DevSecOps implementation* - [ST10359034](https://github.com/ST10359034)
- **Weylin** - *Collaborative development* - [INSY7314 Team](https://github.com/ST10256074/INSY7314_Swift_System)
- **James** - *Collaborative development* - [INSY7314 Team](https://github.com/ST10256074/INSY7314_Swift_System)
- **Kevin** - *Collaborative development* - [INSY7314 Team](https://github.com/ST10256074/INSY7314_Swift_System)


---

<div align="center">

**Built with ❤️ by the INSY7314 Team**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/ST10256074/INSY7314_Swift_System)
[![CircleCI](https://img.shields.io/badge/CircleCI-Pipeline-blue?style=for-the-badge&logo=circleci)](https://circleci.com)

</div>
