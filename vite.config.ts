import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
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
  base: process.env.NODE_ENV === 'production' ? '/payments-management-frontend/' : '/'
})