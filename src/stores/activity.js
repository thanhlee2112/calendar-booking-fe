import { activityService } from "../api/activity";
import { defineStore } from "pinia";

export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [],
    loading: false,
    error: null,
  }),
    actions: {
      async fetchAllActivities() {
            this.loading = true;
            this.error = null;
            try {
                const response = await activityService.getActivities();
                this.activities = response.data; // Giả sử API trả về { data: [...] }
            } catch (err) {
                console.error("❌ Lỗi fetch activities:", err);
                this.error = err.message;
                this.activities = [];
            } finally {
                this.loading = false;
            }
        },
    }
});