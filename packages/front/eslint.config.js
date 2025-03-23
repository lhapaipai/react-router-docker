import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

/** @type {import('typescript-eslint').ConfigWithExtends} */
const baseConfig = {
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    "react-refresh/only-export-components": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "_",
        caughtErrorsIgnorePattern: "_",
        argsIgnorePattern: "_",
      },
    ],
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-namespace": "off",
  },
};

export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["app/**/*.{ts,tsx}", "scripts/**/*.{ts,tsx}", "stories/**/*.{ts,tsx}"],
    ...baseConfig,
  },
  {
    ...baseConfig,
    files: ["**/*.fixture.ts", "**/*.spec.ts"],
    rules: {
      ...baseConfig.rules,
      "react-hooks/rules-of-hooks": "off",
      "no-empty-pattern": "off",
    },
  },
);
