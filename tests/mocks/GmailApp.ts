/**
 * Mock for Google Apps Script GmailApp service
 * @see https://developers.google.com/apps-script/reference/gmail/gmail-app
 */

export interface SendEmailOptions {
  htmlBody?: string;
  cc?: string;
  bcc?: string;
  name?: string;
  replyTo?: string;
  attachments?: GoogleAppsScript.Base.Blob[];
  inlineImages?: Record<string, GoogleAppsScript.Base.Blob>;
}

export interface MockGmailMessage {
  getId(): string;
  getSubject(): string;
  getBody(): string;
  getTo(): string;
  getFrom(): string;
  getDate(): Date;
}

// Track sent emails for test assertions
export const sentEmails: Array<{
  to: string;
  subject: string;
  body: string;
  options?: SendEmailOptions;
}> = [];

export const mockGmailApp = {
  sendEmail: jest.fn((
    to: string,
    subject: string,
    body: string,
    options?: SendEmailOptions,
  ): void => {
    sentEmails.push({ to, subject, body, options });
  }),

  getRemainingDailyQuota: jest.fn(() => 2000),

  createDraft: jest.fn((
    to: string,
    subject: string,
    body: string,
    _options?: SendEmailOptions,
  ) => ({
    getId: () => 'draft-123',
    getMessage: () => ({
      getId: () => 'msg-123',
      getSubject: () => subject,
      getBody: () => body,
      getTo: () => to,
    }),
    send: jest.fn(),
    update: jest.fn(),
    deleteDraft: jest.fn(),
  })),

  // Helper for tests to clear sent emails
  _clearSentEmails: () => {
    sentEmails.length = 0;
  },

  // Helper for tests to get sent emails
  _getSentEmails: () => [...sentEmails],
};

// Reset function for beforeEach
export const resetGmailAppMock = () => {
  sentEmails.length = 0;
  jest.clearAllMocks();
};
