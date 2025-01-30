import { config } from "@/config/env";

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
};
