interface Config {
  apiBaseUrl: string;
  authTokenKey: string;
  authUserKey: string;
  isDevelopment: boolean;
}

export const getConfig = (): Config => {
  const config: Config = {
    apiBaseUrl:
      process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1",
    authTokenKey: process.env.NUXT_AUTH_TOKEN_KEY || "auth_token",
    authUserKey: process.env.NUXT_AUTH_USER_KEY || "auth_user",
    isDevelopment: process.env.NODE_ENV !== "production",
  };

  return config;
};

export const getApiUrl = (path: string): string => {
  const config = getConfig();
  return `${config.apiBaseUrl}${path}`;
};
