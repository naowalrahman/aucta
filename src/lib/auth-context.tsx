"use client";

import { createContext, useContext, ReactNode } from "react";

export interface AuthContextType {
  user: {
    uid: string;
    email: string | null;
  } | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({
  children,
  user,
  isAuthenticated,
}: {
  children: ReactNode;
  user: AuthContextType["user"];
  isAuthenticated: boolean;
}) {
  return <AuthContext.Provider value={{ user, isAuthenticated }}>{children}</AuthContext.Provider>;
}
