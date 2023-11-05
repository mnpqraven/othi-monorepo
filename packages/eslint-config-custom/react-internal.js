const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    ".eslintrc.js",
    "postcss.config.*",
  ],

  rules: {
    // add specific rules configurations here
    "import/no-default-export": "off",
    "import/no-cycle": "off",
    "unicorn/filename-case": "off",
    "eslint-comments/require-description": "off",
    "tsdoc/syntax": "off",
    "no-console": "off",
    "jsx-a11y/heading-has-content": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/hook-use-state": "off",
    "@typescript-eslint/no-empty-interface": "warn",
  },
};
