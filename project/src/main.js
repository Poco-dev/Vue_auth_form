import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router"; // Импортируем роутер
import "./axios";

const pinia = createPinia();
const app = createApp(App);

app.use(router); // Подключаем роутер
app.use(pinia);
app.mount("#app");
