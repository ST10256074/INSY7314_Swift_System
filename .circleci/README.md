# CircleCI Configuration

This directory contains the CircleCI configuration for the Swift System DevSecOps pipeline.

## Quick Start

### 1. Enable CircleCI for Your Repository

1. Go to [CircleCI](https://circleci.com/)
2. Sign up or log in with your GitHub account
3. Click "Projects" in the left sidebar
4. Find "INSY7314_Swift_System" in the list
5. Click "Set Up Project"
6. CircleCI will automatically detect the `config.yml` file

### 2. Configure Environment Variables (Optional)

If you need to add secrets or environment-specific variables:

1. Go to Project Settings → Environment Variables
2. Add any required variables:
   - `MONGODB_URI` - MongoDB connection string (for integration tests)
   - `JWT_SECRET` - JWT secret key (for tests)
   - Any deployment keys or API tokens

**Important**: Never commit secrets to the repository!

### 3. Set Up GitHub Branch Protection (Optional - For Production)

**Note**: Disabled during active development for faster iteration. Enable before production deployment.

To prevent merging code that fails security checks (when ready):

1. Go to GitHub repository settings
2. Navigate to Branches → Branch protection rules
3. Add rule for `main` branch:
   - ☑ Require status checks to pass before merging
   - ☑ Require branches to be up to date
   - Select all CircleCI checks

### 4. First Pipeline Run

The pipeline will automatically run when you:
- Push commits to any branch
- Create a pull request
- Merge to main branch

View your pipeline at:
`https://app.circleci.com/pipelines/github/ST10256074/INSY7314_Swift_System`

## Pipeline Overview

Our DevSecOps pipeline includes:

### Security Scanning
- Dependency vulnerability scanning (npm audit)
- Static Application Security Testing (SAST via ESLint security plugins)
- Secrets detection (TruffleHog - CircleCI-based)
- License compliance checking

**Note**: All security scanning runs in CircleCI pipeline (not GitHub's native code/secret scanning which requires public repos or GitHub Enterprise/Organizations)

### Code Quality
- ESLint for backend and frontend
- React best practices checking

### Testing
- Backend unit tests
- Frontend tests with coverage

### Building
- Backend syntax validation
- Frontend production build

## Configuration File Structure

```yaml
.circleci/
└── config.yml          # Main CircleCI configuration
```

### Key Sections

1. **Orbs**: Reusable packages
   - `node`: Node.js configuration
   - `snyk`: Security scanning (optional, requires API key)

2. **Commands**: Reusable command definitions
   - `install-backend-deps`: Install and cache backend dependencies
   - `install-frontend-deps`: Install and cache frontend dependencies

3. **Jobs**: Individual tasks
   - Security scans
   - Linting
   - Testing
   - Building
   - License checking

4. **Workflows**: Job orchestration
   - Defines execution order
   - Manages dependencies between jobs

## Customization

### Adding New Jobs

```yaml
jobs:
  my-custom-job:
    docker:
      - image: cimg/node:20.11
    steps:
      - checkout
      - install-backend-deps
      - run:
          name: My Custom Step
          command: |
            echo "Custom commands here"
```

### Adding Job to Workflow

```yaml
workflows:
  devsecops-pipeline:
    jobs:
      - my-custom-job:
          requires:
            - security-scan-backend
```

### Changing Node Version

Update all `cimg/node:20.11` references to your desired version.

### Adding Environment Variables to Jobs

```yaml
jobs:
  my-job:
    docker:
      - image: cimg/node:20.11
    environment:
      MY_VAR: "value"
      NODE_ENV: "test"
```

## Performance Optimization

### Caching
Dependencies are cached based on `package-lock.json` checksums:
- Cache hit: ~30 seconds to restore
- Cache miss: ~2-3 minutes to install

### Parallelization
Jobs run in parallel when possible:
- All security scans run simultaneously
- Backend and frontend jobs run independently
- Total pipeline time: 5-8 minutes (with cache)

### Resource Class
Currently using CircleCI's default resource class (medium):
- 2 vCPUs
- 4GB RAM

To use more resources (paid plans):
```yaml
jobs:
  my-job:
    docker:
      - image: cimg/node:20.11
    resource_class: large  # 4 vCPUs, 8GB RAM
```

## Troubleshooting

### Pipeline Not Running
- Check that config.yml is valid YAML
- Ensure file is in `.circleci/config.yml`
- Verify CircleCI project is enabled

### Jobs Failing
1. **Security scans failing**: Update dependencies
   ```bash
   npm audit fix
   ```

2. **Tests failing**: Run tests locally first
   ```bash
   cd frontend
   npm test
   ```

3. **Build failing**: Check syntax errors
   ```bash
   cd frontend
   npm run build
   ```

### Slow Pipeline
- Check if caching is working
- Review which jobs take longest
- Consider upgrading resource class (paid)

### Cache Issues
Clear cache via CircleCI UI:
1. Go to Project Settings
2. Click "Advanced"
3. Click "Clear Cache"

## Monitoring and Reporting

### Viewing Results
- **Dashboard**: CircleCI project page
- **Email**: Configured in CircleCI settings
- **GitHub**: Status checks on PRs
- **Slack**: Can be configured with CircleCI Slack orb

### Artifacts
Pipeline stores these artifacts:
- `audit-backend.json` - Backend security scan results
- `audit-frontend.json` - Frontend security scan results
- `coverage/` - Test coverage reports
- `build/` - Production frontend build

Access artifacts:
1. Click on a pipeline run
2. Click on a job
3. Click "Artifacts" tab

### Insights
View pipeline analytics:
1. Go to CircleCI Insights
2. See metrics:
   - Pipeline duration over time
   - Success rate
   - Credit usage
   - Most failing jobs

## Security Best Practices

1. **Never commit secrets** to config.yml
2. **Use environment variables** for sensitive data
3. **Enable branch protection** to enforce checks
4. **Review security scan results** regularly
5. **Keep dependencies updated** to pass scans
6. **Monitor pipeline failures** and fix promptly

## Cost Management (Free Tier)

CircleCI Free Tier includes:
- 6,000 build minutes/month
- 1 concurrent job
- 30 days of artifact storage

Our pipeline uses approximately:
- 6-8 minutes per run
- ~750-1000 runs per month possible

## Support and Resources

- [Full DevSecOps Documentation](../DEVSECOPS.md)
- [Security Policy](../SECURITY.md)
- [CircleCI Documentation](https://circleci.com/docs/)
- [CircleCI Config Reference](https://circleci.com/docs/configuration-reference/)
- [CircleCI Orbs Registry](https://circleci.com/developer/orbs)

## Contributing

When modifying the pipeline:

1. Test configuration locally:
   ```bash
   circleci config validate
   ```

2. Create a feature branch:
   ```bash
   git checkout -b feature/update-pipeline
   ```

3. Make changes to `config.yml`

4. Push and verify pipeline runs successfully

5. Create PR with description of changes

6. Get review before merging to main

## Version History

- **v1.0** (2025-10-08): Initial DevSecOps pipeline
  - Security scanning (npm audit, SAST, secrets)
  - Code quality checks
  - Testing and building
  - License compliance

## Future Enhancements

- [ ] Add Snyk integration for advanced security scanning
- [ ] Implement automated deployment to staging
- [ ] Add performance testing
- [ ] Integrate SonarCloud for code quality metrics
- [ ] Add Docker image building and scanning
- [ ] Implement deployment to production
- [ ] Add smoke tests after deployment
- [ ] Configure Slack notifications

