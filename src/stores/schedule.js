import { defineStore } from 'pinia';
import apiClient from '@/api/axios';

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    mySchedules: [],
    loading: false
  }),
  actions: {
    async fetchAllMySchedules(start, end) {
      this.loading = true;
      try {
        // Gọi song song cả 2 API để tối ưu thời gian
        const [recurringRes, oneTimeRes] = await Promise.all([
          apiClient.get('/schedules/availability-rules/', { params: { valid_from: start, valid_to: end } }),
          apiClient.get('/schedules/schedules/', { params: { start_time: start, end_time: end } })
        ]);

        const weekdayMap = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

        // 1. Map lịch lặp lại (Màu xanh)
        const recurring = recurringRes.data.map(item => ({
          id: `rec-${item.id}`,
          title: `[Lặp lại] ${item.start_time.substring(0,5)}`, // Hiện giờ bắt đầu cho gọn
          rrule: {
            freq: 'weekly',
            byweekday: item.rule_weekdays.map(d => weekdayMap[d]),
            dtstart: `${item.valid_from || '2024-01-01'}T${item.start_time}`,
            until: item.valid_to || undefined
          },
          duration: this.calculateDuration(item.start_time, item.end_time),
          backgroundColor: '#3ba55c',
          borderColor: 'transparent',
          extendedProps: { type: 'recurring', description: item.description }
        }));

        // 2. Map lịch đột xuất (Màu cam)
        const oneTime = oneTimeRes.data.map(item => ({
          id: `ot-${item.id}`,
          title: item.name,
          start: item.start_time, // ISO string từ API: "2026-02-02T15:00:00"
          end: item.end_time,
          backgroundColor: '#faa61a',
          borderColor: 'transparent',
          extendedProps: { type: 'one-time', description: item.description }
        }));

        this.mySchedules = [...recurring, ...oneTime];
      } finally {
        this.loading = false;
      }
    },

    calculateDuration(start, end) {
      const [sH, sM] = start.split(':').map(Number);
      const [eH, eM] = end.split(':').map(Number);
      return { minutes: (eH * 60 + eM) - (sH * 60 + sM) };
    },
    async createRecurringSchedule(data) {
      try {
        const response = await apiClient.post('/schedules/availability-rules/', data);
        return response.data;
      } catch (err) {
        console.error("❌ Error creating recurring schedule:", err);
        throw err;
      }
    }
  }
});