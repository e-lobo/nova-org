export const ALLOWED_ROLES = ["ADMIN"] as const;

export const isAllowedRole = (role: string) => {
  return ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number]);
};

export const saveAuthToken = (token: string) => {
  localStorage.setItem("auth_token", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

export const clearAuthToken = () => {
  localStorage.removeItem("auth_token");
};
