/**
 * Jest setup file - runs before all tests
 * Sets up Google Apps Script global mocks
 *
 * Note: We use 'as any' type assertions because our mocks only implement
 * the subset of the Google Apps Script API that we actually use.
 * This is intentional - we don't need to mock the entire API surface.
 */

import { mockGmailApp } from './mocks/GmailApp';
import { mockSpreadsheetApp } from './mocks/SpreadsheetApp';
import { mockDriveApp } from './mocks/DriveApp';
import { mockPropertiesService } from './mocks/PropertiesService';
import { mockUtilities } from './mocks/Utilities';
import { mockSession } from './mocks/Session';
import { mockHtmlService } from './mocks/HtmlService';
import { mockScriptApp } from './mocks/ScriptApp';

// Inject mocks into global scope to simulate Apps Script environment
// Using 'as any' because our mocks only implement methods we actually use
(global as any).GmailApp = mockGmailApp;
(global as any).SpreadsheetApp = mockSpreadsheetApp;
(global as any).DriveApp = mockDriveApp;
(global as any).PropertiesService = mockPropertiesService;
(global as any).Utilities = mockUtilities;
(global as any).Session = mockSession;
(global as any).HtmlService = mockHtmlService;
(global as any).ScriptApp = mockScriptApp;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
