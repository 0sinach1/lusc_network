import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "lusc-platform-super-secret-key-2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Explicitly bypass login route to prevent infinite loops
  if (pathname === "/admin/login" || pathname === "/login") {
    return NextResponse.next();
  }

  // 2. Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("lusc_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = (payload.role as string)?.toLowerCase();

      // SuperAdmin has unrestricted access
      if (role === "super" || role === "superadmin") {
        return NextResponse.next();
      }

      // Enforce lock on delegated office sub-directories (e.g. /admin/welfare)
      const allowedPath = `/admin/${role}`;
      if (!pathname.startsWith(allowedPath)) {
        return NextResponse.redirect(new URL(allowedPath, request.url));
      }

      return NextResponse.next();
    } catch (err) {
      // Token invalid or expired
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};