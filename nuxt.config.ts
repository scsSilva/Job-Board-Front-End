export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: ['vuetify'],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE,
    }
  }
})
