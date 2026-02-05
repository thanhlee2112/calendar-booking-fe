import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// 1. Request Interceptor: Đính kèm Access Token vào Header
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

// 2. Response Interceptor: Xử lý Refresh Token khi gặp lỗi 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa từng thử refresh cho request này
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API Refresh Token của bạn
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`, {
          refresh: authStore.refreshToken,
        });

        const { access, refresh } = response.data;

        // Lưu token mới vào Pinia & LocalStorage
        authStore.setTokens(access, refresh);

        // Cập nhật header cho request cũ và gửi lại
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Nếu refresh cũng lỗi (hết hạn hoàn toàn) -> Logout
        authStore.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;