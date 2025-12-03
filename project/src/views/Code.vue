<template>
    <div class="pt-5">
        <div class="pb-2">
            <p class="text-xl dark:text-white font-medium text-gray-900 text-center">Введите код</p>
        </div>
        <form @submit.prevent="checkCode">
            <div class="mb-2">
                <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Код</label>
                <input type="text" v-model="code" id="code"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required />
            </div>
            <div class="flex flex-row justify-end mb-3">
                <p class="text-slate-500">Не пришел код?</p>
                <a @click="sendEmail" class="dark:text-white text-gray-900 italic cursor-pointer">Отправить еще раз</a>
                <div class="w-5"></div>
            </div>
            <div class="flex justify-center items-center">
                <button type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Подтвердить
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
    name: 'Code',
    data() {
        return {
            userInfoStore: useUserInfoStore(),
            code: "",
            errorMessage: "" // Для вывода ошибок
        };
    },
    methods: {
        async checkCode() {
            this.errorMessage = ""; // Сброс ошибки перед запросом

            if (!this.code) {
                this.errorMessage = "Введите код!";
                return;
            }

            try {
                let payload = {
                    email: this.userInfoStore.information.email,
                    code: this.code
                };

                if (!this.userInfoStore.information.login) {
                    payload.name = this.userInfoStore.information.name;
                    payload.surname = this.userInfoStore.information.surname;
                }

                let response = await axios.post('http://localhost:3000/verify-code', payload);

                console.log("Ответ от сервера:", response.data);

                if (response.data.token) {
                    localStorage.setItem('access_token', response.data.token);
                    if (this.userInfoStore.getToken) {
                        this.userInfoStore.getToken(response.data.token);
                    }
                }

                this.$router.replace('/');

            } catch (err) {
                console.error("Ошибка при проверке кода:", err);

                if (err.response && err.response.data.errorMessages) {
                    this.errorMessage = err.response.data.errorMessages;
                } else {
                    this.errorMessage = "Ошибка соединения с сервером. Попробуйте снова.";
                }
            }
        },

        async sendEmail() {
            console.log("Повторная отправка кода на", this.userInfoStore.information.email);

            try {
                await axios.post('http://localhost:3000/send-code', {
                    email: this.userInfoStore.information.email,
                    login: this.userInfoStore.information.login
                });

                alert("Код отправлен повторно!");

            } catch (err) {
                console.error("Ошибка при повторной отправке кода:", err);
                this.errorMessage = "Ошибка при отправке кода. Попробуйте снова.";
            }
        }
    },
}
</script>
