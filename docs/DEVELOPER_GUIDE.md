# Developer Guide

## Google Sheets Mail Merge Add-on

This guide covers setting up the development environment, project architecture, and contribution guidelines.

---

## Table of Contents

1. [Development Setup](#development-setup)
2. [Project Architecture](#project-architecture)
3. [Working with CLASP](#working-with-clasp)
4. [Code Style](#code-style)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Contributing](#contributing)

---

## Development Setup

### Prerequisites

- **Node.js** v18 or later
- **npm** (comes with Node.js)
- **Git**
- **Google Account** with Apps Script access

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/eusd-server-engineer/google-sheets-mail-merge.git
cd google-sheets-mail-merge

# Install CLASP globally
npm install -g @google/clasp

# Login to Google
clasp login
# This opens a browser for Google OAuth

# Verify login
clasp login --status
```

### Creating a Development Project

```bash
# Create new Apps Script project (one-time setup)
cd src
clasp create --type sheets --title "Mail Merge Dev"

# This creates .clasp.json with your script ID
```

### Linking to Existing Project

If you already have an Apps Script project:

```bash
# Get the script ID from the Apps Script editor URL
# https://script.google.com/home/projects/<SCRIPT_ID>/edit

# Create .clasp.json manually
echo '{"scriptId":"YOUR_SCRIPT_ID","rootDir":"./src"}' > .clasp.json
```

---

## Project Architecture

### Directory Structure

```
google-sheets-mail-merge/
├── README.md                 # Project overview
├── LICENSE                   # MIT license
├── .gitignore               # Git ignore rules
├── .clasp.json              # CLASP configuration (not committed)
├── docs/
│   ├── PRD.md               # Product requirements
│   ├── IMPLEMENTATION_PLAN.md
│   ├── USER_GUIDE.md        # End user documentation
│   └── DEVELOPER_GUIDE.md   # This file
└── src/
    ├── appsscript.json      # Apps Script manifest
    ├── Code.gs              # Entry point
    ├── MailMerge.gs         # Core mail merge logic
    ├── Tracking.gs          # Open/click tracking
    ├── Templates.gs         # Template management
    ├── Scheduling.gs        # Scheduled sending
    ├── Automation.gs        # Triggers and follow-ups
    ├── Unsubscribe.gs       # Unsubscribe handling
    ├── Utils.gs             # Shared utilities
    ├── html/
    │   ├── Sidebar.html     # Main sidebar UI
    │   ├── Compose.html     # Email composer
    │   └── Templates.html   # Template manager
    └── css/
        └── styles.html      # Shared CSS (as HTML include)
```

### Module Responsibilities

| File | Purpose |
|------|---------|
| `Code.gs` | Entry point, menu setup, routing to other modules |
| `MailMerge.gs` | Core merge logic, email sending, batch processing |
| `Tracking.gs` | Open/click tracking, pixel serving, analytics |
| `Templates.gs` | Template CRUD, storage in hidden sheets |
| `Scheduling.gs` | Scheduled campaigns, time-based triggers |
| `Automation.gs` | Form triggers, follow-up sequences |
| `Unsubscribe.gs` | Unsubscribe handling, list management |
| `Utils.gs` | Shared functions, validation, helpers |

### Data Flow

```
User Input (Sidebar)
       ↓
   google.script.run
       ↓
   Code.gs (routes)
       ↓
   MailMerge.gs
       ↓
   ├── Read spreadsheet data
   ├── Process merge fields
   ├── Apply tracking (optional)
   └── Send via GmailApp
       ↓
   Update status column
       ↓
   Return to UI
```

---

## Working with CLASP

### Common Commands

```bash
# Push local changes to Apps Script
clasp push

# Pull remote changes to local
clasp pull

# Open project in browser
clasp open

# View logs
clasp logs

# Create new deployment
clasp deploy --description "v1.0.0"

# List deployments
clasp deployments
```

### Watch Mode

For active development:

```bash
# Auto-push on file changes
clasp push --watch
```

### Managing Versions

```bash
# Create a new version
clasp version "Added tracking feature"

# Deploy specific version
clasp deploy --versionNumber 2 --description "v1.1.0"
```

---

## Code Style

### General Guidelines

- **Use modern JavaScript (ES6+)** - V8 runtime is enabled
- **Clear function names** - Descriptive, verb-first (`sendEmail`, `getTemplates`)
- **JSDoc comments** - Document public functions
- **Consistent formatting** - 2-space indentation

### Example Function

```javascript
/**
 * Sends a merged email to a single recipient.
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject (may contain merge fields)
 * @param {string} body - Email body HTML (may contain merge fields)
 * @param {Object} rowData - Data for merge field replacement
 * @param {Object} options - Additional options (cc, bcc, attachments)
 * @returns {Object} Result with status and any error message
 */
function sendMergedEmail(to, subject, body, rowData, options = {}) {
  try {
    const mergedSubject = processMergeFields(subject, rowData);
    const mergedBody = processMergeFields(body, rowData);

    GmailApp.sendEmail(to, mergedSubject, '', {
      htmlBody: mergedBody,
      cc: options.cc || '',
      bcc: options.bcc || '',
      name: options.fromName || '',
      attachments: options.attachments || []
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### HTML/CSS in Apps Script

Include CSS in HTML files using `<?!= include('css/styles') ?>`:

```html
<!-- Sidebar.html -->
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <?!= include('css/styles'); ?>
</head>
<body>
  <!-- Content -->
  <script>
    // Client-side JavaScript
  </script>
</body>
</html>
```

```html
<!-- css/styles.html -->
<style>
  .sidebar {
    font-family: 'Google Sans', Arial, sans-serif;
    padding: 16px;
  }
  .btn-primary {
    background-color: #1a73e8;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
```

---

## Testing

### Manual Testing

Create a test spreadsheet and manually verify:

1. Column detection works
2. Merge fields replace correctly
3. Emails send successfully
4. Status column updates
5. Tracking works (if enabled)

### Test Functions

Add test functions that can be run from the script editor:

```javascript
/**
 * Run all tests. Execute from Script Editor.
 */
function runAllTests() {
  console.log('Starting tests...');

  testEmailValidation();
  testMergeFieldParsing();
  testMergeFieldReplacement();

  console.log('All tests passed!');
}

function testEmailValidation() {
  const validEmails = ['test@example.com', 'user.name@domain.org'];
  const invalidEmails = ['notanemail', '@nodomain.com', 'spaces here@test.com'];

  validEmails.forEach(email => {
    if (!isValidEmail(email)) {
      throw new Error(`Valid email failed: ${email}`);
    }
  });

  invalidEmails.forEach(email => {
    if (isValidEmail(email)) {
      throw new Error(`Invalid email passed: ${email}`);
    }
  });

  console.log('✓ Email validation tests passed');
}

function testMergeFieldParsing() {
  const template = 'Hello {{Name}}, welcome to {{Company}}!';
  const fields = extractMergeFields(template);

  if (fields.length !== 2 || !fields.includes('Name') || !fields.includes('Company')) {
    throw new Error('Merge field parsing failed');
  }

  console.log('✓ Merge field parsing tests passed');
}

function testMergeFieldReplacement() {
  const template = 'Hi {{FirstName}} {{LastName}}';
  const data = { FirstName: 'John', LastName: 'Doe' };
  const result = processMergeFields(template, data);

  if (result !== 'Hi John Doe') {
    throw new Error(`Expected "Hi John Doe", got "${result}"`);
  }

  console.log('✓ Merge field replacement tests passed');
}
```

### Test Data

Use a dedicated test sheet with known data:

```
| Email | FirstName | LastName |
|-------|-----------|----------|
| test@example.com | Test | User |
| yourmail@gmail.com | Your | Name |
```

---

## Deployment

### Development Deployment

```bash
# Push and open for testing
clasp push && clasp open
```

### Staging Deployment

1. Create a versioned deployment for testing:
   ```bash
   clasp version "Staging v1.0"
   clasp deploy --versionNumber 1 --description "Staging"
   ```

2. Share with test users for feedback

### Production Deployment

1. Final testing complete
2. Create production version:
   ```bash
   clasp version "Production v1.0.0"
   clasp deploy --versionNumber 2 --description "Production v1.0.0"
   ```

3. For organization-wide deployment:
   - Submit to Google Workspace Marketplace (internal)
   - Or share the installation link with users

### Deployment Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version number incremented
- [ ] CHANGELOG updated
- [ ] OAuth scopes are minimal
- [ ] No sensitive data in code
- [ ] Error handling complete

---

## Contributing

### Workflow

1. **Fork** the repository
2. **Create a branch** for your feature/fix
3. **Make changes** following code style guidelines
4. **Test** your changes thoroughly
5. **Submit a pull request**

### Pull Request Guidelines

- Clear description of changes
- Reference any related issues
- Include testing steps
- Update documentation if needed

### Issue Reporting

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/environment details
- Screenshots if applicable

### Feature Requests

Submit feature requests as GitHub Issues with:
- Clear description of the feature
- Use case / why it's needed
- Any implementation suggestions

---

## Troubleshooting Development Issues

### "Script not found"

```bash
# Verify .clasp.json exists and has correct scriptId
cat .clasp.json
```

### "Permission denied"

```bash
# Re-login to CLASP
clasp logout
clasp login
```

### "Manifest file missing"

Ensure `appsscript.json` exists in the `src/` directory:

```json
{
  "timeZone": "America/Los_Angeles",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```

### Changes not appearing

```bash
# Force push all files
clasp push --force
```

---

## Resources

- [Apps Script Documentation](https://developers.google.com/apps-script)
- [CLASP GitHub](https://github.com/google/clasp)
- [GmailApp Reference](https://developers.google.com/apps-script/reference/gmail/gmail-app)
- [HTML Service Guide](https://developers.google.com/apps-script/guides/html)
- [Triggers Guide](https://developers.google.com/apps-script/guides/triggers)

---

*Last updated: January 2025*
