import type { Config } from 'jest';

// coverageReporters: [ 'html', 'lcov', 'json', 'text-summary' ],

export default {
  setupFilesAfterEnv: ['./jest-setup.ts'],
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './../coverage/backend',
  testEnvironment: 'jsdom',
  passWithNoTests: true,
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  testPathIgnorePatterns: ['<rootDir>/src/environment/'],
} satisfies Config;

// moduleNameMapper is used to mock environment imports and
// configure path aliases
//
// testPathIgnorePatterns excludes the actual environment files
// from being tested directly i.e. 'environment.test.ts'