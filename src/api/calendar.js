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
  }
};