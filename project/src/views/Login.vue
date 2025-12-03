<template>
    <div class="pt-5">
        <div class="pb-2">
            <p class="text-xl dark:text-white font-medium text-gray-900 text-center">Войдите в аккаунт</p>
        </div>
        <form @submit.prevent="sendEmail">
            <div class="mb-3">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Электронная
                    почта</label>
                <input type="email" v-model="email" id="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="example@gmail.com" required />
            </div>
            <div class="flex flex-row justify-end mb-3">
                <p class="text-slate-500">Нет аккаунта?</p>
                <router-link to="/register" class="dark:text-white text-gray-900 italic">Создайте его</router-link>
                <div class="w-5"></div>
            </div>
            <div class="flex justify-center items-center">
                <button type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Войти
                </button>
            </div>
            <p v-if="errorMessage" class="text-red-500 text-sm mt-3 text-center">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserInfoStore } from "@/stores/UserInfoStore";

export default {
    data() {
        return {
            userInfoStore: useUserInfoStore(), // Подключаем store
            email: "",
            username: "",
            surname: "",
        };
    },
    methods: {
        async sendEmail() {
            let info = {
                name: this.username,
                surname: this.surname,
                email: this.email,
                login: false,
            };

            try {
                await axios.post("/send-code", { email: this.email, login: false });

                this.userInfoStore.setUserInfo(info); // Теперь работает!
                this.$router.replace("/code");
            } catch (err) {
                console.error("Ошибка при отправке кода:", err);
            }
        },
    },
};

</script>

<style scoped>
#view {
    min-height: 100vh;
}
</style>
