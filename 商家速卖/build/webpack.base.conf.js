var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack')
const vuxLoader = require('vux-loader')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const originalConfig = module.exports = {
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  output: {
    path: config.build.assetsRoot, // 导出目录的绝对路径
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.styl', '.css'],
    alias: {
      '@': resolve('src'),
      'src': path.resolve(__dirname, '../src'),
      'common': path.resolve(__dirname, '../src/common'),
      'components': path.resolve(__dirname, '../src/components'),
      'base': path.resolve(__dirname, '../src/base'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'images': path.resolve(__dirname, '../src/assets/images'),
      'commons$': path.resolve(__dirname, '../src/assets/util/common'),
      'filters$': path.resolve(__dirname, '../src/filters/index.js'),
      'stylus': path.resolve(__dirname, '../src/common/stylus'),
      'data': path.resolve(__dirname, '../data'),
      'api': path.resolve(__dirname, '../src/api'),
      'navtive$': path.resolve(__dirname, '../src/api/navtive'),
      'static': path.resolve(__dirname, '../static'),
      'mixins$': resolve('src/mixins/index.js'),
      'plugins': resolve('src/plugins'),
      'appConfig$': resolve('static/config/index.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [ new webpack.optimize.CommonsChunkPlugin('common.js'), new webpack.ProvidePlugin({ jQuery: 'jquery', $: 'jquery' }) ]
}

const webpackConfig = originalConfig

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui', 'progress-bar', 'duplicate-style', {
    name: 'after-less-parser',
    fn: function (source) {
      if (this.resourcePath.replace(/\\/g, '/').indexOf('/vux/src/components') > -1) {
        source = source.replace(/px/g, 'PX')
      }
      // 自定义的全局样式大部分不需要转换
      if (this.resourcePath.replace(/\\/g, '/').indexOf('App.vue') > -1) {
        source = source.replace(/px/g, 'PX').replace(/-1PX/g, '-1px')
      }
      return source
    }
  }, {
    name: 'style-parser',
    fn: function (source) {
      if (this.resourcePath.replace(/\\/g, '/').indexOf('/vux/src/components') > -1) {
        source = source.replace(/px/g, 'PX')
      }
      // 避免转换1PX.less文件路径
      if (source.indexOf('1PX.less') > -1) {
        source = source.replace(/1PX.less/g, '1px.less')
      }
      return source
    }
  }]
})