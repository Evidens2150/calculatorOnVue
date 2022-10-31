module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    // "plugin:vue/vue3-essential",
    // "eslint:recommended"
    'plugin:vue/vue3-recommended'
    // "plugin:prettier/recommended",
  ],
  // parser: 'vue-eslint-parser',
  parserOptions: {
    // parser: 'vue-eslint-parser',
    // "parser": "@typescript-eslint/parser",
    'sourceType': 'module'
    // parser: "@babel/eslint-parser",
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'experimentalDisableTemplateSupport': 0,
    'quotes': [2, 'single', { 'avoidEscape': true }],
    // 'func-call-spacing': ['error', 'always'],
    'vue/v-slot-style': ['error', 'longform']
    // ['error', {
    //   'atComponent': 'shorthand' | 'longform' | 'v-slot',
    //   'default': 'shorthand' | 'longform' | 'v-slot',
    //   'named': 'shorthand' | 'longform',
    // }]
  },
};
