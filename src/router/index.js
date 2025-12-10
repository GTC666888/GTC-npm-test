import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 使用Vite的环境变量（如果需要）
const baseURL = import.meta.env.VITE_BASE_URL || '/'

const router = new VueRouter({
  mode: 'history',
  base: baseURL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../pages/home/index.vue')
    },
    {
      path: '/system-detail',
      name: 'SystemDetail',
      component: () => import('../pages/system-detail/index.vue')
    },
    {
      path: '/api-detail',
      name: 'ApiDetail',
      component: () => import('../pages/api-detail/index.vue')
    },
    {
      path: '/app-apply',
      name: 'AppApply',
      component: () => import('../pages/app-apply/index.vue')
    }
  ]
})

export default router