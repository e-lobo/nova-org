<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <h2 class="text-2xl font-semibold mb-6 dark:text-white">
      {{ $t("kyc.steps.personalInfo") }}
    </h2>

    <div class="space-y-4">
      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
        >
          {{ $t("kyc.personalInfo.fullName") }}
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.fullName"
          type="text"
          class="form-input"
          :class="{ 'border-red-500': errors.fullName }"
          :disabled="isReadOnly"
          required
        />
        <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
          {{ errors.fullName }}
        </p>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
        >
          {{ $t("kyc.personalInfo.dateOfBirth") }}
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.dateOfBirth"
          type="date"
          class="form-input"
          :class="{ 'border-red-500': errors.dateOfBirth }"
          :disabled="isReadOnly"
          required
        />
        <p v-if="errors.dateOfBirth" class="mt-1 text-sm text-red-600">
          {{ errors.dateOfBirth }}
        </p>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
        >
          {{ $t("kyc.personalInfo.address") }}
          <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.address"
          class="form-input"
          :class="{ 'border-red-500': errors.address }"
          rows="3"
          :disabled="isReadOnly"
          required
        ></textarea>
        <p v-if="errors.address" class="mt-1 text-sm text-red-600">
          {{ errors.address }}
        </p>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
        >
          {{ $t("kyc.personalInfo.phone") }}
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.phone"
          type="tel"
          class="form-input"
          :class="{ 'border-red-500': errors.phone }"
          :disabled="isReadOnly"
          required
        />
        <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
          {{ errors.phone }}
        </p>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
        >
          {{ $t("kyc.personalInfo.nationality") }}
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.nationality"
          type="text"
          class="form-input"
          :class="{ 'border-red-500': errors.nationality }"
          :disabled="isReadOnly"
          required
        />
        <p v-if="errors.nationality" class="mt-1 text-sm text-red-600">
          {{ errors.nationality }}
        </p>
      </div>
    </div>

    <div v-if="!isReadOnly" class="flex justify-end">
      <button type="submit" class="btn btn-primary">Next</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import {
  useKycStore,
  personalInfoSchema,
  type PersonalInfo,
} from "~/stores/kyc";
import { useToast } from "vue-toastification";

const store = useKycStore();
const { isReadOnly } = storeToRefs(store);
const errors = ref<Partial<Record<keyof PersonalInfo, string>>>({});

const form = ref<PersonalInfo>({
  fullName: store.$state.personalInfo.fullName,
  dateOfBirth: store.$state.personalInfo.dateOfBirth,
  address: store.$state.personalInfo.address,
  phone: store.$state.personalInfo.phone,
  nationality: store.$state.personalInfo.nationality,
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
    // Show validation toast
    useToast().error("Please fill in all required fields correctly");
  }
};

// Update store when component unmounts
onBeforeUnmount(() => {
  store.setPersonalInfo(form.value);
});

// Initialize form with store data
onMounted(() => {
  const storeData = store.$state.personalInfo;
  if (storeData) {
    form.value = { ...storeData };
  }
});
</script>
