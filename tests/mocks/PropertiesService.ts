/**
 * Mock for Google Apps Script PropertiesService
 * @see https://developers.google.com/apps-script/reference/properties/properties-service
 */

export interface MockProperties {
  getProperty(key: string): string | null;
  setProperty(key: string, value: string): MockProperties;
  deleteProperty(key: string): MockProperties;
  getProperties(): Record<string, string>;
  setProperties(properties: Record<string, string>, deleteAllOthers?: boolean): MockProperties;
  deleteAllProperties(): MockProperties;
  getKeys(): string[];
}

// Storage for different property types
const scriptProperties: Map<string, string> = new Map();
const userProperties: Map<string, string> = new Map();
const documentProperties: Map<string, string> = new Map();

const createMockProperties = (storage: Map<string, string>): MockProperties => ({
  getProperty: (key: string) => storage.get(key) ?? null,
  setProperty: jest.fn(function(this: MockProperties, key: string, value: string) {
    storage.set(key, value);
    return this;
  }),
  deleteProperty: jest.fn(function(this: MockProperties, key: string) {
    storage.delete(key);
    return this;
  }),
  getProperties: () => Object.fromEntries(storage),
  setProperties: jest.fn(function(
    this: MockProperties,
    properties: Record<string, string>,
    deleteAllOthers = false,
  ) {
    if (deleteAllOthers) {
      storage.clear();
    }
    Object.entries(properties).forEach(([key, value]) => {
      storage.set(key, value);
    });
    return this;
  }),
  deleteAllProperties: jest.fn(function(this: MockProperties) {
    storage.clear();
    return this;
  }),
  getKeys: () => Array.from(storage.keys()),
});

export const mockPropertiesService = {
  getScriptProperties: jest.fn(() => createMockProperties(scriptProperties)),
  getUserProperties: jest.fn(() => createMockProperties(userProperties)),
  getDocumentProperties: jest.fn(() => createMockProperties(documentProperties)),

  // Test helpers
  _getScriptProperties: () => new Map(scriptProperties),
  _getUserProperties: () => new Map(userProperties),
  _getDocumentProperties: () => new Map(documentProperties),
  _reset: () => {
    scriptProperties.clear();
    userProperties.clear();
    documentProperties.clear();
  },
};

export const resetPropertiesServiceMock = () => {
  mockPropertiesService._reset();
  jest.clearAllMocks();
};
