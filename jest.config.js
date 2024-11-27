module.exports = {
  testEnvironment: "node",
  testMatch: [
    "**/tests/**/*.[jt]s?(x)", // Include all .test.js files in the tests folder
    "**/?(*.)+(spec|test).[jt]s?(x)" // Default pattern for test files in src
  ],
};
