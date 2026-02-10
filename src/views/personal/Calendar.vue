<template>
  <div class="h-full relative bg-discord-dark">
    <div v-if="scheduleStore.loading" class="absolute top-4 right-4 z-50 animate-spin text-discord-blurple italic text-xs">Loading...</div>

    <FullCalendar 
      ref="fullCalendarRef"
      :options="calendarOptions" 
      class="h-full custom-discord-calendar" 
    />

    <!-- Dialog Modal -->
    <ErrorDialog :show="showError" :message="errorMessage" @close="showError = false" />

    <!-- Dialog xem chi tiết item -->
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
                    <button @click="deleteEvent" class="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-700 transition-colors">Xóa</button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" @close="showModal = false" class="relative z-50">
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
                <DialogTitle class="text-lg font-semibold text-white mb-4">Tạo lịch trình</DialogTitle>
                
                <div class="space-y-4">
                  <!-- Type Toggle -->
                  <div class="flex gap-1 bg-[#1e1f22] p-1 rounded">
                    <button v-for="t in ['one-time', 'recurring']" :key="t" @click="form.type = t"
                            :class="form.type === t ? 'bg-[#4e5058] text-white' : 'text-[#b5bac1]'"
                            class="flex-1 text-[10px] py-1 rounded uppercase font-bold transition-all">
                      {{ t === 'one-time' ? 'Đột xuất' : 'Lặp lại' }}
                    </button>
                  </div>

                  <!-- Title Input -->
                  <input v-model="form.title" placeholder="Tiêu đề lịch trình..." 
                         class="w-full bg-[#1e1f22] border-none rounded p-2 text-sm text-white focus:ring-1 focus:ring-[#5865f2] outline-none" />

                  <!-- Recurring Options -->
                  <div v-if="form.type === 'recurring'" class="space-y-3">
                    <div class="flex justify-between">
                      <button v-for="(day, i) in ['T2','T3','T4','T5','T6','T7','CN']" :key="i"
                              @click="toggleDay(i)" :class="form.weekday.includes(i) ? 'bg-[#5865f2] text-white' : 'bg-[#1e1f22] text-[#b5bac1]'"
                              class="w-8 h-8 rounded-full text-[10px] font-bold transition-all">{{ day }}</button>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <input type="date" v-model="form.valid_from" class="bg-[#1e1f22] text-white text-[10px] p-1 rounded border-none outline-none" />
                      <input type="date" v-model="form.valid_to" class="bg-[#1e1f22] text-white text-[10px] p-1 rounded border-none outline-none" />
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex justify-end gap-2 text-xs mt-6 pt-4 border-t border-black/20">
                    <button @click="showModal = false" class="text-[#b5bac1] hover:underline px-3 py-1.5">Hủy</button>
                    <button @click="save(t)" class="bg-[#5865f2] text-white px-4 py-1.5 rounded hover:bg-[#4752c4] transition-colors">Lưu</button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue'
import { reactive, ref, watch, onMounted } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import { useScheduleStore } from '@/stores/schedule';

const scheduleStore = useScheduleStore();
const fullCalendarRef = ref(null);
const showModal = ref(false);
const selectedRange = ref(null);

const form = reactive({ title: '', type: 'one-time', weekday: [1,2,3,4,5], valid_from: '', valid_to: '' });

const showError = ref(false)
const errorMessage = ref('')
const showDetail = ref(false)
const selectedEvent = ref(null)

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin],
  initialView: 'timeGridWeek',
  selectable: true,
  editable: false, // Vô hiệu hóa drag & drop
  eventAllow: () => false, // Cấm mọi thao tác di chuyển event
  height: '100%',
  locale: 'vi',
  headerToolbar: { left: 'prev,next today', center: 'title', right: 'timeGridWeek,dayGridMonth' },
  datesSet: (info) => {
    scheduleStore.fetchAllMySchedules(info.startStr.split('T')[0], info.endStr.split('T')[0]);
  },
  buttonText: {
    today: 'Hôm nay',
    month: 'Tháng',
    week: 'Tuần'
  },
  forceEventDuration: true,
  defaultTimedEventDuration: '01:00',
  select: (info) => {
    selectedRange.value = info;
    form.start_time = info.startStr.split('T')[1].substring(0, 8);
    form.end_time = info.endStr.split('T')[1].substring(0, 8);
    showModal.value = true;
  },
  eventClick: (info) => {    
    selectedEvent.value = {
      id: info.event.id.split('-')[1],
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      type: info.event.extendedProps.type
    }
    showDetail.value = true;
  },
  // Events callback để render schedules
  events: (info, successCallback) => {
    successCallback(scheduleStore.mySchedules);
  }
});
const deleteEvent = async () => {
  if (!selectedEvent.value) return;
  try {
    await scheduleStore.deleteSchedule(selectedEvent.value.type, selectedEvent.value.id);
    showDetail.value = false;
    fetchSchedules();
  } catch (err) {
    showDetail.value = false;
    errorMessage.value =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      err?.error ||
      'Đã xảy ra lỗi khi xóa lịch trình.';
    showError.value = true;
  }
};

// Khi mySchedules thay đổi, refetch
watch(
  () => scheduleStore.mySchedules,
  () => {
    console.log('👁️ MySchedules changed, refetching...');
    if (fullCalendarRef.value?.getApi) {
      fullCalendarRef.value.getApi().refetchEvents();
    }
  },
  { deep: true }
);

onMounted(() => {
  fetchSchedules();
});

const toggleDay = (d) => {
  const idx = form.weekday.indexOf(d);
  idx > -1 ? form.weekday.splice(idx, 1) : form.weekday.push(d);
};
 
const fetchSchedules = () => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const startStr = today.toISOString().split('T')[0];
  const endStr = nextWeek.toISOString().split('T')[0];

  scheduleStore.fetchAllMySchedules(startStr, endStr);
};
const save = async (t) => {
  try {
    console.log(t);
    
    if(t === 'recurring'){
      await scheduleStore.createRecurringSchedule({
        start_time: form.start_time,
        end_time: form.end_time,
        valid_from: form.valid_from || null,
        valid_to: form.valid_to || null,
        weekday: form.weekday
      });
    }else{
      const start_time = selectedRange.value.startStr.split('T')[0] + 'T' + form.start_time;
      const end_time = selectedRange.value.startStr.split('T')[0] + 'T' + form.end_time;
      await scheduleStore.createOneTimeSchedule({
        name: form.title,
        start_time: start_time,
        end_time: end_time
      });
    }

    showModal.value = false;
    fetchSchedules();
  } catch (err) {
    showModal.value = false;
    errorMessage.value =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      err?.error ||
      'Đã xảy ra lỗi khi lưu lịch trình.'
    showError.value = true
  }
};
</script>

<style>
.custom-discord-calendar {
  --fc-border-color: #3f4147;
  --fc-today-bg-color: rgba(88, 101, 242, 0.05);
  color: #dcddde;
}
.fc-theme-standard td, .fc-theme-standard th { border-color: #383a40; }
.fc .fc-timegrid-slot { height: 3em; border-bottom: 1px solid #2e3035; }
.fc-v-event { border-radius: 4px; padding: 2px; }
</style>