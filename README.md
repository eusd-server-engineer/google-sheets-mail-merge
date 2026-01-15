# Google Sheets Mail Merge

A powerful, open-source Google Sheets add-on for sending personalized mass emails through Gmail. Built as a self-hosted alternative to Mailmeteor.

## Features

- **Mail Merge** - Send personalized emails using data from Google Sheets
- **Merge Fields** - Use `{{ColumnName}}` syntax to personalize subject and body
- **Email Tracking** - Track opens and link clicks with detailed analytics
- **Scheduling** - Send immediately or schedule for later
- **Templates** - Save and reuse email templates
- **Attachments** - Include files from Google Drive
- **CC/BCC Support** - Add recipients via spreadsheet columns
- **Unsubscribe Management** - Built-in unsubscribe link handling
- **Campaign History** - Track all sent campaigns with status
- **Rate Limiting** - Respect Gmail's sending limits automatically

## Why Use This?

- **Free** - No subscription fees, runs on your Google Workspace
- **Private** - Your data never leaves Google's infrastructure
- **Customizable** - Full source code access, modify as needed
- **Org-Controlled** - Deploy internally, no third-party dependencies

## Requirements

- Google Workspace account (or personal Gmail)
- Permission to install Google Sheets add-ons
- Gmail sending limits apply (2,000/day for Workspace, 500/day for personal)

## Quick Start

1. Open a Google Sheet with your recipient data
2. Install the add-on (Extensions > Add-ons > Get add-ons)
3. Click **Mail Merge > Start Mail Merge** in the menu
4. Compose your email using `{{Column}}` merge fields
5. Preview, test, and send

## Documentation

- [Product Requirements Document](docs/PRD.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [User Guide](docs/USER_GUIDE.md)
- [Developer Guide](docs/DEVELOPER_GUIDE.md)

## Project Structure

```
google-sheets-mail-merge/
├── README.md
├── docs/
│   ├── PRD.md                 # Product Requirements Document
│   ├── IMPLEMENTATION_PLAN.md # Development roadmap
│   ├── USER_GUIDE.md          # End user documentation
│   └── DEVELOPER_GUIDE.md     # Developer setup and contribution guide
├── src/
│   ├── Code.gs                # Main Apps Script entry point
│   ├── MailMerge.gs           # Core mail merge logic
│   ├── Tracking.gs            # Open/click tracking
│   ├── Templates.gs           # Template management
│   ├── Scheduling.gs          # Scheduled sending
│   ├── UI.gs                  # Sidebar and dialog UI
│   ├── html/
│   │   ├── Sidebar.html       # Main sidebar interface
│   │   ├── Compose.html       # Email composer
│   │   └── Templates.html     # Template manager
│   └── css/
│       └── styles.html        # Shared styles
├── appsscript.json            # Apps Script manifest
└── .clasp.json                # CLASP deployment config
```

## Gmail Sending Limits

| Account Type | Daily Limit |
|-------------|-------------|
| Google Workspace | 2,000 emails/day |
| Gmail (free) | 500 emails/day |

The add-on automatically respects these limits and will queue remaining emails.

## License

MIT License - See [LICENSE](LICENSE) for details.

## Contributing

Contributions welcome! Please read the [Developer Guide](docs/DEVELOPER_GUIDE.md) first.

## Credits

Built by EUSD Server Engineering team as an internal tool, released as open source.
