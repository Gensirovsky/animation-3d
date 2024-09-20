// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/scss/index.scss'],

  imports: {
    dirs: ['composables'],
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_variables.scss" as *;',
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  experimental: {
    renderJsonPayloads: false,
  },

  modules: ['nuxt-viewport', '@hypernym/nuxt-gsap'],

  gsap: {
    extraPlugins: {
      scrollTrigger: true,
      scrollTo: true,
    },
  },

  viewport: {
    breakpoints: {
      mobile: 320,
      mobileMedium: 375,
      mobileWide: 425,
      preTablet: 500,
      tablet: 768,
      desktop: 1024,
      desktopMedium: 1280,
      desktopWide: 1600,
    },
  },
})
