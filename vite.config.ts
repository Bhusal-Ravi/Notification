import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({mode})=>{
  return{
  plugins: [react(), tailwindcss()],
  server: {
    ...(mode === 'development' && {
        https: {
          key: './cert/key.pem',
          cert: './cert/cert.pem'
        }
      }),
    allowedHosts: [
      'arg-forward-mpg-princess.trycloudflare.com',
      'racks-james-headlines-bridges.trycloudflare.com',
      'localhost:5173'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}
})
