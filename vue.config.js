module.exports = {
  lintOnSave: false,
  assetsDir: 'static',

  devServer: {
    port: 8080,
    open: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://192.168.0.56:8012',     //设置你调用的接口域名和端口号 别忘了加http
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '',     //这里理解成用'/api'代替target里面的地址，后面组件中我们掉接口时直接用api          代替 比如我要调用'http://xxx.xxx.xxx.xx:8081/user/add'，直接写‘/api/user/add’即可
    //     }
    //   }
    // }
  },

  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/scss/settings.scss";
              @import "@/assets/css/_variable.scss";
        `
      }
    }
  },

  publicPath: '/Areas/Assembly/dist/',

}
