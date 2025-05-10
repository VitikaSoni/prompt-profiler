import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "../../config/env";
import { auth } from "@/config/firebase";

const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthorizationHeader = async (
  config: InternalAxiosRequestConfig<any>
) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
};

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    await setAuthorizationHeader(config);
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;
