import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: [".next/*", "photo-management/*"] },
  { files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"] },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: "./tsconfig.json", tsconfigRootDir: import.meta.dirname },
    },
    plugins: { "@typescript-eslint": pluginTs },
    rules: {
      ...pluginTs.configs.recommended.rules,
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "module" } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  { rules: { "react/react-in-jsx-scope": "off", "react/prop-types": "off" } },
];
