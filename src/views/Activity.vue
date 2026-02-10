
<template>
    <div class="h-full bg-discord-dark p-4 rounded-lg overflow-hidden flex flex-col relative">
        <button @click="showAdd = true" class="absolute top-4 right-4 bg-[#5865f2] text-white px-4 py-2 rounded shadow hover:bg-[#4752c4] transition-all cursor-pointer mb-4">+ Thêm hoạt động</button>

        <div class="text-xl font-bold text-discord-text-white mb-4">Danh sách hoạt động</div>
        <div v-if="activityStore.loading" class="text-discord-text-gray italic mb-2">Đang tải hoạt động...</div>
        <div v-if="activityStore.activities.length === 0 && !activityStore.loading" class="text-discord-text-gray">Không có hoạt động nào.</div>
        <ul v-else class="space-y-2">
            <li v-for="item in activityStore.activities" :key="item.id" class="bg-[#23272a] rounded p-3 text-sm text-discord-text-gray flex flex-col">
                <span><b>Tên:</b> {{ item.title }}</span>
                <span><b>Mô tả:</b> {{ item.description }}</span>
                <span><b>Chi phí:</b> {{ formatCurrency(item.price) }}</span>
            </li>
        </ul>

        <!-- Dialog thêm activity (đơn giản) -->
        <div v-if="showAdd" class="fixed inset-0 flex items-center justify-center z-50">
            <div class="absolute inset-0 bg-black opacity-40"></div>
            <div class="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-sm">
                <button @click="showAdd = false" class="absolute top-2 right-2 text-black hover:text-red-500 text-3xl font-bold p-2 leading-none cursor-pointer">&times;</button>
                <div class="mb-4 text-lg font-bold text-black">Thêm hoạt động</div>
                <input v-model="form.name" placeholder="Tên hoạt động" class="w-full mb-2 p-2 rounded border text-black" />
                <textarea v-model="form.description" placeholder="Mô tả" class="w-full mb-2 p-2 rounded border text-black"></textarea>
                <input v-model="form.time" placeholder="Chi phí" class="w-full mb-4 p-2 rounded border text-black" />
                <button @click="addActivity" class="bg-[#5865f2] text-white px-4 py-2 rounded hover:bg-[#4752c4] w-full">Thêm</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useActivityStore } from '@/stores/activity';
import { formatCurrency } from '@/utils/common';
const activityStore = useActivityStore();
const showAdd = ref(false);
const form = reactive({ name: '', description: '', time: '' });

onMounted(() => {
    activityStore.fetchAllActivities();
});

const addActivity = async () => {
    if (!form.name) return;
    await activityStore.addActivity({ ...form });
    showAdd.value = false;
    form.name = '';
    form.description = '';
    form.time = '';
    activityStore.fetchAllActivities();
};
</script>
<style scoped>
textarea {
    resize: none;
    height: 300px;
}
</style>