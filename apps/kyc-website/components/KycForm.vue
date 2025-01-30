<template>
  <div class="max-w-3xl mx-auto p-4">
    <div v-if="isLoading" class="text-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <template v-else>
      <!-- Status Banner -->
      <div v-if="kycUser" class="mb-6">
        <div :class="statusAlertClass" role="alert">
          <h3 class="font-bold dark:text-white">
            KYC Status: {{ kycUser.status }}
          </h3>
          <div class="text-sm">
            <p
              v-if="kycUser.status === 'APPROVED'"
              class="mt-2 dark:text-white"
            >
              Your KYC has been approved. You can view your submitted
              information below.
            </p>
            <p
              v-else-if="kycUser.status === 'PENDING'"
              class="mt-2 dark:text-white"
            >
              Your KYC is currently under review. You can view your submitted
              information below.
            </p>
            <p
              v-else-if="
                kycUser.status === 'REJECTED' || kycUser.status === 'RETURNED'
              "
              class="mt-2 dark:text-white"
            >
              Your KYC needs attention. Please review and resubmit.
              <span v-if="kycUser.notes" class="block mt-2">
                Notes: {{ kycUser.notes }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="canSubmit" class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1">
            <div class="h-2 bg-gray-200 rounded">
              <div
                class="h-full bg-blue-600 rounded transition-all duration-300"
                :style="{ width: `${((currentStep - 1) / 2) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
        <div class="flex justify-between text-sm">
          <span :class="{ 'text-blue-600 font-medium': currentStep >= 1 }">
            {{ $t("kyc.steps.personalInfo") }}
          </span>
          <span :class="{ 'text-blue-600 font-medium': currentStep >= 2 }">
            {{ $t("kyc.steps.documents") }}
          </span>
          <span :class="{ 'text-blue-600 font-medium': currentStep >= 3 }">
            {{ $t("kyc.steps.review") }}
          </span>
        </div>
      </div>

      <!-- Form Steps -->
      <PersonalInfoStep v-if="currentStep === 1" />
      <DocumentUploadStep v-if="currentStep === 2" />
      <ReviewStep v-if="currentStep === 3 || isReadOnly" />

      <!-- Navigation Buttons -->
      <div v-if="canSubmit" class="mt-6 flex justify-between">
        <button
          v-if="currentStep === 3"
          @click="previousStep"
          class="btn btn-secondary"
          :disabled="isSubmitting"
        >
          Back
        </button>
        <button
          v-if="currentStep === 3"
          @click="handleSubmit"
          class="btn btn-primary ml-auto"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Submitting..." : "Submit KYC" }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useKycStore } from "~/stores/kyc";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";
import { useToast } from "vue-toastification";

const store = useKycStore();
const {
  currentStep,
  isSubmitting,
  kycUser,
  error,
  isLoading,
  canSubmit,
  isReadOnly,
} = storeToRefs(store);

const { submitKyc, fetchKycStatus, previousStep } = store;

const statusAlertClass = computed(() => {
  if (!kycUser.value?.status) return "";

  const classes = {
    APPROVED: "alert alert-success",
    PENDING: "alert alert-info",
    REJECTED: "alert alert-error",
    RETURNED: "alert alert-warning",
  };

  return classes[kycUser.value.status] || "alert";
});

const handleSubmit = async () => {
  const success = await submitKyc();
  if (success) {
    useToast().success("KYC submitted successfully!");
  } else {
    useToast().error(error.value || "Error submitting KYC. Please try again.");
  }
};

onMounted(() => {
  fetchKycStatus();
});
</script>
