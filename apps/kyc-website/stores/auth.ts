import { defineStore } from "pinia";
import { getConfig, getApiUrl } from "~/utils/config";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthResponse {
  status: string;
  data: {
    user: User;
    token: string;
  };
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
  },

  actions: {
    async initialize() {
      const config = getConfig();
      const storedToken = localStorage.getItem(config.authTokenKey);
      const storedUser = localStorage.getItem(config.authUserKey);

      if (storedToken && storedUser) {
        this.token = storedToken;
        this.user = JSON.parse(storedUser);
      }
      this.loading = false;
    },

    async login(email: string, password: string) {
      this.loading = true;
      try {
        const response = await fetch(getApiUrl("/auth/login"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        const data = (await response.json()) as AuthResponse;
        const config = getConfig();

        this.user = data.data.user;
        this.token = data.data.token;

        localStorage.setItem(config.authTokenKey, data.data.token);
        localStorage.setItem(
          config.authUserKey,
          JSON.stringify(data.data.user)
        );
      } finally {
        this.loading = false;
      }
    },

    async signup(email: string, password: string, name: string) {
      this.loading = true;
      try {
        const response = await fetch(getApiUrl("/auth/signup"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          throw new Error("Registration failed");
        }

        const data = (await response.json()) as AuthResponse;
        const config = getConfig();

        this.user = data.data.user;
        this.token = data.data.token;

        localStorage.setItem(config.authTokenKey, data.data.token);
        localStorage.setItem(
          config.authUserKey,
          JSON.stringify(data.data.user)
        );
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      const config = getConfig();

      this.user = null;
      this.token = null;
      localStorage.removeItem(config.authTokenKey);
      localStorage.removeItem(config.authUserKey);
    },
  },
});
