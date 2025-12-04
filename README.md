# crispy-fishstick

Collection of Zendesk Plugins used in JustServe.

## Prerequisites

### Windows Setup

Install Node.js and npm using winget:

```powershell
winget install OpenJS.NodeJS
```

Verify the installation:

```powershell
node --version; npm --version
```

## Installation

Clone the repository and install dependencies:

```bash
git clone git@github.com/JustServe-Resources/crispy-fishstick.git
cd crispy-fishstick
npm install
```

This will install:
- **@zendesk/zcli** – Zendesk CLI for plugin validation and deployment
- **ESLint** – JavaScript linter for code quality
- **Prettier** – Code formatter

## Common Commands

### Development

View available npm scripts:

```bash
npm run
```

### Linting & Formatting

Check for linting issues:

```bash
npm run lint
```

Auto-fix linting issues:

```bash
npm run lint:fix
```

Format code with Prettier:

```bash
npm run format
```

### Plugin Management

Validate a plugin using ZCLI:

```bash
zcli apps:validate <plugin-directory>
```

Example:

```bash
zcli apps:validate ./problem-ticket-search
```

## Project Structure

Each plugin is located in its own directory with the following structure:

```
plugin-name/
├── manifest.json       # Plugin configuration
├── assets/             # Plugin source files (HTML, CSS, JS)
├── components/         # React components (if applicable)
├── translations/       # Localization files (JSON)
└── package.json        # Plugin-specific dependencies
```

### Current Plugins

- **help-center-redirect-manager** – Redirect help center articles
- **incident-metadata-prefill** – Pre-fill incident metadata
- **problem-ticket-merger** – Merge problem tickets
- **problem-ticket-search** – Search for problem tickets
- **quick-problem-ticket-creator** – Quickly create problem tickets
- **test-run-manager** – Manage test runs
- **AttachedTicketsManager** – Manage attached tickets

## Development

Each plugin contains its own `assets` directory with HTML, CSS, and JavaScript files. To develop:

1. Edit files in the plugin's `assets` or `components` directory
2. Run `npm run lint:fix` to ensure code quality
3. Run `npm run format` to format your code
4. Use `zcli apps:validate <plugin-directory>` to validate before deployment

## Deployment

To deploy a plugin:

```bash
zcli apps:create <plugin-directory>
```

or update an existing app:

```bash
zcli apps:update <app-id> <plugin-directory>
```

Refer to [Zendesk CLI documentation](https://developer.zendesk.com/documentation/apps/zendesk-cli/) for more details.
