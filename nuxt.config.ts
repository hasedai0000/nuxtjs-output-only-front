import { REPOSITORY_NAME } from './src/config/config'

export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src/',
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api'
    }
  },
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? `/${REPOSITORY_NAME}/` : '/',
    head: {
      title: 'Nuxt + Vue',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/vite.svg' }],
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
      ]
    }
  },
  css: ['~/style.css'],
  typescript: {
    strict: true
  },
  vite: {
    optimizeDeps: {
      include: ['@fortawesome/fontawesome-svg-core', '@fortawesome/vue-fontawesome']
    }
  }
})
