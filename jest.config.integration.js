module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js'],

  testMatch: ['**/integration/**/*.integration.js'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputName: './integration.junit.xml',
        outputDirectory: './test-reports',
        suiteNameTemplate: '{filename}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
};