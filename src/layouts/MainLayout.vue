<script setup>
import { CalendarDays, Clock, PartyPopper, Plus } from 'lucide-vue-next';
import { sidebarRoutes } from '../router/index';
// Map icon thủ công để dùng với <component :is />
const iconMap = {
  CalendarDays,
  Clock,
  PartyPopper,
  Plus
};

const handleLogout = () => { /* ... */ };
</script>

<template>
  <div class="flex h-screen bg-[#1e1f22] text-[#dbdee1]">
    <aside class="w-60 bg-[#2b2d31] flex flex-col">
      <header class="h-12 px-4 flex items-center border-b border-black/20 font-bold text-white">
        Discord Calendar
      </header>

      <nav class="flex-1 p-2 mt-2 space-y-0.5">
        <router-link 
          v-for="route in sidebarRoutes" 
          :key="route.fullPath"
          :to="route.fullPath"
          class="flex items-center gap-3 px-3 py-2 rounded transition-colors group"
          exact-active-class="bg-[#3f4147] text-white"
          :class="[$route.path === route.fullPath ? '' : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]']"
        >
          <component :is="iconMap[route.meta.icon]" :size="20" />
          <span class="font-medium">{{ route.meta.title }}</span>
        </router-link>
      </nav>
      
      </aside>

    <main class="flex-1 bg-[#313338] relative overflow-auto">
       <router-view />
    </main>
  </div>
</template>