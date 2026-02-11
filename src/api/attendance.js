import apiClient from "./axios";

export const attendanceService = {
    async attendEvent(eventId) {
        try {
            const payload = {
                'event': eventId
            }
            const response = await apiClient.post(`/events/attendance/`, payload);
            return response;
        } catch (error) {
            console.error('❌ Lỗi khi tham gia sự kiện:', error);
            throw error;
        }
    },
    async voteActivity(activityId) {
        try {
            const payload = { 
                'activity': activityId
            }
            const response = await apiClient.post(`/events/voting/`, payload);
            return response;
        } catch (error) {
            console.error('❌ Lỗi khi vote hoạt động:', error);
            throw error;
        }
    },
    async unvoteActivity(activityId) {
        try {
            const response = await apiClient.delete(`/events/voting/${activityId}/`);
            return response;
        } catch (error) {
            console.error('❌ Lỗi khi hủy vote hoạt động:', error);
            throw error;
        }
    },
    async attendAndVote(eventId, activityId) {
        try {
            const payload = {
                'event': eventId,
                'activity': activityId
            }
            const response = await apiClient.post(`/events/attendance/attend-and-vote/`, payload);
            return response;
        } catch (error) {
            console.error('❌ Lỗi khi tham gia sự kiện:', error);
            throw error;
        }
    },
    async declineEvent(eventId) {
        try {
            const response = await apiClient.delete(`/events/attendance/${eventId}/`);
            return response;
        } catch (error) {
            console.error('❌ Lỗi khi từ chối sự kiện:', error);
            throw error;
        }
    }
};

