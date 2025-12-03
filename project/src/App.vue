<template>
    <div class="dark:bg-gray-800 flex flex-col" style="min-height: 100vh;">
        <nav-app />
        <div class="flex justify-center pt-2">
            <router-view class="sm:w-1/4 md:w-1/2 2xl:h-1/2"></router-view>
        </div>
    </div>
</template>

<script>
import { useUserInfoStore } from "@/stores/UserInfoStore";
import { setupAxiosInterceptors } from "@/utils/axiosInterceptor";
import NavApp from "./components/NavApp.vue";

export default {
    components: { NavApp },
    async created() {
        const userStore = useUserInfoStore();
        setupAxiosInterceptors();
        await userStore.checkAuth();
    },
};
</script>