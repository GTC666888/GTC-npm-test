import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import path from 'path'

export default defineConfig({
  plugins: [createVuePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 火山引擎 ARK API 代理
      '/api/ark': {
        target: 'https://ark.cn-beijing.volces.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ark/, '/api'),
        secure: false
      },
      // 通用代理 - 支持任意 HTTPS 请求
      '/proxy': {
        target: 'https://example.com',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 从请求头获取真实目标URL
            const targetUrl = req.headers['x-proxy-target']
            if (targetUrl) {
              try {
                const url = new URL(targetUrl)
                options.target = url.origin
                proxyReq.path = url.pathname + url.search
                proxyReq.setHeader('host', url.host)
              } catch (e) {
                console.error('Invalid proxy target URL:', e)
              }
            }
          })
        }
      }
    }
  }
})