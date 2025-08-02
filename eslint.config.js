import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      "@typescript-eslint/no-explicit-any": ["off"]
    }
  },
  tseslint.configs.recommended,
]);

// import { defineConfig, globalIgnores } from "eslint/config";
// import svelteParser from "svelte-eslint-parser";
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import js from "@eslint/js";
// import { FlatCompat } from "@eslint/eslintrc";
//
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);
// // const compat = new FlatCompat({
// //   baseDirectory: __dirname,
// //   recommendedConfig: js.configs.recommended,
// //   allConfig: js.configs.all
// // });
//
// export default defineConfig([
//   globalIgnores(["**/node_modules", "**/dist", "**/out", "**/.gitignore"]),
//   {
//     // extends: compat.extends("eslint:recommended", "plugin:svelte/recommended"),
//     extends: compat.extends("eslint:recommended"),
//
//     languageOptions: {
//       ecmaVersion: 5,
//       sourceType: "script",
//
//       // parserOptions: {
//       //     extraFileExtensions: [".svelte"],
//       // },
//     },
//
//     rules: {
//       // "svelte/no-unused-svelte-ignore": "off",
//       semi: ["error", "always"],
//       quotes: ["error", "double"],
//
//       "comma-dangle": ["error", {
//         arrays: "always-multiline",
//         objects: "always-multiline",
//         imports: "always-multiline",
//         exports: "always-multiline",
//         functions: "always-multiline",
//       }],
//     },
//   },
//   // {
//   //     files: ["**/*.svelte"],
//   //
//   //     languageOptions: {
//   //         parser: svelteParser,
//   //         ecmaVersion: 5,
//   //         sourceType: "script",
//   //
//   //         parserOptions: {
//   //             parser: "@typescript-eslint/parser",
//   //         },
//   //     },
//   // },
// ]);

// import eslint from '@eslint/js';
// // import prettier from 'eslint-config-prettier';
// import svelte from 'eslint-plugin-svelte';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';
//
// export default tseslint.config(
//   eslint.configs.recommended,
//   ...tseslint.configs.recommended,
//   ...svelte.configs['flat/recommended'],
//   // prettier,
//   // ...svelte.configs['flat/prettier'],
//   {
//     languageOptions: {
//       globals: {
//         ...globals.browser,
//         ...globals.node,
//         DndEvent: 'readonly'
//       }
//     }
//   },
//   {
//     files: ['**/*.svelte'],
//     languageOptions: {
//       parserOptions: {
//         parser: tseslint.parser
//       }
//     }
//   },
//   {
//     ignores: ['build/', '.svelte-kit/', 'dist/']
//   },
//   {
//     /*
//      * Temporarily disable certain rules to mitigate
//      * unnecessary distractions during development.
//      */
//     rules: {
//       '@typescript-eslint/no-explicit-any': 'off',
//       '@typescript-eslint/ban-ts-comment': 'off',
//       'svelte/no-at-html-tags': 'off'
//     }
//   }
// );
