import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: [
      'next',
      'next/typescript',
      'plugin:@typescript-eslint/recommended',
      'plugin:tailwindcss/recommended',
      'prettier',
    ],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      semi: ['error', 'never'],
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'tailwindcss/classnames-order': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'tailwindcss/enforces-shorthand': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/migration-from-tailwind-2': 'off',
      'tailwindcss/no-unnecessary-arbitrary-value': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'prefer-const': 'warn',
      '@next/next/no-img-element': 'off',
      'jsx-a11y/alt-text': 'warn',
      'tailwindcss/no-contradicting-classname': 'warn',
    },
  }),
]

export default eslintConfig
