import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-04-24',

  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@primevue/nuxt-module'
  ],

  app: {
    keepalive: true
  },
  css: ['@/assets/css/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  },
  imports: {
    dirs: ['types/**', 'composables/**', 'components-types/**'],
    presets: [
      {
        from: 'vue-router',
        imports: ['LocationQuery']
      }
    ]
  },

  typescript: {
    shim: false
  },
  runtimeConfig: {
    public: {
      api: {
        origin: process.env.API_ORIGIN
      }
    }
  },

  tailwindcss: {
    configPath: './configs/tailwind.config.ts'
  },
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },

  auth: {
    baseURL: process.env.API_ORIGIN + '/',
    globalAppMiddleware: false,
    provider: {
      type: 'local',
      session: {
        dataType: {
          id: 'number',
          username: 'string',
          firstName: 'string',
          middleName: 'string',
          lastName: 'string',
          email: 'string',
          phone: 'string',
          role: 'string'
        }
      },
      pages: {
        login: '/auth/login'
      },
      endpoints: {
        signIn: { path: 'auth/signIn', method: 'post' },
        signOut: false,
        signUp: { path: 'auth/signUp', method: 'post' },
        getSession: { path: 'account/me', method: 'get' }
      },
      refresh: {
        isEnabled: true,
        endpoint: { path: 'auth/refresh', method: 'post' }
      },
      token: {
        signInResponseTokenPointer: '/token',
        type: 'Bearer',
        cookieName: 'auth.token',
        headerName: 'Authorization',
        maxAgeInSeconds: 60 * 60 * 24 * 3,
        sameSiteAttribute: 'lax',
        secureCookieAttribute: false,
        httpOnlyCookieAttribute: false
      }
    }
  }
})
