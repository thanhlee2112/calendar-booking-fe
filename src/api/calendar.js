import apiClient from './axios';

export const calendarService = {
  /**
   * Lấy danh sách sự kiện tổng quát
   * @param {String} start - ISO Date string
   * @param {String} end - ISO Date string
   */
  async getAllEvents(start, end) {
    try {
      const response = await apiClient.get('/events/events/');

      return response.data;
    } catch (error) {
      console.error('❌ Lỗi khi fetch sự kiện:', error);
      throw error;
    }
  },
  async createEvent(data) {
    try {
      const response = await apiClient.post('/events/events/', data);
      return response;
    } catch (error) {
      console.error('❌ Lỗi khi tạo sự kiện:', error);
      throw error;
    }
  },
  async getEventDetail(id) {
    try {
      const response = await apiClient.get(`/events/events/${id}/`);
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi khi lấy chi tiết sự kiện:', error);
      throw error;
    }
  },
  async updateEvent(id, data) {
    try {
      const response = await apiClient.put(`/events/events/${id}/`, data);
      return response;
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật sự kiện:', error);
      throw error;
    }
  }
};