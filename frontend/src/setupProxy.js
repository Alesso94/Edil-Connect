const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy solo le richieste che iniziano con /api
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
    })
  );
}; 