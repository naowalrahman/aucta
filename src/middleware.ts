import { authMiddleware } from "next-firebase-auth-edge";
import { NextRequest, NextResponse } from "next/server";
import { clientConfig, serverConfig } from "@/lib/config";
import { getTokens } from "next-firebase-auth-edge";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // redirect to home page if user is already authenticated
  if (path === "/login" || path === "/register") {
    try {
      const tokens = await getTokens(request.cookies, {
        apiKey: clientConfig.apiKey,
        cookieName: serverConfig.cookieName,
        cookieSignatureKeys: serverConfig.cookieSignatureKeys,
        serviceAccount: serverConfig.serviceAccount,
      });

      if (tokens) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Auth token verification error:", error);
    }
  }

  // continue with default auth middleware for all other paths
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
  });
}

export const config = {
  matcher: ["/", "/((?!_next|api|.*\\.).*)", "/api/login", "/api/logout"],
};
