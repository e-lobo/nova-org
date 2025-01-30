<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-semibold mb-6 dark:text-white">
      Review Your Information
    </h2>

    <div class="space-y-6">
      <div class="border rounded-lg p-6">
        <h3 class="text-lg font-medium mb-4 dark:text-white">
          Personal Information
        </h3>
        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-white">
              Full Name
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ store.personalInfo.fullName }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-white">
              Date of Birth
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ formatDate(store.personalInfo.dateOfBirth) }}
            </dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-sm font-medium text-gray-500 dark:text-white">
              Address
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ store.personalInfo.address }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-white">
              Phone
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ store.personalInfo.phone }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-white">
              Nationality
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ store.personalInfo.nationality }}
            </dd>
          </div>
        </dl>
      </div>

      <div class="border rounded-lg p-6">
        <h3 class="text-lg font-medium mb-4 dark:text-white">Uploaded Documents</h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div
            v-for="(doc, type) in store.documents"
            :key="type"
            class="space-y-2"
          >
            <p class="text-sm font-medium text-gray-500 dark:text-white">
              {{ formatDocumentType(type) }}
            </p>
            <div class="border rounded p-2">
              <div v-if="doc" class="text-sm text-gray-900 dark:text-white">
                <p>{{ doc.name }}</p>
                <p class="text-gray-500">{{ formatFileSize(doc.size) }}</p>
              </div>
              <p v-else class="text-sm text-red-600">Not uploaded</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKycStore } from "~/stores/kyc";

const store = useKycStore();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const formatDocumentType = (type: string) => {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>
