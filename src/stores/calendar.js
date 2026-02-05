import { defineStore } from 'pinia';
import { calendarService } from '@/api/calendar';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    events: [],
    loading: false,
    error: null
  }),

// src/stores/calendar.js
actions: {
  async fetchAllEvents() {
    this.loading = true;
    this.error = null;
    try {
      const response = await calendarService.getAllEvents();
      
      // GIẢ SỬ API TRẢ VỀ: { data: [...] } hoặc chỉ là [...]
      const rawData = response.data || response; 

      if (!Array.isArray(rawData)) {
        throw new Error(`Expected array, got ${typeof rawData}`);
      }

      this.events = rawData.map(event => {        
        return {
          id: event.id,
          title: event.title,
          start: event.start_time,
          end: event.end_time,
          description: event.description,
          backgroundColor: '#5865f2',
          borderColor: 'transparent',
          allDay: false
        };
      });
      
    } catch (err) {
      console.error("❌ Lỗi fetch events:", err);
      this.error = err.message;
      this.events = [];
    } finally {
      this.loading = false;
    }
  }
}
});