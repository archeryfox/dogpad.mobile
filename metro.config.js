// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Добавляем поддержку для дополнительных расширений файлов
config.resolver.assetExts.push('db');

module.exports = config; 