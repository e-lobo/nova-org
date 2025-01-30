<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold mb-6 dark:text-white">
      {{ $t("kyc.steps.documents") }}
    </h2>

    <div class="space-y-8">
      <div class="border rounded-lg p-6 space-y-4">
        <h3 class="text-lg font-medium dark:text-white">
          {{ $t("kyc.documents.idDocument") }}
          <span class="text-red-500">*</span>
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t("kyc.documents.instructions.id") }}
        </p>
        <FileUpload
          v-model="documents.idDocument"
          accept="image/*,.pdf"
          :preview="true"
          @update:modelValue="handleFileUpload('idDocument', $event)"
          :disabled="isReadOnly"
          :error="errors.idDocument"
        />
      </div>

      <div class="border rounded-lg p-6 space-y-4">
        <h3 class="text-lg font-medium dark:text-white">
          {{ $t("kyc.documents.proofOfAddress") }}
          <span class="text-red-500">*</span>
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t("kyc.documents.instructions.address") }}
        </p>
        <FileUpload
          v-model="documents.proofOfAddress"
          accept="image/*,.pdf"
          :preview="true"
          @update:modelValue="handleFileUpload('proofOfAddress', $event)"
          :disabled="isReadOnly"
          :error="errors.proofOfAddress"
        />
      </div>

      <div class="border rounded-lg p-6 space-y-4">
        <h3 class="text-lg font-medium dark:text-white">
          {{ $t("kyc.documents.selfie") }}
          <span class="text-red-500">*</span>
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t("kyc.documents.instructions.selfie") }}
        </p>
        <FileUpload
          v-model="documents.selfie"
          accept="image/*"
          :preview="true"
          @update:modelValue="handleFileUpload('selfie', $event)"
          :disabled="isReadOnly"
          :error="errors.selfie"
        />
      </div>
    </div>

    <div v-if="!isReadOnly" class="flex justify-between mt-6">
      <button @click="handleBack" class="btn btn-secondary">Back</button>
      <button @click="handleNext" class="btn btn-primary">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useKycStore, documentsSchema, type Documents } from "~/stores/kyc";
import { useToast } from "vue-toastification";

const store = useKycStore();
const { isReadOnly } = storeToRefs(store);
const errors = ref<Partial<Record<keyof Documents, string>>>({});

const documents = ref<Documents>({
  idDocument: store.$state.documents.idDocument,
  proofOfAddress: store.$state.documents.proofOfAddress,
  selfie: store.$state.documents.selfie,
});

const validateDocuments = () => {
  try {
    documentsSchema.parse(documents.value);
    errors.value = {};
    return true;
  } catch (error: any) {
    if (error.errors) {
      errors.value = error.errors.reduce((acc: any, curr: any) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
    }
    return false;
  }
};

const handleFileUpload = async (type: keyof Documents, file: File | null) => {
  if (!file) return;

  // File size validation (10MB limit)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > MAX_FILE_SIZE) {
    useToast().error(`${formatDocumentType(type)} must be less than 10MB`);
    return;
  }

  // File type validation
  if (type === "selfie" && !file.type.startsWith("image/")) {
    useToast().error("Selfie must be an image file");
    return;
  }

  documents.value[type] = file;
  store.setDocuments(documents.value);
  validateDocuments();
};

const handleNext = () => {
  if (validateDocuments()) {
    store.nextStep();
  } else {
    useToast().error("Please upload all required documents");
  }
};

const handleBack = () => {
  store.previousStep();
};

const formatDocumentType = (type: string) => {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

// Update store when component unmounts
onBeforeUnmount(() => {
  store.setDocuments(documents.value);
});

// Initialize documents from store
onMounted(() => {
  const storeData = store.$state.documents;
  if (storeData) {
    documents.value = { ...storeData };
  }
});
</script>
