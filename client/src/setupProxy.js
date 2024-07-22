// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
    //   target: 'http://13.60.166.80:5000',
      target: 'https://13.60.166.80',
      changeOrigin: true,
      secure: false,
    })
  );
};
