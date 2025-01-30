export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  environment: process.env.NEXT_PUBLIC_ENV,
  isDevelopment: process.env.NEXT_PUBLIC_ENV === "development",
  isProduction: process.env.NEXT_PUBLIC_ENV === "production",
};
