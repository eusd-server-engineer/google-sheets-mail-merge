# Product Requirements Document (PRD)

## Google Sheets Mail Merge Add-on

**Version:** 1.0
**Last Updated:** January 2025
**Author:** EUSD Server Engineering

---

## 1. Executive Summary

### 1.1 Problem Statement

Organizations need to send personalized mass emails (newsletters, announcements, outreach) but face challenges:

- **Cost** - Commercial solutions like Mailmeteor charge $5-25/user/month
- **Privacy** - Third-party services require access to email and contact data
- **Control** - Limited customization and dependency on external vendors
- **Compliance** - Difficulty ensuring data stays within organizational boundaries

### 1.2 Solution

An open-source Google Sheets add-on that replicates Mailmeteor's core functionality while keeping all data within Google's infrastructure. The organization maintains full control over the code, data, and deployment.

### 1.3 Success Metrics

| Metric | Target |
|--------|--------|
| Email delivery success rate | > 98% |
| User adoption (org-wide) | 50+ users in first 3 months |
| Support tickets per month | < 5 |
| Time to send 100-email campaign | < 2 minutes |

---

## 2. User Personas

### 2.1 Primary: Administrative Staff

- **Role:** Office managers, executive assistants, department coordinators
- **Needs:** Send announcements, event invitations, parent communications
- **Tech Level:** Comfortable with Google Sheets, not technical
- **Pain Points:** Current process involves manual copy-paste or expensive tools

### 2.2 Secondary: Teachers & Instructional Staff

- **Role:** Teachers, instructional coaches, curriculum specialists
- **Needs:** Student/parent updates, class announcements, resource sharing
- **Tech Level:** Basic to intermediate
- **Pain Points:** Limited time, need simple one-click solutions

### 2.3 Tertiary: IT/Technical Staff

- **Role:** System administrators, technical coordinators
- **Needs:** Deployment, customization, troubleshooting
- **Tech Level:** Advanced
- **Pain Points:** Supporting multiple tools, security concerns with third-party access

---

## 3. Feature Requirements

### 3.1 Core Features (MVP - Phase 1)

#### 3.1.1 Mail Merge Engine

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Column Detection | Auto-detect columns for merge fields | P0 |
| Merge Field Syntax | Support `{{ColumnName}}` in subject and body | P0 |
| Email Validation | Validate email column before sending | P0 |
| Batch Sending | Send in batches respecting Gmail limits | P0 |
| Status Tracking | Update spreadsheet with send status per row | P0 |
| Error Handling | Graceful handling of invalid emails, API errors | P0 |

#### 3.1.2 User Interface

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Sidebar Interface | Primary UI as Google Sheets sidebar | P0 |
| Email Composer | Rich text editor with merge field insertion | P0 |
| Preview Mode | Preview merged email for any row | P0 |
| Test Send | Send test email to self before campaign | P0 |
| Progress Indicator | Show sending progress with count | P0 |

#### 3.1.3 Basic Personalization

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Subject Merge | Merge fields in email subject | P0 |
| Body Merge | Merge fields in email body | P0 |
| Fallback Values | Default value if column is empty | P1 |
| Conditional Content | Show/hide content based on column values | P2 |

### 3.2 Enhanced Features (Phase 2)

#### 3.2.1 Email Tracking

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Open Tracking | Track email opens via tracking pixel | P1 |
| Click Tracking | Track link clicks via redirect | P1 |
| Analytics Dashboard | View campaign performance stats | P1 |
| Spreadsheet Updates | Write open/click data back to sheet | P1 |

#### 3.2.2 Templates

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Save Template | Save current email as reusable template | P1 |
| Load Template | Load saved template into composer | P1 |
| Template Library | Browse/manage saved templates | P1 |
| Shared Templates | Organization-wide template sharing | P2 |

#### 3.2.3 Scheduling

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Schedule Send | Set specific date/time for sending | P1 |
| Drip Sending | Send emails gradually over time period | P2 |
| Queue Management | View/cancel scheduled campaigns | P1 |

### 3.3 Advanced Features (Phase 3)

#### 3.3.1 Attachments

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Static Attachments | Attach same file to all emails | P2 |
| Drive Integration | Attach files from Google Drive | P2 |
| Per-Row Attachments | Different attachment per recipient (via URL column) | P3 |

#### 3.3.2 CC/BCC Support

| Requirement | Description | Priority |
|-------------|-------------|----------|
| CC Column | Add CC recipients from spreadsheet column | P2 |
| BCC Column | Add BCC recipients from spreadsheet column | P2 |
| Static CC/BCC | Same CC/BCC for all emails | P2 |

#### 3.3.3 Unsubscribe Management

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Unsubscribe Link | Insert unsubscribe link in emails | P2 |
| Unsubscribe Sheet | Track unsubscribed recipients | P2 |
| Auto-Skip | Automatically skip unsubscribed recipients | P2 |

### 3.4 Automation Features (Phase 4)

#### 3.4.1 Triggers

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Form Submission | Send email when Google Form submitted | P3 |
| Row Addition | Send email when new row added | P3 |
| Scheduled Campaigns | Recurring email campaigns | P3 |

#### 3.4.2 Follow-ups

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Auto Follow-up | Send follow-up if no open/reply | P3 |
| Follow-up Sequences | Multi-step follow-up campaigns | P3 |
| Stop Conditions | Stop sequence on reply/unsubscribe | P3 |

---

## 4. Technical Requirements

### 4.1 Platform

| Component | Technology |
|-----------|------------|
| Runtime | Google Apps Script (V8) |
| UI Framework | HTML Service (sidebar/dialogs) |
| Storage | Google Sheets (data), PropertiesService (config) |
| Email | Gmail API via MailApp/GmailApp |
| Tracking | Google Cloud Functions or Apps Script Web App |

### 4.2 Performance Requirements

| Metric | Requirement |
|--------|-------------|
| Sidebar Load Time | < 2 seconds |
| Email Send Rate | ~20 emails/second (API limit) |
| Max Recipients per Campaign | 2,000 (Gmail daily limit) |
| Concurrent Users | Unlimited (per-user execution) |

### 4.3 Security Requirements

| Requirement | Description |
|-------------|-------------|
| OAuth Scopes | Minimum required scopes only |
| Data Access | No external data transmission |
| Credential Storage | No credential storage (uses OAuth) |
| Audit Logging | Log all send operations to sheet |

### 4.4 OAuth Scopes Required

```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/script.container.ui",
    "https://www.googleapis.com/auth/drive.readonly"
  ]
}
```

---

## 5. User Experience

### 5.1 User Flow: Basic Mail Merge

```
1. User opens Google Sheet with recipient data
   └── Columns: Email, FirstName, LastName, etc.

2. User clicks Extensions > Mail Merge > Start Mail Merge
   └── Sidebar opens on right side

3. Sidebar shows:
   ├── Detected columns list
   ├── Email column selector (auto-detected)
   └── "Compose Email" button

4. User clicks "Compose Email"
   ├── Subject field with merge field buttons
   ├── Rich text body editor
   ├── Merge field insertion toolbar
   └── Preview/Test/Send buttons

5. User writes email with merge fields
   └── "Hi {{FirstName}}, your account {{Email}} is ready..."

6. User clicks "Preview"
   └── Shows merged preview for first row (or selected row)

7. User clicks "Send Test"
   └── Sends one email to user's own address

8. User clicks "Send All"
   ├── Confirmation dialog with recipient count
   ├── Progress bar during sending
   ├── Status column updated per row
   └── Summary dialog on completion
```

### 5.2 UI Mockups

#### Sidebar Layout

```
┌─────────────────────────────┐
│ 📧 Mail Merge               │
├─────────────────────────────┤
│                             │
│ Email Column:               │
│ ┌─────────────────────────┐ │
│ │ Email              ▼    │ │
│ └─────────────────────────┘ │
│                             │
│ Recipients: 150 rows        │
│ (3 empty emails skipped)    │
│                             │
│ ┌─────────────────────────┐ │
│ │   📝 Compose Email      │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │   📋 Load Template      │ │
│ └─────────────────────────┘ │
│                             │
│ ───── Recent Campaigns ──── │
│                             │
│ ✓ Jan 10 - Newsletter (145) │
│ ✓ Jan 8 - Event Invite (89) │
│ ⏱ Jan 15 - Scheduled (200)  │
│                             │
└─────────────────────────────┘
```

#### Compose Dialog

```
┌─────────────────────────────────────────────────────┐
│ Compose Email                                   ✕   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ From: josh.stephens@eusd.org                        │
│                                                     │
│ Subject:                                            │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Update for {{FirstName}} - January Newsletter  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Insert: [FirstName] [LastName] [Email] [+More]      │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Hi {{FirstName}},                               │ │
│ │                                                 │ │
│ │ Hope this email finds you well! Here's your    │ │
│ │ January update...                              │ │
│ │                                                 │ │
│ │ B I U  🔗  📎  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ☐ Track opens   ☐ Track clicks   ☐ Add unsubscribe │
│                                                     │
│ ┌──────────┐ ┌──────────┐ ┌────────────────────┐   │
│ │ Preview  │ │ Test Send│ │ 📨 Send to 150     │   │
│ └──────────┘ └──────────┘ └────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 6. Data Model

### 6.1 Spreadsheet Structure (User's Sheet)

| Column | Type | Description |
|--------|------|-------------|
| Email | String | Recipient email (required) |
| [Custom Columns] | Any | User-defined merge fields |
| _Status | String | Send status (auto-added) |
| _SentAt | DateTime | Timestamp of send (auto-added) |
| _Opens | Number | Open count (if tracking enabled) |
| _Clicks | Number | Click count (if tracking enabled) |

### 6.2 Template Storage (Hidden Sheet: `_MailMergeTemplates`)

| Column | Type | Description |
|--------|------|-------------|
| ID | String | Unique template ID |
| Name | String | Template display name |
| Subject | String | Email subject with merge fields |
| Body | String | HTML email body |
| CreatedAt | DateTime | Creation timestamp |
| CreatedBy | String | Creator email |

### 6.3 Campaign Log (Hidden Sheet: `_MailMergeCampaigns`)

| Column | Type | Description |
|--------|------|-------------|
| ID | String | Campaign ID |
| Name | String | Campaign name |
| SentAt | DateTime | Send timestamp |
| TotalRecipients | Number | Total emails attempted |
| Successful | Number | Successfully sent |
| Failed | Number | Failed sends |
| Opens | Number | Total opens |
| Clicks | Number | Total clicks |

### 6.4 Configuration (PropertiesService)

```javascript
{
  "defaultFromName": "EUSD",
  "trackingEnabled": true,
  "trackingEndpoint": "https://script.google.com/.../exec",
  "unsubscribeSheetId": "...",
  "dailySendLimit": 2000,
  "sendDelay": 100  // ms between emails
}
```

---

## 7. Integration Points

### 7.1 Gmail API

- **MailApp.sendEmail()** - Basic sending (simpler, fewer features)
- **GmailApp.sendEmail()** - Advanced (HTML, attachments, aliases)

### 7.2 Google Drive

- Attach files from Drive by ID or URL
- Read template files from Drive

### 7.3 Google Forms

- Trigger emails on form submission
- Map form responses to email fields

### 7.4 Tracking Webhook (Optional)

- Apps Script Web App for tracking pixel/link redirects
- Records opens/clicks to tracking sheet
- Returns 1x1 transparent GIF or redirects to target URL

---

## 8. Error Handling

### 8.1 Error Types

| Error | Handling |
|-------|----------|
| Invalid Email | Skip row, log error, continue |
| Rate Limit | Pause, wait, resume |
| API Error | Retry 3x, then fail row |
| Network Error | Retry 3x, then fail campaign |
| Auth Error | Prompt re-authorization |

### 8.2 User Notifications

- **Toast notifications** for minor issues
- **Alert dialogs** for critical errors
- **Status column** for per-row issues
- **Summary report** for campaign completion

---

## 9. Constraints & Limitations

### 9.1 Gmail Limits

| Limit | Value |
|-------|-------|
| Daily send limit (Workspace) | 2,000 |
| Daily send limit (personal) | 500 |
| Recipients per email | 500 |
| Email size (with attachments) | 25 MB |
| API calls per minute | 250 |

### 9.2 Apps Script Limits

| Limit | Value |
|-------|-------|
| Execution time | 6 minutes |
| Triggers per user | 20 |
| Script size | 50 MB |
| Cache size | 100 KB per item |

### 9.3 Workarounds

- **6-minute limit**: Use time-based triggers to continue long campaigns
- **Rate limits**: Implement exponential backoff
- **Large campaigns**: Queue and batch process

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gmail marks as spam | Medium | High | Rate limiting, proper headers |
| API changes break add-on | Low | High | Version pinning, monitoring |
| User sends to wrong list | Medium | Medium | Confirmation dialogs, test sends |
| Exceeds daily limits | Medium | Low | Tracking, warnings, queuing |

---

## 11. Future Considerations

### 11.1 Potential Enhancements (Post v1.0)

- AI-powered subject line suggestions
- A/B testing for subject lines
- Email validation (check if address exists)
- Multi-language template support
- Integration with Google Calendar for event invites
- Slack/Teams notifications for campaign completion

### 11.2 Not In Scope

- Custom SMTP server support (Gmail only)
- CRM integration
- Contact management
- Email verification services
- Advanced analytics/reporting beyond basic tracking

---

## 12. Appendix

### 12.1 Competitive Analysis

| Feature | Mailmeteor | YAMM | Our Solution |
|---------|------------|------|--------------|
| Price | $5-25/mo | $25-50/yr | Free |
| Mail Merge | ✓ | ✓ | ✓ |
| Tracking | ✓ | ✓ | ✓ |
| Scheduling | ✓ | ✓ | ✓ |
| Templates | ✓ | ✓ | ✓ |
| Follow-ups | ✓ | ✓ | Phase 4 |
| Self-hosted | ✗ | ✗ | ✓ |
| Open Source | ✗ | ✗ | ✓ |

### 12.2 Glossary

- **Mail Merge**: Process of combining a template with data to create personalized emails
- **Merge Field**: Placeholder like `{{Name}}` replaced with actual data
- **Campaign**: A single batch of emails sent together
- **Tracking Pixel**: 1x1 transparent image used to detect email opens
- **Drip Campaign**: Emails sent gradually over time rather than all at once
