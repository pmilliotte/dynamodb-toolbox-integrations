module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.unit.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
