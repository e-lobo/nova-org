<template>
  <div class="min-h-screen bg-gray-50">
    <main class="bg-white dark:bg-gray-900 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <template v-if="authStore.loading">
          <div class="text-center">
            <p class="text-gray-600">Loading...</p>
          </div>
        </template>
        <template v-else-if="authStore.isAuthenticated">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ $t("kyc.title") }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              {{ $t("kyc.subtitle") }}
            </p>
          </div>
          <KycForm />
        </template>
        <template v-else>
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to KYC Portal
            </h1>
            <p class="mt-4 text-gray-600">
              Please sign in to start your KYC verification process.
            </p>
            <div class="mt-8">
              <NuxtLink to="/login" class="btn btn-primary">Sign in</NuxtLink>
              <span class="mx-2 text-gray-500">or</span>
              <NuxtLink to="/signup" class="btn btn-secondary"
                >Create account</NuxtLink
              >
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "nuxt/app";

const authStore = useAuthStore();

// Initialize auth state
onMounted(() => {
  authStore.initialize();
});
</script>
