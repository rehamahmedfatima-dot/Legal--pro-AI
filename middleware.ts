import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const roleHomePage: Record<string, string> = {
  admin: "/admin/dashboard",
  lawyer: "/lawyer/dashboard",
  client: "/client/dashboard"
};

function requiredRoleForPath(pathname: string): string | null {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/lawyer")) return "lawyer";
  if (pathname.startsWith("/client")) return "client";
  return null;
}

export async function middleware(request: NextRequest) {
  const { response, user, role } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const requiredRole = requiredRoleForPath(pathname);

  // Protected area but no session -> send to login
  if (requiredRole && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protected area but wrong role -> send to their own dashboard
  if (requiredRole && role && role !== requiredRole && role !== "admin") {
    return NextResponse.redirect(new URL(roleHomePage[role] ?? "/", request.url));
  }

  // Already logged in and visiting /login or /register -> go to dashboard
  if (user && role && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL(roleHomePage[role] ?? "/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/lawyer/:path*",
    "/client/:path*",
    "/login",
    "/register"
  ]
};
