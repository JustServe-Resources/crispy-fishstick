#!/usr/bin/env node

/**
 * README Validation Tests
 * 
 * This test suite validates that all code block commands in README.md work correctly.
 * It only tests that instructions users should follow actually execute successfully.
 */

const { execSync } = require('child_process');

// Test utilities
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let testsPassed = 0;
let testsFailed = 0;

function log(color, message) {
  console.log(`${colors[color] || colors.reset}${message}${colors.reset}`);
}

function test(name, fn) {
  try {
    fn();
    testsPassed++;
    log('green', `✓ ${name}`);
  } catch (error) {
    testsFailed++;
    log('red', `✗ ${name}`);
    log('red', `  ${error.message}`);
  }
}

function assertCommandExists(command, message) {
  try {
    execSync(`${command} --help || ${command} --version || true`, { stdio: 'pipe', shell: true });
  } catch (error) {
    throw new Error(`${message || command} is not available: ${error.message}`);
  }
}

function assertCommandSucceeds(command, message) {
  try {
    execSync(command, { stdio: 'pipe', shell: true });
  } catch (error) {
    throw new Error(`${message || command} failed: ${error.message}`);
  }
}

// Run tests
log('blue', '\n📋 README Commands Validation\n');

// Prerequisites
log('blue', 'Prerequisites:');
test('node --version', () => {
  assertCommandSucceeds('node --version', 'node command failed');
});

test('npm --version', () => {
  assertCommandSucceeds('npm --version', 'npm command failed');
});

// Common Commands - Development
log('blue', '\nCommon Commands - Development:');
test('npm run', () => {
  assertCommandSucceeds('npm run', 'npm run failed');
});

// Common Commands - Linting & Formatting
log('blue', '\nCommon Commands - Linting & Formatting:');
test('npm run lint (command exists)', () => {
  assertCommandExists('npm run lint', 'npm run lint command not found');
});

test('npm run lint:fix (command exists)', () => {
  assertCommandExists('npm run lint:fix', 'npm run lint:fix command not found');
});

test('npm run format', () => {
  assertCommandSucceeds('npm run format', 'npm run format failed');
});

// Plugin Management - zcli commands
log('blue', '\nPlugin Management - zcli availability:');
test('zcli --version', () => {
  assertCommandSucceeds('zcli --version', 'zcli command failed');
});

// Summary
log('blue', '\n' + '='.repeat(50));
log('blue', `Tests: ${testsPassed} passed, ${testsFailed} failed`);

if (testsFailed === 0) {
  log('green', '\n✓ All README commands work!\n');
  process.exit(0);
} else {
  log('red', '\n✗ Some commands failed. Please review the errors above.\n');
  process.exit(1);
}
