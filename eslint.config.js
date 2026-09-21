import js from '@eslint/js';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        DOMParser: 'readonly', URL: 'readonly', URLSearchParams: 'readonly', clearTimeout: 'readonly', document: 'readonly', fetch: 'readonly', history: 'readonly', location: 'readonly', matchMedia: 'readonly', navigator: 'readonly', setTimeout: 'readonly', window: 'readonly'
      }
    }
  }
];
