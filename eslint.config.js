import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import solid from "eslint-plugin-solid/configs/typescript.js";
import * as tsParser from "@typescript-eslint/parser";
import "eslint-plugin-only-warn";

import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const __dirname = resolve(fileURLToPath(import.meta.url), "..");
const compat = new FlatCompat({ resolvePluginsRelativeTo: __dirname });

export default [
  js.configs.recommended,
  ...compat.extends("plugin:@typescript-eslint/recommended"),
  {
    files: ["src/**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.app.json",
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    rules: {
      semi: 0,
      "@typescript-eslint/semi": 1,
      "@typescript-eslint/no-non-null-assertion": 1,
      eqeqeq: 1,
      "no-unused-vars": 0,
      "@typescript-eslint/no-unused-vars": 1,
    },
  },
  {
    files: ["**/*.cjs"],
    env: {
      commonjs: true,
    }
  }
];
