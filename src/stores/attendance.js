import { attendanceService } from "../api/attendance";
import { defineStore } from "pinia";

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    attendingEvents: [],
    voter: [],
  }),
  actions: {
    async attendEvent(eventId) {
      const response = await attendanceService.attendEvent(eventId);
      if (response.status === 200) {
        this.attendingEvents.push(eventId);
      }
    },
    async voteActivity(activityId) {
      const response = await attendanceService.voteActivity(activityId);
      if (response.status === 200) {
        this.voter.push(activityId);
      }
    },
    async attendAndVote(eventId, activityId) {
      const response = await attendanceService.attendAndVote(eventId, activityId);
      if (response.status === 200) {
        this.attendingEvents.push(eventId);
        this.voter.push(activityId);
      }
    },
    async unvoteActivity(activityId) {
      const response = await attendanceService.unvoteActivity(activityId);
      if (response.status === 200) {
        const index = this.voter.indexOf(activityId);
        if (index !== -1) {
          this.voter.splice(index, 1);
        }
      }
    },
    async declineEvent(eventId) {
        const response = await attendanceService.declineEvent(eventId);
        if (response.status === 200) {
            const index = this.attendingEvents.indexOf(eventId);
            if (index !== -1) {
                this.attendingEvents.splice(index, 1);
            }
        }
    },
  },
});
