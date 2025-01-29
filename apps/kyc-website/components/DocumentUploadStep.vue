<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold mb-6 dark:text-white">
      {{ $t("kyc.steps.documents") }}
    </h2>

    <div class="space-y-8">
      <div class="border rounded-lg p-6 space-y-4">
        <h3 class="text-lg font-medium dark:text-white">
          {{ $t("kyc.documents.idDocument") }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t("kyc.documents.instructions.id") }}
        </p>
        <FileUpload
          v-model="documents.idDocument"
          accept="image/*"
          :preview="true"
          @update:modelValue="handleFileUpload('idDocument', $event)"
        />
      </div>

      <div class="border rounded-lg p-6 space-y-4">
        <h3 class="text-lg font-medium dark:text-white">
          {{ $t("kyc.documents.proofOfAddress") }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t("kyc.documents.instructions.address") }}
        </p>
        <FileUpload
          v-model="documents.proofOfAddress"
          accept="image/*,.pdf"
          :preview="true"
          @update:modelValue="handleFileUpload('proofOfAddress', $event)"
        />
      </div>

      <div class="border rounded-lg p-6 space-y-4">
        <h3 class="text-lg font-medium dark:text-white">
          {{ $t("kyc.documents.selfie") }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t("kyc.documents.instructions.selfie") }}
        </p>
        <FileUpload
          v-model="documents.selfie"
          accept="image/*"
          :preview="true"
          @update:modelValue="handleFileUpload('selfie', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useKycStore, type Documents } from "~/stores/kyc";

const store = useKycStore();
const documents = ref<Documents>({
  idDocument: store.$state.documents.idDocument,
  proofOfAddress: store.$state.documents.proofOfAddress,
  selfie: store.$state.documents.selfie,
});

const handleFileUpload = async (type: keyof Documents, file: File | null) => {
  if (!file) return;

  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  documents.value[type] = file;
  store.setDocuments(documents.value);
};

// Update store when component unmounts
onBeforeUnmount(() => {
  store.setDocuments(documents.value);
});
</script>
