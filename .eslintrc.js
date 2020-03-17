module.exports = {
  // root: true,
  // parser: 'vue-eslint-parser',
  env: {
    node: true,
    // jest: true,
  },

  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:node/recommended',
    // 'plugin:jest/recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'prettier',
  ],
  parserOptions: {
      // Only ESLint 6.2.0 and later support ES2020.
      ecmaVersion: 2019
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      }
    ],
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'func-names': 'off',
    'no-case-declarations': 'off', // Case declarations are great for Websockets
    'no-process-exit': 'off',
    // 'object-shorthand': 'off',
    // 'class-methods-use-this': 'off',
    'no-debugger': 'off',
    'no-underscore-dangle': 'off', // Private variables in JS
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    'import/prefer-default-export': 0, // Too strict.
    'max-len': ['warn', { code: 144 }],
    'consistent-return': 0, // Arrow functions don't always have to return stuff
    'implicit-arrow-linebreak': 0, // Arrow line breaks are important for chained promises
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for VueX state
        'acc', // for reduce accumulators
        'accumulator', // for reduce accumulators
        'e', // for e.returnvalue
        'ctx', // for Koa routing
        'req', // for Express requests
        'request', // for Express requests
        'res', // for Express responses
        'response', // for Express responses
        '$scope', // for Angular 1 scopes
        'staticContext', // for ReactRouter context
      ],
    }],
  },

  overrides: [
    { // Jest-specific overrides
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
      rules: {
        // 'require-jsdoc': 'off'
        // '@typescript-eslint/explicit-function-return-type': 0, // Jest functions do not return stuff
      },
    },
  ],
};
