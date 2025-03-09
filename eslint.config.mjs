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
      'plugin:tailwindcss/recommended',
      'prettier',
    ],

    plugins: ['remotion'],
    overrides: [
      {
        files: ['remotion/*.{ts,tsx}'],
        extends: ['plugin:@remotion/recommended'],
      },
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
    },
  }),
]

export default eslintConfig
