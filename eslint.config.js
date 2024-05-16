import globals from "globals";
import pluginJs from "@eslint/js";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [".config/*", "dist", "build/**/*", "eslint.config.js"],
  },
  {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    rules: {
      "no-console": "warn",
      "arrow-body-style": ["error", "as-needed", { requireReturnForObjectLiteral: true }],
      "block-scoped-var": "error",
    },
  },
);
