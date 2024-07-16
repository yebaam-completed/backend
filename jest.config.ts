import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testMatch: ['<rootDir>/src/**/test/*.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/test/*.ts?(x)', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1
    }
  },
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: {
    '@auth/(.*)': ['<rootDir>/src/modules/auth/$1'],
    '@user/(.*)': ['<rootDir>/src/modules/user/$1'],
    '@post/(.*)': ['<rootDir>/src/modules/post/$1'],
    '@reaction/(.*)': ['<rootDir>/src/modules/reactions/$1'],
    '@comment/(.*)': ['<rootDir>/src/modules/comments/$1'],
    '@follower/(.*)': ['<rootDir>/src/modules/followers/$1'],
    '@notification/(.*)': ['<rootDir>/src/modules/notifications/$1'],
    '@image/(.*)': ['<rootDir>/src/modules/images/$1'],
    '@chat/(.*)': ['<rootDir>/src/modules/chat/$1'],
    '@globals/(.*)': ['<rootDir>/src/shared/global/$1'],
    '@service/(.*)': ['<rootDir>/src/shared/services/$1'],
    '@socket/(.*)': ['<rootDir>/src/shared/sockets/$1'],
    '@worker/(.*)': ['<rootDir>/src/shared/workers/$1'],
    '@root/(.*)': ['<rootDir>/src/$1'],
  }
};

export default config;
