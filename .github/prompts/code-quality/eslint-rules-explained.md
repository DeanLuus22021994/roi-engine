# ESLint Rules Explained: ROI Impact Analysis

This document explains our ESLint rules in the context of their ROI impact, helping developers understand which rules provide the most value when addressed.

## High ROI Rules

### Error Prevention Rules

These rules prevent runtime errors and have the highest ROI when fixed:

| Rule | Description | ROI Justification |
|------|-------------|-------------------|
| `no-unused-vars` | Disallow unused variables | Prevents memory leaks and indicates potential logic errors |
| `no-undef` | Disallow undeclared variables | Prevents ReferenceError crashes in production |
| `react-hooks/rules-of-hooks` | Enforce Rules of Hooks | Prevents unpredictable React behavior and hard-to-debug issues |
| `react-hooks/exhaustive-deps` | Verify dependency arrays | Prevents stale closures and infinite re-render bugs |
| `@typescript-eslint/no-explicit-any` | Disallow `any` type | Prevents type safety bypasses that can lead to runtime errors |

### Security Rules

These rules prevent security vulnerabilities:

| Rule | Description | ROI Justification |
|------|-------------|-------------------|
| `react/no-danger` | Prevent use of dangerouslySetInnerHTML | Prevents XSS vulnerabilities |
| `no-eval` | Disallow eval() | Prevents code injection attacks |
| `@typescript-eslint/no-unsafe-assignment` | Prevent unsafe assignments | Prevents type coercion issues that could lead to security exploits |

## Medium ROI Rules

### Maintainability Rules

These rules improve code maintainability and have a medium-term ROI:

| Rule | Description | ROI Justification |
|------|-------------|-------------------|
| `complexity` | Limit cyclomatic complexity | Reduces cognitive load and bug probability in complex functions |
| `max-lines-per-function` | Limit function size | Improves code readability and testability |
| `no-duplicate-imports` | Prevent duplicate imports | Improves bundle size and readability |
| `prefer-const` | Use const for variables never reassigned | Makes code intent clearer and prevents accidental reassignment |

### Performance Rules

These rules improve runtime performance:

| Rule | Description | ROI Justification |
|------|-------------|-------------------|
| `react/jsx-no-bind` | Avoid creating functions in render | Prevents unnecessary re-renders |
| `import/no-cycle` | Prevent circular dependencies | Improves bundle size and load time |
| `react/no-array-index-key` | Prevent using array index as key | Improves list rendering performance and prevents state bugs |

## Lower ROI Rules

### Style and Formatting Rules

These rules improve code consistency but have lower direct ROI:

| Rule | Description | ROI Justification |
|------|-------------|-------------------|
| `indent` | Enforce consistent indentation | Improves readability but doesn't affect functionality |
| `quotes` | Enforce quote style | Aesthetic consistency only |
| `semi` | Require or disallow semicolons | Stylistic preference with minimal impact |

## How to Prioritize ESLint Fixes

1. **Focus on Error Prevention**: Always fix high ROI rules first as they prevent actual bugs
2. **Address Security Issues**: Fix any security-related violations immediately
3. **Improve Maintainability**: Address maintainability rules next, especially in frequently modified code
4. **Style Last**: Fix style issues during refactoring or with automated tools

## Automated Fixes

Many ESLint rules can be automatically fixed using:

```bash
npx eslint --ext .ts,.tsx --fix src/
```

## Disabling Rules

If a rule must be disabled, always:

1. Disable for the smallest possible scope
2. Add a comment explaining why
3. Consider if there's a better architectural solution

Example:

```typescript
// eslint-disable-next-line no-unused-vars
function handleError(error: Error) {
  // This function is required by the API contract but not used in this context
}
```
