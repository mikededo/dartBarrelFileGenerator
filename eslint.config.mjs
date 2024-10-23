import antfu from '@antfu/eslint-config';

export default antfu({
  lessOpinionated: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: 'single'
  },
  gitignore: true,
  typescript: {
    overrides: {
      'no-use-before-define': 'off',
      'ts/consistent-type-definitions': ['error', 'type'],
      'ts/consistent-type-imports': ['error', {
        disallowTypeAnnotations: false,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports'
      }],
      'ts/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_'
        }
      ],
      'ts/no-use-before-define': ['error', {
        classes: false,
        enums: false,
        functions: true,
        ignoreTypeReferences: true,
        typedefs: false,
        variables: true
      }]
    }
  }
}).override(
  'antfu/stylistic/rules',
  {
    rules: {
      'style/brace-style': ['error', '1tbs'],
      'style/comma-dangle': ['error', 'never'],
      'style/indent': [
        'error',
        2,
        {
          flatTernaryExpressions: true,
          offsetTernaryExpressions: true,
          SwitchCase: 1
        }
      ],
      'style/no-multiple-empty-lines': ['error', { max: 1 }],
      'style/operator-linebreak': ['error', 'after', {
        overrides: { ':': 'before', '?': 'before' }
      }],
      'style/quote-props': ['error', 'as-needed']
    }
  }
);
