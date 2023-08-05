module.exports = {
  extends: [require.resolve('@umijs/max/eslint'), 'plugin:import/recommended'],
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
      },
    ],

    'import/no-unresolved': 0,
  },
};
