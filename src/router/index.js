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
    },
    {
      path: '/api-auth',
      name: 'ApiAuth',
      component: () => import('../pages/api-auth/index.vue')
    },
    {
      path: '/token',
      name: 'Token',
      component: () => import('../pages/token/index.vue')
    },
    {
      path: '/swagger',
      name: 'Swagger',
      component: () => import('../pages/swagger/index.vue')
    },
    {
      path: '/api-debug',
      name: 'ApiDebug',
      component: () => import('../pages/api-debug/index.vue')
    }
  ]
})

export default router