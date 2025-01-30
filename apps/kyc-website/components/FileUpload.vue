<template>
  <div class="space-y-4">
    <div
      class="border-2 border-dashed rounded-lg p-6 text-center"
      :class="[
        error ? 'border-red-500' : 'border-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ]"
      @dragover.prevent
      @drop.prevent="!disabled && handleDrop($event)"
    >
      <input
        type="file"
        :accept="accept"
        class="hidden"
        ref="fileInput"
        @change="handleFileChange"
        :disabled="disabled"
      />

      <div v-if="!modelValue && !uploading" class="space-y-2">
        <div class="text-gray-600">
          <i class="fas fa-cloud-upload-alt text-2xl"></i>
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          {{
            disabled
              ? "File upload disabled"
              : "Drag and drop your file here or"
          }}
        </p>
        <button
          v-if="!disabled"
          type="button"
          class="btn btn-secondary"
          @click="$refs.fileInput?.click()"
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
          <p class="text-sm text-gray-500">
            {{ formatFileSize(modelValue.size) }}
          </p>
        </div>
        <button
          v-if="!disabled"
          type="button"
          class="btn btn-secondary"
          @click="handleRemove"
        >
          Remove
        </button>
      </div>
    </div>
    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface Props {
  modelValue: File | null;
  accept?: string;
  preview?: boolean;
  disabled?: boolean;
  error?: string;
  maxSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  accept: undefined,
  preview: false,
  disabled: false,
  error: "",
  maxSize: MAX_FILE_SIZE,
});

const emit = defineEmits<{
  "update:modelValue": [File | null];
  error: [string];
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

const validateFile = (file: File): boolean => {
  // Check file size
  if (file.size > props.maxSize) {
    emit(
      "error",
      `File size must be less than ${formatFileSize(props.maxSize)}`
    );
    return false;
  }

  // Check file type if accept is specified
  if (props.accept) {
    const acceptedTypes = props.accept.split(",").map((type) => type.trim());
    const fileType = file.type;
    const fileExtension = "." + file.name.split(".").pop();

    const isValidType = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        // Check file extension
        return fileExtension.toLowerCase() === type.toLowerCase();
      } else if (type.includes("/*")) {
        // Check mime type group (e.g., image/*)
        const [group] = type.split("/");
        return fileType.startsWith(group);
      } else {
        // Check exact mime type
        return fileType === type;
      }
    });

    if (!isValidType) {
      emit("error", `Invalid file type. Accepted types: ${props.accept}`);
      return false;
    }
  }

  return true;
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    const file = target.files[0];
    if (validateFile(file)) {
      simulateUpload(file);
    }
  }
};

const handleDrop = (event: DragEvent) => {
  if (props.disabled) return;

  const file = event.dataTransfer?.files[0];
  if (file && validateFile(file)) {
    simulateUpload(file);
  }
};

const handleRemove = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  emit("update:modelValue", null);
  emit("error", "");
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const simulateUpload = async (file: File) => {
  uploading.value = true;
  uploadProgress.value = 0;

  try {
    // Simulate upload progress
    const interval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 200);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearInterval(interval);
    uploadProgress.value = 100;
    emit("update:modelValue", file);
    emit("error", "");
  } catch (error) {
    emit("error", "Failed to upload file. Please try again.");
  } finally {
    uploading.value = false;
  }
};

// Cleanup preview URLs when component is unmounted
onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
