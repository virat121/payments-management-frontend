import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'vuex'],
          charts: ['chart.js', 'vue-chartjs'],
          ui: ['@headlessui/vue', '@heroicons/vue']
        }
      }
    }
  },
  base: process.env.NODE_ENV === 'production' ? '/finflow/' : '/'
})