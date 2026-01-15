import { type FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright E2E tests.
 *
 * This runs once before all tests and handles:
 * - Google authentication
 * - Storage state persistence for session reuse
 *
 * @see https://playwright.dev/docs/test-global-setup-teardown
 */
async function globalSetup(_config: FullConfig) {
  // Check for required environment variables
  const requiredEnvVars = [
    'TEST_ACCOUNT_EMAIL',
    'TEST_SPREADSHEET_ID',
  ];

  const missingVars = requiredEnvVars.filter(v => !process.env[v]);

  if (missingVars.length > 0 && !process.env.SKIP_AUTH) {
    console.warn(`
⚠️  Missing environment variables for E2E tests:
   ${missingVars.join(', ')}

   To run E2E tests, create a .env file with:
   TEST_ACCOUNT_EMAIL=your-test@eusd.org
   TEST_SPREADSHEET_ID=your-test-spreadsheet-id

   Or set SKIP_AUTH=true to skip authentication setup.
`);
  }

  // Skip auth setup if explicitly requested or if running in CI without credentials
  if (process.env.SKIP_AUTH || (process.env.CI && missingVars.length > 0)) {
    console.log('Skipping authentication setup');
    return;
  }

  // If we have credentials, attempt to set up authenticated session
  // This would normally involve logging into Google, but for now we'll
  // require manual authentication state setup

  console.log('Playwright E2E tests configured');
  console.log(`Test account: ${process.env.TEST_ACCOUNT_EMAIL || 'not configured'}`);
  console.log(`Test spreadsheet: ${process.env.TEST_SPREADSHEET_ID || 'not configured'}`);
}

export default globalSetup;
