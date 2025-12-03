import axios from "axios";
import { useUserInfoStore } from "@/stores/UserInfoStore";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Добавляем перехватчик запросов
api.interceptors.request.use(
  async (config) => {
    const store = UseUserInfoStore();
    if (store.information.token) {
      config.headers.Authorization = `Bearer ${store.information.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Добавляем перехватчик ответов
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const store = UseUserInfoStore();
    if (error.response && error.response.status === 401) {
      const newToken = await store.refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      }
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
