export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Skip middleware if going to login or signup pages
  if (to.path === "/login" || to.path === "/signup") {
    return;
  }

  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }
});
