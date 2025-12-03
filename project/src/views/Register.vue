<template>
    <div class="pt-5">
        <div class="pb-2">
            <p class="text-xl dark:text-white text-gray-900 font-medium text-center">Регистрация</p>
        </div>
        <form @submit.prevent="sendEmail()">

            <div class="mb-2">
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Имя</label>
                <input type="text" v-model="username" id="name"
                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    required />
            </div>
            <div class="mb-2">
                <label for="surname"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Фамилия</label>
                <input type="text" v-model="surname" id="surname"
                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    required />
            </div>
            <div class="mb-3">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Электронная
                    почта</label>
                <input type="email" id="email" v-model="email"
                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="example@gmail.com" required />
            </div>
            <div class="flex items-start mb-5">
                <div class="flex items-center h-5">
                    <input id="terms" type="checkbox" value=""
                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                        required />
                </div>
                <label for="terms" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Я согласен с
                    <router-link to="/rules" target="_blank"
                        class="text-blue-600 hover:underline dark:text-blue-500">правилами
                        пользования</router-link></label>
            </div>
            <div class="flex flex-row justify-end mb-3">
                <p class="text-slate-500">Уже есть аккаунт?</p><router-link to="/login"
                    class="dark:text-white text-gray-900 italic">Войдите в
                    него</router-link>
                <div class="w-5"></div>
            </div>
            <div class="flex justify-center items-center">
                <button type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Зарегистрироваться</button>
            </div>
        </form>
    </div>

</template>

<script>
import axios from 'axios';
import { useUserInfoStore } from "@/stores/UserInfoStore";


export default {
    name: 'Register',
    data() {
        return {
            userInfoStore: useUserInfoStore(),
            email: "",
            username: '',
            surname: "",
        }
    },
    methods: {
        async sendEmail() {
            if (!this.email) return alert("Введите email!");

            let info = {
                name: this.username,
                surname: this.surname,
                email: this.email,
                login: false,
            };

            try {
                let response = await axios.post('/send-code', {
                    email: this.email,
                    login: false
                });

                this.userInfoStore.getInfo(info);
                this.$router.replace('/code');

                // Очистка полей только после успешного запроса
                this.email = "";
                this.username = "";
                this.surname = "";
            } catch (err) {
                console.error("Ошибка при отправке запроса:", err);
                alert("Ошибка при отправке кода. Проверьте email и попробуйте снова.");
            }
        }
    },

}
</script>
