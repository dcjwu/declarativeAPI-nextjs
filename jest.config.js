/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
   preset: "ts-jest",
   testEnvironment: "node",
   testRegex: ".*\\.test\\.ts$",
   collectCoverage: true,
   collectCoverageFrom: ["./src/**"],
   testPathIgnorePatterns: ["<rootDir>/src/*/index.ts"], //TODO: Add ignoring export index.ts file
   moduleNameMapper: { "^@utils/(.*)$": "<rootDir>/src/utils/$1", },
}