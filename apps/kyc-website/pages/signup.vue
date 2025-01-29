<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center dark:bg-gray-900"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
      >
        Create a new account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <NuxtLink
          to="/login"
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          sign in to your existing account
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 dark:bg-gray-800"
      >
        <form class="space-y-6" @submit.prevent="handleSignup">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="form-input"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="form-input"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full btn btn-primary"
              :disabled="isLoading"
            >
              {{ isLoading ? "Creating account..." : "Create account" }}
            </button>
          </div>

          <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "nuxt/app";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const handleSignup = async () => {
  try {
    isLoading.value = true;
    error.value = "";
    await authStore.signup(email.value, password.value);
    router.push("/");
  } catch (err: any) {
    error.value = err.message || "Failed to create account";
  } finally {
    isLoading.value = false;
  }
};
</script>
