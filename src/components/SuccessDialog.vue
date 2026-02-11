<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-40"></div>
    <div class="bg-[#2b2d31] border border-black/20 rounded-lg shadow-2xl p-6 relative w-full max-w-sm">
      <button @click="close" class="absolute top-2 right-2 text-gray-400 hover:text-green-400 text-xl">&times;</button>
      <div class="mb-4 flex justify-center">
        <slot name="icon">
          <span class="text-green-400 text-3xl">✔️</span>
        </slot>
      </div>
      <div class="mb-4 text-center text-white font-semibold">
        <slot name="title">
          {{ title || 'Tham gia sự kiện thành công!' }}
        </slot>
      </div>
      <div class="mb-4 text-[#b5bac1] text-center">
        <slot name="message">
          {{ message || 'Cảm ơn bạn đã chọn tham gia sự kiện.\nThông báo sẽ được gửi đến bạn để giúp bạn theo dõi sự kiện.' }}
        </slot>
      </div>
      <div class="flex justify-end">
        <button @click="close" class="bg-[#5865f2] text-white px-4 py-2 rounded font-bold">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['close']);
function close() {
  emit('close');
}
</script>

<style scoped>
</style>
