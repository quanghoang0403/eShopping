module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier', // Add "prettier" last. This will turn off eslint rules conflicting with prettier. This is not what will format our code.
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Ensure Prettier errors are flagged by ESLint
  },
};