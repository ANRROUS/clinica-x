/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  testTimeout: 300000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'js'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports/jest-html-reporter',
        filename: 'report.html',
        openReport: false,
        expand: true,
      },
    ],
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
};
