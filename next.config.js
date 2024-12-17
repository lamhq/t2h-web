const path = require('path');
const withPlugins = require('next-compose-plugins');
const nextBuildId = require('next-build-id');
const withOffline = require('next-offline');
const withSourceMaps = require('@zeit/next-source-maps');
const runtimeConfig = require('./next.config.runtime');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = withPlugins([withOffline, withSourceMaps], Object.assign(runtimeConfig, {
  generateBuildId: async () => nextBuildId({ dir: __dirname }),
  webpack: (config, options) => {
    config.module.rules.push({
      type: 'javascript/auto',
      test: /\.mjs$/,
      use: [],
    });
    if (process.env.ANALYZE == 'true') {
      config.plugins.push(new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: 'static',
        reportFilename: options.isServer
          ? path.join(__dirname, '.analyze/server.html')
          : path.join(__dirname, '.analyze/browser.html')
      }))
    }

    // Further custom configuration here
    return config
  },
}));
