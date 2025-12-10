<template>
  <div class="api-debug-page">
    <!-- 动态粒子背景 -->
    <div class="particles-bg">
      <div v-for="n in 25" :key="n" class="particle" :style="getParticleStyle(n)"></div>
    </div>
    
    <!-- 流光线条 -->
    <div class="glow-lines">
      <div class="glow-line line-1"></div>
      <div class="glow-line line-2"></div>
      <div class="glow-line line-3"></div>
    </div>
    
    <!-- 顶部控制栏 -->
    <div class="control-bar">
      <div class="control-bar-inner">
        <div class="logo-section">
          <div class="logo-icon">
            <t-icon name="api" size="28px" />
          </div>
          <div class="logo-text">
            <h1>API 调试中心</h1>
            <p>基于 Swagger UI 的专业调试工具</p>
          </div>
        </div>
        
        <div class="url-input-section">
          <t-input-adornment prepend="OpenAPI">
            <t-input
              v-model="specUrl"
              placeholder="输入 OpenAPI/Swagger 规范 URL (JSON/YAML)"
              clearable
              size="large"
              @enter="loadSpec"
            />
          </t-input-adornment>
          <t-button theme="primary" size="large" @click="loadSpec" :loading="loading">
            <template #icon><t-icon name="refresh" /></template>
            加载
          </t-button>
          <t-dropdown :options="exampleOptions" @click="handleExampleClick">
            <t-button variant="outline" size="large">
              <template #icon><t-icon name="catalog" /></template>
              示例 API
              <t-icon name="chevron-down" size="16px" style="margin-left: 4px;" />
            </t-button>
          </t-dropdown>
        </div>
        
        <div class="action-buttons">
          <t-tooltip content="切换主题">
            <t-button variant="text" @click="toggleTheme">
              <t-icon :name="isDarkTheme ? 'sunny' : 'moon'" size="20px" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="全屏显示">
            <t-button variant="text" @click="toggleFullscreen">
              <t-icon :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" size="20px" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="刷新">
            <t-button variant="text" @click="refreshSwagger">
              <t-icon name="refresh" size="20px" />
            </t-button>
          </t-tooltip>
        </div>
      </div>
    </div>
    
    <!-- 主体内容区 -->
    <div class="main-content" :class="{ 'fullscreen': isFullscreen, 'dark-theme': isDarkTheme }">
      <!-- 欢迎页面 -->
      <div v-if="!specLoaded && !loading" class="welcome-section">
        <div class="welcome-card">
          <div class="welcome-header">
            <div class="welcome-icon-wrapper">
              <div class="welcome-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                  <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 1.144c5.995 0 10.856 4.861 10.856 10.856S17.995 22.856 12 22.856 1.144 17.995 1.144 12 6.005 1.144 12 1.144zM8.17 8.97v6.06h1.39v-2.36h1.55c1.53 0 2.37-.86 2.37-1.85 0-1-.84-1.85-2.37-1.85H8.17zm1.39 1.11h1.24c.79 0 1.18.32 1.18.74 0 .42-.39.74-1.18.74H9.56V10.08zm4.74-1.11v6.06h1.39v-2.36h.55l1.54 2.36h1.66l-1.73-2.55c.9-.29 1.45-.98 1.45-1.66 0-1-.84-1.85-2.37-1.85h-2.49zm1.39 1.11h1.1c.79 0 1.18.32 1.18.74 0 .42-.39.74-1.18.74h-1.1V10.08z"/>
                </svg>
              </div>
              <div class="icon-ring"></div>
              <div class="icon-ring delay-1"></div>
              <div class="icon-ring delay-2"></div>
            </div>
            <h2>欢迎使用 Swagger UI 调试中心</h2>
            <p>业界最流行的 API 文档与调试工具，周下载量 2.5M+</p>
          </div>
          
          <div class="quick-start">
            <h3>
              <t-icon name="rocket" />
              快速开始
            </h3>
            <div class="example-grid">
              <div 
                v-for="example in examples" 
                :key="example.name"
                class="example-card"
                @click="loadExample(example)"
              >
                <div class="example-icon" :style="{ background: example.gradient }">
                  <t-icon :name="example.icon" size="24px" />
                </div>
                <div class="example-info">
                  <h4>{{ example.name }}</h4>
                  <p>{{ example.description }}</p>
                </div>
                <div class="example-arrow">
                  <t-icon name="chevron-right" />
                </div>
              </div>
            </div>
          </div>
          
          <div class="features-section">
            <h3>
              <t-icon name="star" />
              Swagger UI 核心功能
            </h3>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon" style="background: linear-gradient(135deg, #85EA2D 0%, #4CAF50 100%);">
                  <t-icon name="browse" size="24px" />
                </div>
                <h4>交互式文档</h4>
                <p>自动生成美观的API文档</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                  <t-icon name="play-circle" size="24px" />
                </div>
                <h4>在线调试</h4>
                <p>直接发送请求测试接口</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                  <t-icon name="code" size="24px" />
                </div>
                <h4>请求示例</h4>
                <p>自动生成cURL命令</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                  <t-icon name="secured" size="24px" />
                </div>
                <h4>认证支持</h4>
                <p>支持多种认证方式</p>
              </div>
            </div>
          </div>
          
          <div class="tips-section">
            <t-alert theme="success" :close="false">
              <template #message>
                <strong>💡 提示：</strong>输入 OpenAPI 3.0 或 Swagger 2.0 规范 URL，支持 JSON 和 YAML 格式
              </template>
            </t-alert>
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-section">
        <div class="loading-card">
          <div class="swagger-loader">
            <div class="loader-circle"></div>
            <div class="loader-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="#85EA2D">
                <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"/>
              </svg>
            </div>
          </div>
          <h3>正在加载 API 规范...</h3>
          <p class="loading-url">{{ specUrl }}</p>
          <div class="loading-progress">
            <div class="progress-bar"></div>
          </div>
        </div>
      </div>
      
      <!-- Swagger UI 容器 -->
      <div v-show="specLoaded && !loading" class="swagger-container">
        <div id="swagger-ui"></div>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="error" class="error-section">
        <div class="error-card">
          <div class="error-icon-wrapper">
            <t-icon name="close-circle-filled" size="48px" />
          </div>
          <h3>加载失败</h3>
          <p>{{ error }}</p>
          <div class="error-actions">
            <t-button theme="primary" @click="retryLoad">
              <t-icon name="refresh" /> 重试
            </t-button>
            <t-button variant="outline" @click="clearError">
              <t-icon name="close" /> 关闭
            </t-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle.js'
import 'swagger-ui-dist/swagger-ui.css'
import { MessagePlugin } from 'tdesign-vue'

export default {
  name: 'ApiDebugPage',
  data() {
    return {
      specUrl: '',
      specLoaded: false,
      loading: false,
      error: null,
      isDarkTheme: true,
      isFullscreen: false,
      swaggerUI: null,
      examples: [
        {
          name: 'Petstore API v3',
          description: 'OpenAPI 3.0 官方示例',
          url: 'https://petstore3.swagger.io/api/v3/openapi.json',
          icon: 'cat',
          gradient: 'linear-gradient(135deg, #85EA2D 0%, #4CAF50 100%)'
        },
        {
          name: 'Petstore API v2',
          description: 'Swagger 2.0 经典示例',
          url: 'https://petstore.swagger.io/v2/swagger.json',
          icon: 'heart',
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
          name: 'GitHub API',
          description: 'GitHub REST API 规范',
          url: 'https://api.apis.guru/v2/specs/github.com/api.github.com/1.1.4/openapi.yaml',
          icon: 'logo-github',
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
          name: 'Stripe API',
          description: '支付服务 API 规范',
          url: 'https://api.apis.guru/v2/specs/stripe.com/2022-11-15/openapi.yaml',
          icon: 'money',
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }
      ],
      exampleOptions: [
        { content: 'Petstore v3 (OpenAPI 3.0)', value: 'https://petstore3.swagger.io/api/v3/openapi.json' },
        { content: 'Petstore v2 (Swagger 2.0)', value: 'https://petstore.swagger.io/v2/swagger.json' },
        { content: 'GitHub API', value: 'https://api.apis.guru/v2/specs/github.com/api.github.com/1.1.4/openapi.yaml' },
        { content: 'Stripe API', value: 'https://api.apis.guru/v2/specs/stripe.com/2022-11-15/openapi.yaml' },
        { content: 'Twilio API', value: 'https://api.apis.guru/v2/specs/twilio.com/api/1.52.0/openapi.yaml' }
      ]
    }
  },
  methods: {
    // 获取粒子样式
    getParticleStyle(index) {
      const size = Math.random() * 8 + 4
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 15 + 10}s`,
        opacity: Math.random() * 0.5 + 0.1
      }
    },
    
    // 加载 OpenAPI 规范
    async loadSpec() {
      if (!this.specUrl) {
        MessagePlugin.warning('请输入 OpenAPI 规范 URL')
        return
      }
      
      this.loading = true
      this.error = null
      this.specLoaded = false
      
      // 销毁现有实例
      if (this.swaggerUI) {
        const container = document.getElementById('swagger-ui')
        if (container) {
          container.innerHTML = ''
        }
        this.swaggerUI = null
      }
      
      try {
        // 延迟执行以显示加载动画
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 初始化 Swagger UI
        this.swaggerUI = SwaggerUIBundle({
          url: this.specUrl,
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: 'StandaloneLayout',
          // 配置选项
          docExpansion: 'list',
          filter: true,
          showExtensions: true,
          showCommonExtensions: true,
          tryItOutEnabled: true,
          displayRequestDuration: true,
          syntaxHighlight: {
            activate: true,
            theme: 'monokai'
          },
          // 加载完成回调
          onComplete: () => {
            this.loading = false
            this.specLoaded = true
            MessagePlugin.success('API 规范加载成功！')
          },
          // 加载失败回调
          onFailure: (err) => {
            this.loading = false
            this.error = err.message || '加载失败，请检查 URL 是否正确'
            MessagePlugin.error('加载失败：' + this.error)
          }
        })
        
        // 设置超时
        setTimeout(() => {
          if (this.loading) {
            this.loading = false
            this.specLoaded = true
          }
        }, 5000)
        
      } catch (err) {
        this.loading = false
        this.error = err.message || '初始化失败'
        MessagePlugin.error('加载失败：' + this.error)
      }
    },
    
    // 加载示例
    loadExample(example) {
      this.specUrl = example.url
      this.loadSpec()
    },
    
    // 处理下拉选择
    handleExampleClick(data) {
      this.specUrl = data.value
      this.loadSpec()
    },
    
    // 切换主题
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme
      MessagePlugin.info(this.isDarkTheme ? '已切换到深色主题' : '已切换到浅色主题')
    },
    
    // 切换全屏
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen
    },
    
    // 刷新 Swagger
    refreshSwagger() {
      if (this.specUrl) {
        this.loadSpec()
      } else {
        MessagePlugin.info('请先输入 API 规范 URL')
      }
    },
    
    // 重试加载
    retryLoad() {
      this.error = null
      this.loadSpec()
    },
    
    // 清除错误
    clearError() {
      this.error = null
    }
  },
  beforeDestroy() {
    // 清理 Swagger UI 实例
    if (this.swaggerUI) {
      const container = document.getElementById('swagger-ui')
      if (container) {
        container.innerHTML = ''
      }
    }
  }
}
</script>

<style scoped>
.api-debug-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d1b2a 100%);
  position: relative;
  overflow-x: hidden;
}

/* 粒子背景 */
.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(133, 234, 45, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: float-particle 20s infinite ease-in-out;
}

@keyframes float-particle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translate(30px, -50px) scale(1.2);
    opacity: 0.6;
  }
  50% {
    transform: translate(-20px, -30px) scale(0.8);
    opacity: 0.4;
  }
  75% {
    transform: translate(40px, -60px) scale(1.1);
    opacity: 0.5;
  }
}

/* 流光线条 */
.glow-lines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.glow-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, #85EA2D, transparent);
  animation: glow-flow 8s linear infinite;
}

.line-1 {
  top: 20%;
  width: 60%;
  left: -60%;
  animation-delay: 0s;
}

.line-2 {
  top: 50%;
  width: 40%;
  left: -40%;
  animation-delay: 2s;
  background: linear-gradient(90deg, transparent, #4facfe, transparent);
}

.line-3 {
  top: 80%;
  width: 50%;
  left: -50%;
  animation-delay: 4s;
  background: linear-gradient(90deg, transparent, #f093fb, transparent);
}

@keyframes glow-flow {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(100vw + 100%)); }
}

/* 控制栏 */
.control-bar {
  background: rgba(15, 15, 35, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(133, 234, 45, 0.2);
  padding: 12px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.control-bar-inner {
  max-width: 1800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #85EA2D 0%, #4CAF50 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(133, 234, 45, 0.4);
  animation: logo-glow 3s ease-in-out infinite;
}

@keyframes logo-glow {
  0%, 100% { box-shadow: 0 4px 20px rgba(133, 234, 45, 0.4); }
  50% { box-shadow: 0 4px 30px rgba(133, 234, 45, 0.7); }
}

.logo-text h1 {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0;
  background: linear-gradient(90deg, #85EA2D, #4CAF50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-text p {
  font-size: 12px;
  color: rgba(133, 234, 45, 0.7);
  margin: 2px 0 0 0;
}

.url-input-section {
  flex: 1;
  display: flex;
  gap: 12px;
  align-items: center;
}

.url-input-section .t-input-adornment {
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-buttons .t-button {
  color: rgba(133, 234, 45, 0.8);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.action-buttons .t-button:hover {
  background: rgba(133, 234, 45, 0.2);
  color: #85EA2D;
}

/* 主体内容 */
.main-content {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 72px);
}

.main-content.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  background: #0f0f23;
}

.main-content.fullscreen .swagger-container {
  height: 100vh;
}

/* 欢迎页面 */
.welcome-section {
  display: flex;
  justify-content: center;
  padding: 40px 24px 60px;
}

.welcome-card {
  max-width: 1000px;
  width: 100%;
}

.welcome-header {
  text-align: center;
  margin-bottom: 48px;
}

.welcome-icon-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
}

.welcome-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #85EA2D;
  z-index: 2;
  border: 2px solid rgba(133, 234, 45, 0.3);
}

.icon-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 2px solid rgba(133, 234, 45, 0.5);
  border-radius: 20px;
  animation: ring-pulse 2s ease-out infinite;
}

.icon-ring.delay-1 { animation-delay: 0.4s; }
.icon-ring.delay-2 { animation-delay: 0.8s; }

@keyframes ring-pulse {
  0% {
    width: 80px;
    height: 80px;
    opacity: 0.8;
  }
  100% {
    width: 160px;
    height: 160px;
    opacity: 0;
  }
}

.welcome-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
  background: linear-gradient(90deg, #85EA2D, #4CAF50, #85EA2D);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-flow 3s linear infinite;
}

@keyframes gradient-flow {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.welcome-header p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* 快速开始 */
.quick-start {
  margin-bottom: 48px;
}

.quick-start h3,
.features-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0 0 20px 0;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.example-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(133, 234, 45, 0.15);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.example-card:hover {
  background: rgba(40, 40, 80, 0.8);
  border-color: rgba(133, 234, 45, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(133, 234, 45, 0.15);
}

.example-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.example-info {
  flex: 1;
}

.example-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
}

.example-info p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.example-arrow {
  color: rgba(133, 234, 45, 0.4);
  transition: all 0.3s ease;
}

.example-card:hover .example-arrow {
  color: #85EA2D;
  transform: translateX(4px);
}

/* 功能卡片 */
.features-section {
  margin-bottom: 32px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.feature-card {
  padding: 24px 16px;
  background: rgba(30, 30, 60, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(133, 234, 45, 0.1);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(40, 40, 80, 0.6);
  border-color: rgba(133, 234, 45, 0.25);
  transform: translateY(-4px);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 16px;
}

.feature-card h4 {
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
}

.feature-card p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* 提示区 */
.tips-section {
  margin-top: 24px;
}

/* 加载状态 */
.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 24px;
}

.loading-card {
  text-align: center;
  padding: 48px;
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(133, 234, 45, 0.2);
  border-radius: 24px;
  max-width: 400px;
}

.swagger-loader {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
}

.loader-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #85EA2D;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.9); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}

.loading-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
}

.loading-url {
  font-size: 13px;
  color: rgba(133, 234, 45, 0.6);
  word-break: break-all;
  margin: 0 0 24px 0;
}

.loading-progress {
  height: 4px;
  background: rgba(133, 234, 45, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, #85EA2D, #4CAF50, #85EA2D);
  background-size: 200% auto;
  border-radius: 2px;
  animation: progress 1.5s ease-in-out infinite;
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

/* Swagger UI 容器 */
.swagger-container {
  min-height: calc(100vh - 72px);
  background: #fafafa;
}

.dark-theme .swagger-container {
  background: #1a1a2e;
}

/* Swagger UI 样式覆盖 */
.swagger-container :deep(.swagger-ui) {
  font-family: inherit;
}

.dark-theme .swagger-container :deep(.swagger-ui) {
  background: #1a1a2e;
}

.dark-theme .swagger-container :deep(.swagger-ui .topbar) {
  background: #0f0f23;
}

.dark-theme .swagger-container :deep(.swagger-ui .info .title),
.dark-theme .swagger-container :deep(.swagger-ui .info .description),
.dark-theme .swagger-container :deep(.swagger-ui .opblock-tag),
.dark-theme .swagger-container :deep(.swagger-ui .opblock .opblock-summary-description),
.dark-theme .swagger-container :deep(.swagger-ui .parameter__name),
.dark-theme .swagger-container :deep(.swagger-ui .parameter__type),
.dark-theme .swagger-container :deep(.swagger-ui table thead tr th),
.dark-theme .swagger-container :deep(.swagger-ui table tbody tr td),
.dark-theme .swagger-container :deep(.swagger-ui .response-col_description),
.dark-theme .swagger-container :deep(.swagger-ui .model-title),
.dark-theme .swagger-container :deep(.swagger-ui .model) {
  color: #e0e0e0;
}

.dark-theme .swagger-container :deep(.swagger-ui .opblock-tag) {
  border-bottom-color: rgba(133, 234, 45, 0.2);
}

.dark-theme .swagger-container :deep(.swagger-ui section.models) {
  border-color: rgba(133, 234, 45, 0.2);
}

.dark-theme .swagger-container :deep(.swagger-ui section.models h4) {
  color: #e0e0e0;
}

/* 错误提示 */
.error-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 24px;
}

.error-card {
  text-align: center;
  padding: 48px;
  background: rgba(239, 68, 68, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 24px;
  max-width: 400px;
}

.error-icon-wrapper {
  color: #ef4444;
  margin-bottom: 16px;
  animation: error-shake 0.5s ease;
}

@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

.error-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
}

.error-card p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 24px 0;
  word-break: break-all;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 响应式 */
@media (max-width: 1024px) {
  .control-bar-inner {
    flex-wrap: wrap;
  }
  
  .url-input-section {
    order: 3;
    width: 100%;
  }
  
  .example-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .logo-text h1 {
    font-size: 16px;
  }
  
  .welcome-header h2 {
    font-size: 24px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .url-input-section {
    flex-wrap: wrap;
  }
}
</style>
