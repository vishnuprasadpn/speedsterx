import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  const isAdmin = session?.user?.role === "ADMIN";
  const isManager = session?.user?.role === "MANAGER";
  const isAdminOrManager = isAdmin || isManager;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  // Protect admin routes - allow both ADMIN and MANAGER
  if (isAdminRoute && !isAdminOrManager) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow public routes
  const publicRoutes = [
    "/",
    "/shop",
    "/product",
    "/category",
    "/cart",
    "/auth",
    "/page",
    "/about",
    "/contact",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protect account and admin routes
  if (req.nextUrl.pathname.startsWith("/account") || req.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};

