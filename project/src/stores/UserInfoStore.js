import { defineStore } from "pinia";

// Функция для загрузки состояния из localStorage
function loadState() {
  const savedState = localStorage.getItem("userInfo");
  return savedState ? JSON.parse(savedState) : null;
}

export const useUserInfoStore = defineStore("userInfoStore", {
  state: () => ({
    information: loadState() || {
      // Загружаем данные при запуске
      name: "",
      surname: "",
      token: "",
      refreshToken: "",
      email: "",
      login: false,
    },
  }),

  actions: {
    // Устанавливаем информацию о пользователе
    setUserInfo(info) {
      this.information = { ...this.information, ...info };
      localStorage.setItem("userInfo", JSON.stringify(this.information)); // Сохраняем в localStorage
    },

    // Устанавливаем токены
    setTokens({ token, refreshToken }) {
      this.information.token = token;
      this.information.refreshToken = refreshToken;
      localStorage.setItem("userInfo", JSON.stringify(this.information));
    },

    // Обновляем Access Token по Refresh Token
    async refreshAccessToken() {
      try {
        const response = await fetch("/api/refresh-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: this.information.refreshToken }),
        });

        if (!response.ok) throw new Error("Ошибка обновления токена");

        const data = await response.json();
        this.setTokens({ token: data.token, refreshToken: data.refreshToken });
        return data.token;
      } catch (error) {
        console.error("Ошибка обновления токена:", error);
        this.logout();
      }
    },

    // Выход из системы
    logout() {
      this.information = {
        name: "",
        surname: "",
        email: "",
        token: "",
        refreshToken: "",
        login: false,
      };
      localStorage.removeItem("userInfo"); // Удаляем данные из localStorage
    },
  },
});
