module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest"
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/node_modules/@testing-library/jest-dom"]
};