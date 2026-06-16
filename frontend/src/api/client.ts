import axios from "axios";

export const AUTH_TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
