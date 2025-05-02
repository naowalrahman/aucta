import { initializeApp } from "firebase/app";
import { clientConfig } from "./config";
import { getAuth } from "firebase/auth";
import { getFirestore as getClientFirestore } from "firebase/firestore";

export const clientApp = initializeApp(clientConfig);
export const clientAuth = getAuth(clientApp);
export const clientDatabase = getClientFirestore(clientApp);
