<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  const accessToken = route.query.access;
  const refreshToken = route.query.refresh;
  const user = route.query.user;
  if (accessToken && refreshToken && user) {
    // Lưu vào Pinia và LocalStorage
    authStore.setTokens(accessToken, refreshToken,user);    
    // Chuyển hướng về trang chủ hoặc dashboard
    router.push('/');
  } else {
    console.error('Không tìm thấy token trong URL');
    router.push('/login');
  }
});
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p>Đang xác thực, vui lòng chờ...</p>
  </div>
</template>