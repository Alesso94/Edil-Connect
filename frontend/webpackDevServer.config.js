module.exports = {
    allowedHosts: ['localhost', '.localhost'],
    proxy: {
        '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            secure: false,
            pathRewrite: {
                '^/api': '/api'
            }
        }
    }
}; 