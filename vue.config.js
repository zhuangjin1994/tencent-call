const path = require('path')
const resolve = function (dir) {
  return path.join(__dirname, dir)
}

// 所有配置项说明可在中找到 https://cli.vuejs.org/config/
module.exports = {
  publicPath: '/',
  // process.env.NODE_ENV === 'production' ? '/tencent-call/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false, // 是否开启eslint保存检测
  productionSourceMap: false, // 是否在构建生产包时生成sourcdeMap
  chainWebpack: config => {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.resolve.alias
      .set('@', resolve('src'))
      .set('@views', resolve('src/views'))
    config.optimization.runtimeChunk('single')
  },
  devServer: {
    host: 'localhost',
    port: '8080',
    hot: true,
    open: true,
    overlay: {
      // 让浏览器 overlay 同时显示警告和错误
      warning: false,
      error: true
    },
    proxy: {
      // '/call-demand': {
      '/tencent-call': {
        changeOrigin: true,
        // target: 'http://10.43.16.65:9000', // 肖仁豪
        // target: "http://10.43.31.102:9000", // 邱喆鹏
        // target: "http://10.43.8.85:9000", // 康恩兵
         target: "http://localtestmrr.natapp1.cc", // 黄育威
        // target: "http://10.43.8.88:9000", // 需求方
        // target: "http://192.168.10.1:18002", // mrr
        secure: false,
        context: ['/tencent-call']
        // context: ['/call--demand']
      }
    }
  }
}
