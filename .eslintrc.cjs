module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },

  rules: {
    // ✅ FIX React 17+ JSX issue
    "react/react-in-jsx-scope": "off",

    // ✅ Turn off prop-types (you’re not using them)
    "react/prop-types": "off",
  },

  overrides: [
    {
      // ✅ Fix ALL your test file errors
      files: ["**/*.test.{js,jsx}"],
      env: {
        jest: true, // works for vitest globals too
    },
        rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",

        // 👇 THIS is the fix
        "no-unused-vars": "warn",
        },
    },
  ],
};