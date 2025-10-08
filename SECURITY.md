# Security Policy

## DevSecOps Pipeline

This project implements a comprehensive DevSecOps pipeline using CircleCI that includes:

### Security Scanning

#### 1. Dependency Vulnerability Scanning
- **Tool**: npm audit
- **Scope**: Both frontend and backend dependencies
- **Action**: Fails build on high/critical vulnerabilities
- **Frequency**: On every commit

#### 2. Static Application Security Testing (SAST)
- **Tool**: ESLint with security plugins
- **Checks**:
  - Unsafe regex patterns
  - Buffer vulnerabilities
  - Eval() usage
  - CSRF vulnerabilities
  - Timing attacks
  - Object injection
- **Frequency**: On every commit

#### 3. Secrets Scanning
- **Tool**: TruffleHog (via CircleCI pipeline)
- **Purpose**: Detect accidentally committed secrets, API keys, tokens
- **Frequency**: On every commit
- **Note**: Using CircleCI-based scanning as GitHub secret scanning requires public repos or GitHub Enterprise

#### 4. License Compliance
- **Tool**: license-checker
- **Purpose**: Ensure all dependencies have acceptable licenses
- **Frequency**: On every build

### Security Best Practices

#### Backend Security
- HTTPS enforcement
- CORS configuration
- Password hashing with bcrypt
- JWT authentication
- Input validation with regex
- Rate limiting (brute-force protection)

#### Frontend Security
- Environment variable management
- Secure API communication (HTTPS only)
- Input sanitization
- XSS protection via React

### Pipeline Stages

```
1. Security Scans (Parallel)
   ├── Backend Dependency Scan
   ├── Frontend Dependency Scan
   ├── SAST Scan
   └── Secrets Scan
   
2. Code Quality (Parallel)
   ├── Backend Linting
   └── Frontend Linting
   
3. Testing (Parallel)
   ├── Backend Tests
   └── Frontend Tests
   
4. Building (Parallel)
   ├── Backend Build
   └── Frontend Build
   
5. License Check
```

## Reporting a Vulnerability

If you discover a security vulnerability, please email the security team or create a private security advisory on GitHub. Do not create public issues for security vulnerabilities.

### What to Include
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Time
- We aim to acknowledge receipt within 48 hours
- We aim to provide an initial assessment within 5 business days

## Security Updates

This project follows semantic versioning. Security updates will be released as patch versions.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Checklist for Developers

Before committing code:
- [ ] No hardcoded secrets, API keys, or credentials
- [ ] Input validation implemented
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies are up to date
- [ ] npm audit shows no high/critical vulnerabilities
- [ ] Code follows OWASP security guidelines
- [ ] Authentication and authorization properly implemented
- [ ] Sensitive data is encrypted at rest and in transit

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

