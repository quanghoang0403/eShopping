module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard',
    'plugin:react/recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    'react/no-deprecated': 'off',
    'no-void': 'off',
    'no-undef': 'off',
    'no-case-declarations': 'off',
    'no-useless-constructor': 'off',
    'no-prototype-builtins': 'off',
    'react/display-name': 'off',
    'array-callback-return': 'off',
    camelcase: 'off'
  }
}
