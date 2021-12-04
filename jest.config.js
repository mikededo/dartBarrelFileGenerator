module.exports = {
  runner: 'vscode',
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePaths: ['<rootDir>'],
  rootDir: '.',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  }
};
