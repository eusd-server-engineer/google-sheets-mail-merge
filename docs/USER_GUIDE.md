# User Guide

## Google Sheets Mail Merge Add-on

This guide walks you through using the Mail Merge add-on to send personalized emails directly from Google Sheets.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Preparing Your Data](#preparing-your-data)
3. [Composing Your Email](#composing-your-email)
4. [Using Merge Fields](#using-merge-fields)
5. [Previewing & Testing](#previewing--testing)
6. [Sending Your Campaign](#sending-your-campaign)
7. [Understanding Status](#understanding-status)
8. [Email Tracking](#email-tracking)
9. [Using Templates](#using-templates)
10. [Scheduling Emails](#scheduling-emails)
11. [Attachments](#attachments)
12. [CC and BCC](#cc-and-bcc)
13. [Unsubscribe Links](#unsubscribe-links)
14. [Troubleshooting](#troubleshooting)
15. [FAQ](#faq)

---

## Getting Started

### Installing the Add-on

1. Open any Google Sheets spreadsheet
2. Click **Extensions** > **Add-ons** > **Get add-ons**
3. Search for "Mail Merge" (or use the direct installation link provided by your IT team)
4. Click **Install** and authorize the required permissions

### Opening the Add-on

1. Open your spreadsheet with recipient data
2. Click **Extensions** > **Mail Merge** > **Start Mail Merge**
3. The Mail Merge sidebar will appear on the right

---

## Preparing Your Data

### Required Setup

Your spreadsheet should have:

- **Header row** - Column names in the first row
- **Email column** - A column containing recipient email addresses
- **One row per recipient** - Each person gets their own row

### Example Spreadsheet

| Email | FirstName | LastName | Department | Amount |
|-------|-----------|----------|------------|--------|
| john@example.com | John | Smith | Sales | $150 |
| jane@example.com | Jane | Doe | Marketing | $200 |
| bob@example.com | Bob | Johnson | Engineering | $175 |

### Tips for Clean Data

- **Check for duplicates** - Each email should appear only once
- **Validate emails** - Ensure all email addresses are correctly formatted
- **No blank rows** - Remove empty rows between data
- **Clean headers** - Use simple, descriptive column names (avoid special characters)

### Column Naming Best Practices

| Good | Avoid |
|------|-------|
| FirstName | First Name (spaces) |
| Email | E-mail Address |
| Amount | $ Amount |
| StartDate | Start Date/Time |

---

## Composing Your Email

### Opening the Composer

1. In the sidebar, verify the **Email Column** is correctly detected
2. Review the recipient count
3. Click **Compose Email**

### The Compose Window

```
┌─────────────────────────────────────────────────────┐
│ Subject: [Your subject line here]                   │
│                                                     │
│ Insert: [FirstName] [LastName] [Email] [+More]      │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │                                                 │ │
│ │ Your email message here...                      │ │
│ │                                                 │ │
│ │ Formatting: B I U  Link  Bullet  Number         │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ [Preview] [Send Test] [Send All]                    │
└─────────────────────────────────────────────────────┘
```

---

## Using Merge Fields

Merge fields are placeholders that get replaced with actual data for each recipient.

### Syntax

Use double curly braces with the exact column name:

```
{{ColumnName}}
```

### Example

**Subject:**
```
{{FirstName}}, your monthly report is ready
```

**Body:**
```
Hi {{FirstName}},

Your {{Department}} department report for this month shows
a total of {{Amount}}.

Best regards,
The Finance Team
```

**Result for John:**
```
Subject: John, your monthly report is ready

Hi John,

Your Sales department report for this month shows
a total of $150.

Best regards,
The Finance Team
```

### Merge Field Tips

| Do | Don't |
|----|-------|
| `{{FirstName}}` | `{{ FirstName }}` (spaces) |
| `{{Email}}` | `{{email}}` (case must match) |
| Match column exactly | Guess the name |

### Finding Available Fields

Click the **[+More]** button in the composer to see all available columns from your spreadsheet.

---

## Previewing & Testing

### Preview Mode

Before sending, always preview your email:

1. Click **Preview** in the composer
2. Use the row selector to preview different recipients
3. Verify all merge fields are replaced correctly
4. Check formatting looks correct

### Sending a Test Email

1. Click **Send Test**
2. A test email will be sent to YOUR email address
3. Check your inbox to verify:
   - Subject line looks correct
   - Body content is properly formatted
   - Links work
   - Attachments are included (if any)

> **Always send a test before a real campaign!**

---

## Sending Your Campaign

### Before You Send

Confirm:
- [ ] Data is correct and up-to-date
- [ ] Test email looks good
- [ ] Recipient count is expected
- [ ] You're ready to send now

### Sending

1. Click **Send All**
2. A confirmation dialog appears:
   ```
   Ready to send 150 emails?
   This action cannot be undone.
   [Cancel] [Send Now]
   ```
3. Click **Send Now**
4. Watch the progress indicator

### During Sending

- **Do not close** the spreadsheet while sending
- Progress shows: "Sending 45 of 150..."
- Each sent email updates the status column

### After Sending

A summary dialog appears:
```
Campaign Complete!
✓ 147 emails sent successfully
✗ 3 emails failed (invalid address)

[View Details] [Close]
```

---

## Understanding Status

After sending, a **_Status** column is added (or updated) in your spreadsheet:

| Status | Meaning |
|--------|---------|
| `Sent` | Email delivered to Gmail successfully |
| `Invalid email` | Email address format was invalid |
| `Error: [message]` | Sending failed (see message) |
| `Skipped` | Row was skipped (no email, unsubscribed, etc.) |

### Checking Failed Emails

1. Sort by the _Status column
2. Filter for rows not showing "Sent"
3. Fix any issues
4. Re-run the merge (only unsent rows will be processed if you choose)

---

## Email Tracking

### Enabling Tracking

In the compose window, check the boxes:
- [ ] **Track opens** - Know when recipients open your email
- [ ] **Track clicks** - Know when recipients click links

### Viewing Tracking Data

After enabling tracking, new columns appear in your sheet:

| Column | Description |
|--------|-------------|
| `_Opens` | Number of times email was opened |
| `_LastOpened` | Most recent open timestamp |
| `_Clicks` | Number of link clicks |
| `_LastClicked` | Most recent click timestamp |

### Campaign Statistics

In the sidebar, view overall stats:
- Open rate (% of recipients who opened)
- Click rate (% who clicked a link)
- Timeline of opens

### Tracking Limitations

- Some email clients block tracking pixels
- Open tracking works ~70-80% of the time
- Click tracking is more reliable

---

## Using Templates

Save time by reusing email templates.

### Saving a Template

1. Compose your email as usual
2. Click **Save as Template**
3. Enter a name (e.g., "Monthly Newsletter")
4. Click **Save**

### Loading a Template

1. In the sidebar, click **Load Template**
2. Select from your saved templates
3. The composer opens with the template content
4. Modify as needed and send

### Managing Templates

1. In the sidebar, click **Manage Templates**
2. View all saved templates
3. Options: Edit, Duplicate, Delete

### Shared Templates

If your organization has shared templates:
1. Click **Load Template**
2. Switch to **Organization** tab
3. Select from shared templates

---

## Scheduling Emails

Send emails at a future date/time.

### Scheduling a Campaign

1. Compose your email
2. Instead of **Send Now**, click **Schedule**
3. Select date and time
4. Click **Schedule Send**

### Managing Scheduled Campaigns

In the sidebar under **Scheduled**:
- View upcoming scheduled sends
- Cancel scheduled campaigns
- Edit before send time

### Tips

- Schedule during business hours for best open rates
- Consider recipient time zones
- Allow time to cancel if needed

---

## Attachments

Include files with your emails.

### Adding an Attachment

1. In the composer, click **Attach File**
2. Select from Google Drive or upload
3. File appears in attachment list
4. Maximum size: 25 MB total

### Per-Recipient Attachments

To send different files to different recipients:

1. Add a column called **AttachmentURL** or **AttachmentID**
2. Enter the Google Drive file ID or URL for each row
3. The merge will attach the specific file per recipient

### Supported File Types

All standard file types are supported:
- PDF, Word, Excel, PowerPoint
- Images (JPG, PNG, GIF)
- ZIP archives

---

## CC and BCC

Add additional recipients to your emails.

### Using CC/BCC Columns

Add columns to your spreadsheet:

| Email | FirstName | Cc | Bcc |
|-------|-----------|-----|-----|
| john@example.com | John | manager@example.com | hr@example.com |

- **Cc** - Recipients visible to everyone
- **Bcc** - Hidden recipients

### Multiple CC/BCC

Separate multiple addresses with commas:
```
manager@example.com, supervisor@example.com
```

### Static CC/BCC

To add the same CC/BCC to ALL emails:
1. In the composer, click **Options**
2. Enter addresses in Static CC/BCC fields

---

## Unsubscribe Links

Allow recipients to opt out of future emails.

### Adding an Unsubscribe Link

1. In the composer, check **Add unsubscribe link**
2. Or manually add `{{unsubscribe}}` where you want the link

Example:
```
If you no longer wish to receive these emails, {{unsubscribe}}.
```

### What Happens When Someone Unsubscribes

1. They click the unsubscribe link
2. They see a confirmation page
3. Their email is added to the unsubscribe list
4. Future campaigns automatically skip them

### Viewing Unsubscribes

In the sidebar, click **Unsubscribes** to see:
- List of unsubscribed emails
- Date they unsubscribed
- Option to remove from list

---

## Troubleshooting

### Common Issues

#### "Invalid email" for valid addresses

**Cause:** Extra spaces or hidden characters
**Fix:**
1. Use `=TRIM(A2)` to clean cells
2. Copy-paste as plain text

#### Emails not arriving

**Possible causes:**
- Recipient's spam filter
- Daily limit reached
- Email bounced

**Fix:**
1. Check spam folder
2. Verify email address
3. Wait if limit reached

#### Merge fields not replacing

**Cause:** Column name mismatch
**Fix:**
1. Ensure exact spelling
2. Match capitalization
3. No extra spaces

#### "Exceeded daily limit"

**Cause:** Gmail limits (2,000/day for Workspace)
**Fix:**
1. Wait until tomorrow
2. Use scheduling to spread sends

### Error Messages

| Error | Solution |
|-------|----------|
| "Authorization required" | Re-authorize the add-on |
| "Rate limit exceeded" | Wait 1 minute, try again |
| "Invalid attachment" | Check file permissions/size |
| "Recipient rejected" | Verify email address |

---

## FAQ

### How many emails can I send?

**Gmail limits:**
- Google Workspace: 2,000 per day
- Personal Gmail: 500 per day

The add-on tracks your usage and warns you before reaching limits.

### Are my emails going to spam?

**To avoid spam filters:**
- Don't use all caps in subject
- Avoid spam trigger words
- Include unsubscribe link
- Personalize with merge fields
- Send from a recognizable address

### Can I undo a sent campaign?

No, once emails are sent they cannot be recalled. Always use the test send feature first.

### How accurate is open tracking?

Open tracking works when the recipient's email client loads images. Accuracy is typically 70-80% because:
- Some clients block images by default
- Privacy features may block trackers

### Can I send HTML emails?

Yes, the composer supports rich formatting. For advanced HTML:
1. Design your email in another tool
2. Copy the HTML
3. Paste into the composer

### What happens if my spreadsheet is closed during sending?

The send will stop. When you reopen:
1. Check the _Status column
2. Rows marked "Sent" were successful
3. Re-run for remaining rows

### Can multiple people use this at once?

Yes, each user runs their own instance. However:
- Share limits apply per Google account
- Each user needs add-on authorization

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Bold text |
| `Ctrl/Cmd + I` | Italic text |
| `Ctrl/Cmd + U` | Underline text |
| `Ctrl/Cmd + K` | Insert link |
| `Ctrl/Cmd + Enter` | Send (when focused) |

---

## Getting Help

- **Technical Issues:** Contact your IT department
- **Bug Reports:** Submit via GitHub Issues
- **Feature Requests:** Submit via GitHub Discussions

---

## Version History

| Version | Changes |
|---------|---------|
| 1.0.0 | Initial release: mail merge, templates, tracking |

---

*Last updated: January 2025*
