module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/src/config/',
    '/src/models/',
    '/src/utils/'
  ],
  setupFilesAfterEnv: ['./tests/setup.js'],
  testTimeout: 10000
};