import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "janic_super_secret_session_jwt_key_2026_xYz987!@"
);

const SESSION_COOKIE_NAME = "janic_auth_token";

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Protect /admin and /staff routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/staff")) {
      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

      let isAuthenticated = false;
      let userRole = null;
      if (token) {
        try {
          const { payload } = await jwtVerify(token, SECRET_KEY);
          if (payload?.id) {
            isAuthenticated = true;
            userRole = payload.role;
          }
        } catch {
          isAuthenticated = false;
        }
      }

      // For all protected routes, must be authenticated
      if (!isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Regular USER (public account) cannot access /admin or /staff portals
      if (userRole === "USER") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // If STAFF tries to access /admin/..., redirect to /staff/...
      if (userRole === "STAFF" && pathname.startsWith("/admin")) {
        const staffPath = pathname.replace(/^\/admin/, "/staff");
        return NextResponse.redirect(new URL(staffPath, request.url));
      }
    }

    // If user is accessing /login while already authenticated
    if (pathname === "/login") {
      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      if (token) {
        try {
          const { payload } = await jwtVerify(token, SECRET_KEY);
          if (payload?.id) {
            const dest =
              payload.role === "STAFF"
                ? "/staff/dashboard"
                : payload.role === "ADMIN" || payload.role === "EDITOR"
                ? "/admin/dashboard"
                : "/";
            return NextResponse.redirect(new URL(dest, request.url));
          }
        } catch {
          // invalid token, proceed to login
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware Error]:", error);
    return NextResponse.next();
  }
}

export default middleware;
export const proxy = middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets with extensions (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
