/**
 * Central export for all Google Apps Script mocks
 */

export { mockGmailApp, sentEmails, resetGmailAppMock } from './GmailApp';
export { mockSpreadsheetApp, resetSpreadsheetAppMock } from './SpreadsheetApp';
export { mockDriveApp, resetDriveAppMock } from './DriveApp';
export { mockPropertiesService, resetPropertiesServiceMock } from './PropertiesService';
export { mockUtilities, resetUtilitiesMock } from './Utilities';
export { mockSession, resetSessionMock } from './Session';
export { mockHtmlService, resetHtmlServiceMock } from './HtmlService';
export { mockScriptApp, resetScriptAppMock } from './ScriptApp';

/**
 * Reset all mocks to their initial state
 */
export function resetAllMocks() {
  resetGmailAppMock();
  resetSpreadsheetAppMock();
  resetDriveAppMock();
  resetPropertiesServiceMock();
  resetUtilitiesMock();
  resetSessionMock();
  resetHtmlServiceMock();
  resetScriptAppMock();
}
