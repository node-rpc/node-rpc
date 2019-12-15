module.exports = {
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    verbose: true,
    "bail": 1,
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: [
      "**/*.{ts,js}",
      "!**/node_modules/**",
      "!**/vendor/**"
    ]
  }