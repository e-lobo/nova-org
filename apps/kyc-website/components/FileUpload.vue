<template>
  <div class="space-y-4">
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        type="file"
        :accept="accept"
        class="hidden"
        ref="fileInput"
        @change="handleFileChange"
      />

      <div v-if="!modelValue && !uploading" class="space-y-2">
        <div class="text-gray-600">
          <i class="fas fa-cloud-upload-alt text-2xl"></i>
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          Drag and drop your file here or
        </p>
        <button
          type="button"
          class="btn btn-secondary"
          @click="$refs.fileInput.click()"
        >
          Browse Files
        </button>
      </div>

      <div v-if="uploading" class="space-y-2">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full"
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
        <p class="text-sm text-gray-600">Uploading... {{ uploadProgress }}%</p>
      </div>

      <div v-if="modelValue && preview" class="space-y-2">
        <div v-if="isImage" class="relative">
          <img
            :src="previewUrl || ''"
            alt="Preview"
            class="max-h-48 mx-auto rounded"
          />
        </div>
        <div v-else class="text-gray-600">
          <i class="fas fa-file text-2xl"></i>
          <p>{{ modelValue.name }}</p>
        </div>
        <button type="button" class="btn btn-secondary" @click="handleRemove">
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  modelValue: File | null;
  accept?: string;
  preview?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [File | null];
}>();

const fileInput = ref<HTMLInputElement>();
const uploading = ref(false);
const uploadProgress = ref(0);

const isImage = computed(() => {
  return props.modelValue?.type.startsWith("image/");
});

const previewUrl = computed(() => {
  if (props.modelValue && isImage.value) {
    return URL.createObjectURL(props.modelValue);
  }
  return null;
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    simulateUpload(target.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0];
  if (file) {
    simulateUpload(file);
  }
};

const handleRemove = () => {
  emit("update:modelValue", null);
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const simulateUpload = async (file: File) => {
  uploading.value = true;
  uploadProgress.value = 0;

  // Simulate upload progress
  const interval = setInterval(() => {
    if (uploadProgress.value < 100) {
      uploadProgress.value += 10;
    }
  }, 200);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  clearInterval(interval);
  uploadProgress.value = 100;
  uploading.value = false;
  emit("update:modelValue", file);
};
</script>
