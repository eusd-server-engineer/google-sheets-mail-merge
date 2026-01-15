/**
 * Mock for Google Apps Script DriveApp service
 * @see https://developers.google.com/apps-script/reference/drive/drive-app
 */

export interface MockFile {
  getId(): string;
  getName(): string;
  getMimeType(): string;
  getBlob(): MockBlob;
  getAs(mimeType: string): MockBlob;
  getUrl(): string;
  getSize(): number;
}

export interface MockBlob {
  getBytes(): number[];
  getContentType(): string;
  getName(): string;
  getDataAsString(): string;
  setName(name: string): MockBlob;
  setContentType(contentType: string): MockBlob;
}

// Mock files storage
const mockFiles: Map<string, MockFile> = new Map();

const createMockBlob = (
  name: string,
  content: string,
  mimeType: string,
): MockBlob => ({
  getBytes: () => Array.from(content).map(c => c.charCodeAt(0)),
  getContentType: () => mimeType,
  getName: () => name,
  getDataAsString: () => content,
  setName: jest.fn(function(this: MockBlob, newName: string) {
    return createMockBlob(newName, content, mimeType);
  }),
  setContentType: jest.fn(function(this: MockBlob, newMimeType: string) {
    return createMockBlob(name, content, newMimeType);
  }),
});

const createMockFile = (
  id: string,
  name: string,
  mimeType: string,
  content = 'mock file content',
): MockFile => ({
  getId: () => id,
  getName: () => name,
  getMimeType: () => mimeType,
  getBlob: () => createMockBlob(name, content, mimeType),
  getAs: (targetMimeType: string) => createMockBlob(name, content, targetMimeType),
  getUrl: () => `https://drive.google.com/file/d/${id}`,
  getSize: () => content.length,
});

// Pre-populate with some test files
mockFiles.set('file-pdf-123', createMockFile('file-pdf-123', 'document.pdf', 'application/pdf'));
mockFiles.set('file-img-123', createMockFile('file-img-123', 'image.png', 'image/png'));

export const mockDriveApp = {
  getFileById: jest.fn((id: string) => {
    const file = mockFiles.get(id);
    if (!file) {
      throw new Error(`File not found: ${id}`);
    }
    return file;
  }),

  getFilesByName: jest.fn((name: string) => {
    const matchingFiles = Array.from(mockFiles.values()).filter(
      f => f.getName() === name,
    );
    let index = 0;
    return {
      hasNext: () => index < matchingFiles.length,
      next: () => matchingFiles[index++],
    };
  }),

  createFile: jest.fn((
    name: string,
    content: string,
    mimeType = 'text/plain',
  ) => {
    const id = `file-${Date.now()}`;
    const file = createMockFile(id, name, mimeType, content);
    mockFiles.set(id, file);
    return file;
  }),

  getRootFolder: jest.fn(() => ({
    getId: () => 'root',
    getName: () => 'My Drive',
    createFile: jest.fn((name: string, content: string, mimeType = 'text/plain') => {
      const id = `file-${Date.now()}`;
      return createMockFile(id, name, mimeType, content);
    }),
  })),

  // Test helpers
  _addMockFile: (id: string, name: string, mimeType: string, content?: string) => {
    mockFiles.set(id, createMockFile(id, name, mimeType, content));
  },
  _clearMockFiles: () => {
    mockFiles.clear();
  },
  _reset: () => {
    mockFiles.clear();
    mockFiles.set('file-pdf-123', createMockFile('file-pdf-123', 'document.pdf', 'application/pdf'));
    mockFiles.set('file-img-123', createMockFile('file-img-123', 'image.png', 'image/png'));
  },
};

export const resetDriveAppMock = () => {
  mockDriveApp._reset();
  jest.clearAllMocks();
};
