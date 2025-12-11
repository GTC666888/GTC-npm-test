import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 使用Vite的环境变量（如果需要）
const baseURL = import.meta.env.VITE_BASE_URL || '/'

const router = new VueRouter({
  mode: 'history',
  base: baseURL,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器前进/后退），使用保存的位置
    if (savedPosition) {
      return savedPosition
    }
    // 否则滚动到页面顶部
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../pages/home/index.vue')
    },
    {
      path: '/home-b2b',
      name: 'HomeB2B',
      component: () => import('../pages/home-b2b/index.vue')
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
      path: '/swagger',
      name: 'Swagger',
      component: () => import('../pages/swagger/index.vue')
    },
    {
      path: '/api-debug',
      name: 'ApiDebug',
      component: () => import('../pages/api-debug/index.vue')
    },
    {
      path: '/api-docs',
      name: 'ApiDocs',
      component: () => import('../pages/api-docs/index.vue')
    },
    {
      path: '/my-apps',
      name: 'MyApps',
      component: () => import('../pages/my-apps/index.vue')
    },
    {
      path: '/app-detail',
      name: 'AppDetail',
      component: () => import('../pages/app-detail/index.vue')
    }
  ]
})

export default router