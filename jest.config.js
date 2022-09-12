const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // moduleNameMapper: {
  //   // Handle module aliases (this will be automatically configured for you soon)
  //   '^@/components/(.*)$': '<rootDir>/src/components/$1',
  //   '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
  // },
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
};
module.exports = createJestConfig(customJestConfig);