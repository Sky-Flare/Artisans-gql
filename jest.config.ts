import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  verbose: true,
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    './src/graphql/**/*.ts',
    './src/graphql/**/**/*.ts',
    './src/repository/*.ts',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  collectCoverage: true,
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@entity/(.*)$': '<rootDir>/src/entities/$1',
    '^@resolver/(.*)$': '<rootDir>/src/graphql/resolvers/$1',
    '^@repository/(.*)$': '<rootDir>/src/repository/$1',
    '^@gqlMiddlewares/(.*)$': '<rootDir>/src/graphql/middlewares/$1'
  }
};

export default jestConfig;
