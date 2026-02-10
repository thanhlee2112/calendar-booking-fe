import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth';

// Định nghĩa sidebar routes
export const sidebarRoutes = [
  {
    path: '',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: 'Lịch chung', icon: 'CalendarDays', showInSidebar: true },
    fullPath: '/'
  },
  {
    path: 'schedule',
    name: 'Schedule',
    component: () => import('../views/personal/Calendar.vue'),
    meta: { title: 'Lịch cá nhân', icon: 'Clock', showInSidebar: true },
    fullPath: '/schedule'
  },
  {
    path: 'activity',
    name: 'Activity',
    component: () => import('../views/Activity.vue'),
    meta: { title: 'Hoạt động', icon: 'PartyPopper', showInSidebar: true },
    fullPath: '/activity'
  },
  {
    path: 'create-event',
    name: 'CreateEvent',
    component: () => import('../views/CreateEvent.vue'),
    meta: { title: 'Tạo sự kiện', icon: 'Plus', showInSidebar: true },
    fullPath: '/create-event'
  }
];

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '', // Khớp với URL: /
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: 'Lịch chung', icon: 'CalendarDays', showInSidebar: true }
      },
      {
        path: 'schedule', // Khớp với URL: /schedule
        name: 'Schedule',
        component: () => import('../views/personal/Calendar.vue'),
        meta: { title: 'Lịch cá nhân', icon: 'Clock', showInSidebar: true }
      },
      {
        path: 'activity',
        name: 'Activity',
        component: () => import('../views/Activity.vue'),
        meta: { title: 'Hoạt động', icon: 'PartyPopper', showInSidebar: true }
      },
      {
        path: 'create-event',
        name: 'CreateEvent',
        component: () => import('../views/CreateEvent.vue'),
        meta: { title: 'Tạo sự kiện', icon: 'Plus', showInSidebar: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login', 
    component: () => import('../views/auth/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/auth/callback',
    name: 'DiscordCallback',
    component: () => import('../views/auth/DiscordCallback.vue')
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
// Logic kiểm tra quyền truy cập
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.accessToken
  // 1. Nếu trang yêu cầu login mà chưa login -> Về trang Login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } 
  // 2. Nếu đã login mà cố vào trang Login -> Đẩy về Home
  else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'Home' })
  } 
  // 3. Các trường hợp khác cho đi tiếp
  else {
    next()
  }
})
export default router