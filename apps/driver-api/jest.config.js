module.exports = {
  displayName: 'driver-api',
  rootDir: '../..',
  testMatch: ['<rootDir>/apps/driver-api/**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironment: 'node',
};
