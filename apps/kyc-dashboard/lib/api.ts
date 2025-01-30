import { config } from "@/config/env";
import { KYCSubmission } from "@/types/kyc";

export const API_ROUTES = {
  LOGIN: `${config.apiUrl}/auth/login`,
  ME: `${config.apiUrl}/auth/me`,
} as const;

interface LoginResponse {
  status: string;
  data: {
    user: User;
    token: string;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  KYCUser?: {
    id: string;
    status: string;
  };
}

interface MeResponse {
  status: string;
  data: User;
}

export const api = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(API_ROUTES.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  },
  getMe: async (token: string): Promise<MeResponse> => {
    const response = await fetch(API_ROUTES.ME, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user data");
    }

    return response.json();
  },
  getKYCSubmissions: async (
    token: string
  ): Promise<{ data: KYCSubmission[] }> => {
    const response = await fetch(`${config.apiUrl}/kyc`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch KYC submissions");
    }

    return response.json();
  },

  updateKYCStatus: async (
    token: string,
    kycId: string,
    status: "APPROVED" | "REJECTED" | "RETURNED",
    notes?: string
  ) => {
    const response = await fetch(`${config.apiUrl}/kyc/${kycId}/status`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) {
      throw new Error("Failed to update KYC status");
    }

    return response.json();
  },
  updateKYCStatus: async (
    token: string,
    kycId: string,
    status: "APPROVED" | "REJECTED" | "PENDING",
    notes?: string
  ): Promise<{ status: string; data: KYCSubmission }> => {
    const response = await fetch(`${config.apiUrl}/kyc/${kycId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) {
      throw new Error("Failed to update KYC status");
    }

    return response.json();
  },

  downloadFile: async (
    token: string,
    fileId: string,
    fileName: string
  ): Promise<void> => {
    try {
      const response = await fetch(`${config.apiUrl}/files/${fileId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw new Error("Failed to download file");
    }
  },
};
