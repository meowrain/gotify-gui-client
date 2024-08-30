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
      path: '/about',
      name: 'About',
      component: ()=>import('@/views/web/about/index.vue')
    }
  ]
})
export default router
