# INSY7314_Swift_System

A secure banking application built with Node.js, Express, React, and MongoDB featuring comprehensive DevSecOps practices.

## Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Payment Processing**: International payment verification and processing
- **Role-Based Access**: Client and employee role management
- **HTTPS Enforcement**: Secure communication with SSL/TLS
- **Rate Limiting**: Brute-force protection
- **Input Validation**: Regex-based validation for user data

## Security & DevSecOps

This project implements a comprehensive DevSecOps pipeline with CircleCI:

- **Automated Security Scanning**: Dependency vulnerability checks on every commit (npm audit)
- **SAST**: Static Application Security Testing with ESLint security plugins (CircleCI-based)
- **Secrets Detection**: TruffleHog integration to prevent credential leaks (CircleCI-based)
- **License Compliance**: Automatic license checking for all dependencies
- **Code Quality**: Automated linting for both frontend and backend
- **Testing**: Automated test execution with coverage reporting

**Note**: All security scanning runs in our CircleCI pipeline (not GitHub's native features which require public repos or GitHub Enterprise)

**CircleCI Status**: [![CircleCI](https://circleci.com/gh/ST10256074/INSY7314_Swift_System/tree/circleci-project-setup.svg?style=svg)](https://circleci.com/gh/ST10256074/INSY7314_Swift_System/tree/circleci-project-setup)

For detailed DevSecOps documentation, see:
- [DevSecOps Pipeline Documentation](DEVSECOPS.md)
- [Security Policy](SECURITY.md)
- [CircleCI Setup Guide](.circleci/README.md)

## Prerequisites

- Node.js 18+ and npm
- MongoDB
- Git

## How to Run

### Quick Start

1. Clone or Download the repository
   ```bash
   git clone https://github.com/ST10256074/INSY7314_Swift_System.git
   cd INSY7314_Swift_System
   ```

2. Open the terminal in VSCode

3. Use the split icon in the terminal to have two terminals open at once

4. **Backend Setup** (Left Terminal):
   ```bash
   cd backend
   npm install
   npm run start
   ```

5. **Frontend Setup** (Right Terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

6. This should open the browser with localhost with the frontend displayed otherwise use `https://localhost:3000`

### Access Points
- **Frontend**: https://localhost:3000
- **Backend API**: https://localhost:8443

## Project Structure

```
INSY7314_Swift_System/
├── .circleci/              # CircleCI DevSecOps configuration
│   ├── config.yml         # Pipeline definition
│   └── README.md          # CircleCI setup guide
├── backend/               # Node.js/Express backend
│   ├── routes/           # API routes
│   ├── db/               # Database connection
│   ├── keys/             # SSL certificates
│   └── server.js         # Entry point
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
├── DEVSECOPS.md         # DevSecOps documentation
├── SECURITY.md          # Security policy
└── README.md            # This file
```

## Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests with coverage
cd frontend
npm test -- --coverage
```

### Security Scanning

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix
```

## Security Features

### Backend
- HTTPS enforcement with SSL/TLS
- CORS configuration
- Password hashing with bcrypt (10 rounds)
- JWT authentication
- Input validation with regex patterns
- Rate limiting for brute-force protection
- Secure session management

### Frontend
- Secure API communication (HTTPS only)
- Input sanitization
- XSS protection via React
- Environment variable management

## API Documentation

### Authentication Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

### Payment Endpoints
- `POST /api/payments/create` - Create payment
- `GET /api/payments/pending` - Get pending payments (employees only)
- `POST /api/payments/verify` - Verify payment (employees only)

## User Roles

### Client
- Create account
- Login securely
- Make international payments
- View account information

### Employee
- Login securely
- View pending payments
- Verify payments with SWIFT code validation

## CI/CD Pipeline

The CircleCI pipeline runs automatically on every commit:

1. **Security Scans** (Parallel)
   - Backend dependency scan
   - Frontend dependency scan
   - SAST scan
   - Secrets scan

2. **Code Quality** (Parallel)
   - Backend linting
   - Frontend linting

3. **Testing** (Parallel)
   - Backend tests
   - Frontend tests with coverage

4. **Building** (Parallel)
   - Backend syntax check
   - Frontend production build

5. **License Check**

Total pipeline time: ~5-8 minutes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Note**: The DevSecOps pipeline runs automatically on all commits. While branch protection is currently disabled for faster development, ensure your code passes all security checks before merging.

## License

This project is licensed under the ISC License.

## Authors

- **Emil** - Initial work
- **James** - Backend development
- **Kevin** - UI development
- **Weylin** - Security implementation

## Support

For issues or questions:
1. Check the [DevSecOps Documentation](DEVSECOPS.md)
2. Review [Security Policy](SECURITY.md)
3. Create an issue in the repository

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security](https://reactjs.org/docs/dom-elements.html)
- [CircleCI Documentation](https://circleci.com/docs/)
