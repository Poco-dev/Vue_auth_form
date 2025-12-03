import { createRouter, createWebHistory } from "vue-router";

// Компоненты
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Code from "@/views/Code.vue";
import Rules from "@/views/Rules.vue";
// Определяем маршруты
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/:pathMatch(.*)*", // Для страницы 404
    name: "NotFound",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/code",
    name: "Code",
    component: Code,
  },
  {
    path: "/rules",
    name: "Rules",
    component: Rules,
  },
];

// Создаем экземпляр роутера
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
