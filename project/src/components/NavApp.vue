<template>
    <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 flex p-2 justify-between items-center">
        <router-link to="/">
            <div class="flex gap-2 items-center">
                <img src="../../favicon.ico" alt="Logo" />
                <p class="text-white font-serif text-xl">Сервис</p>
            </div>
        </router-link>
        <div class="pr-1">
            <div v-if="userInfoStore.information.accessToken" @click="toggleProfile">
                <div class="relative ml-3">
                    <button type="button" class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none">
                        <span class="sr-only">Открыть меню</span>
                        <img class="size-8 rounded-full" :src="avatarSrc" alt="Avatar" />
                    </button>
                    <Transition name="profile">
                        <div v-if="profile"
                            class="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                            <router-link to="/profile"
                                class="block px-4 py-2 text-sm text-gray-700">Профиль</router-link>
                            <button @click="logout"
                                class="block px-4 py-2 text-sm text-gray-700 w-full text-left">Выйти</button>
                        </div>
                    </Transition>
                </div>
            </div>
            <router-link v-else to="/login" class="text-white font-serif text-xl">Войти</router-link>
        </div>
    </div>
</template>

<script>
import { useUserInfoStore } from "@/stores/UserInfoStore";

export default {
    data() {
        return {
            userInfoStore: useUserInfoStore(),
            profile: false,
        };
    },
    computed: {
        avatarSrc() {
            return this.userInfoStore.information.avatar || "https://via.placeholder.com/50";
        },
    },
    methods: {
        toggleProfile() {
            this.profile = !this.profile;
        },
        async logout() {
            await this.userInfoStore.clearUser();
            this.profile = false;
            this.$router.push("/login");
        },
    },
};
</script>

<style>
.profile-enter-active,
.profile-leave-active {
    transition: opacity 0.3s ease;
}

.profile-enter-from,
.profile-leave-to {
    opacity: 0;
}
</style>