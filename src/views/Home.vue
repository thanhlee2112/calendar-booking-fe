<template>
  <div class="h-full bg-discord-dark p-4 rounded-lg overflow-hidden flex flex-col">
    <div v-if="calendarStore.loading" class="text-discord-text-gray animate-pulse mb-4">
      Đang cập nhật sự kiện mới nhất...
    </div>
    
    <div v-if="calendarStore.error" class="text-red-400 mb-4 p-2 bg-red-900 rounded">
      ❌ Lỗi: {{ calendarStore.error }}
    </div>

    <div class="text-discord-text-gray mb-2">
      📊 Events trong store: {{ calendarEvents.length }}
    </div>

    <FullCalendar 
      ref="fullCalendarRef"
      :options="calendarOptions"
      class="flex-1 custom-discord-calendar"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, computed, ref, watch } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendarStore } from '@/stores/calendar';

const calendarStore = useCalendarStore();
const fullCalendarRef = ref(null);

const calendarEvents = computed(() => {
  return calendarStore.events;
});

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  },
  editable: false,
  selectable: false,
  selectMirror: false,
  dayMaxEvents: true,
  
  // Events callback - FullCalendar sẽ gọi hàm này để lấy events
  events: (info, successCallback, failureCallback) => {
    const eventsToShow = calendarStore.events;
    successCallback(eventsToShow);
  },

  buttonText: {
    today: 'Hôm nay',
    month: 'Tháng',
    week: 'Tuần'
  }
});

// Khi store events thay đổi, refetch
watch(
  () => calendarStore.events,
  () => {
    if (fullCalendarRef.value?.getApi) {
      fullCalendarRef.value.getApi().refetchEvents();
    }
  },
  { deep: true }
);

onMounted(() => {
  calendarStore.fetchAllEvents();  
});
</script>

<style>
/* Custom CSS để FullCalendar "hòa tan" vào Discord Theme */
.custom-discord-calendar {
  --fc-border-color: #3f4147;
  --fc-page-bg-color: transparent;
  --fc-today-bg-color: rgba(88, 101, 242, 0.1);
  color: #dcddde;
  height: 100%;
}

.fc {
  height: 100%;
}

.fc .fc-scroller {
  overflow-y: auto !important;
}

.fc .fc-col-header-cell {
  background-color: #36393f;
  border-color: #3f4147;
  color: #b5bac1;
}

.fc .fc-daygrid-day,
.fc .fc-timegrid-slot {
  border-color: #3f4147;
}

.fc .fc-daygrid-day-frame {
  min-height: 100px;
}

.fc .fc-daygrid-day-event {
  background-color: #5865f2 !important;
  border-color: transparent !important;
  color: #fff !important;
}

.fc .fc-event {
  background-color: #5865f2 !important;
  border-color: transparent !important;
}

.fc .fc-toolbar-title {
  font-size: 1.25rem;
  color: #f2f3f5;
}

.fc .fc-button-primary {
  background-color: #4e5058;
  border-color: transparent;
}

.fc .fc-button-primary:hover {
  background-color: #6d6f78;
}

.fc .fc-daygrid-day-number {
  padding: 8px;
  color: #b5bac1;
}

.fc .fc-timegrid-slot {
  height: 3em;
}

.fc .fc-button-primary:hover {
  background-color: #6d6f78;
}

.fc .fc-daygrid-day-number {
  padding: 8px;
  color: #b5bac1;
}

</style>