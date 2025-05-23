
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { // Global ignores
    ignores: ["dist/**", "node_modules/**"],
  },
  // Base configuration for JavaScript files (including .js, .mjs, .cjs)
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended, // Apply ESLint's recommended JS rules
    languageOptions: {
      globals: {
        ...globals.node, // Node.js globals for config files etc.
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": "warn", // Keep JS specific no-unused-vars as warn, or change to error if desired for JS too. For now, focusing on TS.
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error", // Changed from warn to error for JS files
    }
  },
  // Configuration for TypeScript and React files
  {
    files: ["**/*.{ts,tsx}"],
    // Apply recommended TS configs from tseslint
    // These are arrays of configs, so spread them
    ...tseslint.configs.recommended.reduce((acc, config) => ({ ...acc, ...config }), {}),
    // Apply React recommended config (rules part)
    // react.configs.recommended is an object, spread its rules
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules, // React Hooks rules
      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "error", // Changed from warn to error
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }], // Stays as is, already disallows console.log
      "prefer-const": "error", // Changed from warn to error
      "no-duplicate-imports": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": "off", // Disable prop-types rule for TypeScript projects
    },
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      // TypeScript plugin is implicitly part of tseslint.configs.recommended
      // but ensure it's available if tseslint.configs.recommended doesn't add it to plugins
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser, // Use TypeScript parser
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: ["./tsconfig.app.json", "./tsconfig.node.json"], // Specify tsconfig files
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: { version: "detect" },
    },
  }
);
