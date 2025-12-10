import Vue from 'vue';
import TDesign from 'tdesign-vue';
import 'tdesign-vue/es/style/index.css';
import './assets/index.css'
import './assets/dashboard.css'

import BaseChart from './components/ECharts/BaseChart.vue'
import ERApiPlugin from './plugins/erApiPlugin'
import router from './router' // 导入路由配置

import App from './App.vue';

// 安装TDesign
Vue.use(TDesign)

// 安装ER API插件
Vue.use(ERApiPlugin, {
  baseURL: 'https://api.er.com/v1',
  timeout: 10000,
  retryTimes: 3,
  enableCache: true,
  cacheTimeout: 300000 // 5分钟
})

// 注册全局组件
Vue.component('BaseChart', BaseChart)

// 创建Vue实例
new Vue({
  router, // 注入路由实例
  render: (h) => h(App)
}).$mount('#app');

