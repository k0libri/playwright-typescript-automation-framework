# Allure Reports on GitHub Pages Setup

This guide explains how to set up and access Allure test reports hosted on GitHub Pages.

## Prerequisites

- Repository with Playwright tests configured with `allure-playwright` reporter
- GitHub Actions enabled for the repository
- GitHub Pages enabled in repository settings

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Build and deployment**, set:
   - **Source**: GitHub Actions
   - Note: There's no Save button - the setting is applied immediately when you select GitHub Actions

### 2. Workflow Configuration

The GitHub Actions workflow ([.github/workflows/playwright.yml](.github/workflows/playwright.yml)) is already configured to:

- Run Playwright tests on push/PR to main/master branches
- Generate Allure reports from test results
- Deploy reports to GitHub Pages (only on main branch pushes)

#### Key Workflow Features:

- **Permissions**: Configured to allow Pages deployment
- **Test Job**: Runs tests, generates reports, uploads artifacts
- **Deploy Job**: Deploys Allure report to GitHub Pages (only on main branch)

### 3. Access Your Reports

Once the workflow runs successfully on the main branch:

1. Navigate to the **Actions** tab in your repository
2. Click on the latest workflow run
3. Find the deployment URL in the "Deploy to GitHub Pages" step
4. Alternatively, visit: `https://<username>.github.io/<repository-name>/`

Example: `https://k0libri.github.io/playwright-typescript-automation-framework/`

## How It Works

### Workflow Steps

1. **Test Execution**:
   ```bash
   npx playwright test
   ```
   - Runs all Playwright tests
   - Generates `allure-results` directory with test data

2. **Report Generation**:
   ```bash
   npx allure generate allure-results --clean -o allure-report
   ```
   - Processes test results
   - Creates HTML report in `allure-report` directory

3. **Deployment**:
   - Uploads `allure-report` directory as Pages artifact
   - Deploys to GitHub Pages (main branch only)

### Local Development

To view reports locally:

```bash
# Run tests
npm test

# Serve report locally
npm run allure:serve

# Or generate static report
npm run allure:generate
```

## Report Features

The Allure report includes:

- ✅ Test execution summary with pass/fail statistics
- 📊 Graphical representations of test results
- 📝 Detailed test steps and logs
- 🖼️ Screenshots and videos (if configured)
- ⏱️ Execution time metrics
- 📈 Historical trends (across multiple runs)

## Troubleshooting

### Reports not deploying

1. Check **Actions** tab for failed workflows
2. Verify GitHub Pages is enabled in Settings
3. Ensure workflow has proper permissions in [playwright.yml](.github/workflows/playwright.yml)
4. Confirm the workflow ran on the `main` branch (PRs don't deploy)

### Old reports showing

- GitHub Pages may cache content
- Wait a few minutes for cache to clear
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Permission errors

Ensure the workflow has these permissions in [playwright.yml](.github/workflows/playwright.yml):
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## Maintenance

### Report Retention

- Artifacts (zip files) are retained for 30 days
- GitHub Pages shows the latest deployment
- Historical data is overwritten on each deployment

### Customization

To customize Allure report generation, modify:
- [playwright.config.ts](playwright.config.ts) for Playwright reporter settings
- [.github/workflows/playwright.yml](.github/workflows/playwright.yml) for workflow steps

## Additional Resources

- [Allure Documentation](https://docs.qameta.io/allure/)
- [Playwright Test Reporters](https://playwright.dev/docs/test-reporters)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
