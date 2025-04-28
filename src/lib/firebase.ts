import { initializeApp } from "firebase/app";
import { clientConfig } from "./config";
import { getAuth } from "firebase/auth";

export const clientApp = initializeApp(clientConfig);
export const clientAuth = getAuth(clientApp);
