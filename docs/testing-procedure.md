# Testing Procedure for ROI Engine MVP

## Overview

This document outlines the steps to run tests, generate reports, and archive results for the ROI Engine MVP.

## Prerequisites

- Node.js and npm installed
- Dependencies installed via `npm install`

## Running Tests

1. **Run All Tests**:

   ```bash
   npm run test
   ```

   - Executes unit, integration, and E2E tests.
   - Generates coverage and detailed reports.

2. **Run Unit Tests Only**:

   ```bash
   npm run test:unit
   ```

   - Runs Jest tests and generates a coverage report.

3. **Run E2E Tests Only**:

   ```bash
   npm run test:e2e
   ```

   - Runs Cypress tests and generates a detailed log.

## Viewing Reports

- Jest Coverage Report:
  - Located in `test-reports/jest-coverage/` folder.
  - Open `index.html` in a browser to view.
- Cypress Logs:
  - Located in `test-reports/cypress-reports/` folder.

## Archiving Reports

- After running tests, reports are automatically archived in the `test-reports/` folder.

## Future Testing

- Use the same commands to re-run tests and generate updated reports.
- Ensure reports are archived for future reference.
