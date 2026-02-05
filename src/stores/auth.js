import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Tự động đồng bộ với LocalStorage bằng VueUse
    accessToken: useStorage('access_token', null),
    refreshToken: useStorage('refresh_token', null),
    user: useStorage('user_info', null),
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    setTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;
    },
    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      window.location.href = '/';
    }
  }
});