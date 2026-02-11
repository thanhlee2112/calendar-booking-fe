
<template>
    <div class="h-full bg-discord-dark p-4 rounded-lg overflow-hidden flex flex-col relative">
        <button @click="showAdd = true" class="absolute top-4 right-4 bg-[#5865f2] text-white px-4 py-2 rounded shadow hover:bg-[#4752c4] transition-all cursor-pointer mb-4">+ Thêm hoạt động</button>

        <div class="text-xl font-bold text-discord-text-white mb-4">Danh sách hoạt động</div>
        <div v-if="activityStore.loading" class="text-discord-text-gray italic mb-2">Đang tải hoạt động...</div>
        <div v-if="activityStore.activities.length === 0 && !activityStore.loading" class="text-discord-text-gray">Không có hoạt động nào.</div>
        <ul v-else class="space-y-2 mt-6">
            <li v-for="item in activityStore.activities" :key="item.id" class="bg-[#23272a] rounded p-3 text-sm text-discord-text-gray flex flex-col relative">
                <span><b>Tên:</b> {{ item.title }}</span>
                <span><b>Mô tả:</b> {{ item.description }}</span>
                <span><b>Chi phí:</b> {{ formatCurrency(item.price) }}</span>
                <span><b>Link tham khảo:</b> <a :href="item.link" target="_blank" class="text-blue-400 underline">{{ item.link }}</a></span>
                <div class="flex gap-2 mt-2">
                    <button @click="editId = item.id" class="bg-yellow-500 text-white px-3 py-1 rounded font-bold">Update</button>
                    <button @click="deleteId = item.id" class="bg-red-600 text-white px-3 py-1 rounded font-bold">Delete</button>
                </div>
                <!-- Update input -->
                <div v-if="editId === item.id" class="mt-2 flex flex-col gap-2">
                    <input v-model="editForm.title" placeholder="Tên hoạt động" class="w-full p-2 rounded border text-white" />
                    <textarea v-model="editForm.description" placeholder="Mô tả" class="w-full p-2 rounded border text-white"></textarea>
                    <input v-model="editForm.price" placeholder="Chi phí" class="w-full p-2 rounded border text-white" />
                    <div class="flex gap-2">
                        <button @click="updateActivity(item.id)" class="bg-green-600 text-white px-3 py-1 rounded font-bold">Lưu</button>
                        <button @click="editId = null" class="bg-gray-400 text-white px-3 py-1 rounded font-bold">Hủy</button>
                    </div>
                </div>
                <!-- Delete confirm dialog -->
                <div v-if="deleteId === item.id" class="fixed inset-0 flex items-center justify-center z-50">
                    <div class="absolute inset-0 bg-black opacity-40"></div>
                    <div class="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-sm">
                        <div class="mb-4 text-lg font-bold text-black">Xác nhận xóa hoạt động?</div>
                        <div class="mb-4 text-black">Bạn có chắc chắn muốn xóa hoạt động <b>{{ item.title }}</b>?</div>
                        <div class="flex gap-2 justify-end">
                            <button @click="confirmDelete(item.id)" class="bg-red-600 text-white px-4 py-2 rounded font-bold">Xóa</button>
                            <button @click="deleteId = null" class="bg-gray-400 text-white px-4 py-2 rounded font-bold">Hủy</button>
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <!-- Dialog thêm activity (đơn giản) -->
        <div v-if="showAdd" class="fixed inset-0 flex items-center justify-center z-50">
            <div class="absolute inset-0 bg-black opacity-40"></div>
            <div class="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-sm">
                <button @click="showAdd = false" class="absolute top-2 right-2 text-black hover:text-red-500 text-3xl font-bold p-2 leading-none cursor-pointer">&times;</button>
                <div class="mb-4 text-lg font-bold text-black">Thêm hoạt động</div>
                <input v-model="form.title" placeholder="Tên hoạt động" class="w-full mb-2 p-2 rounded border text-black" />
                <textarea v-model="form.description" placeholder="Mô tả" class="w-full mb-2 p-2 rounded border text-black"></textarea>
                <input v-model="form.price" placeholder="Chi phí" class="w-full mb-4 p-2 rounded border text-black" />
                <input v-model="form.link" placeholder="Link tham khảo" class="w-full mb-4 p-2 rounded border text-black" />
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
const form = reactive({ title: '', description: '', price: '' });
const editId = ref(null);
const deleteId = ref(null);
const editForm = reactive({ title: '', description: '', price: '' });
const updateActivity = async (id) => {
    const old = activityStore.activities.find(a => a.id === id);
    const payload = {
        title: editForm.title || old.title,
        description: editForm.description || old.description,
        price: editForm.price || old.price
    };
    await activityStore.updateActivity(id, payload);
    editId.value = null;
    editForm.title = '';
    editForm.description = '';
    editForm.price = '';
    activityStore.fetchAllActivities();
};

const confirmDelete = async (id) => {
    await activityStore.deleteActivity(id);
    deleteId.value = null;
    activityStore.fetchAllActivities();
};

onMounted(() => {
    activityStore.fetchAllActivities();
});

const addActivity = async () => {
    if (!form.title) return;
    await activityStore.addActivity({ ...form });
    showAdd.value = false;
    form.title = '';
    form.description = '';
    form.price = '';
    activityStore.fetchAllActivities();
};
</script>
<style scoped>
textarea {
    resize: none;
    height: 300px;
}
</style>