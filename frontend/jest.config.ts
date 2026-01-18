import type { Config } from 'jest';

import { createCjsPreset } from 'jest-preset-angular/presets/index.js';

// coverageReporters: [ 'html', 'lcov', 'json', 'text-summary' ],

export default {
  ...createCjsPreset(),
  setupFilesAfterEnv: ['./jest-setup.ts'],
  moduleNameMapper: {
    '^(.*)/environment/(.*)$': '<rootDir>/src/environment/environment.test.ts',
    '^@server/core/(.*)$': ['<rootDir>/src/app/core/$1'],
    '^@server/components/(.*)$': ['<rootDir>/src/app/components/$1'],
    '^@server/features/(.*)$': ['<rootDir>/src/app/features/$1'],
    '^@server/shared/(.*)$': ['<rootDir>/src/app/shared/$1'],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './../coverage/frontend',
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