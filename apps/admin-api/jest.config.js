module.exports = {
  displayName: 'admin-api',
  rootDir: '../..',
  testMatch: ['<rootDir>/apps/admin-api/**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironment: 'node',
};
