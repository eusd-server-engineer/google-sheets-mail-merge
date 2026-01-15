/**
 * Mock for Google Apps Script HtmlService
 * @see https://developers.google.com/apps-script/reference/html/html-service
 */

export interface MockHtmlOutput {
  getContent(): string;
  setTitle(title: string): MockHtmlOutput;
  setWidth(width: number): MockHtmlOutput;
  setHeight(height: number): MockHtmlOutput;
  append(html: string): MockHtmlOutput;
  clear(): MockHtmlOutput;
  setFaviconUrl(url: string): MockHtmlOutput;
  setSandboxMode(mode: unknown): MockHtmlOutput;
  setXFrameOptionsMode(mode: unknown): MockHtmlOutput;
}

export interface MockHtmlTemplate {
  evaluate(): MockHtmlOutput;
  getCode(): string;
  getCodeWithComments(): string;
  getRawContent(): string;
}

const createMockHtmlOutput = (content = ''): MockHtmlOutput => {
  let htmlContent = content;

  return {
    getContent: () => htmlContent,
    setTitle: jest.fn(function(this: MockHtmlOutput, _t: string) {
      return this;
    }),
    setWidth: jest.fn(function(this: MockHtmlOutput, _w: number) {
      return this;
    }),
    setHeight: jest.fn(function(this: MockHtmlOutput, _h: number) {
      return this;
    }),
    append: jest.fn(function(this: MockHtmlOutput, html: string) {
      htmlContent += html;
      return this;
    }),
    clear: jest.fn(function(this: MockHtmlOutput) {
      htmlContent = '';
      return this;
    }),
    setFaviconUrl: jest.fn().mockReturnThis(),
    setSandboxMode: jest.fn().mockReturnThis(),
    setXFrameOptionsMode: jest.fn().mockReturnThis(),
  };
};

const createMockHtmlTemplate = (content: string): MockHtmlTemplate => ({
  evaluate: () => createMockHtmlOutput(content),
  getCode: () => content,
  getCodeWithComments: () => content,
  getRawContent: () => content,
});

// Store for template files
const templateFiles: Map<string, string> = new Map();

export const mockHtmlService = {
  createHtmlOutput: jest.fn((html = '') => createMockHtmlOutput(html)),

  createHtmlOutputFromFile: jest.fn((filename: string) => {
    const content = templateFiles.get(filename) ?? `<!-- ${filename} content -->`;
    return createMockHtmlOutput(content);
  }),

  createTemplate: jest.fn((html: string) => createMockHtmlTemplate(html)),

  createTemplateFromFile: jest.fn((filename: string) => {
    const content = templateFiles.get(filename) ?? `<!-- ${filename} template -->`;
    return createMockHtmlTemplate(content);
  }),

  SandboxMode: {
    IFRAME: 'IFRAME',
    EMULATED: 'EMULATED',
    NATIVE: 'NATIVE',
  },

  XFrameOptionsMode: {
    ALLOWALL: 'ALLOWALL',
    DEFAULT: 'DEFAULT',
  },

  // Test helpers
  _setTemplateFile: (filename: string, content: string) => {
    templateFiles.set(filename, content);
  },
  _clearTemplateFiles: () => {
    templateFiles.clear();
  },
};

export const resetHtmlServiceMock = () => {
  mockHtmlService._clearTemplateFiles();
  jest.clearAllMocks();
};
