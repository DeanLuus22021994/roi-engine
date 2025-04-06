# TypeScript Best Practices for ROI Optimization

## Type Safety Principles

- Strong typing provides the highest ROI through error prevention
- Type errors discovered at compile time have 10x lower cost than runtime errors
- Invest in proper typing as an insurance policy against costly production bugs

## High-ROI TypeScript Patterns

### Use Discriminated Unions for State Management

```typescript
type RequestState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: T }
  | { status: 'error', error: Error };

// Usage ensures all states are handled
function renderData<T>(state: RequestState<T>) {
  switch (state.status) {
    case 'idle': 
      return <Idle />;
    case 'loading': 
      return <Loading />;
    case 'success': 
      return <Success data={state.data} />;
    case 'error': 
      return <Error error={state.error} />;
  }
}
```

### Make Impossible States Impossible

```typescript
// Bad: allows invalid combinations
interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
}

// Good: states are mutually exclusive
type FormState = 
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error', message: string };
```

### Leverage Utility Types for DRY Code

```typescript
// Extract common fields to reduce duplication
interface UserBase {
  id: string;
  name: string;
  email: string;
}

type CreateUserRequest = Omit<UserBase, 'id'>;
type UpdateUserRequest = Partial<UserBase>;
type UserResponse = UserBase & { createdAt: string };
```

## Error Prevention Guidelines

### Use Non-Nullable Types by Default

- Enable `strictNullChecks` in tsconfig.json
- Explicitly handle null/undefined cases with optional chaining
- Use the nullish coalescing operator for fallbacks

### Prefer Interfaces for Public APIs

- Interfaces provide clearer error messages
- Interfaces can be extended retroactively
- Types are better for unions and complex transformations

### Avoid Type Assertions

- Type assertions bypass TypeScript's checks
- Each assertion is a potential runtime error
- Use type guards instead:

```typescript
// Bad
const user = someValue as User;

// Good
function isUser(value: any): value is User {
  return value && 
    typeof value.id === 'string' && 
    typeof value.name === 'string';
}

if (isUser(someValue)) {
  // someValue is User here
}
```

## Performance Optimization

### Minimize Type Re-computation

- Extract complex types to avoid recalculation
- Use `Pick` and `Omit` on existing types rather than recreating

### Use Specific Type Imports

- Import only needed types to improve compiler performance

```typescript
// Better for performance
import type { User } from './types';
```

## Testing Types

### Test Type Correctness

```typescript
// In a test file
import { expectType } from 'tsd';
import { calculateTotal } from './cart';

test('calculateTotal returns a number', () => {
  const result = calculateTotal([{ price: 10, quantity: 2 }]);
  expectType<number>(result);
});
```
