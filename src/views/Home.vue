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
    <TransitionRoot appear :show="showDetail" as="template">
      <Dialog as="div" @close="showDetail = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/50" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-sm transform bg-[#2b2d31] border border-black/20 rounded-lg shadow-2xl p-4 transition-all">
                <DialogTitle class="text-lg font-semibold text-white mb-4">Chi tiết lịch trình</DialogTitle>
                <div v-if="selectedEvent">
                  <div class="mb-2 text-white"><b>Tiêu đề:</b> {{ selectedEvent.title }}</div>
                  <div class="mb-2 text-white"><b>Bắt đầu:</b> {{ selectedEvent.start }}</div>
                  <div class="mb-2 text-white"><b>Kết thúc:</b> {{ selectedEvent.end }}</div>
                  <div class="flex justify-end gap-2 mt-6">
                    <button @click="showDetail = false" class="text-[#b5bac1] hover:underline px-3 py-1.5">Đóng</button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
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
import { useScheduleStore } from '@/stores/schedule';
import rrulePlugin from '@fullcalendar/rrule';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';

const calendarStore = useCalendarStore();
const scheduleStore = useScheduleStore();
const fullCalendarRef = ref(null);
const showDetail = ref(false)
const selectedEvent = ref(null);
const calendarEvents = computed(() => {
  // Gộp cả calendar events và schedule
  return [
    ...calendarStore.events,
    ...scheduleStore.mySchedules
  ];
});

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin],
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
    successCallback(calendarEvents.value);
  },

  buttonText: {
    today: 'Hôm nay',
    month: 'Tháng',
    week: 'Tuần'
  },
  eventContent: function(arg) {
    const username = arg.event.extendedProps?.username || '';
    return {
      html: `<div><b>${arg.event.title}</b><br><span style='font-size:12px;color:#b5bac1'>${username ? '👤 ' + username : ''}</span></div>`
    };
  },
  eventClick: (info) => {
    // Route to EventDetail.vue with event id
    // event.id có thể là dạng "event-123", lấy số id
    const eventId = info.event.id.split('-')[1] || info.event.id;
    // Sử dụng router để chuyển trang
    window.location.href = `/events/${eventId}`;
    // Nếu dùng vue-router:
    // router.push({ name: 'EventDetail', params: { id: eventId } });
  },
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
  scheduleStore.fetchAllSchedules();
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
  cursor: pointer;
}

.fc .fc-event {
  background-color: #5865f2 !important;
  border-color: transparent !important;
    cursor: pointer;

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