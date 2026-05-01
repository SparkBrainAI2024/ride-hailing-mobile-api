module.exports = {
  displayName: 'api',
  rootDir: '../..',
  testMatch: ['<rootDir>/apps/api/**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironment: 'node',
};
