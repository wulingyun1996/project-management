const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  lintOnSave: isDev,
  assetsDir: 'public',
  css: {
    modules: false,
    sourceMap: false,
    loaderOptions: {}
  },
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve
      .alias
      .set('api', '@/api')
      .set('assets', '@/assets')
      .set('css', '@/assets/css')
      .set('data', '@/assets/data')
      .set('components', '@/components')
      .set('mixins', '@/mixins')
      .set('utils', '@/utils')
      .set('views', '@/views')
      .set('icons', '@/icons')
      .end()
      .extensions
      .add('.styl')
      .add('.css')
  },
  devServer: {
    host: 'localhost',
    port: 2020,
    hot: true,
    hotOnly: false,
    open: true,
    https: false,
    overlay: {
      warnings: false,
      errors: true
    }
  }
}
