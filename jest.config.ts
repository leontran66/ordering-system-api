export default {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['js', 'ts'],
  modulePathIgnorePatterns: ['dist'],
  testEnvironment: 'node',
  testMatch: ['**/test/**.test.(ts|js)'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
};
