<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <h2 class="text-2xl font-semibold mb-6 dark:text-white">
      {{ $t("kyc.steps.personalInfo") }}
    </h2>

    <div class="space-y-4">
      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
          >{{ $t("kyc.personalInfo.fullName") }}</label
        >
        <input
          v-model="form.fullName"
          type="text"
          class="form-input"
          :class="{ 'border-red-500': errors.fullName }"
        />
        <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
          {{ errors.fullName }}
        </p>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
          >{{ $t("kyc.personalInfo.dateOfBirth") }}</label
        >
        <input
          v-model="form.dateOfBirth"
          type="date"
          class="form-input"
          :class="{ 'border-red-500': errors.dateOfBirth }"
        />
        <p v-if="errors.dateOfBirth" class="mt-1 text-sm text-red-600">
          {{ errors.dateOfBirth }}
        </p>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
          >{{ $t("kyc.personalInfo.address") }}</label
        >
        <textarea
          v-model="form.address"
          class="form-input"
          :class="{ 'border-red-500': errors.address }"
          rows="3"
        ></textarea>
        <p v-if="errors.address" class="mt-1 text-sm text-red-600">
          {{ errors.address }}
        </p>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
          >{{ $t("kyc.personalInfo.phone") }}</label
        >
        <input
          v-model="form.phone"
          type="tel"
          class="form-input"
          :class="{ 'border-red-500': errors.phone }"
        />
        <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
          {{ errors.phone }}
        </p>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
          >{{ $t("kyc.personalInfo.email") }}</label
        >
        <input
          v-model="form.email"
          type="email"
          class="form-input"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">
          {{ errors.email }}
        </p>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  useKycStore,
  personalInfoSchema,
  type PersonalInfo,
} from "~/stores/kyc";

const store = useKycStore();
const errors = ref<Partial<Record<keyof PersonalInfo, string>>>({});

const form = ref<PersonalInfo>({
  fullName: store.$state.personalInfo.fullName,
  dateOfBirth: store.$state.personalInfo.dateOfBirth,
  address: store.$state.personalInfo.address,
  phone: store.$state.personalInfo.phone,
  email: store.$state.personalInfo.email,
});

const handleSubmit = () => {
  try {
    const validated = personalInfoSchema.parse(form.value);
    store.setPersonalInfo(validated);
    errors.value = {};
    store.nextStep();
  } catch (error: any) {
    if (error.errors) {
      errors.value = error.errors.reduce((acc: any, curr: any) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
    }
  }
};

// Update store when component unmounts
onBeforeUnmount(() => {
  store.setPersonalInfo(form.value);
});
</script>
