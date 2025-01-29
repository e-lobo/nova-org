<template>
  <div
    :class="{ rtl: $i18n.locale === 'ar' }"
    class="min-h-screen"
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="bg-white dark:bg-gray-900 min-h-screen">
      <nav class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <NuxtLink to="/" class="flex items-center">
                <span class="text-xl font-bold text-gray-900 dark:text-white">{{
                  $t("app.title")
                }}</span>
              </NuxtLink>
            </div>
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
              <!-- Language Switcher -->
              <select
                v-model="$i18n.locale"
                class="form-select rounded-md text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>

              <!-- Theme Switcher -->
              <ClientOnly>
                <button
                  @click="toggleColorMode"
                  class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  :title="$t('app.toggleTheme')"
                >
                  <span
                    v-if="$colorMode.value === 'dark'"
                    class="text-yellow-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </span>
                  <span v-else class="text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  </span>
                </button>
              </ClientOnly>

              <!-- Auth Actions -->
              <template v-if="authStore.isAuthenticated">
                <span class="text-gray-700 dark:text-gray-300">{{
                  authStore.user?.email
                }}</span>
                <button @click="handleLogout" class="btn btn-secondary">
                  {{ $t("auth.signOut") }}
                </button>
              </template>
              <template v-else>
                <NuxtLink :to="localePath('/login')" class="btn btn-primary">
                  {{ $t("auth.signIn") }}
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </nav>

      <main class="py-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "nuxt/app";

const router = useRouter();
const authStore = useAuthStore();
const colorMode = useColorMode();
const localePath = useLocalePath();

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
</script>

<style>
.rtl {
  direction: rtl;
  text-align: right;
}

/* Dark mode styles */
.dark .btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.dark .btn-secondary {
  @apply bg-gray-700 text-white hover:bg-gray-600;
}

.dark .form-input {
  @apply bg-gray-700 border-gray-600 text-white;
}
</style>
