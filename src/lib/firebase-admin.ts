"use server";

import { serverConfig } from "./config";
import { initializeApp as initializeServerApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serverApp = getApps().length
  ? getApps()[0]
  : initializeServerApp({
      credential: cert(serverConfig.serviceAccount),
    });

const database = getFirestore(serverApp);

export async function getServerApp() {
  return serverApp;
}

export async function getDatabase() {
  return database;
}
