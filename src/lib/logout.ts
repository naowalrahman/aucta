"use server";

import { removeServerCookies } from "next-firebase-auth-edge/next/cookies";
import { getAuth, signOut } from "firebase/auth";
import { clientApp } from "./firebase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverConfig } from "@/lib/config";

export async function logout() {
  await signOut(getAuth(clientApp));
  removeServerCookies(await cookies(), { cookieName: serverConfig.cookieName });
  redirect("/");
}
