import { cookies } from "next/headers";
import { getTokens } from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "@/lib/config";
import { AuthProvider } from "@/lib/auth-context";
import { ReactNode } from "react";

export async function getAuthData() {
  try {
    const tokens = await getTokens(await cookies(), {
      apiKey: clientConfig.apiKey,
      cookieName: serverConfig.cookieName,
      cookieSignatureKeys: serverConfig.cookieSignatureKeys,
      serviceAccount: serverConfig.serviceAccount,
    });

    if (!tokens) {
      return { user: null, isAuthenticated: false };
    }

    return {
      user: {
        uid: tokens.decodedToken.uid,
        email: tokens.decodedToken.email || null,
      },
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Error fetching auth data:", error);
    return { user: null, isAuthenticated: false };
  }
}

export default async function AuthProviderWrapper({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = await getAuthData();

  return (
    <AuthProvider user={user} isAuthenticated={isAuthenticated}>
      {children}
    </AuthProvider>
  );
}
