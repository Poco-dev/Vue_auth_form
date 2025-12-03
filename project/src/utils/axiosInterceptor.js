import axios from "axios";
import { useUserInfoStore } from "@/stores/UserInfoStore";

export function setupAxiosInterceptors() {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const userStore = useUserInfoStore();

      if (error.response?.status === 401) {
        const newToken = await userStore.refreshToken();

        if (newToken) {
          error.config.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(error.config); // Повторяем запрос с новым токеном
        } else {
          userStore.clearUser();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
}
