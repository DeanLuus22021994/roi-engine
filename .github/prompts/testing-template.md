# Testing Template for VS Code Insiders Agent

## Unit Test Template
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  test('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  test('handles user interaction', async () => {
    render(<ComponentName />);
    await userEvent.click(screen.getByRole('button', { name: /button name/i }));
    expect(screen.getByText(/updated text/i)).toBeInTheDocument();
  });

  test('calls appropriate functions', () => {
    const mockFunction = jest.fn();
    render(<ComponentName onAction={mockFunction} />);
    userEvent.click(screen.getByRole('button'));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledWith(expect.any(Object));
  });
});
```

## API Test Template
```javascript
import request from 'supertest';
import app from '../app';
import db from '../database';

describe('API Endpoint: /api/resource', () => {
  beforeAll(async () => {
    // Setup test database
    await db.migrate.latest();
    await db.seed.run();
  });

  afterAll(async () => {
    // Clean up
    await db.destroy();
  });

  test('GET returns status 200 and correct data', async () => {
    const response = await request(app).get('/api/resource');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3); // Adjust based on seeded data
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST creates new resource', async () => {
    const newResource = { name: 'Test Resource', value: 'test' };
    const response = await request(app)
      .post('/api/resource')
      .send(newResource);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newResource.name);
  });
});
```

## E2E Test Template
```javascript
describe('User flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes critical user path', () => {
    // Login
    cy.findByLabelText(/username/i).type('testuser');
    cy.findByLabelText(/password/i).type('password123');
    cy.findByRole('button', { name: /log in/i }).click();
    
    // Navigate to resource page
    cy.findByRole('link', { name: /resources/i }).click();
    cy.url().should('include', '/resources');
    
    // Create new resource
    cy.findByRole('button', { name: /create new/i }).click();
    cy.findByLabelText(/name/i).type('New Resource');
    cy.findByLabelText(/description/i).type('This is a test resource');
    cy.findByRole('button', { name: /save/i }).click();
    
    // Verify resource was created
    cy.findByText(/successfully created/i).should('be.visible');
    cy.findByText('New Resource').should('be.visible');
  });
});
```