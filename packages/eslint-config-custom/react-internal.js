import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
    },
  },
];

// "import/no-default-export": "off",
// "import/no-cycle": "off",
// "unicorn/filename-case": "off",
// "eslint-comments/require-description": "off",
// "tsdoc/syntax": "off",
// "no-console": "off",
// "jsx-a11y/heading-has-content": "off",
// "@typescript-eslint/explicit-function-return-type": "off",
// "react/hook-use-state": "off",
// "@typescript-eslint/no-empty-interface": "warn",
// "react/no-unstable-nested-components": ["warn", { allowAsProps: true }],
// "@typescript-eslint/ban-ts-comment": "warn",
// "@typescript-eslint/prefer-ts-expect-error": "warn",
