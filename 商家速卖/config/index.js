'use strict'
// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const env = require('./prod.env')
const defaultAssetsSubDirectory = JSON.parse(env.defaultAssetsSubDirectory)
const versionApp = defaultAssetsSubDirectory === 'static'
module.exports = {
  build: {
    env,
    index: versionApp ? path.resolve(__dirname, '../dist/index.html') : path.resolve(__dirname, `../dist/${defaultAssetsSubDirectory}/index.html`),
    assetsRoot: versionApp ? path.resolve(__dirname, '../dist') : path.resolve(__dirname, `../dist/${defaultAssetsSubDirectory}`),
    assetsSubDirectory: 'static',
    assetsPublicPath: versionApp ? '/' : `/${defaultAssetsSubDirectory}/`,
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: false
  },
  dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 2019,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    overlay: {
      warnings: false
    }
  }
}
