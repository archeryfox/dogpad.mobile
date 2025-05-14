// dogpad.mobile/babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove 'expo-router/babel' - it's now included in babel-preset-expo
      // Add other plugins you need here
    ],
  };
};