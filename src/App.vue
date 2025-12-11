<template>
  <div id="app" ref="appContainer">
    <router-view></router-view>
    
    <!-- 回到顶部按钮 -->
    <transition name="fade">
      <div 
        v-show="showBackTop" 
        class="back-to-top" 
        @click="scrollToTop"
        title="回到顶部"
      >
        <t-icon name="chevron-up" size="24px" />
      </div>
    </transition>
  </div>
</template>

<script>
import { Icon as TIcon } from 'tdesign-icons-vue'

export default {
  name: 'App',
  components: {
    TIcon
  },
  data() {
    return {
      showBackTop: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      this.showBackTop = scrollTop > 300
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style>
html, body {
  overflow-x: clip;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.4);
  transition: all 0.3s ease;
  z-index: 999;
}

.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.5);
}

.back-to-top .t-icon {
  color: white;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .back-to-top {
    right: 20px;
    bottom: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
