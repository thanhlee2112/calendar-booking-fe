import apiClient from "./axios";

export const activityService = {
  getActivities() {
    return apiClient.get("/activities/activities/");
  },
  createActivity(data) {
    return apiClient.post("/activities/activities/", data);
  },
  updateActivity(id, data) {
    return apiClient.put(`/activities/activities/${id}/`, data);
  },
  deleteActivity(id) {
    return apiClient.delete(`/activities/activities/${id}/`);
  }
};
