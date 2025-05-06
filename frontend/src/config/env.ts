interface Env {
  apiUrl: string;
}

// Validate environment variables
const requiredEnvVars = ["VITE_API_URL"] as const;

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env: Env = {
  apiUrl: import.meta.env.VITE_API_URL,
};
