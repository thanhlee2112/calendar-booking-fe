
<template>
  <div class="min-h-screen w-full bg-discord-dark flex flex-col items-center justify-center p-6 overflow-auto">
    <div class="max-w-xl w-full bg-[#23272a] rounded-lg shadow p-6">
      <div class="mb-6">
        <div class="text-2xl font-bold text-white mb-2">{{ event.title }}</div>
        <div class="text-[#b5bac1] mb-2">{{ event.description }}</div>
        <div class="text-sm text-[#b5bac1] mb-2">
          <b>Ngày:</b> {{ event.date }}<br>
          <b>Bắt đầu:</b> {{ formatTime(event.start_time) }}<br>
          <b>Kết thúc:</b> {{ formatTime(event.end_time) }}
        </div>
      </div>
      <div class="mb-6">
        <div class="text-lg font-bold text-white mb-2">Hoạt động
            <p class="text-xs text-[#b5bac1]">(Lưu ý: Vote chỉ được ghi nhận khi tham gia sự kiện)</p>
        </div>
        <div v-if="event.activities && event.activities.length">
          <div v-for="activity in event.activities" :key="activity.id" class="mb-4 p-3 rounded bg-[#35373c]">
            <div class="font-semibold text-white">{{ activity.activity_title }}</div>
            <div class="text-[#b5bac1] text-sm mb-2">{{ activity.activity_description }}</div>
            <div class="text-green-400 text-xs font-bold mb-2">Giá: {{ formatCurrency(activity.activity_price) }}</div>
            <div class="text-xs text-[#b5bac1] mb-2">Link tham khảo: <a :href="activity.activity_link" target="_blank" class="text-blue-400 underline">{{ activity.activity_link }}</a></div>
            <button v-if="event.is_eligible &&!votedActivities.includes(activity.id) && !(activity.voter && activity.voter.some(voter => voter.user_id == authStore.user))" @click="voteActivity(activity.id,activity.activity_title)" class="bg-[#5865f2] text-white px-3 py-1 rounded font-bold">Vote cho hoạt động này</button>
            <button v-else-if = "event.is_eligible" @click="unvoteActivity(activity.id,activity.activity_title)" class="bg-[red] text-white px-3 py-1 rounded font-bold">Hủy vote cho hoạt động này</button>
            <div class="text-xs text-[#b5bac1] mt-2">
              <span class="font-semibold">Người đã vote: </span>
              <span v-if="activity.voter && activity.voter.length">
                <span v-for="(voter, idx) in activity.voter" :key="voter.id">
                  {{ voter.username }}<span v-if="idx < activity.voter.length - 1">, </span>
                </span>
              </span>
              <span v-else>Chưa có ai vote</span>
            </div>
        </div>
        </div>
        <div v-else class="text-[#b5bac1]">Không có hoạt động nào.</div>
      </div>
      <div class="mb-6">
        <div class="text-lg font-bold text-white mb-2">Những người tham gia</div>
        <div v-if="event.participants && event.participants.length">
          <ul class="list-disc list-inside text-[#b5bac1]">
            <li v-for="participant in event.participants" :key="participant.id">{{ participant.username }}</li>
          </ul>
        </div>
        <div v-else class="text-[#b5bac1]">Không có người tham gia nào.</div>
      </div>
       <div v-if="showUpdateEvent" class="mt-6 bg-[#35373c] p-4 rounded-lg">
        <div class="text-lg font-bold text-white mb-2">Cập nhật sự kiện</div>
        <form @submit.prevent="submitUpdateEvent">
          <div class="mb-2">
            <label class="text-[#b5bac1]">Tiêu đề:</label>
            <input v-model="updateForm.title" class="w-full p-2 rounded bg-[#23272a] text-white" />
          </div>
          <div class="mb-2">
            <label class="text-[#b5bac1]">Mô tả:</label>
            <textarea v-model="updateForm.description" class="w-full p-2 rounded bg-[#23272a] text-white"></textarea>
          </div>
          <div class="mb-2">
            <label class="text-[#b5bac1]">Ngày:</label>
            <input type="date" v-model="updateForm.date" class="w-full p-2 rounded bg-[#23272a] text-white" />
          </div>
          <div class="mb-2">
            <label class="text-[#b5bac1]">Bắt đầu:</label>
            <input type="time" v-model="updateForm.start_time" class="w-full p-2 rounded bg-[#23272a] text-white" />
          </div>
          <div class="mb-2">
            <label class="text-[#b5bac1]">Kết thúc:</label>
            <input type="time" v-model="updateForm.end_time" class="w-full p-2 rounded bg-[#23272a] text-white" />
          </div>
          <div class="mb-2">
            <label class="text-[#b5bac1]">Hoạt động:</label>
            <div v-if="activityStore.activities.length">
              <div v-for="activity in activityStore.activities" :key="activity.id" class="flex items-center mb-1">
                <input type="checkbox" :value="activity.id" v-model="updateForm.selectedActivities" class="mr-2" />
                <span class="text-white">{{ activity.title }}</span>
              </div>
            </div>
            <div v-else class="text-[#b5bac1]">Không có hoạt động nào.</div>
          </div>
          <div class="flex gap-2 mt-4">
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded font-bold">Lưu cập nhật</button>
            <button type="button" @click="showUpdateEvent = false" class="bg-gray-600 text-white px-4 py-2 rounded font-bold">Đóng</button>
          </div>
        </form>
      </div>
      <div class="flex justify-center mt-6 gap-2">
        <button v-if="event.is_eligible && !event.participants.some(participant => participant.user_id == authStore.user)" @click="attendEvent" class="bg-green-600 text-white px-4 py-2 rounded font-bold">Tham gia sự kiện</button>
        <button v-else-if="event.is_eligible" @click="declineEvent" class="bg-red-600 text-white px-4 py-2 rounded font-bold">Từ chối sự kiện</button>
        <button v-if="event.created_by && event.created_by == authStore.user" @click="openUpdateForm" class="bg-yellow-500 text-white px-4 py-2 rounded font-bold">Update sự kiện</button>
      </div>
     
        <ErrorDialog :show="showErrorDialog" :message="errorMessage" @close="showErrorDialog = false" />

      <SuccessDialog :show="showAttendDialog" @close="showAttendDialog = false" :message="successMessage" :title="successTitle" />
    </div>
  </div>
</template>

<script setup>
const showUpdateEvent = ref(false);
import { useActivityStore } from '@/stores/activity';
const activityStore = useActivityStore();
const updateForm = ref({
  title: '',
  description: '',
  date: '',
  start_time: '',
  end_time: '',
  selectedActivities: []
});
function openUpdateForm() {
  // Gọi fetchAllActivities nếu chưa có
  if (!activityStore.activities.length) {
    activityStore.fetchAllActivities();
  }
  // Gán giá trị hiện tại của event vào form
  updateForm.value = {
    title: event.value.title || '',
    description: event.value.description || '',
    date: event.value.date || '',
    start_time: event.value.start_time ? formatTime(event.value.start_time) : '',
    end_time: event.value.end_time ? formatTime(event.value.end_time) : '',
    selectedActivities: event.value.activities ? event.value.activities.map(a => a.id) : []
  };
  showUpdateEvent.value = true;
}

async function submitUpdateEvent() {
  // Validate
  if (!updateForm.value.title || !updateForm.value.date || !updateForm.value.start_time || !updateForm.value.end_time) {
    errorMessage.value = 'Vui lòng nhập đầy đủ thông tin.';
    showErrorDialog.value = true;
    return;
  }
  try {
    // Gọi API update event (giả sử calendarStore có updateEvent)
    await calendarStore.updateEvent(route.params.id, {
      title: updateForm.value.title,
      description: updateForm.value.description,
      date: updateForm.value.date,
      start_time: updateForm.value.date + 'T' + updateForm.value.start_time,
      end_time: updateForm.value.date + 'T' + updateForm.value.end_time,
      activities: updateForm.value.selectedActivities
    });
    showUpdateEvent.value = false;
    fetchEventDetail();
    successMessage.value = 'Cập nhật sự kiện thành công!';
    successTitle.value = 'Thành công!';
    showAttendDialog.value = true;
  } catch (err) {
    errorMessage.value = 'Có lỗi khi cập nhật sự kiện!';
    showErrorDialog.value = true;
  }
}
const successMessage = ref('Cảm ơn bạn đã chọn tham gia sự kiện.\nThông báo sẽ được gửi đến bạn để giúp bạn theo dõi sự kiện.');
const successTitle = ref('Tham gia sự kiện thành công!');
// Hàm lấy giờ phút từ chuỗi ISO hoặc HH:mm
function formatTime(val) {
  if (!val) return '';
  // Nếu là ISO string
  if (val.includes('T')) {
    return val.split('T')[1]?.slice(0,5) || val;
  }
  // Nếu là HH:mm:ss hoặc HH:mm
  return val.slice(0,5);
}
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCalendarStore } from '@/stores/calendar';
import { useAttendanceStore } from '@/stores/attendance';
import { useAuthStore } from '@/stores/auth';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import { formatCurrency } from '@/utils/common';
const route = useRoute();
const calendarStore = useCalendarStore();
const attendanceStore = useAttendanceStore();
const authStore = useAuthStore();
const event = ref({});
const user = authStore.user;
async function fetchEventDetail() {
  const id = route.params.id;
  if (!id) return;
  try {
    const data = await calendarStore.detailEvent(id);
    // Map API data to expected format if needed
    event.value = {
      title: data.title,
      description: data.description,
      date: data.date || data.start_time?.split('T')[0],
      start_time: data.start_time,
      end_time: data.end_time,
      activities: data.event_activities || [],
      participants: data.event_participants || [],
      is_eligible: data.is_eligible || false,
      created_by: data.created_by || null
    };
    
  } catch (err) {
    event.value = { title: 'Không tìm thấy sự kiện', description: err.message };
  }
}


const showAttendDialog = ref(false);
const showErrorDialog = ref(false);
const errorMessage = ref('');
const votedActivities = ref([]);

function checkEligibilityForVoting() {
    return event.value.participants && event.value.participants.some(p => p.user_id == authStore.user);
}
async function attendEvent() {
  if (!event.value || !route.params.id) return;  
  if(checkEligibilityForVoting()) {
     showErrorDialog.value = true;
        errorMessage.value = 'Bạn đã tham gia sự kiện này rồi, không thể tham gia lại!';
     return; 
  }
  if(!checkEligibilityForVoting() && votedActivities.value.length > 0) {
    try{
        await attendanceStore.attendAndVote(route.params.id, votedActivities.value);
        showAttendDialog.value = true;
        successMessage.value = 'Cảm ơn bản chọn tham gia sự kiện.\n Thông báo sẽ được gửi tới bạn định kỳ để giúp bạn theo dõi sự kiện.';
        successTitle.value = 'Tham gia sự kiện thành công!';
        fetchEventDetail();
        return;
    } catch (err) {
      errorMessage.value = 'Có lỗi khi tham gia sự kiện!';
      showErrorDialog.value = true;
      return;
    }
  }
  try {
    await attendanceStore.attendEvent(route.params.id);
    showAttendDialog.value = true;
    successMessage.value = 'Cảm ơn bản chọn tham gia sự kiện.\n Thông báo sẽ được gửi tới bạn định kỳ để giúp bạn theo dõi sự kiện.';
    successTitle.value = 'Tham gia sự kiện thành công!';
    fetchEventDetail();
  } catch (err) {
    errorMessage.value = 'Có lỗi khi tham gia sự kiện!';
    showErrorDialog.value = true;
  }
}
async function declineEvent() {
    if (!event.value || !route.params.id) return;
    if(!checkEligibilityForVoting()) {
      showErrorDialog.value = true;
      errorMessage.value = 'Bạn chưa tham gia sự kiện này!';
      return;
    }
    try{
       await attendanceStore.declineEvent(route.params.id);
       showAttendDialog.value = true;
       successMessage.value = 'Rất tiếc khi bạn từ chối tham gia sự kiện.\n Hy vọng bạn sẽ tham gia các sự kiện khác trong tương lai!';
       successTitle.value = 'Từ chối sự kiện thành công!';
       fetchEventDetail();
    }catch (err) {
      errorMessage.value = 'Có lỗi khi từ chối sự kiện!';
       showErrorDialog.value = true;
    }

}
async function voteActivity(activityId, activityName) {
  if (!event.value || !route.params.id) return;

  if(!checkEligibilityForVoting()) {
    if(votedActivities.value.includes(activityId)) {
      errorMessage.value = 'Bạn đã vote cho hoạt động này rồi!';
      showErrorDialog.value = true;
      return;
    }
    votedActivities.value.push(activityId);
    return;
  }
  try {
    await attendanceStore.voteActivity(activityId);
    successMessage.value = 'Bạn đã vote cho hoạt động: ' + activityName;
    successTitle.value = 'Vote thành công!';
    showAttendDialog.value = true;
    fetchEventDetail();
} catch (err) {    
    errorMessage.value = 'Có lỗi khi vote hoạt động!';
    showErrorDialog.value = true;
  }
}
async function unvoteActivity(activityId,activityName) {
  if (!event.value || !route.params.id) return;

  if(!checkEligibilityForVoting()) {
    const index = votedActivities.value.indexOf(activityId);
    if(index === -1) {
      errorMessage.value = 'Bạn chưa vote cho hoạt động này!';
      showErrorDialog.value = true;
      return;
    }
    votedActivities.value.splice(index, 1);
    return;
  }
  try {
    await attendanceStore.unvoteActivity(activityId, event.value.id);
    showAttendDialog.value = true;
    successMessage.value = 'Bạn hủy vote cho hoạt động: ' + activityName;
    successTitle.value = 'Hủy vote thành công!';
    fetchEventDetail();
} catch (err) {    
    errorMessage.value = 'Có lỗi khi hủy vote hoạt động!';
    showErrorDialog.value = true;
  }
}

onMounted(fetchEventDetail);
</script>

<style scoped>
.bg-discord-dark {
  background-color: #23272a;
}
</style>
