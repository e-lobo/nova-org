// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  devServer: {
    port: parseInt(process.env.NUXT_PORT || "3000"),
    host: process.env.NUXT_HOST || "localhost",
  },
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL,
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
  ],
  css: ["~/assets/css/main.css"],
  build: {
    transpile: ["vue-toastification"],
  },
  i18n: {
    locales: [
      { code: "en", iso: "en-US", file: "en.json", dir: "ltr" },
      { code: "ar", iso: "ar-SA", file: "ar.json", dir: "rtl" },
    ],
    lazy: false,
    langDir: "../locales/",
    defaultLocale: "en",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
  colorMode: {
    classSuffix: "",
    // fallback: 'dark',
    storageKey: "nuxt-color-mode",
    storage: "cookie",
  },
});
