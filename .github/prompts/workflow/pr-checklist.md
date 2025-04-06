# Pull Request Checklist: ROI-Oriented Review

This checklist helps ensure pull requests deliver maximum ROI by focusing reviews on high-impact areas.

## Business Value Assessment

- [ ] Clear description of the business value/problem solved
- [ ] ROI analysis included for significant features
- [ ] Success metrics defined for measuring impact

## High-Priority Review Areas

### Error Prevention & Security (Highest ROI)

- [ ] No new TypeScript errors or type bypasses (`any`, type assertions)
- [ ] Security vulnerabilities addressed (auth, data validation, injections)
- [ ] Error handling for critical paths and edge cases
- [ ] No exposure of sensitive data

### Performance & Scalability (High ROI)

- [ ] Critical user paths remain performant (includes profiling if needed)
- [ ] No N+1 database query issues introduced
- [ ] Lazy loading used appropriately
- [ ] Components memoized when beneficial

### Testing Coverage (High ROI)

- [ ] Tests added for critical business logic
- [ ] Edge cases and error paths tested
- [ ] No regressions in existing functionality
- [ ] Test coverage meets category requirements per test-coverage-strategy.md

## Medium-Priority Review Areas

### Maintainability & Architecture

- [ ] Follows architectural patterns in code-organization-strategy.md
- [ ] Code is DRY but not over-engineered
- [ ] Complex logic is documented
- [ ] No tight coupling between unrelated modules

### Developer Experience

- [ ] Clear naming conventions followed
- [ ] APIs well documented
- [ ] Complex algorithms explained
- [ ] Helpful comments where appropriate

## Lower-Priority Review Areas

- [ ] Code style and formatting consistency
- [ ] Minor UI adjustments match designs
- [ ] Documentation updates
- [ ] Non-critical TODOs addressed

## Pre-Merge Checks

- [ ] CI pipeline passes (tests, linting, type checking)
- [ ] Required reviewers have approved
- [ ] Performance impact measured for significant changes
- [ ] Breaking changes documented and communicated

## ROI-Focused Review Process

1. **First Pass**: Focus on high-priority items that could impact system stability, security, or performance
2. **Second Pass**: Review medium-priority items affecting maintainability and developer experience
3. **Third Pass**: Address lower-priority items if time permits

## Pull Request Size Guidelines

For optimal ROI of review time:

- **Small PRs** (<300 lines): Complete review of all priority areas
- **Medium PRs** (300-1000 lines): Focus on high and medium priorities
- **Large PRs** (>1000 lines): Focus primarily on high-priority areas, consider breaking into smaller PRs

## Common ROI Improvements to Suggest

- Replacing custom implementations with standard libraries
- Adding monitoring for critical business functions
- Optimizing database queries for frequently used endpoints
- Adding retry logic for external service calls
- Improving error messages to help with debugging
