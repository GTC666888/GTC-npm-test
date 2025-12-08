import Vue from 'vue';
import TDesign from 'tdesign-vue';
import 'tdesign-vue/es/style/index.css';
import './assets/index.css'
import './assets/dashboard.css'

import BaseChart from './components/ECharts/BaseChart.vue'

import App from './App.vue';

Vue.use(TDesign);
Vue.component('BaseChart', BaseChart)
new Vue({
  render: (h) => h(App)
}).$mount('#app');
