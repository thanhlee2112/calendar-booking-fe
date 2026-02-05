<template>
  <div class="min-h-screen flex items-center justify-center bg-discord-dark">
    <div class="w-full max-w-md bg-discord-card rounded-md shadow-lg p-8">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// Không cần logic gì nhiều ở đây, chỉ là layout chứa
</script>

<style scoped>
/* Tailwind utility classes handles most of it, but custom colors are defined in tailwind.config.js */
</style>