import { defineStore } from "pinia";
import { z } from "zod";
import { getConfig, getApiUrl } from "~/utils/config";

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  nationality: z.string().min(2, "Nationality is required"),
});

export const documentsSchema = z.object({
  idDocument: z.instanceof(File, { message: "ID document is required" }),
  proofOfAddress: z.instanceof(File, {
    message: "Proof of address is required",
  }),
  selfie: z.instanceof(File, { message: "Selfie is required" }),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Documents = z.infer<typeof documentsSchema>;

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED" | "RETURNED" | null;

interface KycUser {
  id: string;
  status: KycStatus;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  phoneNumber: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const useKycStore = defineStore("kyc", {
  state: () => ({
    currentStep: 1,
    personalInfo: {
      fullName: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      nationality: "",
    } as PersonalInfo,
    documents: {
      idDocument: null,
      proofOfAddress: null,
      selfie: null,
    } as unknown as Documents,
    isSubmitting: false,
    kycUser: null as KycUser | null,
    error: null as string | null,
    isLoading: false,
  }),

  getters: {
    canSubmit: (state) => {
      return (
        !state.kycUser ||
        state.kycUser.status === "REJECTED" ||
        state.kycUser.status === "RETURNED"
      );
    },
    isReadOnly: (state) => {
      return (
        state.kycUser?.status === "PENDING" ||
        state.kycUser?.status === "APPROVED"
      );
    },
  },

  actions: {
    async fetchKycStatus() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch(getApiUrl("/auth/me"), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              getConfig().authTokenKey
            )}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch KYC status");

        const data = await response.json();
        this.kycUser = data.data.KYCUser;

        // Pre-fill form if KYC exists
        if (this.kycUser) {
          this.personalInfo = {
            fullName: this.kycUser.fullName,
            dateOfBirth: new Date(this.kycUser.dateOfBirth)
              .toISOString()
              .split("T")[0],
            address: this.kycUser.address,
            phone: this.kycUser.phoneNumber,
            nationality: this.kycUser.nationality,
          };
        }
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    setPersonalInfo(info: PersonalInfo) {
      this.personalInfo = info;
    },

    setDocuments(docs: Documents) {
      this.documents = docs;
    },

    async validateCurrentStep(): Promise<boolean> {
      try {
        if (this.currentStep === 1) {
          personalInfoSchema.parse(this.personalInfo);
        } else if (this.currentStep === 2) {
          documentsSchema.parse(this.documents);
        }
        return true;
      } catch (error) {
        return false;
      }
    },

    async nextStep() {
      if ((await this.validateCurrentStep()) && this.currentStep < 3) {
        this.currentStep++;
      }
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },

    async submitKyc() {
      if (!(await this.validateCurrentStep())) {
        return false;
      }

      this.isSubmitting = true;
      this.error = null;

      try {
        const formData = new FormData();
        formData.append("fullName", this.personalInfo.fullName);
        formData.append("dateOfBirth", this.personalInfo.dateOfBirth);
        formData.append("address", this.personalInfo.address);
        formData.append("phoneNumber", this.personalInfo.phone);
        formData.append("nationality", this.personalInfo.nationality);
        formData.append("passport", this.documents.idDocument);
        formData.append("addressProof", this.documents.proofOfAddress);
        formData.append("selfie", this.documents.selfie);

        const response = await fetch(getApiUrl("/kyc/submit"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              getConfig().authTokenKey
            )}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to submit KYC");
        }

        await this.fetchKycStatus();
        return true;
      } catch (error: any) {
        this.error = error.message;
        return false;
      } finally {
        this.isSubmitting = false;
      }
    },
  },
});
