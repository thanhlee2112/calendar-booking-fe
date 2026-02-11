<template>
	<div class="min-h-screen w-full bg-discord-dark flex flex-col">
		<!-- Thanh tiến trình dạng progress bar -->
        <div class="mt-6 mb-6 text-xl font-bold text-white text-center">Tạo sự kiện mới</div>
	<div class="w-full bg-[#23272a] shadow py-6 flex justify-center items-center">
	<div class="flex w-full items-center">        
				<template v-for="(label, idx) in stepLabels">
					<div class="flex flex-col items-center flex-1">
						<div :class="['w-8 h-8 rounded-full flex items-center justify-center font-bold', step === idx+1 ? 'bg-[#5865f2] text-white' : 'bg-[#35373c] text-[#b5bac1]']">
							{{ idx+1 }}
						</div>
						<div class="mt-2 text-xs text-[#b5bac1]">{{ label }}</div>
					</div>
					<div v-if="idx < stepLabels.length - 1" class="flex-1 h-1 bg-[#35373c] mx-2"></div>
				</template>
			</div>
		</div>
		<!-- Khung form bên dưới -->
	<div class="w-full bg-[#23272a] shadow p-6 flex flex-col flex-1">
			<!-- Màn hình từng bước -->
			<div v-if="step === 1">
				<div class="mb-4 text-white text-lg font-bold">Thông tin chung của sự kiện</div>
				<input v-model="form.title" placeholder="Tên sự kiện" class="w-full p-2 rounded border text-white mb-1" />
				<div v-if="showValidation && !form.title" class="text-red-500 text-xs mb-2">Vui lòng nhập tên sự kiện</div>
				<textarea v-model="form.description" placeholder="Mô tả sự kiện" class="w-full p-2 rounded border text-white mb-1 description" />
				<div v-if="showValidation && !form.description" class="text-red-500 text-xs mb-2">Vui lòng nhập mô tả sự kiện</div>
				<div class="mb-4">
					<p class="mb-4 text-white text-lg font-bold">Thời gian</p>
					<FullCalendar
						ref="calendarRef"
						:options="calendarOptions"
						class="bg-discord rounded shadow custom-discord-calendar"
					/>
					<div v-if="showValidation && (!form.date || !form.startTime || !form.endTime)" class="text-red-500 text-xs mt-2">Vui lòng chọn thời gian diễn ra sự kiện</div>
				</div>
				<TransitionRoot appear :show="showOverlapWarning" as="template">
					<Dialog as="div" class="fixed inset-0 z-50 flex items-center justify-center">
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
								<DialogPanel class="w-full max-w-md transform bg-yellow-600 rounded-lg shadow-2xl p-6 transition-all text-white pointer-events-auto">
									<DialogTitle class="text-lg font-semibold mb-4">Cảnh báo</DialogTitle>
									<div class="whitespace-pre-line mb-6">
										<b>Cảnh báo:</b> Thời gian bạn chọn bị chồng với một sự kiện/lịch trình khác!
										<br />Bạn có chắc muốn tạo sự kiện với khoảng thời gian này không?
										<br />Một thông báo sẽ được gửi cho người có lịch bị chồng chéo để họ được biết.
									</div>
									<div class="flex justify-end gap-4">
										<button @click.stop="handleAcceptOverlap" class="bg-green-600 px-4 py-2 rounded text-white font-bold">Đồng ý</button>
										<button @click.stop="handleRejectOverlap" class="bg-gray-700 px-4 py-2 rounded text-white">Từ chối</button>
									</div>
								</DialogPanel>
							</TransitionChild>
						</div>
					</Dialog>
				</TransitionRoot>
				<button @click="handleNextStep" class="bg-[#5865f2] text-white px-4 py-2 rounded w-full">Tiếp tục</button>
			</div>
			<div v-else-if="step === 2">
				<div class="mb-4 text-white text-lg font-bold">Các hoạt động của sự kiện</div>
				<div v-if="activityStore.loading" class="text-white">Đang tải hoạt động...</div>
				<div v-else-if="activityStore.error" class="text-red-500">Lỗi: {{ activityStore.error }}</div>
				<div v-else>
					<div v-for="activity in activityStore.activities" :key="activity.id" class="flex items-center mb-2 p-2 bg-[#23272a] rounded border border-[#35373c]">
						<input type="checkbox" :id="'activity-' + activity.id" v-model="selectedActivityIds" :value="activity.id" class="mr-2" />
						<label :for="'activity-' + activity.id" class="flex-1 cursor-pointer">
							<div class="font-semibold text-white">{{ activity.title }}</div>
							<div class="text-[#b5bac1] text-sm">{{ activity.description }}</div>
							<div class="text-green-400 text-xs font-bold">Giá: {{ activity.price }}đ</div>
						</label>
					</div>
					<div v-if="showValidation && selectedActivityIds.length === 0" class="text-red-500 text-xs mb-2">Vui lòng chọn ít nhất 1 hoạt động</div>
				</div>
				<div class="flex justify-between mt-4">
					<button @click="prevStep" class="bg-[#35373c] text-white px-4 py-2 rounded">Quay lại</button>
					<button @click="handleNextStep" class="bg-[#5865f2] text-white px-4 py-2 rounded">Tiếp tục</button>
				</div>
			</div>
			<div v-else-if="step === 3">
				<div class="mb-4 text-white text-lg font-bold">Lời nhắn cho mọi người</div>
				<p class="mt-4 font-bold mb-4">Gửi một lời nhắn cho những người có thể tham gia</p>
				<textarea v-model="form.eligible_notification" class="w-full p-2 rounded border text-white mb-1" />
				<div v-if="showValidation && !form.eligible_notification" class="text-red-500 text-xs mb-2">Vui lòng nhập lời nhắn cho những người có thể tham gia</div>
				<p class="mt-4 font-bold mb-4">Gửi một lời nhắn cho những người không thể tham gia</p>
				<textarea v-model="form.ineligible_notification" class="w-full p-2 rounded border text-white mb-1" />
				<div v-if="showValidation && !form.ineligible_notification" class="text-red-500 text-xs mb-2">Vui lòng nhập lời nhắn cho những người không thể tham gia</div>
				<p class="mt-4 text-sm text-[#b5bac1]">Channel ID của Discord riêng của bạn để chúng tôi thông báo cho bạn về các thay đổi của sự kiện</p>
				<input v-model="form.discord_channel_id" class="w-full p-2 rounded border text-black mb-1" />
				<div class="flex justify-between">
					<button @click="prevStep" class="bg-[#35373c] text-white px-4 py-2 rounded">Quay lại</button>
					<button @click="handleNextStep" class="bg-[#5865f2] text-white px-4 py-2 rounded">Tiếp tục</button>
				</div>
			</div>
			<div v-else-if="step === 4">
				<div class="mb-4 text-white text-lg font-bold">Xác nhận & tạo sự kiện</div>
				<div class="mb-2 text-white"><b>Tên:</b> {{ form.title }}</div>
				<div class="mb-2 text-white"><b>Mô tả:</b> {{ form.description }}</div>
				<div class="mb-2 text-white"><b>Ngày:</b> {{ form.date }}</div>
				<div class="mb-2 text-white"><b>Bắt đầu:</b> {{ form.startTime }}</div>
				<div class="mb-2 text-white"><b>Kết thúc:</b> {{ form.endTime }}</div>
				<div class="mb-2 text-white">
					<b>Hoạt động đã chọn:</b>
					<ul class="list-disc list-inside">
						<li v-for="activityId in selectedActivityIds" :key="activityId">
							{{ activityStore.activities.find(a => a.id === activityId)?.title || 'Không xác định' }}
							({{ activityStore.activities.find(a => a.id === activityId)?.price }}đ)
						</li>
					</ul>
				</div>
				<div class="mb-2 text-white"><b>Lời nhắn cho người có thể tham gia:</b> {{ form.eligible_notification }}</div>
				<div class="mb-2 text-white"><b>Lời nhắn cho người không thể tham gia:</b> {{ form.ineligible_notification }}</div>
				<div class="flex justify-between mt-4">
					<button @click="prevStep" class="bg-[#35373c] text-white px-4 py-2 rounded">Quay lại</button>
					<button @click="submitEvent" class="bg-[#3ba55c] text-white px-4 py-2 rounded">
        {{ route.query.mode === 'update' ? 'Cập nhật sự kiện' : 'Tạo sự kiện' }}
    </button>
				</div>
				<TransitionRoot appear :show="success" as="template">
					<Dialog as="div" class="fixed inset-0 z-50 flex items-center justify-center">
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
								<DialogPanel class="w-full max-w-md transform bg-green-700 rounded-lg shadow-2xl p-6 transition-all text-white pointer-events-auto">
									<DialogTitle class="text-lg font-semibold mb-4">Tạo sự kiện thành công!</DialogTitle>
									<div class="mb-6">Sự kiện của bạn đã được tạo thành công.</div>
									<div class="flex justify-end">
										<button @click="goHome" class="bg-white text-green-700 font-bold px-4 py-2 rounded">Về trang chủ</button>
									</div>
								</DialogPanel>
							</TransitionChild>
						</div>
					</Dialog>
				</TransitionRoot>
			</div>
		</div>
	</div>
</template>

<script setup>
import { nextTick } from 'vue';
import { ref, reactive, onMounted, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import FullCalendar from '@fullcalendar/vue3';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useScheduleStore } from '../../stores/schedule';
import { useCalendarStore } from '../../stores/calendar';
import { useActivityStore } from '../../stores/activity';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const calendarRef = ref(null);
const showValidation = ref(false);
const selectedActivityIds = ref([]);
function handleNextStep() {
	showValidation.value = false;
	if (step.value === 1) {
		if (!form.title || !form.description || !form.date || !form.startTime || !form.endTime) {
			showValidation.value = true;
			// Restore calendar selection if time range is present but validation fails
			nextTick(() => {
				selectCalendarRangeFromForm();
			});
			return;
		}
		nextStep();
	} else if (step.value === 2) {
		if (!selectedActivityIds.value.length) {
			showValidation.value = true;
			return;
		}
		nextStep();
	} else if (step.value === 3) {
		if (!form.eligible_notification || !form.ineligible_notification) {
			showValidation.value = true;
			return;
		}
		nextStep();
	}
}



const activityStore = useActivityStore();
const step = ref(1);
const stepLabels = [
	'Thông tin chung của sự kiện',
	'Các hoạt động của sự kiện',
	'Lời nhắn cho mọi người',
	'Xác nhận lại thông tin sự kiện'
];
const form = reactive({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    activities: [],
    eligible_notification: '',
    ineligible_notification: ''
});
const selectedRange = ref(null);
const lastFormState = ref({});
const success = ref(false);

const scheduleStore = useScheduleStore();
const calendarStore = useCalendarStore();

const showOverlapWarning = ref(false);

function isOverlap(start, end, items) {
	const startTime = new Date(start).getTime();
	const endTime = new Date(end).getTime();
	return items.some(item => {
		const itemStart = new Date(item.start).getTime();
		const itemEnd = new Date(item.end).getTime();
		return (
			(startTime < itemEnd && endTime > itemStart)
		);
	});
}

const calendarOptions = reactive({
	plugins: [timeGridPlugin, interactionPlugin],
	initialView: 'timeGridWeek',
	selectable: true,
	selectMirror: true,
	height: 400,
	headerToolbar: {
		left: 'prev,next today',
		center: 'title',
		right: 'timeGridWeek,timeGridDay'
	},
	slotMinTime: '06:00:00',
	slotMaxTime: '23:00:00',
	allDaySlot: false,
	unselectAuto: false, // Ngăn tự động bỏ chọn khi click ra ngoài
	events: async (info, successCallback) => {
		await Promise.all([
			scheduleStore.fetchAllSchedules(),
			calendarStore.fetchAllEvents()
		]);
		const schedules = scheduleStore.mySchedules || [];
		const events = calendarStore.events || [];
		const merged = [
			...schedules.map(s => ({
				title: s.title || 'Lịch bận',
				start: s.start,
				end: s.end,
				backgroundColor: '#f87171',
				borderColor: '#f87171',
				display: 'block',
			})),
			...events.map(e => ({
				title: e.title || 'Sự kiện',
				start: e.start,
				end: e.end,
				backgroundColor: '#60a5fa',
				borderColor: '#60a5fa',
				display: 'block',
			}))
		];
		successCallback(merged);
	},
	select: (info) => {
		// Lưu lại trạng thái form trước khi chọn
		lastFormState.value = { ...form };
		// Cho phép chọn vùng, kiểm tra chồng lấn
		const schedules = scheduleStore.mySchedules || [];
		const events = calendarStore.events || [];
		selectedRange.value = info;
		if (isOverlap(info.startStr, info.endStr, [...schedules, ...events])) {
			showOverlapWarning.value = true;
		} else {
			// Nếu không chồng lấn, chỉ lưu giá trị vào form, KHÔNG chuyển màn
			saveSelectedRange(info);
		}
	},
	unselect: () => {
		// Nếu form còn dữ liệu thời gian, phục hồi lại vùng chọn
		nextTick(() => {
			selectCalendarRangeFromForm();
		});
	}
});

function saveSelectedRange(info) {
	form.date = info.startStr.split('T')[0];
	form.startTime = info.startStr.split('T')[1]?.substring(0,5) || '';
	form.endTime = info.endStr.split('T')[1]?.substring(0,5) || '';
}

function handleAcceptOverlap() {
	if (selectedRange.value) {
		saveSelectedRange(selectedRange.value);
		showOverlapWarning.value = false;
	}
}

function goHome() {
	router.push({ name: 'Home' });
}

function loadActivity(){
	
	// Gọi API lấy hoạt động của sự kiện nếu cần
	activityStore.fetchAllActivities();
}

function handleRejectOverlap() {
	showOverlapWarning.value = false;
	selectedRange.value = null;
	// Xóa vùng chọn trên lịch nếu cần
	const calendarApi = calendarRef.value?.getApi?.() || calendarRef.value?.getApi?.call?.(calendarRef.value);
	if (calendarApi) {
		calendarApi.unselect();
	}
	// Khôi phục lại form nếu có
	Object.assign(form, lastFormState.value);
}

function nextStep() {
	if (step.value < 4) {
		step.value++;
		// Nếu chuyển về step 1, set lại vùng chọn trên lịch nếu đã có
		if (step.value === 1) {
			nextTick(() => {
				selectCalendarRangeFromForm();
			});
		}
		if(step.value === 2){
			loadActivity();
		}
	}
}
function prevStep() {
	if (step.value > 1) {
		step.value--;
		// Khôi phục lại dữ liệu đã chọn/điền nếu quay lại step trước
		if (lastFormState.value) {
			Object.assign(form, lastFormState.value);
		}
		// Nếu quay lại step 1, set lại vùng chọn trên lịch nếu đã có
		if (step.value === 1) {
			nextTick(() => {
				selectCalendarRangeFromForm();
			});
		}
	}
}

function selectCalendarRangeFromForm() {
	if (calendarRef.value && form.date && form.startTime && form.endTime) {
		const calendarApi = calendarRef.value.getApi?.() || calendarRef.value.getApi?.call?.(calendarRef.value);
		if (calendarApi) {
			const start = new Date(`${form.date}T${form.startTime}`);
			const end = new Date(`${form.date}T${form.endTime}`);
			calendarApi.select({ start, end });
		}
	}
}
async function submitEvent() {
    // Nếu là update
    if (route.query.mode === 'update') {
        try {
            const startDateTime = form.date && form.startTime ? `${form.date}T${form.startTime}` : '';
            const endDateTime = form.date && form.endTime ? `${form.date}T${form.endTime}` : '';
            await calendarStore.updateEvent({
                event_id: route.query.event_id,
                title: form.title,
                description: form.description,
                date: form.date,
                start_time: startDateTime,
                end_time: endDateTime,
                activities: selectedActivityIds.value,
                eligible_notification: form.eligible_notification,
                ineligible_notification: form.ineligible_notification
            });
            success.value = true;
        } catch (error) {
            console.error('Lỗi cập nhật sự kiện:', error);
        }
        return;
    }
    // Tạo mới
    try{
        const startDateTime = form.date && form.startTime ? `${form.date}T${form.startTime}` : '';
        const endDateTime = form.date && form.endTime ? `${form.date}T${form.endTime}` : '';
        await calendarStore.createEvent({
            title: form.title,
            description: form.description,
            date: form.date,
            start_time: startDateTime,
            end_time: endDateTime,
            activities: selectedActivityIds.value,
            eligible_notification: form.eligible_notification,
            ineligible_notification: form.ineligible_notification
        });
        success.value = true;
    }catch(error){
        console.error('Lỗi tạo sự kiện:', error);
    }
}

onMounted(() => {
	if (route.query.mode === 'update') {
		form.title = route.query.title || '';
		form.description = route.query.description || '';
		form.date = route.query.date || '';
		form.startTime = route.query.start_time ? route.query.start_time.split('T')[1]?.slice(0,5) : '';
		form.endTime = route.query.end_time ? route.query.end_time.split('T')[1]?.slice(0,5) : '';
		form.eligible_notification = route.query.eligible_notification || '';
		form.ineligible_notification = route.query.ineligible_notification || '';
		try {
			const activities = JSON.parse(route.query.activities || '[]');
			form.activities = activities;
			selectedActivityIds.value = activities.map(a => a.activity_id || a.id);
		} catch {}
		// Nếu có đủ thông tin lịch, set lại vùng chọn trên lịch
		nextTick(() => {
			selectCalendarRangeFromForm();
		});
		// Bắt đầu ở step 1
		step.value = 1;
	}
});
</script>
<style scoped>
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
textarea{
	resize: none;
	height: 150px;
}
</style>