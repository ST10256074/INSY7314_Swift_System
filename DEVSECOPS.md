# DevSecOps Pipeline Documentation

## Overview

This repository implements a comprehensive DevSecOps (Development, Security, and Operations) pipeline using CircleCI. The pipeline integrates security at every stage of the development lifecycle.

## Architecture

### Pipeline Philosophy
Our DevSecOps approach follows the "shift-left" security principle, integrating security checks early in the development process to catch issues before they reach production.

## CircleCI Configuration

### Location
`.circleci/config.yml`

### Key Features
1. **Automated Security Scanning**: Every commit triggers security scans
2. **Parallel Execution**: Jobs run in parallel for faster feedback
3. **Fail-Fast Strategy**: Critical security issues halt the pipeline
4. **Dependency Caching**: Speeds up builds by caching node_modules
5. **Artifact Storage**: Stores security reports and build artifacts

## Pipeline Jobs Explained

### Security Jobs

#### 1. `security-scan-backend`
**Purpose**: Scan backend dependencies for known vulnerabilities

**What it does**:
- Runs `npm audit` on backend dependencies
- Generates a JSON report of all vulnerabilities
- Fails build if high/critical vulnerabilities are found

**Example output**:
```
found 0 vulnerabilities
✓ Security scan passed
```

#### 2. `security-scan-frontend`
**Purpose**: Scan frontend dependencies for known vulnerabilities

**What it does**:
- Runs `npm audit` on frontend dependencies
- Generates a JSON report of all vulnerabilities
- Fails build if high/critical vulnerabilities are found

#### 3. `sast-scan`
**Purpose**: Static Application Security Testing (SAST)

**What it does**:
- Analyzes code for security vulnerabilities without executing it
- Uses ESLint with security plugins (CircleCI-based, not GitHub Code Scanning)
- Detects common security issues like:
  - SQL injection patterns
  - XSS vulnerabilities
  - Unsafe regex
  - Use of eval()
  - CSRF vulnerabilities
  - Timing attacks

**Security rules checked**:
```javascript
- detect-object-injection
- detect-non-literal-regexp
- detect-unsafe-regex
- detect-buffer-noassert
- detect-eval-with-expression
- detect-no-csrf-before-method-override
- detect-possible-timing-attacks
```

#### 4. `secrets-scan`
**Purpose**: Prevent accidental commits of secrets

**What it does**:
- Uses TruffleHog (CircleCI-based) to scan for:
  - API keys
  - Access tokens
  - Passwords
  - Private keys
  - Database credentials
- Prevents sensitive data from entering version control
- **Note**: Not using GitHub's native secret scanning (requires public repo or GitHub Enterprise)

### Code Quality Jobs

#### 5. `lint-backend`
**Purpose**: Enforce code quality standards in backend

**What it does**:
- Runs ESLint on all backend JavaScript files
- Checks for:
  - Code style consistency
  - Potential bugs
  - Best practice violations
- Allows up to 10 warnings before failing

#### 6. `lint-frontend`
**Purpose**: Enforce code quality standards in frontend

**What it does**:
- Uses react-scripts built-in linting
- Checks React-specific best practices
- Validates JSX syntax

### Testing Jobs

#### 7. `test-backend`
**Purpose**: Run backend unit and integration tests

**Current state**: Placeholder (ready for test implementation)
**Future**: Will run Jest/Mocha tests

#### 8. `test-frontend`
**Purpose**: Run frontend tests with coverage

**What it does**:
- Runs Jest tests via react-scripts
- Generates code coverage reports
- Stores coverage artifacts in CircleCI
- Runs in CI mode (no watch mode)

**Coverage includes**:
- Statements
- Branches
- Functions
- Lines

### Build Jobs

#### 9. `build-backend`
**Purpose**: Verify backend code can run

**What it does**:
- Syntax checks all JavaScript files
- Ensures Node.js can parse the code
- Validates server.js entry point

#### 10. `build-frontend`
**Purpose**: Create production build of React app

**What it does**:
- Runs `npm run build`
- Creates optimized production bundle
- Stores build artifacts
- Persists build to workspace for deployment

### Compliance Jobs

#### 11. `license-check`
**Purpose**: Ensure license compliance

**What it does**:
- Scans all dependencies for licenses
- Generates license summary
- Helps ensure no GPL or restrictive licenses in production

## Workflow Execution

### Dependency Graph
```
security-scan-backend ──> lint-backend ──> test-backend ──> build-backend ──┐
                                                                              │
security-scan-frontend ─> lint-frontend ─> test-frontend ─> build-frontend ─┤
                                                                              │
sast-scan ────────────────────────────────────────────────────────────────── ├──> license-check
                                                                              │
secrets-scan ─────────────────────────────────────────────────────────────┘
```

### Execution Strategy
1. **Stage 1**: All security scans run in parallel (fail-fast)
2. **Stage 2**: Linting jobs run after their respective security scans pass
3. **Stage 3**: Tests run after linting passes
4. **Stage 4**: Builds only if all tests pass
5. **Stage 5**: License check runs after all builds complete

### Total Pipeline Time
- Average: 5-8 minutes
- With cache hit: 3-5 minutes

## Setting Up CircleCI

### Prerequisites
1. GitHub account
2. CircleCI account (free tier available)
3. Repository connected to CircleCI

### Steps to Enable

#### 1. Connect Repository
```bash
1. Go to https://circleci.com/
2. Sign in with GitHub
3. Click "Projects" in sidebar
4. Find "INSY7314_Swift_System"
5. Click "Set Up Project"
```

#### 2. Configure Environment Variables
```bash
# In CircleCI Project Settings > Environment Variables
# Add any required variables:
# - MONGODB_URI (if needed for tests)
# - JWT_SECRET (if needed for tests)
# - Any API keys for deployment
```

#### 3. Enable Status Checks (Optional - For Production)
```bash
# In GitHub repository settings (enable later for production):
Settings > Branches > Branch protection rules
☑ Require status checks to pass before merging
☑ Require branches to be up to date before merging
Select: circleci/devsecops-pipeline

# Note: Disabled during active development for speed
# Enable before production deployment
```

### First Run
After merging the `.circleci/config.yml` to main branch:
1. CircleCI automatically detects the config
2. Pipeline starts on next commit
3. View results at: `https://app.circleci.com/pipelines/github/ST10256074/INSY7314_Swift_System`

## Interpreting Results

### Successful Build
All jobs show green checkmarks. Safe to merge/deploy.

### Failed Build

#### Security Scan Failed
```
Action: Review audit report, update dependencies
Command: npm update or npm audit fix
```

#### SAST Scan Failed
```
Action: Review security linting errors, fix code issues
Focus: Check for eval(), unsafe regex, injection vulnerabilities
```

#### Tests Failed
```
Action: Fix failing tests, ensure code changes don't break functionality
```

#### Build Failed
```
Action: Review build logs, fix syntax errors or missing dependencies
```

## Local Testing

### Run Security Checks Locally

#### Backend Security Scan
```bash
cd backend
npm audit --audit-level=high
```

#### Frontend Security Scan
```bash
cd frontend
npm audit --audit-level=high
```

#### SAST Scan
```bash
npm install -g eslint eslint-plugin-security
eslint backend/**/*.js --plugin security
```

#### Secrets Scan
```bash
pip install truffleHog3
trufflehog3 .
```

### Run Tests Locally
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Run Builds Locally
```bash
# Backend
cd backend
node -c server.js

# Frontend
cd frontend
npm run build
```

## Best Practices

### For Developers

1. **Run security scans locally before pushing**
   ```bash
   npm audit
   ```

2. **Fix vulnerabilities immediately**
   ```bash
   npm audit fix
   ```

3. **Keep dependencies updated**
   ```bash
   npm update
   ```

4. **Never commit secrets**
   - Use environment variables
   - Add sensitive files to .gitignore

5. **Write tests**
   - Aim for >80% code coverage
   - Test security-critical functions

6. **Review security reports**
   - Check CircleCI artifacts
   - Address findings promptly

### For Code Reviews

- Check that pipeline passes
- Review security scan results
- Verify tests are written for new features
- Ensure no new high/critical vulnerabilities
- Check for hardcoded secrets

## Continuous Improvement

### Future Enhancements
- [ ] Add DAST (Dynamic Application Security Testing)
- [ ] Integrate SonarCloud for code quality metrics
- [ ] Add Docker image security scanning
- [ ] Implement automated deployment
- [ ] Add performance testing
- [ ] Integrate OWASP ZAP for penetration testing
- [ ] Add database migration checks
- [ ] Implement canary deployments

## Troubleshooting

### Pipeline is slow
**Solution**: Check if dependencies are being cached properly
```yaml
# Verify cache keys in config.yml
- restore_cache:
    keys:
      - deps-{{ checksum "package-lock.json" }}
```

### Security scan false positives
**Solution**: Document exceptions and use audit allowlist
```bash
npm audit --audit-level=high --production
```

### Build fails intermittently
**Solution**: May be due to:
- Network issues downloading dependencies
- CircleCI resource limits
- Flaky tests (fix or mark as known issues)

## Support

For issues with the DevSecOps pipeline:
1. Check CircleCI build logs
2. Review this documentation
3. Contact the DevOps team
4. Create an issue in the repository

## References

- [CircleCI Documentation](https://circleci.com/docs/)
- [OWASP DevSecOps Guidelines](https://owasp.org/www-project-devsecops-guideline/)
- [npm audit Documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [ESLint Security Plugin](https://github.com/eslint-community/eslint-plugin-security)

