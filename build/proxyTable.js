module.exports = {
  '/onLogin': {
    target: 'http://localhost:8088/',
    changeOrigin: true,
    pathRewrite: {
      '^/onLogin': '/onLogin'
    }
  }
}