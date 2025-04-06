# Test Template: ROI-Optimized Testing Strategy

Use this template when creating tests to ensure they focus on high-ROI scenarios, critical user paths, and proper error handling.

## Test Structure Guidelines

### Unit Test Template

```typescript
import { functionToTest } from './module';

describe('Module: Function Name', () => {
  // Happy path tests (high ROI)
  describe('when used with valid inputs', () => {
    test('returns expected result for normal use case', () => {
      // Arrange
      const input = { /* valid input */ };
      const expected = { /* expected output */ };
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toEqual(expected);
    });
    
    test('handles edge case correctly', () => {
      // Arrange
      const edgeInput = { /* edge case input */ };
      const expected = { /* expected output */ };
      
      // Act
      const result = functionToTest(edgeInput);
      
      // Assert
      expect(result).toEqual(expected);
    });
  });
  
  // Error handling tests (high ROI)
  describe('when used with invalid inputs', () => {
    test('throws appropriate error for null input', () => {
      // Arrange & Act & Assert
      expect(() => functionToTest(null)).toThrow('Input cannot be null');
    });
    
    test('handles missing optional parameters', () => {
      // Arrange
      const incompleteInput = { /* missing optional params */ };
      const expected = { /* expected output with defaults */ };
      
      // Act
      const result = functionToTest(incompleteInput);
      
      // Assert
      expect(result).toEqual(expected);
    });
  });
  
  // Performance considerations (medium ROI)
  describe('performance characteristics', () => {
    test('processes large inputs efficiently', () => {
      // Arrange
      const largeInput = Array(1000).fill({ /* sample data */ });
      
      // Act & Assert
      expect(() => {
        functionToTest(largeInput);
      }).not.toThrow();
      
      // Optional performance assertions
      // const startTime = performance.now();
      // functionToTest(largeInput);
      // const endTime = performance.now();
      // expect(endTime - startTime).toBeLessThan(100); // ms
    });
  });
});
```

### React Component Test Template

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentToTest } from './Component';

// Mock external dependencies
jest.mock('../services/apiService', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mocked data' }))
}));

describe('Component: ComponentName', () => {
  // Setup and teardown
  beforeEach(() => {
    // Common setup (reset mocks, prepare test data)
    jest.clearAllMocks();
  });
  
  // Critical path tests (highest ROI)
  test('renders critical UI elements correctly', () => {
    // Arrange
    render(<ComponentToTest />);
    
    // Assert - check for critical elements
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
  
  test('handles primary user interaction correctly', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ComponentToTest />);
    
    // Act - simulate main user flow
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Assert - check the expected outcome
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
  
  // Error handling tests (high ROI)
  test('displays validation errors for invalid input', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ComponentToTest />);
    
    // Act - trigger validation
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Assert - check error display
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });
  
  test('handles API errors gracefully', async () => {
    // Arrange - mock API failure
    const mockedApiService = require('../services/apiService');
    mockedApiService.fetchData.mockRejectedValueOnce(new Error('API Error'));
    
    const user = userEvent.setup();
    render(<ComponentToTest />);
    
    // Act - trigger API call
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Assert - check error handling
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
  
  // Accessibility tests (medium-high ROI)
  test('is accessible', async () => {
    // Note: requires jest-axe
    const { container } = render(<ComponentToTest />);
    
    // Example with jest-axe
    // const results = await axe(container);
    // expect(results).toHaveNoViolations();
  });
});
```

### API Integration Test Template

```typescript
import request from 'supertest';
import { app } from '../app';
import { db } from '../database';

describe('API: /api/resource', () => {
  // Setup test data and cleanup
  beforeAll(async () => {
    // Setup test database
    await db.migrate.latest();
    await db.seed.run();
  });
  
  afterAll(async () => {
    // Clean up
    await db.destroy();
  });
  
  // Critical path tests (highest ROI)
  describe('GET /api/resource', () => {
    test('returns 200 and correct data structure', async () => {
      // Act
      const response = await request(app).get('/api/resource');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Validate data structure (prevents contract breaking)
      const firstItem = response.body.data[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('createdAt');
    });
    
    test('supports pagination', async () => {
      // Act
      const response = await request(app).get('/api/resource?page=1&limit=5');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.items.length).toBeLessThanOrEqual(5);
      expect(response.body.data).toHaveProperty('page', 1);
      expect(response.body.data).toHaveProperty('limit', 5);
      expect(response.body.data).toHaveProperty('total');
    });
  });
  
  describe('POST /api/resource', () => {
    test('creates resource with valid data', async () => {
      // Arrange
      const newResource = {
        name: 'Test Resource',
        email: 'test@example.com',
      };
      
      // Act
      const response = await request(app)
        .post('/api/resource')
        .send(newResource);
      
      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newResource.name);
      
      // Verify data was saved (optional but high value)
      const getResponse = await request(app).get(`/api/resource/${response.body.data.id}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.data.name).toBe(newResource.name);
    });
    
    // Error handling test (high ROI)
    test('returns 400 for invalid data', async () => {
      // Arrange
      const invalidResource = {
        name: '', // Empty name should fail validation
        email: 'not-an-email', // Invalid email format
      };
      
      // Act
      const response = await request(app)
        .post('/api/resource')
        .send(invalidResource);
      
      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeTruthy();
    });
  });
  
  // Security tests (highest ROI)
  describe('security concerns', () => {
    test('requires authentication for protected endpoints', async () => {
      // Act
      const response = await request(app).delete('/api/resource/1');
      
      // Assert
      expect(response.status).toBe(401);
    });
    
    test('prevents unauthorized access to resources', async () => {
      // Arrange
      const authToken = 'valid-token-for-wrong-user';
      
      // Act
      const response = await request(app)
        .get('/api/resource/restricted-resource')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Assert
      expect(response.status).toBe(403);
    });
  });
});
```

## ROI-Focused Testing Checklist

### Critical Path Tests (Highest ROI)

- [ ] Tests for core business functionality
- [ ] Tests for revenue-impacting features
- [ ] Tests for user authentication/authorization
- [ ] Tests for data persistence and retrieval

### Error Handling Tests (High ROI)

- [ ] Tests for input validation
- [ ] Tests for API error responses
- [ ] Tests for UI error states
- [ ] Tests for edge cases and boundary conditions

### Security Tests (High ROI)

- [ ] Tests for authentication requirements
- [ ] Tests for authorization rules
- [ ] Tests for input sanitization
- [ ] Tests for proper error messages (no leaking info)

### Performance Tests (Medium-High ROI)

- [ ] Tests for response time on critical paths
- [ ] Tests for handling large datasets
- [ ] Tests for resource usage (memory, CPU)
- [ ] Tests for concurrent users/requests

### User Experience Tests (Medium ROI)

- [ ] Tests for accessibility compliance
- [ ] Tests for responsive design
- [ ] Tests for form validation feedback
- [ ] Tests for proper loading states

### Maintainability Checks (Medium ROI)

- [ ] Tests are easy to understand
- [ ] Tests have clear arrange/act/assert sections
- [ ] Tests mock external dependencies
- [ ] Tests are isolated and don't affect each other

## Test Skip/Defer Criteria

It's acceptable to have lower test coverage for:

1. UI styling details (use visual testing instead)
2. Third-party library functionality (already tested by library authors)
3. Trivial code with minimal logic
4. Legacy code scheduled for replacement
5. Prototype/experimental features

## ROI Testing Principles

1. **Focus on user-facing functionality first** - test what users actually experience
2. **Test error cases thoroughly** - errors are often where systems fail most visibly
3. **Test security-sensitive areas comprehensively** - breaches have enormous costs
4. **Balance coverage with maintenance cost** - not all code deserves the same testing effort
5. **Prioritize automation of repetitive tests** - free up human testers for exploratory testing
