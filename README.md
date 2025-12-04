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

Refer to each plugin's README for specific build and deployment instructions.
