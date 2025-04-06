# React Component Template: ROI-Optimized Implementation

Use this template when creating new React components to ensure they follow best practices for maintainability, performance, and error prevention.

## Component Structure

```tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppContextAwareness } from '@/context/contextAwarenessContext';

// Define props interface with explicit types
interface ComponentNameProps {
  /** Description of the property and its purpose */
  requiredProp: string;
  /** Description with example usage */
  optionalProp?: number;
  /** Callback function description */
  onSomeEvent?: (value: string) => void;
  /** Children description */
  children?: React.ReactNode;
}

/**
 * ComponentName - Brief description of purpose and usage
 * 
 * Detailed description of when to use this component,
 * any performance considerations, or other important notes.
 * 
 * @example
 * ```tsx
 * <ComponentName requiredProp="example">
 *   Child content
 * </ComponentName>
 * ```
 */
export function ComponentName({
  requiredProp,
  optionalProp = 0, // Default value for optional props
  onSomeEvent,
  children,
}: ComponentNameProps) {
  // Context for tracking usage and errors
  const { trackFeatureUsage, trackError } = useAppContextAwareness();
  
  // State declarations
  const [state, setState] = useState<string>('');
  
  // Track component usage for analytics
  useEffect(() => {
    trackFeatureUsage('ComponentName');
    
    return () => {
      // Cleanup if needed
    };
  }, [trackFeatureUsage]);
  
  // Memoize expensive calculations
  const expensiveValue = useMemo(() => {
    // Calculation that depends on props
    return `${requiredProp}-${optionalProp}`;
  }, [requiredProp, optionalProp]);
  
  // Memoize callbacks to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    try {
      // Update state
      setState(prevState => `${prevState} updated`);
      
      // Call parent callback if provided
      if (onSomeEvent) {
        onSomeEvent(expensiveValue);
      }
    } catch (error) {
      // Track errors with context
      trackError(error as Error, { 
        component: 'ComponentName', 
        action: 'handleClick' 
      });
    }
  }, [expensiveValue, onSomeEvent, trackError]);
  
  // Early return for error states or loading
  if (!requiredProp) {
    return <div>Required prop is missing</div>;
  }
  
  // Main render
  return (
    <div className="component-name">
      <h2>{requiredProp}</h2>
      <p>{expensiveValue}</p>
      <button onClick={handleClick} type="button">
        Click me
      </button>
      {children && <div className="children-container">{children}</div>}
    </div>
  );
}

// Default export for dynamic imports
export default ComponentName;
```

## ROI-Focused Implementation Checklist

### Error Prevention (High ROI)

- [ ] All props have explicit TypeScript types
- [ ] Default values for optional props
- [ ] Error handling for user interactions
- [ ] Error tracking integration
- [ ] Validate required props

### Performance Optimization (High ROI)

- [ ] Use `useMemo` for expensive calculations
- [ ] Use `useCallback` for event handlers passed to children
- [ ] Implement proper dependency arrays for hooks
- [ ] Consider code-splitting/lazy loading for large components

### Maintainability (Medium ROI)

- [ ] Clear JSDoc comments
- [ ] Explicit function and variable names
- [ ] Single responsibility principle
- [ ] Component usage examples

### User Analytics (Medium ROI)

- [ ] Track component usage
- [ ] Track key user interactions
- [ ] Track performance metrics for critical operations

### Accessibility (Medium-High ROI)

- [ ] Semantic HTML elements
- [ ] Keyboard navigation support
- [ ] ARIA attributes where appropriate
- [ ] Sufficient color contrast

## Testing Strategy

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

// Mock context
jest.mock('@/context/contextAwarenessContext', () => ({
  useAppContextAwareness: () => ({
    trackFeatureUsage: jest.fn(),
    trackError: jest.fn(),
  }),
}));

describe('ComponentName', () => {
  const defaultProps = {
    requiredProp: 'test',
  };

  test('renders with required props', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('handles click events', () => {
    const onSomeEvent = jest.fn();
    render(<ComponentName {...defaultProps} onSomeEvent={onSomeEvent} />);
    
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    
    expect(onSomeEvent).toHaveBeenCalledTimes(1);
  });

  test('renders children when provided', () => {
    render(
      <ComponentName {...defaultProps}>
        <span>Child content</span>
      </ComponentName>
    );
    
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  test('handles missing required props gracefully', () => {
    // @ts-expect-error Testing improper usage
    render(<ComponentName />);
    
    expect(screen.getByText('Required prop is missing')).toBeInTheDocument();
  });
});
```
