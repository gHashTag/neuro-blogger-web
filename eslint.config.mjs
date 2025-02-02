import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Предупреждение вместо отключения
      '@typescript-eslint/no-unused-vars': 'warn', // Предупреждение вместо отключения
      'prefer-const': 'warn', // Предупреждение вместо отключения
      '@typescript-eslint/no-unused-expressions': 'warn', // Предупреждение вместо отключения
      'react-hooks/exhaustive-deps': 'warn', // Предупреждение вместо отключения
      '@typescript-eslint/ban-ts-comment': 'warn', // Предупреждение вместо отключения
      'react/no-unescaped-entities': 'warn', // Предупреждение вместо отключения
      'no-var': 'error', // Ошибка вместо отключения
      'no-console': 'warn', // Предупреждение вместо отключения
      'no-undef': 'error', // Ошибка вместо отключения
      '@next/next/no-img-element': 'warn', // Предупреждение вместо отключения
      'jsx-a11y/alt-text': 'warn', // Предупреждение вместо отключения
      '@typescript-eslint/no-empty-interface': 'warn', // Предупреждение вместо отключения
      '@typescript-eslint/no-empty-object-type': 'warn', // Предупреждение вместо отключения
      '@typescript-eslint/no-unsafe-function-type': 'warn', // Предупреждение вместо отключения
    },
  },
]

export default eslintConfig
