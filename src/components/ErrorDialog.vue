<template>
	<div v-if="show" class="fixed inset-0 flex items-center justify-center z-50">
		<div class="absolute inset-0 bg-black opacity-40"></div>
		<div class="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-sm">
			<button @click="close" class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">&times;</button>
			<div class="mb-4">
				<slot name="icon">
					<span class="text-red-500 text-3xl">&#9888;</span>
				</slot>
			</div>
			<div class="mb-4 text-center text-red-600 font-semibold">
				{{ message }}
			</div>
			<slot />
		</div>
	</div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
	show: {
		type: Boolean,
		required: true
	},
	message: {
		type: String,
		default: ''
	}
})

const emit = defineEmits(['close'])

function close() {
	emit('close')
}
</script>

<style scoped>
.fixed {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
}
</style>
