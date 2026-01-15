/**
 * Mock for Google Apps Script Session service
 * @see https://developers.google.com/apps-script/reference/base/session
 */

// Configurable test user
let activeUserEmail = 'test@eusd.org';
let effectiveUserEmail = 'test@eusd.org';

export const mockSession = {
  getActiveUser: jest.fn(() => ({
    getEmail: () => activeUserEmail,
    getUserLoginId: () => activeUserEmail,
  })),

  getEffectiveUser: jest.fn(() => ({
    getEmail: () => effectiveUserEmail,
    getUserLoginId: () => effectiveUserEmail,
  })),

  getScriptTimeZone: jest.fn(() => 'America/Los_Angeles'),

  getActiveUserLocale: jest.fn(() => 'en'),

  getTemporaryActiveUserKey: jest.fn(() => 'temp-user-key-123'),

  // Test helpers
  _setActiveUserEmail: (email: string) => {
    activeUserEmail = email;
  },
  _setEffectiveUserEmail: (email: string) => {
    effectiveUserEmail = email;
  },
  _reset: () => {
    activeUserEmail = 'test@eusd.org';
    effectiveUserEmail = 'test@eusd.org';
  },
};

export const resetSessionMock = () => {
  mockSession._reset();
  jest.clearAllMocks();
};
