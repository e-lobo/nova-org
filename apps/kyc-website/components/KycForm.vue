<template>
  <div class="max-w-3xl mx-auto p-4">
    <div class="mb-8">
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
        <span :class="{ 'text-blue-600 font-medium': currentStep >= 1 }">{{
          $t("kyc.steps.personalInfo")
        }}</span>
        <span :class="{ 'text-blue-600 font-medium': currentStep >= 2 }">{{
          $t("kyc.steps.documents")
        }}</span>
        <span :class="{ 'text-blue-600 font-medium': currentStep >= 3 }">{{
          $t("kyc.steps.review")
        }}</span>
      </div>
    </div>

    <PersonalInfoStep v-if="currentStep === 1" />
    <DocumentUploadStep v-if="currentStep === 2" />
    <ReviewStep v-if="currentStep === 3" />

    <div class="mt-6 flex justify-between">
      <button
        v-if="currentStep > 1"
        @click="previousStep"
        class="btn btn-secondary"
        :disabled="isSubmitting"
      >
        Back
      </button>
      <button
        v-if="currentStep < 3"
        @click="handleNext"
        class="btn btn-primary ml-auto"
      >
        Next
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
  </div>
</template>

<script setup lang="ts">
import { useKycStore } from "~/stores/kyc";
import { storeToRefs } from "pinia";

const store = useKycStore();
const { currentStep, isSubmitting } = storeToRefs(store);
const { previousStep, nextStep, submitKyc } = store;

const handleNext = () => {
  nextStep();
};

const handleSubmit = async () => {
  const success = await submitKyc();
  if (success) {
    // Show success toast
    alert("KYC submitted successfully!");
  } else {
    // Show error toast
    alert("Error submitting KYC. Please try again.");
  }
};
</script>
