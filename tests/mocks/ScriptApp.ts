/**
 * Mock for Google Apps Script ScriptApp service
 * @see https://developers.google.com/apps-script/reference/script/script-app
 */

export interface MockTrigger {
  getHandlerFunction(): string;
  getTriggerSource(): string;
  getTriggerSourceId(): string;
  getUniqueId(): string;
}

export interface MockTriggerBuilder {
  timeBased(): MockClockTriggerBuilder;
  forSpreadsheet(spreadsheet: unknown): MockSpreadsheetTriggerBuilder;
  create(): MockTrigger;
}

export interface MockClockTriggerBuilder {
  at(date: Date): MockClockTriggerBuilder;
  after(durationMilliseconds: number): MockClockTriggerBuilder;
  everyMinutes(n: number): MockClockTriggerBuilder;
  everyHours(n: number): MockClockTriggerBuilder;
  everyDays(n: number): MockClockTriggerBuilder;
  atHour(hour: number): MockClockTriggerBuilder;
  nearMinute(minute: number): MockClockTriggerBuilder;
  onWeekDay(day: unknown): MockClockTriggerBuilder;
  create(): MockTrigger;
}

export interface MockSpreadsheetTriggerBuilder {
  onOpen(): MockSpreadsheetTriggerBuilder;
  onEdit(): MockSpreadsheetTriggerBuilder;
  onChange(): MockSpreadsheetTriggerBuilder;
  onFormSubmit(): MockSpreadsheetTriggerBuilder;
  create(): MockTrigger;
}

// Store created triggers
const triggers: MockTrigger[] = [];
let triggerIdCounter = 0;

const createMockTrigger = (handlerFunction: string): MockTrigger => ({
  getHandlerFunction: () => handlerFunction,
  getTriggerSource: () => 'SPREADSHEETS',
  getTriggerSourceId: () => 'spreadsheet-123',
  getUniqueId: () => `trigger-${++triggerIdCounter}`,
});

const createMockClockTriggerBuilder = (handlerFunction: string): MockClockTriggerBuilder => {
  const builder: MockClockTriggerBuilder = {
    at: jest.fn().mockReturnThis(),
    after: jest.fn().mockReturnThis(),
    everyMinutes: jest.fn().mockReturnThis(),
    everyHours: jest.fn().mockReturnThis(),
    everyDays: jest.fn().mockReturnThis(),
    atHour: jest.fn().mockReturnThis(),
    nearMinute: jest.fn().mockReturnThis(),
    onWeekDay: jest.fn().mockReturnThis(),
    create: jest.fn(() => {
      const trigger = createMockTrigger(handlerFunction);
      triggers.push(trigger);
      return trigger;
    }),
  };
  return builder;
};

const createMockSpreadsheetTriggerBuilder = (handlerFunction: string): MockSpreadsheetTriggerBuilder => {
  const builder: MockSpreadsheetTriggerBuilder = {
    onOpen: jest.fn().mockReturnThis(),
    onEdit: jest.fn().mockReturnThis(),
    onChange: jest.fn().mockReturnThis(),
    onFormSubmit: jest.fn().mockReturnThis(),
    create: jest.fn(() => {
      const trigger = createMockTrigger(handlerFunction);
      triggers.push(trigger);
      return trigger;
    }),
  };
  return builder;
};

export const mockScriptApp = {
  newTrigger: jest.fn((handlerFunction: string): MockTriggerBuilder => ({
    timeBased: () => createMockClockTriggerBuilder(handlerFunction),
    forSpreadsheet: jest.fn(() => createMockSpreadsheetTriggerBuilder(handlerFunction)),
    create: () => {
      const trigger = createMockTrigger(handlerFunction);
      triggers.push(trigger);
      return trigger;
    },
  })),

  getProjectTriggers: jest.fn(() => [...triggers]),

  deleteTrigger: jest.fn((trigger: MockTrigger) => {
    const index = triggers.findIndex(t => t.getUniqueId() === trigger.getUniqueId());
    if (index > -1) {
      triggers.splice(index, 1);
    }
  }),

  getScriptId: jest.fn(() => 'script-123'),

  getService: jest.fn(() => ({
    getUrl: () => 'https://script.google.com/macros/s/script-123/exec',
  })),

  AuthMode: {
    NONE: 'NONE',
    CUSTOM_FUNCTION: 'CUSTOM_FUNCTION',
    LIMITED: 'LIMITED',
    FULL: 'FULL',
  },

  AuthorizationStatus: {
    REQUIRED: 'REQUIRED',
    NOT_REQUIRED: 'NOT_REQUIRED',
  },

  getAuthorizationInfo: jest.fn(() => ({
    getAuthorizationStatus: () => mockScriptApp.AuthorizationStatus.NOT_REQUIRED,
    getAuthorizationUrl: () => 'https://accounts.google.com/authorize',
  })),

  // Test helpers
  _getTriggers: () => [...triggers],
  _clearTriggers: () => {
    triggers.length = 0;
    triggerIdCounter = 0;
  },
  _reset: () => {
    triggers.length = 0;
    triggerIdCounter = 0;
  },
};

export const resetScriptAppMock = () => {
  mockScriptApp._reset();
  jest.clearAllMocks();
};
