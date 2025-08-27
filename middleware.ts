// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // If user is logged in and tries to hit login or signup → redirect to dashboard
    if (token && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup" || req.nextUrl.pathname === "/")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If not logged in and tries dashboard → redirect to login
    if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: () => true, // always run custom logic
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup","/"],
};
