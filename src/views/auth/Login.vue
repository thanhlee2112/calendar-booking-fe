<template>
  <div class="flex h-screen w-full items-center justify-center bg-discord-card-lighter p-4">
    <div class="w-full max-w-[480px] rounded-lg bg-discord-card p-8 shadow-xl">
      <div class="text-center">
        <h1 class="mb-2 text-2xl font-bold text-discord-text-white">Chào mừng trở lại!</h1>
        <p class="mb-8 text-discord-text-gray">Rất vui được gặp lại bạn!</p>
        
        <button 
          @click="handleLogin"
          class="flex w-full items-center justify-center gap-3 rounded-md bg-discord-blurple py-3 font-medium text-white transition-all hover:bg-[#4752c4] active:scale-[0.98]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M19.27 4.57C17.77 3.88 16.16 3.38 14.48 3.1c-.21.37-.46.88-.63 1.28-1.78-.27-3.55-.27-5.28 0-.18-.4-.44-.91-.65-1.28-1.68.28-3.29.78-4.79 1.47-3.02 4.51-3.84 8.91-3.43 13.23.2.27.6.51 1.01.71 2.03 1.25 4.02 2.01 5.96 2.61.47-.64.88-1.34 1.23-2.09-.65-.25-1.27-.55-1.85-.92.16-.11.31-.24.46-.37 3.6 1.66 7.51 1.66 11.06 0 .15.13.3.26.46.37-.58.37-1.2.67-1.85.92.35.75.76 1.45 1.23 2.09 1.94-.6 3.93-1.36 5.96-2.61.41-.2.81-.44 1.01-.71.51-5.11-.84-9.45-3.43-13.23zM8.52 14.91c-1.14 0-2.09-1.05-2.09-2.33s.91-2.33 2.09-2.33c1.19 0 2.12 1.05 2.12 2.33s-.93 2.33-2.12 2.33zm6.97 0c-1.14 0-2.09-1.05-2.09-2.33s.91-2.33 2.09-2.33c1.19 0 2.12 1.05 2.12 2.33s-.93 2.33-2.12 2.33z"/>
          </svg>
          Tiếp tục với Discord
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleLogin = () => {
  // Thay thế URL này bằng URL API Backend của bạn 
  // Nơi mà Backend sẽ thực hiện redirect sang Discord
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/accounts/discord/login`;
};
</script>