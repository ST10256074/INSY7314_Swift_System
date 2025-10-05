# Security Policy

## Project Overview

INSY7314 is a payment processing system with user authentication and transaction management. Security is critical for this application.

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

### 🚨 CRITICAL: Do NOT open public issues for security vulnerabilities

If you discover a security vulnerability, please follow these steps:

1. **Do NOT** create a public GitHub issue
2. Email the maintainer directly with details
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact (especially for payment/auth systems)
   - Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Critical issues within 14 days, others within 30 days

## Security Measures

This project implements comprehensive DevSecOps practices:

### Automated Security Scanning
- **Daily Security Scans**: Automated via GitHub Actions
- **Dependency Monitoring**: npm audit + OWASP Dependency Check
- **SAST**: CodeQL and Semgrep for code analysis
- **Secret Detection**: TruffleHog and GitLeaks scanning
- **License Compliance**: Automated license checking

### Payment System Security
- **SSL/TLS**: Certificate-based encryption
- **Authentication**: JWT-based authentication
- **Password Security**: bcrypt hashing
- **Rate Limiting**: Brute force protection
- **Input Validation**: Protection against injection attacks

### Database Security
- **MongoDB**: Secure connection strings
- **Environment Variables**: Sensitive data stored in .env
- **Access Control**: Role-based permissions

## Security Best Practices

When contributing to this project:

### 1. Never Commit Sensitive Data
- ❌ API keys, tokens, secrets
- ❌ Database passwords or connection strings
- ❌ JWT secrets
- ❌ SSL private keys
- ❌ User credentials
- ✅ Use .env files (never commit .env files)
- ✅ Use environment variables

### 2. Code Security
- Validate all user inputs
- Sanitize data before database queries
- Use parameterized queries
- Implement proper error handling (don't expose stack traces)
- Keep dependencies up to date

### 3. Authentication & Authorization
- Never store passwords in plain text
- Use strong JWT secrets
- Implement proper session management
- Add rate limiting to prevent brute force
- Use HTTPS for all communications

### 4. Payment Processing
- Follow PCI DSS guidelines
- Never store full credit card numbers
- Log all payment transactions
- Implement transaction verification
- Use secure payment gateways

### 5. Before Pushing Code
```bash
# Run security checks locally
cd backend && npm audit
cd frontend && npm audit

# Check for secrets
git diff | grep -i "password\|api.key\|secret"

# Run tests
npm test
```

## Known Security Considerations

### Environment Variables Required
```
# Backend .env
MONGO_URI=<mongodb_connection_string>
JWT_SECRET=<strong_random_secret>
PORT=5000
SSL_CERT_PATH=<path_to_certificate>
SSL_KEY_PATH=<path_to_private_key>
```

### Security Headers
Ensure these headers are configured:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

## Compliance

This project aims to comply with:
- **OWASP Top 10**: Protection against common web vulnerabilities
- **PCI DSS**: Payment card industry standards (where applicable)
- **GDPR**: Data protection regulations

## Security Checklist for PRs

Before submitting a pull request:
- [ ] No hardcoded secrets or credentials
- [ ] All dependencies are up to date
- [ ] Input validation is implemented
- [ ] Error handling doesn't expose sensitive info
- [ ] Authentication/authorization is properly implemented
- [ ] HTTPS is enforced
- [ ] Rate limiting is configured
- [ ] Security tests pass
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection is implemented

## Acknowledgments

We appreciate responsible disclosure of security vulnerabilities. Contributors who report valid security issues will be acknowledged (with their permission) in our security hall of fame.

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [PCI DSS Compliance](https://www.pcisecuritystandards.org/)

## Contact

For security concerns, contact: ST10256074

---
Last Updated: October 2025
