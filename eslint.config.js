import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// The core unused-variable rule does not recognize JSX component references.
// Mark those references without disabling checks for unused imports.
const jsxUsage = {
  rules: {
    'uses-vars': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        return {
          JSXOpeningElement(node) {
            let name = node.name
            const member = name.type === 'JSXMemberExpression'
            while (name.type === 'JSXMemberExpression') name = name.object
            if (name.type === 'JSXIdentifier' && (member || /^[A-Z]/.test(name.name))) {
              context.sourceCode.markVariableAsUsed(name.name, node)
            }
          },
        }
      },
    },
  },
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
    ],
    plugins: {
      'jsx-usage': jsxUsage,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'jsx-usage/uses-vars': 'error',
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
