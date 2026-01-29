// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  
  devtools: { 
    enabled: true 
  },
  
  css: ['~/assets/css/main.css'],
  
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Fix pipe error
  vite: {
    server: {
      watch: {
        usePolling: true
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 24678
      }
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
      signalrUrl: process.env.NUXT_PUBLIC_SIGNALR_URL || 'http://localhost:5000/chatHub'
    }
  },

  app: {
    head: {
      title: 'Chat Support Service - POSday',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' 
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap'
        }
      ]
    }
  }
})