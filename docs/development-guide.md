# Development Guide

This guide provides instructions for developers working on the South African ID Validation application.

## Development Environment Setup

1. **Prerequisites**
   - Node.js 18.x or later
   - npm or yarn
   - Docker and Docker Compose (for MariaDB)
   - Git

2. **Setting Up Local Environment**

   ```bash
   # Clone the repository
   git clone [repository-url]
   cd minimalreactmariadbapp

   # Install dependencies
   npm install

   # Start MariaDB in Docker
   docker-compose up -d

   # Start development server
   npm run dev
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory with the following variables:

   ```
   DATABASE_URL=mysql://user:password@localhost:3306/sa_id_validation
   HOME_AFFAIRS_API_KEY=test_key_for_development
   ```

## Project Structure

- `/src/app` - Next.js app router components and routes
- `/src/components` - Reusable React components
- `/src/context` - React context providers
- `/src/utils` - Utility functions including ID validation
- `/docs` - Documentation files
- `/public` - Static assets

## Development Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/descriptive-name
   ```

2. **Implement Changes**
   - Follow project architecture patterns
   - Write tests alongside code
   - Document complex logic with comments

3. **Run Tests**

   ```bash
   # Run unit tests
   npm test

   # Run with coverage
   npm test -- --coverage
   ```

4. **Lint Code**

   ```bash
   npm run lint
   ```

5. **Submit Pull Request**
   - Create PR with descriptive title
   - Reference related issues
   - Ensure CI checks pass

## ROI-Focused Development Guidelines

When contributing to this project, follow these guidelines to maximize ROI:

1. **Error Prevention Priority**
   - Focus on validating user input thoroughly
   - Handle edge cases in ID validation logic
   - Write comprehensive tests for validation functions

2. **Performance Optimization**
   - Keep validation functions efficient (target <100ms)
   - Use React.memo for expensive components
   - Minimize unnecessary re-renders

3. **User Experience**
   - Provide clear, actionable error messages
   - Ensure responsive design works on all devices
   - Maintain accessibility compliance

4. **Code Quality**
   - Follow TypeScript best practices
   - Document complex algorithms
   - Keep components focused on single responsibilities

## Database Schema

The MariaDB database includes the following tables:

### `validation_log` Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| id_number | VARCHAR(13) | Validated ID number (hashed) |
| validation_result | BOOLEAN | Whether validation passed |
| errors | TEXT | JSON array of errors if any |
| timestamp | TIMESTAMP | When validation occurred |

### `api_requests` Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| endpoint | VARCHAR(255) | API endpoint called |
| status_code | INT | HTTP status code |
| response_time_ms | INT | Response time in milliseconds |
| timestamp | TIMESTAMP | When request was made |

## Testing Strategy

1. **Unit Tests**
   - Test all validation functions in isolation
   - Mock external dependencies

2. **Component Tests**
   - Test React components with React Testing Library
   - Focus on user interactions and rendering

3. **Integration Tests**
   - Test form submission flow
   - Test context provider integration

4. **E2E Tests** (planned)
   - Test complete user flows
   - Verify database logging

## Deployment

The application is deployed using a CI/CD pipeline that includes:

1. Running tests and linting
2. Building the application
3. Deploying to staging for verification
4. Promoting to production after approval

## Troubleshooting

Common issues and their solutions:

1. **Database Connection Issues**
   - Check Docker container is running: `docker ps`
   - Verify database credentials in `.env.local`

2. **API Mock Issues**
   - The Home Affairs API is mocked in development
   - Check error handling in homeAffairsService.ts

3. **Test Failures**
   - Run tests with verbose flag: `npm test -- --verbose`
   - Check test coverage with `npm test -- --coverage`
