import { getContextValue, useContextAwareness, usePerformanceTracking, withErrorTracking } from './contextAwareness';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Access the internal ContextAwarenessSystem for direct testing
const actualModule = jest.requireActual('./contextAwareness');
const ContextAwarenessSystem = (actualModule as any).ContextAwarenessSystem;

// Mock implementation of window features
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockPerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

// Mock setInterval for testing schedule functions
const mockSetInterval = jest.fn().mockReturnValue(123);
const mockClearInterval = jest.fn();

// Setup and teardown global mocks
beforeAll(() => {
  // Store originals
  global.originalWindowAddEventListener = window.addEventListener;
  global.originalWindowRemoveEventListener = window.removeEventListener;
  global.originalPerformanceObserver = window.PerformanceObserver;
  global.originalSetInterval = global.setInterval;
  global.originalClearInterval = global.clearInterval;
  global.originalConsoleError = console.error;
  global.originalConsoleWarn = console.warn;
  global.originalConsoleInfo = console.info;
  
  // Mock window methods
  window.addEventListener = mockAddEventListener;
  window.removeEventListener = mockRemoveEventListener;
  window.PerformanceObserver = mockPerformanceObserver as any;
  
  // Mock timing functions
  global.setInterval = mockSetInterval as any;
  global.clearInterval = mockClearInterval as any;
  
  // Mock console methods to avoid test output pollution
  console.error = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();
  
  // Mock performance.now for consistent results
  const originalPerformanceNow = performance.now;
  global.performanceNowMock = jest.fn()
    .mockReturnValueOnce(100)
    .mockReturnValueOnce(250);
  performance.now = global.performanceNowMock;
});

afterAll(() => {
  // Restore all original functions
  window.addEventListener = global.originalWindowAddEventListener;
  window.removeEventListener = global.originalWindowRemoveEventListener;
  window.PerformanceObserver = global.originalPerformanceObserver;
  global.setInterval = global.originalSetInterval;
  global.clearInterval = global.originalClearInterval;
  console.error = global.originalConsoleError;
  console.warn = global.originalConsoleWarn;
  console.info = global.originalConsoleInfo;
  performance.now = global.originalPerformanceNow;
});

describe('ContextAwarenessSystem', () => {
  let system: any;
  
  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
    
    // Reset the instance for each test
    ContextAwarenessSystem.instance = null;
    system = ContextAwarenessSystem.getInstance();
  });
  
  test('should be a singleton', () => {
    const instance1 = ContextAwarenessSystem.getInstance();
    const instance2 = ContextAwarenessSystem.getInstance();
    
    expect(instance1).toBe(instance2);
  });
  
  test('should set up error tracking on instantiation', () => {
    expect(mockAddEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
  });
  
  test('should set up performance monitoring on instantiation', () => {
    expect(mockPerformanceObserver).toHaveBeenCalledTimes(2);
  });
  
  test('should schedule retrospectives on instantiation', () => {
    expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 60000);
  });
  
  describe('trackError', () => {
    test('should track errors correctly', () => {
      const error = new Error('Test error');
      const context = { userId: '123', page: 'home' };
      
      system.trackError(error, context);
      
      // Verify error was added to the internal errors array
      expect(system.errors.length).toBe(1);
      expect(system.errors[0].message).toBe('Test error');
      expect(system.errors[0].context).toBe(context);
      
      // Verify console.error was called
      expect(console.error).toHaveBeenCalledWith(
        'Error tracked:', 
        'Test error', 
        context
      );
    });
    
    test('should handle errors without context', () => {
      const error = new Error('No context error');
      
      system.trackError(error);
      
      expect(system.errors.length).toBe(1);
      expect(system.errors[0].message).toBe('No context error');
      expect(system.errors[0].context).toEqual({});
    });
    
    test('should analyze error patterns', () => {
      // Mock the analyzeErrorPatterns method
      const originalAnalyzeErrorPatterns = system.analyzeErrorPatterns;
      system.analyzeErrorPatterns = jest.fn().mockReturnValue([]);
      
      system.trackError(new Error('Pattern test'));
      
      expect(system.analyzeErrorPatterns).toHaveBeenCalled();
      
      // Restore original method
      system.analyzeErrorPatterns = originalAnalyzeErrorPatterns;
    });
  });
  
  describe('trackFeatureUsage', () => {
    test('should initialize feature tracking for new features', () => {
      system.trackFeatureUsage('newFeature');
      
      expect(system.featureUsage.newFeature).toBeTruthy();
      expect(system.featureUsage.newFeature.count).toBe(1);
      expect(system.featureUsage.newFeature.lastUsed).toBeGreaterThan(0);
    });
    
    test('should increment count for existing features', () => {
      // First call initializes
      system.trackFeatureUsage('existingFeature');
      const initialCount = system.featureUsage.existingFeature.count;
      const initialTimestamp = system.featureUsage.existingFeature.lastUsed;
      
      // Wait to ensure different timestamp
      jest.advanceTimersByTime(10);
      
      // Second call increments
      system.trackFeatureUsage('existingFeature');
      
      expect(system.featureUsage.existingFeature.count).toBe(initialCount + 1);
      expect(system.featureUsage.existingFeature.lastUsed).toBeGreaterThan(initialTimestamp);
    });
  });
  
  describe('measurePerformance', () => {
    test('should record and average performance measurements', () => {
      system.measurePerformance('testOperation', 100);
      
      expect(system.performanceMetrics.testOperation).toBeTruthy();
      expect(system.performanceMetrics.testOperation.measurements).toContain(100);
      expect(system.performanceMetrics.testOperation.average).toBe(100);
      
      // Add another measurement
      system.measurePerformance('testOperation', 200);
      
      expect(system.performanceMetrics.testOperation.measurements.length).toBe(2);
      expect(system.performanceMetrics.testOperation.average).toBe(150); // (100+200)/2
    });
    
    test('should detect and warn about slow operations', () => {
      // First create a baseline
      system.measurePerformance('slowOperation', 100);
      
      // Clear mocks
      console.warn.mockClear();
      
      // Now measure something much slower (over 1.5x the average)
      system.measurePerformance('slowOperation', 160);
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Slow operation detected'),
        expect.stringContaining('slowOperation')
      );
    });
    
    test('should initialize metrics for new operations', () => {
      system.measurePerformance('brandNewOperation', 42);
      
      expect(system.performanceMetrics.brandNewOperation).toBeTruthy();
      expect(system.performanceMetrics.brandNewOperation.measurements).toEqual([42]);
      expect(system.performanceMetrics.brandNewOperation.average).toBe(42);
    });
  });
  
  describe('generateRetrospectiveData', () => {
    test('should generate a comprehensive report', () => {
      // Add some test data
      system.trackError(new Error('Test error 1'));
      system.trackError(new Error('Test error 2'));
      system.trackFeatureUsage('feature1');
      system.trackFeatureUsage('feature2');
      system.trackFeatureUsage('feature1'); // Second usage
      system.measurePerformance('operation1', 100);
      system.measurePerformance('operation2', 200);
      
      const report = system.generateRetrospectiveData();
      
      // Verify report structure
      expect(report).toHaveProperty('errorsSummary');
      expect(report).toHaveProperty('performanceSummary');
      expect(report).toHaveProperty('featureUsageSummary');
      
      // Verify error reporting
      expect(report.errorsSummary.count).toBe(2);
      expect(report.errorsSummary.mostRecentErrors.length).toBe(2);
      
      // Verify performance reporting
      expect(report.performanceSummary.length).toBe(2);
      
      // Verify feature usage reporting
      expect(report.featureUsageSummary.length).toBe(2);
      
      // Feature with highest count should be first
      expect(report.featureUsageSummary[0].feature).toBe('feature1');
      expect(report.featureUsageSummary[0].usageCount).toBe(2);
    });
    
    test('should handle empty data', () => {
      // Reset the system to have no data
      ContextAwarenessSystem.instance = null;
      system = ContextAwarenessSystem.getInstance();
      
      const report = system.generateRetrospectiveData();
      
      expect(report.errorsSummary.count).toBe(0);
      expect(report.errorsSummary.mostRecentErrors.length).toBe(0);
      expect(report.performanceSummary.length).toBe(0);
      expect(report.featureUsageSummary.length).toBe(0);
    });
  });
  
  describe('analyzeErrorPatterns', () => {
    test('should group errors by pattern', () => {
      system.trackError(new Error('ValidationError: Invalid input'));
      system.trackError(new Error('ValidationError: Missing field'));
      system.trackError(new Error('NetworkError: Connection timeout'));
      
      const patterns = system.analyzeErrorPatterns();
      
      expect(patterns.length).toBe(2);
      
      // ValidationError should be the most common with count 2
      expect(patterns[0].pattern).toBe('ValidationError');
      expect(patterns[0].count).toBe(2);
      
      // NetworkError should be second with count 1
      expect(patterns[1].pattern).toBe('NetworkError');
      expect(patterns[1].count).toBe(1);
    });
    
    test('should handle errors with no pattern prefix', () => {
      system.trackError(new Error('Just a regular error'));
      system.trackError(new Error('Another regular error'));
      
      const patterns = system.analyzeErrorPatterns();
      
      expect(patterns.length).toBe(2);
      expect(patterns[0].count).toBe(1);
      expect(patterns[1].count).toBe(1);
    });
  });
  
  describe('setupErrorTracking', () => {
    test('should handle browser errors', () => {
      // Get the error handler from addEventListener mock
      const errorHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'error'
      )[1];
      
      // Create a mock error event
      const errorEvent = {
        error: new Error('Browser error'),
        message: 'Browser error message',
        filename: 'test.js',
        lineno: 42,
        colno: 10
      };
      
      // Clear previous calls
      console.error.mockClear();
      
      // Simulate an error event
      errorHandler(errorEvent);
      
      expect(console.error).toHaveBeenCalled();
      expect(system.errors.length).toBeGreaterThan(0);
      
      // Verify the context information is captured
      const lastError = system.errors[system.errors.length - 1];
      expect(lastError.context).toHaveProperty('filename', 'test.js');
      expect(lastError.context).toHaveProperty('lineno', 42);
    });
    
    test('should handle unhandled promise rejections', () => {
      // Get the rejection handler from addEventListener mock
      const rejectionHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'unhandledrejection'
      )[1];
      
      // Create a mock rejection event
      const rejectionEvent = {
        reason: 'Promise was rejected'
      };
      
      // Clear previous calls
      console.error.mockClear();
      
      // Simulate a rejection event
      rejectionHandler(rejectionEvent);
      
      expect(console.error).toHaveBeenCalled();
      expect(system.errors.length).toBeGreaterThan(0);
      
      // Verify the reason is captured
      const lastError = system.errors[system.errors.length - 1];
      expect(lastError.context).toHaveProperty('reason', 'Promise was rejected');
    });
  });
  
  describe('setupPerformanceMonitoring', () => {
    test('should handle navigation entries', () => {
      // Get the navigation observer callback
      const observerCallback = mockPerformanceObserver.mock.calls[0][0];
      
      // Create mock entries
      const mockEntries = [{
        entryType: 'navigation',
        duration: 1500
      }];
      
      // Create mock list
      const mockList = {
        getEntries: () => mockEntries
      };
      
      // Call the callback
      observerCallback(mockList);
      
      // Verify the performance was measured
      expect(system.performanceMetrics).toHaveProperty('pageLoad');
      expect(system.performanceMetrics.pageLoad.measurements).toContain(1500);
    });
    
    test('should handle long task entries', () => {
      // Get the long task observer callback
      const observerCallback = mockPerformanceObserver.mock.calls[1][0];
      
      // Create mock entries
      const mockEntries = [{
        entryType: 'longtask',
        duration: 200
      }];
      
      // Create mock list
      const mockList = {
        getEntries: () => mockEntries
      };
      
      // Clear previous calls
      console.warn.mockClear();
      
      // Call the callback
      observerCallback(mockList);
      
      // Verify the performance was measured
      expect(system.performanceMetrics).toHaveProperty('longTask');
      expect(system.performanceMetrics.longTask.measurements).toContain(200);
      
      // Verify warning was logged
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Long task detected'),
        expect.stringContaining('200')
      );
    });
    
    test('should handle PerformanceObserver setup errors', () => {
      // Create a temporary implementation that throws
      const originalPerformanceObserver = window.PerformanceObserver;
      window.PerformanceObserver = () => {
        throw new Error('PerformanceObserver not supported');
      };
      
      // Clear console mocks
      console.error.mockClear();
      
      // Reset the instance to trigger setup again
      ContextAwarenessSystem.instance = null;
      system = ContextAwarenessSystem.getInstance();
      
      // Verify error was caught and logged
      expect(console.error).toHaveBeenCalledWith(
        'PerformanceObserver setup failed:',
        expect.any(Error)
      );
      
      // Restore mock
      window.PerformanceObserver = originalPerformanceObserver;
    });
  });
  
  describe('scheduleRetrospectives', () => {
    test('should schedule periodic retrospectives', () => {
      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 60000);
      
      // Get the scheduled callback
      const callback = mockSetInterval.mock.calls[0][0];
      
      // Clear console mocks
      console.info.mockClear();
      
      // Execute the callback
      callback();
      
      // Verify report was generated and logged
      expect(console.info).toHaveBeenCalledWith(
        'Weekly retrospective data:',
        expect.any(Object)
      );
    });
  });
});

describe('Context Awareness Tests', () => {
  // Tests for getContextValue
  test('should return correct context value for valid input', () => {
    const result = getContextValue('user', { user: 'John Doe' });
    expect(result).toBe('John Doe');
  });

  test('should return undefined for missing context key', () => {
    const result = getContextValue('admin', { user: 'John Doe' });
    expect(result).toBeUndefined();
  });

  // Tests for useContextAwareness
  test('should return context awareness functions', () => {
    const contextAwareness = useContextAwareness();
    
    expect(contextAwareness).toHaveProperty('trackError');
    expect(contextAwareness).toHaveProperty('trackFeatureUsage');
    expect(contextAwareness).toHaveProperty('measurePerformance');
    expect(contextAwareness).toHaveProperty('generateRetrospectiveData');
    
    expect(typeof contextAwareness.trackError).toBe('function');
    expect(typeof contextAwareness.trackFeatureUsage).toBe('function');
    expect(typeof contextAwareness.measurePerformance).toBe('function');
    expect(typeof contextAwareness.generateRetrospectiveData).toBe('function');
  });

  // Tests for usePerformanceTracking
  test('should measure elapsed time in wrapped function', () => {
    // Setup a controlled test environment for performance tracking
    const mockPerformanceNow = jest.fn()
      .mockReturnValueOnce(100) // First call returns 100
      .mockReturnValueOnce(250); // Second call returns 250
      
    const originalPerformanceNow = performance.now;
    performance.now = mockPerformanceNow;
    
    const mockMeasurePerformance = jest.fn();
    const mockContextValue = {
      measurePerformance: mockMeasurePerformance,
      trackError: jest.fn(),
      trackFeatureUsage: jest.fn(),
      generateRetrospectiveData: jest.fn()
    };
    
    // Mock the useContextAwareness hook
    const originalUseContextAwareness = useContextAwareness;
    (global as any).useContextAwareness = jest.fn().mockReturnValue(mockContextValue);
    
    const trackPerformance = usePerformanceTracking('testOperation');
    const mockCallback = jest.fn().mockReturnValue('result');
    
    const result = trackPerformance(mockCallback);
    
    expect(result).toBe('result');
    expect(mockCallback).toHaveBeenCalled();
    expect(mockPerformanceNow).toHaveBeenCalledTimes(2);
    expect(mockMeasurePerformance).toHaveBeenCalledWith('testOperation', 150); // 250 - 100 = 150
    
    // Restore original methods
    performance.now = originalPerformanceNow;
    (global as any).useContextAwareness = originalUseContextAwareness;
  });
  
  test('should handle errors in the wrapped function', () => {
    const mockMeasurePerformance = jest.fn();
    const mockContextValue = {
      measurePerformance: mockMeasurePerformance,
      trackError: jest.fn(),
      trackFeatureUsage: jest.fn(),
      generateRetrospectiveData: jest.fn()
    };
    
    // Mock the useContextAwareness hook
    const originalUseContextAwareness = useContextAwareness;
    (global as any).useContextAwareness = jest.fn().mockReturnValue(mockContextValue);
    
    const trackPerformance = usePerformanceTracking('errorOperation');
    const mockErrorCallback = jest.fn().mockImplementation(() => {
      throw new Error('Test error in callback');
    });
    
    // The error should be propagated
    expect(() => trackPerformance(mockErrorCallback)).toThrow('Test error in callback');
    
    // But the timing should still be measured
    expect(mockMeasurePerformance).toHaveBeenCalledWith('errorOperation', expect.any(Number));
    
    // Restore original method
    (global as any).useContextAwareness = originalUseContextAwareness;
  });

  // Tests for withErrorTracking
  test('should create error boundary component that handles errors', () => {
    // Mock console.error to avoid actual console output during tests
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Create a component that will throw an error
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    
    const WrappedComponent = withErrorTracking(ErrorComponent);
    
    // Render the component - it should catch the error and render fallback UI
    const { container } = render(<WrappedComponent />);
    
    // Check that the error fallback UI is rendered
    expect(container.textContent).toContain('Something went wrong');
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  test('should render wrapped component normally when no errors occur', () => {
    // Create a component that doesn't throw errors
    const NormalComponent = () => <div>Normal content</div>;
    const WrappedComponent = withErrorTracking(NormalComponent);
    
    // Render the component
    const { container } = render(<WrappedComponent />);
    
    // Check that the normal content is rendered
    expect(container.textContent).toBe('Normal content');
  });
  
  test('should pass props to wrapped component', () => {
    // Create a component that displays its props
    const PropsComponent = ({ message }: { message: string }) => <div>{message}</div>;
    const WrappedComponent = withErrorTracking(PropsComponent);
    
    // Render with props
    const { container } = render(<WrappedComponent message="Hello, World!" />);
    
    // Check that props were passed correctly
    expect(container.textContent).toBe('Hello, World!');
  });
});