/**
 * Mock for Google Apps Script SpreadsheetApp service
 * @see https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
 */

export interface MockRange {
  getValue(): unknown;
  getValues(): unknown[][];
  setValue(value: unknown): MockRange;
  setValues(values: unknown[][]): MockRange;
  getRow(): number;
  getColumn(): number;
  getNumRows(): number;
  getNumColumns(): number;
  getA1Notation(): string;
}

export interface MockSheet {
  getName(): string;
  getDataRange(): MockRange;
  getRange(row: number, column: number, numRows?: number, numColumns?: number): MockRange;
  getLastRow(): number;
  getLastColumn(): number;
  appendRow(values: unknown[]): MockSheet;
  insertSheet(name?: string): MockSheet;
  hideSheet(): MockSheet;
  showSheet(): MockSheet;
}

export interface MockSpreadsheet {
  getActiveSheet(): MockSheet;
  getSheetByName(name: string): MockSheet | null;
  insertSheet(name: string): MockSheet;
  getId(): string;
  getUrl(): string;
  getName(): string;
}

// Default test data
let mockSheetData: unknown[][] = [
  ['Email', 'FirstName', 'LastName', 'Company'],
  ['john@example.com', 'John', 'Doe', 'Acme Corp'],
  ['jane@example.com', 'Jane', 'Smith', 'Tech Inc'],
  ['bob@example.com', 'Bob', 'Johnson', 'Startup LLC'],
];

// Track data modifications
const modifiedCells: Map<string, unknown> = new Map();

const createMockRange = (
  data: unknown[][],
  startRow = 1,
  startCol = 1,
): MockRange => ({
  getValue: () => data[0]?.[0] ?? '',
  getValues: () => data,
  setValue: jest.fn(function(this: MockRange, value: unknown) {
    modifiedCells.set(`${startRow},${startCol}`, value);
    return this;
  }),
  setValues: jest.fn(function(this: MockRange, values: unknown[][]) {
    values.forEach((row, r) => {
      row.forEach((cell, c) => {
        modifiedCells.set(`${startRow + r},${startCol + c}`, cell);
      });
    });
    return this;
  }),
  getRow: () => startRow,
  getColumn: () => startCol,
  getNumRows: () => data.length,
  getNumColumns: () => data[0]?.length ?? 0,
  getA1Notation: () => `A${startRow}:${String.fromCharCode(64 + (data[0]?.length ?? 1))}${startRow + data.length - 1}`,
});

const hiddenSheets: Set<string> = new Set();

const createMockSheet = (name = 'Sheet1', data = mockSheetData): MockSheet => ({
  getName: () => name,
  getDataRange: () => createMockRange(data),
  getRange: (row: number, column: number, numRows = 1, numColumns = 1) => {
    const slicedData = data.slice(row - 1, row - 1 + numRows).map(
      r => r.slice(column - 1, column - 1 + numColumns),
    );
    return createMockRange(slicedData, row, column);
  },
  getLastRow: () => data.length,
  getLastColumn: () => data[0]?.length ?? 0,
  appendRow: jest.fn(function(this: MockSheet, values: unknown[]) {
    data.push(values);
    return this;
  }),
  insertSheet: jest.fn((sheetName?: string) => createMockSheet(sheetName ?? 'NewSheet')),
  hideSheet: jest.fn(function(this: MockSheet) {
    hiddenSheets.add(name);
    return this;
  }),
  showSheet: jest.fn(function(this: MockSheet) {
    hiddenSheets.delete(name);
    return this;
  }),
});

const sheets: Map<string, MockSheet> = new Map([
  ['Sheet1', createMockSheet('Sheet1', mockSheetData)],
]);

const createMockSpreadsheet = (): MockSpreadsheet => ({
  getActiveSheet: () => sheets.get('Sheet1') ?? createMockSheet(),
  getSheetByName: (name: string) => sheets.get(name) ?? null,
  insertSheet: (name: string) => {
    const newSheet = createMockSheet(name, []);
    sheets.set(name, newSheet);
    return newSheet;
  },
  getId: () => 'spreadsheet-123',
  getUrl: () => 'https://docs.google.com/spreadsheets/d/spreadsheet-123',
  getName: () => 'Test Spreadsheet',
});

export const mockSpreadsheetApp = {
  getActiveSpreadsheet: jest.fn(createMockSpreadsheet),
  getActiveSheet: jest.fn(() => sheets.get('Sheet1') ?? createMockSheet()),
  getUi: jest.fn(() => ({
    createAddonMenu: jest.fn(() => ({
      addItem: jest.fn().mockReturnThis(),
      addSeparator: jest.fn().mockReturnThis(),
      addToUi: jest.fn(),
    })),
    showSidebar: jest.fn(),
    showModalDialog: jest.fn(),
    alert: jest.fn(),
    prompt: jest.fn(() => ({
      getSelectedButton: () => 'OK',
      getResponseText: () => 'test response',
    })),
  })),
  newDataValidation: jest.fn(),
  flush: jest.fn(),

  // Test helpers
  _setMockData: (data: unknown[][]) => {
    mockSheetData = data;
    sheets.set('Sheet1', createMockSheet('Sheet1', data));
  },
  _getMockData: () => mockSheetData,
  _getModifiedCells: () => new Map(modifiedCells),
  _clearModifiedCells: () => modifiedCells.clear(),
  _reset: () => {
    mockSheetData = [
      ['Email', 'FirstName', 'LastName', 'Company'],
      ['john@example.com', 'John', 'Doe', 'Acme Corp'],
      ['jane@example.com', 'Jane', 'Smith', 'Tech Inc'],
      ['bob@example.com', 'Bob', 'Johnson', 'Startup LLC'],
    ];
    sheets.clear();
    sheets.set('Sheet1', createMockSheet('Sheet1', mockSheetData));
    modifiedCells.clear();
    hiddenSheets.clear();
  },
};

export const resetSpreadsheetAppMock = () => {
  mockSpreadsheetApp._reset();
  jest.clearAllMocks();
};
