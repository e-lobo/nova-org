// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
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
