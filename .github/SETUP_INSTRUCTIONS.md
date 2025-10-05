# GitHub Repository Setup Instructions for Repository Owner

**Repository**: ST10256074/INSY7314_Swift_System  
**Date**: October 2025

## Action Required by Repository Owner

The DevSecOps workflows have been pushed, but the repository owner needs to enable several GitHub features for full functionality.

---

## Required Setup Steps

### 1. Enable Security Features (CRITICAL for Payment System)

**Path**: Go to `Settings` → `Security` → `Code security and analysis`

Enable the following:

#### A. Dependabot
- **Dependabot alerts** - Enable
  - Automatically detects vulnerable dependencies
  - Critical for npm packages with security issues
  
- **Dependabot security updates** - Enable
  - Automatically creates PRs to fix vulnerabilities
  - Keeps dependencies secure without manual intervention

#### B. Code Scanning
- **Code scanning** - Set up
  - Click "Set up" → Choose "CodeQL Analysis"
  - OR it will run automatically from our workflow
  - Finds security vulnerabilities in code (SQL injection, XSS, etc.)

#### C. Secret Scanning
- **Secret scanning** - Enable (if available for private repos)
  - Detects accidentally committed secrets
  - Alerts for API keys, passwords, tokens
  - CRITICAL for payment system security

#### D. Private Vulnerability Reporting
- **Private vulnerability reporting** - Enable
  - Allows security researchers to report issues privately
  - Prevents public disclosure of security issues

---

### 2. Branch Protection Rules

**Path**: `Settings` → `Branches` → `Add branch protection rule`

#### For `main` branch:

**Branch name pattern**: `main`

Enable these rules:
- **Require a pull request before merging**
  - Require approvals: `1` (or more for critical code)
  - Dismiss stale pull request approvals when new commits are pushed
  
- **Require status checks to pass before merging**
  - Require branches to be up to date before merging
  - Add these required checks:
    - `Quick Build & Test` (from ci.yml)
    - `Code Quality Check` (from devsecops.yml)
    - `Build & Test Backend` (from devsecops.yml)
    - `Build & Test Frontend` (from devsecops.yml)
    - `Secret Detection` (from devsecops.yml)
  
- **Require conversation resolution before merging**
  - All review comments must be resolved

- **Include administrators**
  - Apply rules to repository administrators too

- **Do not allow bypassing the above settings**
  - Prevents force pushes that skip security checks

**Click "Create" or "Save changes"**

---

### 3. Configure Secrets (If Not Already Done)

**Path**: `Settings` → `Secrets and variables` → `Actions`

If you need to add any secrets for the workflows:

- `CODECOV_TOKEN` (optional) - For code coverage reporting
- Any deployment tokens or credentials

**WARNING: NEVER commit these in code!**

---

### 4. Enable GitHub Actions (Verify)

**Path**: `Settings` → `Actions` → `General`

- **Actions permissions**: Allow all actions and reusable workflows
- **Workflow permissions**: Read and write permissions
- **Allow GitHub Actions to create and approve pull requests** (for Dependabot)

---

### 5. Notification Settings (Recommended)

**Path**: `Settings` → `Notifications` or your personal GitHub settings

Set up notifications for:
- Security alerts (Dependabot, Secret scanning)
- Pull requests
- Failed workflow runs
- Code scanning alerts

---

## How to Verify Everything is Working

### After Setup:

1. **Check Actions Tab**
   - Go to the `Actions` tab in your repository
   - You should see workflows running
   - First run may take 10-15 minutes

2. **Check Security Tab**
   - Go to the `Security` tab
   - You should see:
     - Dependabot alerts (if any vulnerabilities exist)
     - Code scanning results
     - Secret scanning results

3. **Check Dependabot Tab**
   - Should see "Dependabot is enabled"
   - May have PRs for dependency updates

4. **Test Pull Request Flow**
   - Create a test branch
   - Make a small change
   - Open a PR → workflows should run automatically

---

## Payment System Specific Security

Since this is a payment processing system, ensure:

### Backend Security Checklist:
- [ ] `.env` file is in `.gitignore` (already done)
- [ ] `MONGO_URI` contains no passwords in code
- [ ] `JWT_SECRET` is strong and random
- [ ] SSL certificates are properly configured
- [ ] Rate limiting is active (`brute` package configured)
- [ ] All passwords are hashed with `bcrypt`

### Frontend Security Checklist:
- [ ] No API keys in frontend code
- [ ] HTTPS enforced in production
- [ ] CORS properly configured
- [ ] No sensitive data in localStorage
- [ ] Input validation on all forms

---

## Expected Workflow Behavior

### On Every Push:
- Quick CI runs (builds and tests)
- Full DevSecOps pipeline runs on main/develop branches

### On Every Pull Request:
- All security checks must pass
- Code quality checks run
- Tests must pass

### Daily (2 AM UTC):
- Full security scan runs automatically
- Checks for new vulnerabilities

### Weekly (Mondays 9 AM):
- Dependabot checks for updates
- Creates PRs for outdated packages

---

## Troubleshooting

### If workflows fail:
1. Check the Actions tab for error details
2. Common issues:
   - Missing Node.js version
   - npm install failures (check package-lock.json)
   - Test failures (fix tests first)

### If secret scanning fails:
1. Review the detected secrets
2. Remove them from git history if needed:
   ```bash
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch PATH/TO/FILE' \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Rotate all exposed secrets immediately

### If you need help:
- Check workflow logs in Actions tab
- Review error messages
- Contact DevSecOps team member

---

## Contact

Setup completed by: emilfabel  
Repository Owner: ST10256074  
Date: October 2025

## Setup Completion Checklist

Please check off as you complete each section:

- [ ] Security features enabled (Dependabot, Code scanning, Secret scanning)
- [ ] Branch protection rules configured for `main`
- [ ] GitHub Actions verified and enabled
- [ ] Notifications configured
- [ ] First workflow run successful
- [ ] Team members added as reviewers in CODEOWNERS

**Once complete, all security automation will be active!**

---

## Useful Links

- [GitHub Security Documentation](https://docs.github.com/en/code-security)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)

---

**Remember**: Security is everyone's responsibility. Report suspicious activity immediately!
