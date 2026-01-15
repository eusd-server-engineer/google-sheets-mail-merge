/**
 * Mock for Google Apps Script Utilities service
 * @see https://developers.google.com/apps-script/reference/utilities/utilities
 */

export const mockUtilities = {
  getUuid: jest.fn(() => {
    // Generate a simple UUID-like string for testing
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }),

  formatDate: jest.fn((date: Date, timeZone: string, format: string) => {
    // Simple date formatting for tests
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatted = format
      .replace('yyyy', date.getFullYear().toString())
      .replace('MM', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
    return formatted;
  }),

  sleep: jest.fn((_milliseconds: number) => {
    // Don't actually sleep in tests
  }),

  base64Encode: jest.fn((data: string | number[]) => {
    if (typeof data === 'string') {
      return Buffer.from(data).toString('base64');
    }
    return Buffer.from(data).toString('base64');
  }),

  base64Decode: jest.fn((encoded: string) => {
    const decoded = Buffer.from(encoded, 'base64');
    return Array.from(decoded);
  }),

  newBlob: jest.fn((data: string | number[], contentType?: string, name?: string) => ({
    getBytes: () => typeof data === 'string' ? Array.from(data).map(c => c.charCodeAt(0)) : data,
    getContentType: () => contentType ?? 'application/octet-stream',
    getName: () => name ?? 'blob',
    getDataAsString: () => typeof data === 'string' ? data : String.fromCharCode(...data),
    setName: jest.fn().mockReturnThis(),
    setContentType: jest.fn().mockReturnThis(),
  })),

  jsonStringify: jest.fn((obj: unknown) => JSON.stringify(obj)),
  jsonParse: jest.fn((jsonString: string) => JSON.parse(jsonString)),

  parseCsv: jest.fn((csv: string, delimiter = ',') => {
    return csv.split('\n').map(line => line.split(delimiter));
  }),

  computeHmacSha256Signature: jest.fn((value: string, _key: string) => {
    // Return a mock signature
    return Array.from(value).map(c => c.charCodeAt(0) % 256);
  }),

  computeDigest: jest.fn((_algorithm: unknown, value: string) => {
    // Return a mock digest
    return Array.from(value).map(c => c.charCodeAt(0) % 256);
  }),
};

export const resetUtilitiesMock = () => {
  jest.clearAllMocks();
};
