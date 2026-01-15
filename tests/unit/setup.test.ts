/**
 * Test to verify Jest setup and mocks are working correctly
 */

describe('Jest Setup', () => {
  describe('Google Apps Script mocks', () => {
    it('should have GmailApp mock available', () => {
      expect(GmailApp).toBeDefined();
      expect(GmailApp.sendEmail).toBeDefined();
      expect(typeof GmailApp.sendEmail).toBe('function');
    });

    it('should have SpreadsheetApp mock available', () => {
      expect(SpreadsheetApp).toBeDefined();
      expect(SpreadsheetApp.getActiveSheet).toBeDefined();
      expect(typeof SpreadsheetApp.getActiveSheet).toBe('function');
    });

    it('should have DriveApp mock available', () => {
      expect(DriveApp).toBeDefined();
      expect(DriveApp.getFileById).toBeDefined();
    });

    it('should have PropertiesService mock available', () => {
      expect(PropertiesService).toBeDefined();
      expect(PropertiesService.getScriptProperties).toBeDefined();
    });

    it('should have Utilities mock available', () => {
      expect(Utilities).toBeDefined();
      expect(Utilities.getUuid).toBeDefined();
    });

    it('should have Session mock available', () => {
      expect(Session).toBeDefined();
      expect(Session.getActiveUser).toBeDefined();
    });

    it('should have HtmlService mock available', () => {
      expect(HtmlService).toBeDefined();
      expect(HtmlService.createHtmlOutput).toBeDefined();
    });

    it('should have ScriptApp mock available', () => {
      expect(ScriptApp).toBeDefined();
      expect(ScriptApp.newTrigger).toBeDefined();
    });
  });

  describe('Mock functionality', () => {
    it('should track sent emails', () => {
      GmailApp.sendEmail('test@example.com', 'Subject', 'Body');

      expect(GmailApp.sendEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Subject',
        'Body',
      );
    });

    it('should return spreadsheet data', () => {
      const sheet = SpreadsheetApp.getActiveSheet();
      const data = sheet.getDataRange().getValues();

      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('should generate UUIDs', () => {
      const uuid1 = Utilities.getUuid();
      const uuid2 = Utilities.getUuid();

      expect(uuid1).toBeDefined();
      expect(uuid2).toBeDefined();
      expect(uuid1).not.toBe(uuid2);
    });

    it('should return active user email', () => {
      const user = Session.getActiveUser();
      const email = user.getEmail();

      expect(email).toBe('test@eusd.org');
    });

    it('should store and retrieve properties', () => {
      const props = PropertiesService.getScriptProperties();
      props.setProperty('testKey', 'testValue');

      const value = props.getProperty('testKey');
      expect(value).toBe('testValue');
    });
  });
});
