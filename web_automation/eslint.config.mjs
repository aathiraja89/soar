import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    {
        ignores: [
            'playwright-report/**',
            'test-results/**',
            'node_modules/**',
            'playwright/.cache/**',
            '.prettierignore',
            '.prettierrc',
        ],
    },
    { files: ['**/*.ts}'] },
    {
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            'no-console': 'error',
            'prefer-const': 'warn',
            '@typescript-eslint/await-thenable': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },
    // ...tseslint.configs.recommended,

    {
        ...eslintPluginPlaywright.configs['flat/recommended'],
        // files: ['tests/**'],
    },
    {
        rules: {
            'playwright/no-nested-step': 'off',
            'playwright/no-conditional-in-test': 'off',
            'playwright/expect-expect': 'off',
            'playwright/no-skipped-test': 'off',
        },
        settings: {
            playwright: {
                globalAliases: {
                    test: ['setup'],
                },
            },
        },
    },
    eslintPluginPrettierRecommended, // Must be last, to override other configs, excludes rules conflicting with Prettier\
    {
        rules: {
            'prettier/prettier': 'off',
        },
    },
];
