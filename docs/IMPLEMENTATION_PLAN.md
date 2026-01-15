# Implementation Plan

## Google Sheets Mail Merge Add-on

**Version:** 1.0
**Last Updated:** January 2025

---

## Overview

This document outlines the phased implementation approach for building the Google Sheets Mail Merge add-on. Development is organized into four phases, progressing from core functionality to advanced automation features.

---

## Development Environment Setup

### Prerequisites

1. **Node.js** (v18+) - For CLASP CLI
2. **CLASP** - Google Apps Script CLI tool
3. **Google Account** - With Apps Script access
4. **Git** - Version control

### Initial Setup Steps

```bash
# Install CLASP globally
npm install -g @google/clasp

# Login to Google (opens browser)
clasp login

# Clone this repo
git clone https://github.com/eusd-server-engineer/google-sheets-mail-merge.git
cd google-sheets-mail-merge

# Create new Apps Script project
clasp create --type sheets --title "Mail Merge" --rootDir ./src

# Push code to Apps Script
clasp push

# Open in browser to test
clasp open
```

### Project Configuration

**appsscript.json:**
```json
{
  "timeZone": "America/Los_Angeles",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/script.container.ui"
  ]
}
```

---

## Phase 1: Core Mail Merge (MVP)

**Goal:** Basic functional mail merge that can send personalized emails

### 1.1 Project Scaffolding

| Task | Description | Files |
|------|-------------|-------|
| Create manifest | Apps Script project configuration | `appsscript.json` |
| Entry point | Menu creation, initialization | `Code.gs` |
| CLASP config | Deployment configuration | `.clasp.json` |

### 1.2 Menu & Sidebar

| Task | Description | Files |
|------|-------------|-------|
| Add-on menu | Create "Mail Merge" menu in Extensions | `Code.gs` |
| Sidebar HTML | Basic sidebar structure | `html/Sidebar.html` |
| Sidebar styles | CSS for sidebar UI | `css/styles.html` |
| Sidebar controller | JavaScript for sidebar interactions | `html/Sidebar.html` |

**Code: Menu Setup**
```javascript
function onOpen(e) {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('Start Mail Merge', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/Sidebar')
    .setTitle('Mail Merge')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}
```

### 1.3 Column Detection

| Task | Description | Files |
|------|-------------|-------|
| Get headers | Read first row as column names | `MailMerge.gs` |
| Detect email column | Auto-detect "Email" or similar | `MailMerge.gs` |
| Count recipients | Count valid email rows | `MailMerge.gs` |
| Expose to sidebar | `google.script.run` endpoints | `Code.gs` |

**Code: Column Detection**
```javascript
function getSheetData() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Find email column
  const emailPatterns = ['email', 'e-mail', 'emailaddress'];
  const emailColIndex = headers.findIndex(h =>
    emailPatterns.includes(h.toLowerCase().replace(/[\s_-]/g, ''))
  );

  // Count valid emails
  let validCount = 0;
  for (let i = 1; i < data.length; i++) {
    if (isValidEmail(data[i][emailColIndex])) validCount++;
  }

  return {
    headers,
    emailColumn: emailColIndex >= 0 ? headers[emailColIndex] : null,
    totalRows: data.length - 1,
    validEmails: validCount
  };
}
```

### 1.4 Email Composer

| Task | Description | Files |
|------|-------------|-------|
| Compose dialog | Modal for email composition | `html/Compose.html` |
| Subject field | Text input with merge field buttons | `html/Compose.html` |
| Body editor | Rich text editor (contenteditable) | `html/Compose.html` |
| Merge field buttons | Insert merge fields at cursor | `html/Compose.html` |

### 1.5 Merge Field Processing

| Task | Description | Files |
|------|-------------|-------|
| Parse template | Find all `{{Field}}` patterns | `MailMerge.gs` |
| Replace fields | Substitute values from row | `MailMerge.gs` |
| Handle missing | Leave placeholder or use default | `MailMerge.gs` |

**Code: Merge Field Processing**
```javascript
function processMergeFields(template, rowData, headers) {
  let result = template;
  headers.forEach((header, index) => {
    const pattern = new RegExp(`\\{\\{${escapeRegex(header)}\\}\\}`, 'gi');
    result = result.replace(pattern, rowData[index] || '');
  });
  return result;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

### 1.6 Email Sending

| Task | Description | Files |
|------|-------------|-------|
| Send single email | Core send function | `MailMerge.gs` |
| Batch processing | Loop through rows | `MailMerge.gs` |
| Rate limiting | Delay between sends | `MailMerge.gs` |
| Status updates | Write to status column | `MailMerge.gs` |

**Code: Email Sending**
```javascript
function sendMailMerge(subject, body, options = {}) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const emailColIndex = headers.indexOf(options.emailColumn);
  const statusColIndex = ensureStatusColumn(sheet, headers);

  let sent = 0, failed = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const email = row[emailColIndex];

    if (!isValidEmail(email)) {
      sheet.getRange(i + 1, statusColIndex + 1).setValue('Invalid email');
      failed++;
      continue;
    }

    try {
      const mergedSubject = processMergeFields(subject, row, headers);
      const mergedBody = processMergeFields(body, row, headers);

      GmailApp.sendEmail(email, mergedSubject, '', {
        htmlBody: mergedBody,
        name: options.fromName || ''
      });

      sheet.getRange(i + 1, statusColIndex + 1).setValue('Sent');
      sent++;
      Utilities.sleep(100); // Rate limiting
    } catch (e) {
      sheet.getRange(i + 1, statusColIndex + 1).setValue('Error: ' + e.message);
      failed++;
    }
  }

  return { sent, failed };
}
```

### 1.7 Preview & Test

| Task | Description | Files |
|------|-------------|-------|
| Preview merged | Show email with row data | `MailMerge.gs` |
| Row selector | Choose which row to preview | `html/Compose.html` |
| Test send | Send preview to user's email | `MailMerge.gs` |

### 1.8 Progress & Completion

| Task | Description | Files |
|------|-------------|-------|
| Progress updates | Real-time count during send | `html/Compose.html` |
| Completion dialog | Summary with stats | `html/Compose.html` |
| Error report | List failed recipients | `MailMerge.gs` |

### Phase 1 Deliverables

- [ ] Working sidebar with column detection
- [ ] Email composer with merge field insertion
- [ ] Preview functionality
- [ ] Test send capability
- [ ] Batch email sending
- [ ] Status column updates
- [ ] Basic error handling

---

## Phase 2: Tracking & Templates

**Goal:** Add email tracking and reusable templates

### 2.1 Open Tracking

| Task | Description | Files |
|------|-------------|-------|
| Tracking pixel endpoint | Web app that logs opens | `Tracking.gs` |
| Unique tracking IDs | Generate per-recipient ID | `Tracking.gs` |
| Insert pixel | Add to email HTML | `MailMerge.gs` |
| Record opens | Update sheet/log | `Tracking.gs` |

**Code: Tracking Pixel**
```javascript
function doGet(e) {
  const trackingId = e.parameter.id;
  if (trackingId) {
    recordOpen(trackingId);
  }

  // Return 1x1 transparent GIF
  const gif = Utilities.base64Decode(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  );
  return ContentService.createTextOutput(gif)
    .setMimeType(ContentService.MimeType.GIF);
}

function insertTrackingPixel(html, trackingId) {
  const trackingUrl = getTrackingEndpoint() + '?id=' + trackingId;
  const pixel = `<img src="${trackingUrl}" width="1" height="1" style="display:none" />`;
  return html.replace('</body>', pixel + '</body>');
}
```

### 2.2 Click Tracking

| Task | Description | Files |
|------|-------------|-------|
| Link wrapper | Redirect links through tracker | `Tracking.gs` |
| Click logging | Record clicked links | `Tracking.gs` |
| Redirect | Forward to original URL | `Tracking.gs` |

**Code: Link Tracking**
```javascript
function wrapLinks(html, trackingId) {
  const trackingBase = getTrackingEndpoint();
  return html.replace(
    /href="(https?:\/\/[^"]+)"/g,
    (match, url) => {
      const encodedUrl = encodeURIComponent(url);
      return `href="${trackingBase}?id=${trackingId}&url=${encodedUrl}"`;
    }
  );
}

function doGet(e) {
  const { id, url } = e.parameter;

  if (url) {
    recordClick(id, url);
    return HtmlService.createHtmlOutput(
      `<script>window.location.href="${decodeURIComponent(url)}";</script>`
    );
  }
  // ... tracking pixel logic
}
```

### 2.3 Analytics Dashboard

| Task | Description | Files |
|------|-------------|-------|
| Campaign stats | Opens, clicks, rates | `Tracking.gs` |
| Per-recipient data | Individual open/click data | `Tracking.gs` |
| Sheet updates | Write tracking data to sheet | `Tracking.gs` |
| Stats UI | Display in sidebar | `html/Sidebar.html` |

### 2.4 Template System

| Task | Description | Files |
|------|-------------|-------|
| Template storage | Hidden sheet for templates | `Templates.gs` |
| Save template | Store current email | `Templates.gs` |
| Load template | Populate composer | `Templates.gs` |
| Template manager | List/edit/delete | `html/Templates.html` |

**Code: Template Storage**
```javascript
function saveTemplate(name, subject, body) {
  const sheet = getOrCreateTemplateSheet();
  const id = Utilities.getUuid();

  sheet.appendRow([
    id,
    name,
    subject,
    body,
    new Date(),
    Session.getActiveUser().getEmail()
  ]);

  return id;
}

function getOrCreateTemplateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('_MailMergeTemplates');

  if (!sheet) {
    sheet = ss.insertSheet('_MailMergeTemplates');
    sheet.hideSheet();
    sheet.appendRow(['ID', 'Name', 'Subject', 'Body', 'CreatedAt', 'CreatedBy']);
  }

  return sheet;
}
```

### 2.5 Scheduling

| Task | Description | Files |
|------|-------------|-------|
| Schedule picker | Date/time selection UI | `html/Compose.html` |
| Store scheduled | Save campaign for later | `Scheduling.gs` |
| Time trigger | Execute at scheduled time | `Scheduling.gs` |
| Queue management | View/cancel scheduled | `html/Sidebar.html` |

**Code: Scheduling**
```javascript
function scheduleCampaign(campaignData, sendAt) {
  const campaignId = Utilities.getUuid();

  // Store campaign data
  PropertiesService.getScriptProperties().setProperty(
    'scheduled_' + campaignId,
    JSON.stringify(campaignData)
  );

  // Create time-based trigger
  ScriptApp.newTrigger('executeScheduledCampaign')
    .timeBased()
    .at(new Date(sendAt))
    .create();

  return campaignId;
}
```

### Phase 2 Deliverables

- [ ] Open tracking with pixel
- [ ] Click tracking with link wrapping
- [ ] Tracking data written to sheet
- [ ] Campaign analytics in sidebar
- [ ] Template save/load functionality
- [ ] Template management UI
- [ ] Schedule send feature
- [ ] Scheduled campaign queue

---

## Phase 3: Enhanced Features

**Goal:** Add attachments, CC/BCC, and unsubscribe management

### 3.1 Attachments

| Task | Description | Files |
|------|-------------|-------|
| File picker | Google Drive file selection | `html/Compose.html` |
| Attach from Drive | Include Drive files | `MailMerge.gs` |
| Size validation | Check 25MB limit | `MailMerge.gs` |
| Per-row attachments | URL column for individual files | `MailMerge.gs` |

**Code: Attachments**
```javascript
function sendWithAttachment(email, subject, body, attachmentId) {
  const file = DriveApp.getFileById(attachmentId);

  GmailApp.sendEmail(email, subject, '', {
    htmlBody: body,
    attachments: [file.getAs(file.getMimeType())]
  });
}
```

### 3.2 CC/BCC Support

| Task | Description | Files |
|------|-------------|-------|
| Column detection | Detect Cc/Bcc columns | `MailMerge.gs` |
| Multiple recipients | Parse comma-separated | `MailMerge.gs` |
| Static CC/BCC | Same for all emails | `html/Compose.html` |

**Code: CC/BCC**
```javascript
function sendEmail(to, subject, body, options) {
  GmailApp.sendEmail(to, subject, '', {
    htmlBody: body,
    cc: options.cc || '',
    bcc: options.bcc || '',
    name: options.fromName
  });
}
```

### 3.3 Unsubscribe Management

| Task | Description | Files |
|------|-------------|-------|
| Unsubscribe link | Insert {{unsubscribe}} placeholder | `MailMerge.gs` |
| Unsubscribe endpoint | Web app to handle clicks | `Unsubscribe.gs` |
| Unsubscribe sheet | Track unsubscribed emails | `Unsubscribe.gs` |
| Auto-skip | Skip unsubscribed in future sends | `MailMerge.gs` |

**Code: Unsubscribe**
```javascript
function insertUnsubscribeLink(html, email) {
  const unsubUrl = getUnsubscribeEndpoint() + '?email=' + encodeURIComponent(email);
  return html.replace(
    '{{unsubscribe}}',
    `<a href="${unsubUrl}">Unsubscribe</a>`
  );
}

function doGet(e) {
  const email = e.parameter.email;
  if (email) {
    addToUnsubscribeList(email);
    return HtmlService.createHtmlOutput(
      '<h1>Unsubscribed</h1><p>You have been removed from our mailing list.</p>'
    );
  }
}
```

### Phase 3 Deliverables

- [ ] Attachment from Google Drive
- [ ] Per-row attachment support
- [ ] CC/BCC columns support
- [ ] Static CC/BCC option
- [ ] Unsubscribe link insertion
- [ ] Unsubscribe tracking
- [ ] Auto-skip unsubscribed recipients

---

## Phase 4: Automation

**Goal:** Event-based triggers and follow-up sequences

### 4.1 Form Submission Trigger

| Task | Description | Files |
|------|-------------|-------|
| Form connection | Link to Google Form | `Automation.gs` |
| Submission trigger | Detect new responses | `Automation.gs` |
| Auto-send | Send email on submission | `Automation.gs` |

### 4.2 Row Addition Trigger

| Task | Description | Files |
|------|-------------|-------|
| Edit trigger | Detect new rows | `Automation.gs` |
| Filter logic | Only new rows, not edits | `Automation.gs` |
| Auto-send | Send on new row | `Automation.gs` |

### 4.3 Follow-up Sequences

| Task | Description | Files |
|------|-------------|-------|
| Sequence builder | Multi-step follow-up UI | `html/Followups.html` |
| Condition logic | If no open/reply in X days | `Automation.gs` |
| Sequence storage | Store follow-up configs | `Automation.gs` |
| Daily processor | Check and send follow-ups | `Automation.gs` |

**Code: Follow-up Logic**
```javascript
function processFollowups() {
  const campaigns = getActiveCampaigns();

  campaigns.forEach(campaign => {
    if (!campaign.followups) return;

    campaign.recipients.forEach(recipient => {
      const daysSinceSent = getDaysSince(recipient.sentAt);
      const followup = campaign.followups.find(f =>
        f.daysAfter === daysSinceSent &&
        !recipient.opened &&
        !recipient.replied
      );

      if (followup) {
        sendFollowup(recipient, followup);
      }
    });
  });
}
```

### Phase 4 Deliverables

- [ ] Form submission auto-send
- [ ] New row trigger
- [ ] Follow-up sequence builder
- [ ] Conditional follow-up logic
- [ ] Daily follow-up processor

---

## Testing Strategy

### Unit Testing

Use [clasp-test](https://github.com/nicofirst1/clasp-test) or manual testing functions:

```javascript
function runTests() {
  testMergeFields();
  testEmailValidation();
  testTemplateStorage();
  Logger.log('All tests passed');
}

function testMergeFields() {
  const template = 'Hello {{Name}}, welcome to {{Company}}!';
  const result = processMergeFields(template, ['John', 'Acme'], ['Name', 'Company']);
  if (result !== 'Hello John, welcome to Acme!') {
    throw new Error('Merge field test failed');
  }
}
```

### Integration Testing

1. Create test spreadsheet with sample data
2. Run mail merge to test email account
3. Verify emails received correctly
4. Check status column updates

### User Acceptance Testing

1. Deploy to test group (IT staff)
2. Gather feedback on UI/UX
3. Test with various data formats
4. Verify tracking accuracy

---

## Deployment

### Development Deployment

```bash
# Push latest code
clasp push

# Open in browser for testing
clasp open
```

### Organization Deployment

1. **Create deployment:**
   ```bash
   clasp deploy --description "v1.0.0"
   ```

2. **Submit for internal review** (Workspace admin)

3. **Publish to organization:**
   - Google Workspace Marketplace (internal)
   - Or manual installation via script link

### Deployment Checklist

- [ ] All tests passing
- [ ] Documentation complete
- [ ] OAuth scopes minimized
- [ ] Error handling comprehensive
- [ ] Rate limiting implemented
- [ ] User guide published

---

## File Structure Summary

```
src/
├── appsscript.json       # Manifest
├── Code.gs               # Entry point, menus, routing
├── MailMerge.gs          # Core merge logic
├── Tracking.gs           # Open/click tracking
├── Templates.gs          # Template CRUD
├── Scheduling.gs         # Scheduled sends
├── Automation.gs         # Triggers, follow-ups
├── Unsubscribe.gs        # Unsubscribe handling
├── Utils.gs              # Shared utilities
├── html/
│   ├── Sidebar.html      # Main sidebar
│   ├── Compose.html      # Email composer
│   ├── Templates.html    # Template manager
│   └── Followups.html    # Follow-up builder
└── css/
    └── styles.html       # Shared styles
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Gmail rate limits | Implement batching, queuing, warnings |
| 6-minute timeout | Use triggers for long campaigns |
| User sends wrong list | Confirmation dialog, test send required |
| Tracking blocked | Graceful degradation, no errors |
| API changes | Monitor Google announcements |

---

## Success Criteria

### Phase 1 Complete When:

- Users can send 100+ personalized emails
- Status column shows sent/failed accurately
- Preview shows correct merge results
- Test send works reliably

### Phase 2 Complete When:

- Open rates tracked within 5% accuracy
- Click tracking works for all links
- Templates save and load correctly
- Scheduling sends at correct time

### Phase 3 Complete When:

- Attachments work up to 25MB
- CC/BCC functions as expected
- Unsubscribe list respected

### Phase 4 Complete When:

- Form triggers send within 1 minute
- Follow-ups send on correct day
- Stop conditions work reliably
