# Code Review Checklist for VS Code Insiders Agent

## General
- [ ] Code follows the project's style guidelines
- [ ] No commented out code or debug statements
- [ ] No hard-coded values that should be configuration
- [ ] Proper error handling is implemented
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Functions/methods have a single responsibility
- [ ] Complex logic is documented
- [ ] No unnecessary dependencies added

## React Components
- [ ] Components are function-based with hooks
- [ ] Components have proper prop validation
- [ ] Components are properly decomposed (not too large)
- [ ] No unnecessary re-renders (useMemo, useCallback used when appropriate)
- [ ] Proper key props used in lists
- [ ] Event handlers are properly bound
- [ ] No direct DOM manipulation
- [ ] Styling follows project conventions
- [ ] Accessibility considerations addressed

## State Management
- [ ] State is managed at the appropriate level
- [ ] State updates do not mutate existing state
- [ ] Complex state logic is extracted to reducers or custom hooks
- [ ] Context API used appropriately for global state
- [ ] Effects have proper dependency arrays

## Database Operations
- [ ] Queries are optimized
- [ ] Proper indexing is used
- [ ] Transactions used when appropriate
- [ ] Prepared statements for user input
- [ ] No N+1 query problems
- [ ] Database connection pool properly managed

## API Design
- [ ] Endpoints follow REST conventions
- [ ] Proper HTTP methods used
- [ ] Status codes used correctly
- [ ] Error responses are consistent
- [ ] Validation for all inputs
- [ ] Rate limiting considerations
- [ ] Authentication/authorization checks

## Security
- [ ] No sensitive data exposure
- [ ] Input validation and sanitization
- [ ] Authentication and authorization checks
- [ ] Protection against common vulnerabilities (XSS, CSRF, SQL Injection)
- [ ] HTTPS used for all requests
- [ ] Secure cookie settings

## Testing
- [ ] Unit tests for business logic
- [ ] Component tests for React components
- [ ] API tests for endpoints
- [ ] Edge cases are covered
- [ ] Tests are meaningful, not just for coverage
- [ ] Mocks and stubs used appropriately

## Performance
- [ ] No unnecessary renders in React
- [ ] Expensive operations are memoized
- [ ] Lazy loading used when appropriate
- [ ] Database queries are optimized
- [ ] Assets are optimized (images, etc.)
- [ ] Bundle size considerations