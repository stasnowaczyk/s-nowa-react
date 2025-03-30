import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", // Next.js-specific rules
    "next/typescript", // TypeScript support
    "eslint:recommended", // Recommended ESLint rules
    "plugin:react/recommended", // React-specific linting rules
    "plugin:react-hooks/recommended", // Rules for React hooks
    "plugin:jsx-a11y/recommended", // Accessibility rules for JSX
    "plugin:prettier/recommended" // Integrates Prettier with ESLint
  ),
  {
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed for Next.js
      "react/prop-types": "off", // Disable prop-types if using TypeScript
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["hrefLeft", "hrefRight"],
          aspects: ["invalidHref", "preferButton"],
        },
      ],
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
];

export default eslintConfig;