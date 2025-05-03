import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginN from 'eslint-plugin-n'
import eslintPluginPromise from 'eslint-plugin-promise'

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        motion: 'readonly',
        AnimatePresence: 'readonly',
      },
    },
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      import: eslintPluginImport,
      n: eslintPluginN,
      promise: eslintPluginPromise
    },
    rules: {
      'semi': ['error', 'never'],
      'no-trailing-spaces': 'error',
      // Desactivamos la regla de variables no utilizadas completamente
      'no-unused-vars': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      // Mantenemos como advertencia las dependencias de hooks para mejorar el código en el futuro
      'react-hooks/exhaustive-deps': 'warn',
      'indent': ['error', 2],
    },
  },
]
