module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    // General code quality
    'no-console': 'off', // Allow console for CLI tools
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-unreachable': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // Best practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-multiple-empty-lines': ['error', { max: 2 }],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.d.ts'
  ],
};







