# Swift Payment System

<div align="center">

![Swift Payment System](images/logo.png)

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

![Application Overview](images/app-overview.png)

## ✨ Features

### 🔑 Authentication & Authorization
- **Secure Login System**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Separate user types (Client/Employee) with appropriate permissions
- **Session Management**: Secure token storage and automatic session handling
- **Logout Confirmation**: User-friendly logout process with confirmation modal

![Authentication Flow](images/auth-flow.png)

### 💳 Payment Processing
- **Payment Applications**: Comprehensive form for submitting payment requests
- **Multi-Currency Support**: Support for various currencies and payment providers
- **SWIFT Integration**: International payment processing with SWIFT codes
- **Status Tracking**: Real-time payment status updates (Pending/Approved/Rejected)

![Payment Interface](images/payment-interface.png)

### 📊 Transaction Management
- **Transaction History**: Complete transaction history for authenticated users
- **Filtering & Search**: Advanced filtering by status, date, and amount
- **Real-time Updates**: Live status updates and transaction notifications
- **Export Capabilities**: Transaction data export for reporting

![Transaction Dashboard](images/transaction-dashboard.png)

### 👨‍💼 Employee Portal
- **Pending Payments Review**: Employee interface for reviewing payment applications
- **Approval Workflow**: Streamlined approval/rejection process
- **User Management**: Employee tools for user account management
- **Reporting Dashboard**: Comprehensive reporting and analytics

![Employee Portal](images/employee-portal.png)

### 🛡️ Security Features
- **Input Validation**: Comprehensive server-side and client-side validation
- **SQL Injection Prevention**: Parameterized queries and input sanitization
- **XSS Protection**: Content Security Policy and input encoding
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Rate Limiting**: Protection against brute force attacks

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Node.js Backend │    │   MongoDB DB    │
│                 │    │                 │    │                 │
│ • Authentication│◄──►│ • REST API      │◄──►│ • User Data     │
│ • Payment Forms │    │ • JWT Auth      │    │ • Transactions  │
│ • Transactions  │    │ • Validation    │    │ • Applications  │
│ • Employee UI   │    │ • Security      │    │ • Audit Logs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  CircleCI CI/CD │
                    │                 │
                    │ • Security Scan │
                    │ • Code Quality  │
                    │ • Testing       │
                    │ • Deployment    │
                    └─────────────────┘
```

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Frontend** | React | 18+ | User interface and state management |
| **Backend** | Node.js | 18+ | Server-side logic and API |
| **Framework** | Express.js | 5+ | Web application framework |
| **Database** | MongoDB | 6+ | Document-based data storage |
| **Authentication** | JWT | 9+ | Secure token-based authentication |
| **Styling** | CSS3 | Latest | Responsive design and UI |
| **CI/CD** | CircleCI | Latest | Automated testing and deployment |

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

![DevSecOps Pipeline](images/devsecops-pipeline.png)

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

![CircleCI Dashboard](images/circleci-dashboard.png)

## 🗄️ Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  username: String,           // Unique username
  full_name: String,          // User's full name
  IDNumber: String,           // Government ID number
  accountNumber: String,      // Bank account number
  password: String,           // Hashed password (bcrypt)
  userType: String,           // "User" (Client) or "Employee"
  createdAt: Date,            // Account creation timestamp
  lastLogin: Date,            // Last login timestamp
  isActive: Boolean           // Account status
}
```

### Payment Applications Collection

```javascript
{
  _id: ObjectId,
  submittedBy: ObjectId,      // Reference to User._id
  recipientName: String,      // Recipient's full name
  recipientAccountNumber: String, // Recipient's account
  amount: Number,             // Payment amount
  currency: String,           // Currency code (USD, EUR, etc.)
  paymentProvider: String,    // Payment service provider
  swiftCode: String,          // SWIFT code for international transfers
  notes: String,              // Additional payment notes
  status: String,             // "Pending", "Approved", "Rejected"
  submittedAt: Date,          // Submission timestamp
  reviewedAt: Date,           // Review timestamp
  reviewedBy: ObjectId,       // Employee who reviewed
  reviewNotes: String         // Employee review comments
}
```

### Database Relationships

![Database Schema](images/database-schema.png)

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

![API Documentation](images/api-docs.png)

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
# Database
MONGODB_URI=mongodb://localhost:27017/swift_payment_system

# Authentication
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=24h

# Server
PORT=8080
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Database Setup

1. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

2. **Create initial data** (optional)
   ```bash
   # The application will create collections automatically
   # You can add sample data through the registration endpoint
   ```

![Installation Guide](images/installation-guide.png)

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

![User Interface](images/ui-guide.png)

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
├── images/                 # Documentation images
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

![Development Workflow](images/dev-workflow.png)

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

![Test Coverage](images/test-coverage.png)

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

![Deployment Pipeline](images/deployment-pipeline.png)

## 🤝 Contributing

We welcome contributions to the Swift Payment System! Please follow these guidelines:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm test
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Create a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass
- Follow security best practices

### Code Review Process

1. **Automated Checks**: CircleCI runs security scans and tests
2. **Peer Review**: Team members review code changes
3. **Security Review**: Security team validates changes
4. **Approval**: Maintainer approval required for merge

![Contributing Guide](images/contributing-guide.png)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Emil Fabel** - *Initial work and DevSecOps implementation* - [ST10359034](https://github.com/ST10359034)
- **Weylin** - *Collaborative development* - [INSY7314 Team](https://github.com/ST10256074/INSY7314_Swift_System)
- **James** - *Collaborative development* - [INSY7314 Team](https://github.com/ST10256074/INSY7314_Swift_System)
- **Kevin** - *Collaborative development* - [INSY7314 Team](https://github.com/ST10256074/INSY7314_Swift_System)

## 📞 Support

For support and questions:

- **Issues**: [GitHub Issues](https://github.com/ST10256074/INSY7314_Swift_System/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ST10256074/INSY7314_Swift_System/discussions)
- **Email**: st10359034@vcconnect.edu.za

## 📚 Additional Resources

- [Security Documentation](SECURITY.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

<div align="center">

**Built with ❤️ by the INSY7314 Team**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/ST10256074/INSY7314_Swift_System)
[![CircleCI](https://img.shields.io/badge/CircleCI-Pipeline-blue?style=for-the-badge&logo=circleci)](https://circleci.com)

</div>