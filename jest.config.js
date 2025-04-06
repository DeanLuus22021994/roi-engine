module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/app/**',
    '!**/node_modules/**',
    '!**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['**/*.test.(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.json' }],
  },
  transformIgnorePatterns: ["/node_modules/(?!@babel/runtime)"],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
    'babel-jest': {
      configFile: './babel.config.json',
    },
  },
};