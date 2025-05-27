# Testing Documentation

## Overview

This document outlines the testing strategy for the TripWise application.

## Test Types

### Unit Tests

- Location: `testing/tests/unit/`
- Purpose: Test individual components and functions
- Coverage: Components, utilities, and helper functions

### Integration Tests

- Location: `testing/tests/integration/`
- Purpose: Test interactions between components
- Coverage: API endpoints, database operations, authentication flows

### End-to-End Tests

- Location: `testing/tests/e2e/`
- Purpose: Test complete user journeys
- Coverage: Critical user paths and workflows

## Running Tests

```bash
# Run all tests
npm run test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## Test Coverage Requirements

- Minimum coverage: 80%
- Critical paths: 100%
- New features: Must include tests

## Writing Tests

1. Follow the existing test patterns
2. Use descriptive test names
3. Include both positive and negative test cases
4. Mock external dependencies
