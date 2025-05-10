interface Env {
  apiUrl: string;
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
}

// Validate environment variables
const requiredEnvVars = [
  "VITE_API_URL",
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env: Env = {
  apiUrl: import.meta.env.VITE_API_URL,
  firebaseApiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  firebaseAuthDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: import.meta.env.VITE_FIREBASE_APP_ID,
};
