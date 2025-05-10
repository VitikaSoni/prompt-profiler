import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { env } from "./env";

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  authDomain: env.firebaseAuthDomain,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseStorageBucket,
  messagingSenderId: env.firebaseMessagingSenderId,
  appId: env.firebaseAppId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
