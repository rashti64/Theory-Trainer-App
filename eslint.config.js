// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*', '.expo/*'] },
  {
    // react-three-fiber elements take three.js props (position, args, castShadow…).
    files: ['src/ui/city3d/**/*.tsx', 'src/ui/mascot-3d-view.tsx'],
    rules: { 'react/no-unknown-property': 'off' },
  },
]);
