module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.js',
            '.android.js', 
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.json'
          ],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/services': './src/services',
            '@/store': './src/store',
            '@/types': './src/types',
            '@/utils': './src/utils',
            '@/styles': './src/styles'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
