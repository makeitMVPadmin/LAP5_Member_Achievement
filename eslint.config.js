import reactPlugin from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

// eslint.config.js
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": "warn",
    },
  },
];
