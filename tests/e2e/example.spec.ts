import { test, expect } from '@playwright/test';

/**
 * Example E2E test to verify Playwright is configured correctly.
 *
 * This test simply loads the Google Sheets homepage to verify
 * the browser can navigate to Google services.
 */

test.describe('Playwright Setup Verification', () => {
  test('can navigate to Google Sheets', async ({ page }) => {
    // Navigate to Google Sheets homepage
    await page.goto('https://docs.google.com/spreadsheets');

    // Verify we're on a Google page
    const title = await page.title();
    expect(title).toContain('Google');
  });

  test.skip('can open test spreadsheet', async ({ page }) => {
    // Skip if no test spreadsheet is configured
    const spreadsheetId = process.env.TEST_SPREADSHEET_ID;
    if (!spreadsheetId) {
      test.skip();
      return;
    }

    // Navigate to test spreadsheet
    await page.goto(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);

    // Wait for spreadsheet to load
    await page.waitForSelector('[data-testid="spreadsheet"]', { timeout: 30000 });
  });
});

/**
 * Placeholder tests for mail merge functionality.
 * These will be implemented as we build the add-on.
 */
test.describe('Mail Merge Add-on', () => {
  test.skip('opens sidebar from Extensions menu', async ({ page: _page }) => {
    // TODO: Implement when add-on is deployed
    // 1. Open test spreadsheet
    // 2. Click Extensions menu
    // 3. Click Mail Merge > Start Mail Merge
    // 4. Verify sidebar appears
  });

  test.skip('detects email column in spreadsheet', async ({ page: _page }) => {
    // TODO: Implement when core functionality is built
    // 1. Open test spreadsheet with Email column
    // 2. Open mail merge sidebar
    // 3. Verify Email column is auto-selected
  });

  test.skip('previews merged email', async ({ page: _page }) => {
    // TODO: Implement when preview functionality is built
    // 1. Open test spreadsheet
    // 2. Open mail merge sidebar
    // 3. Compose email with merge fields
    // 4. Click Preview
    // 5. Verify merge fields are replaced
  });
});
