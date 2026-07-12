const path = require('path');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

module.exports = (async () => {
  const config = await getSentryExpoConfig(__dirname);
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
    extraNodeModules: {
      'grm-learning-materials': path.resolve(__dirname, 'packages/learning-materials'),
    },
  };
  config.watchFolders = [
    path.resolve(__dirname, 'packages/learning-materials'),
  ];

  return config;
})();