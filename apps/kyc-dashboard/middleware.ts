import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_ROUTES } from "./lib/api";

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/api/auth/login"];

// Define allowed authenticated routes
const allowedAuthRoutes = ["/dashboard"];

const ALLOWED_ROLES = ["ADMIN"];

function isAllowedRole(role: string): boolean {
  return ALLOWED_ROLES.includes(role);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always redirect root to dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    // Get auth token from cookies
    const authToken = request.cookies.get("auth_token")?.value;

    // If user is already authenticated on public routes, redirect to dashboard
    if (authToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // Get auth token from cookies
  const authToken = request.cookies.get("auth_token")?.value;

  // If no token is present, redirect to login
  if (!authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify user role by calling /me endpoint
    const response = await fetch(API_ROUTES.ME, {
      headers: {
        Authorization: authToken,
      },
    });

    if (!response.ok) {
      // Token is invalid or expired
      const loginResponse = NextResponse.redirect(
        new URL("/login", request.url)
      );
      loginResponse.cookies.delete("auth_token");
      return loginResponse;
    }

    const data = await response.json();

    // Check role authorization
    if (!isAllowedRole(data.data.role)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // If authenticated but trying to access non-allowed route, redirect to dashboard
    if (!allowedAuthRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // User is authenticated and authorized on allowed route
    return NextResponse.next();
  } catch (error) {
    // Error occurred during verification
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth/login).*)",
  ],
};
