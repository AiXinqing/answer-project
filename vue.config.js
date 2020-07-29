module.exports = {
  lintOnSave: false,

  devServer: {
    port: 8080,
    open: true
  },

  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/scss/settings.scss";'
      }
    }
  }
}
