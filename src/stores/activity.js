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
        async addActivity(activityData) {
            try {
                const response = await activityService.createActivity(activityData);
                this.activities.push(response.data); // Thêm hoạt động mới vào state
            } catch (err) {
                console.error("❌ Lỗi tạo activity:", err);
                throw err; // Ném lỗi để component có thể xử lý
            }
          },
          async updateActivity(activityId, activityData) {
            try {
                const response = await activityService.updateActivity(activityId, activityData);
                const index = this.activities.findIndex(act => act.id === activityId);
                if (index !== -1) {
                    this.activities[index] = response.data; // Cập nhật hoạt động trong state
                }
            } catch (err) {
                console.error("❌ Lỗi cập nhật activity:", err);
                throw err;
            }
          },
          async deleteActivity(activityId) {
            try {
                await activityService.deleteActivity(activityId);
                this.activities = this.activities.filter(act => act.id !== activityId); // Xóa hoạt động khỏi state
            } catch (err) {
                console.error("❌ Lỗi xóa activity:", err);
                throw err;
            }
          },
    }
});