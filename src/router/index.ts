import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/web/home/index.vue')
    },
    {
      path: '/config',
      name: 'Config',
      component: () => import('@/views/web/config/index.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: ()=>import('@/views/web/login/login.vue')
    }
  ]
})

export default router
