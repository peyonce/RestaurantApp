module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './',
            '@app': './app',
            '@components': './components',
            '@contexts': './contexts',
            '@services': './services'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
