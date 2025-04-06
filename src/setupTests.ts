import '@testing-library/jest-dom';

// Mock window.performance methods globally
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn().mockReturnValue(0),
    getEntriesByType: jest.fn().mockReturnValue([]),
    mark: jest.fn(),
    measure: jest.fn(),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn()
  },
  writable: true
});

// Mock window object methods that might not be in jsdom
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    })),
    writable: true
  });
}

// Suppress console errors/warnings in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};