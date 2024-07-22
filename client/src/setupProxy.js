// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
    //   target: 'http://13.60.166.80:5000',
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
    })
  );
};
