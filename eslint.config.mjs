import nextVitals from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier/flat";

export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "out/**", "docs/**"] },
  ...nextVitals,
  ...tseslint.configs.recommended,
  prettier,
  {
    // eslint-plugin-react's automatic React version detection calls an ESLint 9
    // context API that ESLint 10 removed, throwing
    // "contextOrFilename.getFilename is not a function" while loading
    // react/display-name. Pinning the version explicitly skips that code path.
    // Bumped to 19 in Task 5.
    settings: { react: { version: "18.2" } },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          // `const { omitMe, ...rest } = props` is a deliberate idiom for
          // excluding props from a spread, not an unused variable.
          ignoreRestSiblings: true,
        },
      ],
    },
  }
);
