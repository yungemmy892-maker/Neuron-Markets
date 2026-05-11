import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      // Catch-all redirect
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
