import type { Config } from "@jest/types";
import nextJest from "next/jest.js";

const customJestConfig: Config.InitialOptions = {
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFiles: ["<rootDir>/.jest/setEnvVars.ts"],
  setupFilesAfterEnv: ["<rootDir>/.jest/setupTests.ts"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  verbose: true,
};

const esmPackages = ["isbot", "jest-dom", "@faker-js[+/]"].join("|");

const createJestConfig = nextJest({ dir: "./" })(customJestConfig);

export default async () => {
  const jestConfig = await createJestConfig();

  const moduleNameMapper = {
    ...jestConfig.moduleNameMapper,
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^.+\\.(svg)$": "<rootDir>/src/tests/mocks/svgMock.tsx",
  };

  return {
    ...jestConfig,
    moduleNameMapper,
    testTimeout: 20000,
    transformIgnorePatterns: [
      `<rootDir>/node_modules/(?!(?:\\.pnpm/)?(?:${esmPackages}))`,
    ],
  };
};
