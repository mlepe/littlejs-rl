/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
        diagnostics: {
          ignoreCodes: [151002], // Suppress Node16/Next module warning
        },
      },
    ],
  },
  // Mock littlejsengine since it's a browser library with ES modules
  moduleNameMapper: {
    '^littlejsengine$': '<rootDir>/src/ts/__mocks__/littlejsengine.ts',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
    '!src/ts/examples/**',
    '!src/ts/__mocks__/**',
  ],
};
