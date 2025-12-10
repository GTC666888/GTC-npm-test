<template>
  <div class="swagger-page">
    <!-- 动态粒子背景 -->
    <div class="particles-bg">
      <div v-for="n in 15" :key="n" class="particle" :style="getParticleStyle(n)"></div>
    </div>
    
    <!-- 顶部控制栏 -->
    <div class="control-bar">
      <div class="control-bar-inner">
        <div class="logo-section">
          <div class="logo-icon">
            <t-icon name="api" size="28px" />
          </div>
          <div class="logo-text">
            <h1>Swagger API 调试器</h1>
            <p>基于 OpenAPI 规范的专业API调试工具</p>
          </div>
        </div>
        
        <div class="url-input-section">
          <t-input-adornment prepend="OpenAPI URL">
            <t-input
              v-model="specUrl"
              placeholder="输入 OpenAPI 规范 URL，如: https://petstore.swagger.io/v2/swagger.json"
              clearable
              size="large"
              @enter="loadSpec"
            />
          </t-input-adornment>
          <t-button theme="primary" size="large" @click="loadSpec" :loading="loading">
            <template #icon><t-icon name="refresh" /></template>
            加载规范
          </t-button>
          <t-button theme="default" size="large" @click="showExamples = true">
            <template #icon><t-icon name="catalog" /></template>
            示例API
          </t-button>
        </div>
        
        <div class="action-buttons">
          <t-button variant="text" @click="toggleDarkMode">
            <t-icon :name="darkMode ? 'sunny' : 'moon'" />
          </t-button>
          <t-button variant="text" @click="showSettings = true">
            <t-icon name="setting" />
          </t-button>
        </div>
      </div>
    </div>
    
    <!-- 主体内容区 -->
    <div class="main-content" :class="{ 'dark-mode': darkMode }">
      <!-- 欢迎页面 -->
      <div v-if="!specLoaded && !loading" class="welcome-section">
        <div class="welcome-card">
          <div class="welcome-icon">
            <t-icon name="logo-github" size="80px" />
          </div>
          <h2>欢迎使用 Swagger API 调试器</h2>
          <p>请输入 OpenAPI 规范 URL 或选择示例API开始调试</p>
          
          <div class="quick-start">
            <h3>🚀 快速开始</h3>
            <div class="example-cards">
              <div 
                v-for="example in exampleApis" 
                :key="example.name"
                class="example-card"
                @click="loadExample(example)"
              >
                <div class="example-icon" :style="{ background: example.color }">
                  <t-icon :name="example.icon" size="24px" />
                </div>
                <div class="example-info">
                  <h4>{{ example.name }}</h4>
                  <p>{{ example.description }}</p>
                </div>
                <t-icon name="chevron-right" class="arrow-icon" />
              </div>
            </div>
          </div>
          
          <div class="features">
            <h3>✨ 核心功能</h3>
            <div class="feature-grid">
              <div class="feature-item">
                <t-icon name="browse" size="32px" />
                <span>API 文档浏览</span>
              </div>
              <div class="feature-item">
                <t-icon name="play-circle" size="32px" />
                <span>在线调试测试</span>
              </div>
              <div class="feature-item">
                <t-icon name="code" size="32px" />
                <span>请求代码生成</span>
              </div>
              <div class="feature-item">
                <t-icon name="download" size="32px" />
                <span>规范文件下载</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-section">
        <div class="loading-card">
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <h3>正在加载 API 规范...</h3>
          <p>{{ specUrl }}</p>
        </div>
      </div>
      
      <!-- Swagger UI 容器 -->
      <div v-show="specLoaded && !loading" class="swagger-container">
        <div id="swagger-ui"></div>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="error" class="error-section">
        <div class="error-card">
          <t-icon name="close-circle-filled" size="48px" class="error-icon" />
          <h3>加载失败</h3>
          <p>{{ error }}</p>
          <t-button theme="primary" @click="error = null">
            <t-icon name="refresh" /> 重试
          </t-button>
        </div>
      </div>
    </div>
    
    <!-- 示例API弹窗 -->
    <t-dialog
      v-model:visible="showExamples"
      header="选择示例 API"
      :footer="false"
      width="600px"
    >
      <div class="examples-dialog">
        <div 
          v-for="example in allExampleApis" 
          :key="example.name"
          class="example-item"
          @click="loadExample(example); showExamples = false"
        >
          <div class="example-item-icon" :style="{ background: example.color }">
            <t-icon :name="example.icon" size="24px" />
          </div>
          <div class="example-item-info">
            <h4>{{ example.name }}</h4>
            <p>{{ example.description }}</p>
            <code>{{ example.url }}</code>
          </div>
        </div>
      </div>
    </t-dialog>
    
    <!-- 设置弹窗 -->
    <t-dialog
      v-model:visible="showSettings"
      header="Swagger UI 设置"
      width="500px"
      :confirm-btn="{ content: '保存设置', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="saveSettings"
    >
      <div class="settings-dialog">
        <t-form :data="settings" label-width="120px">
          <t-form-item label="显示请求时长">
            <t-switch v-model="settings.displayRequestDuration" />
          </t-form-item>
          <t-form-item label="深度链接">
            <t-switch v-model="settings.deepLinking" />
          </t-form-item>
          <t-form-item label="显示扩展">
            <t-switch v-model="settings.showExtensions" />
          </t-form-item>
          <t-form-item label="显示通用扩展">
            <t-switch v-model="settings.showCommonExtensions" />
          </t-form-item>
          <t-form-item label="默认展开">
            <t-select v-model="settings.docExpansion">
              <t-option value="list" label="列表模式" />
              <t-option value="full" label="完全展开" />
              <t-option value="none" label="全部折叠" />
            </t-select>
          </t-form-item>
          <t-form-item label="默认模型展开深度">
            <t-input-number v-model="settings.defaultModelsExpandDepth" :min="-1" :max="10" />
          </t-form-item>
        </t-form>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import { MessagePlugin } from 'tdesign-vue'
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle.js'
import 'swagger-ui-dist/swagger-ui.css'

export default {
  name: 'SwaggerPage',
  data() {
    return {
      specUrl: '',
      specLoaded: false,
      loading: false,
      error: null,
      darkMode: false,
      showExamples: false,
      showSettings: false,
      swaggerUI: null,
      settings: {
        displayRequestDuration: true,
        deepLinking: true,
        showExtensions: false,
        showCommonExtensions: true,
        docExpansion: 'list',
        defaultModelsExpandDepth: 1
      },
      exampleApis: [
        {
          name: 'Petstore API',
          description: 'Swagger 官方示例 - 宠物商店API',
          url: 'https://petstore.swagger.io/v2/swagger.json',
          icon: 'cat',
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
          name: 'Petstore v3',
          description: 'OpenAPI 3.0 版本示例',
          url: 'https://petstore3.swagger.io/api/v3/openapi.json',
          icon: 'dog',
          color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
          name: 'HTTPBin',
          description: 'HTTP 请求测试服务',
          url: 'https://httpbin.org/spec.json',
          icon: 'internet',
          color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }
      ],
      allExampleApis: [
        {
          name: 'Petstore API v2',
          description: 'Swagger 官方示例 - 宠物商店API (Swagger 2.0)',
          url: 'https://petstore.swagger.io/v2/swagger.json',
          icon: 'cat',
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
          name: 'Petstore API v3',
          description: 'OpenAPI 3.0 版本示例',
          url: 'https://petstore3.swagger.io/api/v3/openapi.json',
          icon: 'dog',
          color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
          name: 'HTTPBin API',
          description: 'HTTP 请求与响应测试服务',
          url: 'https://httpbin.org/spec.json',
          icon: 'internet',
          color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
          name: 'JSON Placeholder',
          description: '免费的在线 REST API 测试服务',
          url: 'https://raw.githubusercontent.com/typicode/json-server/master/openapi.json',
          icon: 'server',
          color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        },
        {
          name: 'GitHub API',
          description: 'GitHub REST API 文档',
          url: 'https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json',
          icon: 'logo-github',
          color: 'linear-gradient(135deg, #434343 0%, #000000 100%)'
        }
      ]
    }
  },
  methods: {
    // 获取粒子样式
    getParticleStyle(index) {
      const size = Math.random() * 6 + 4
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 10 + 10}s`
      }
    },
    
    // 加载OpenAPI规范
    async loadSpec() {
      if (!this.specUrl) {
        MessagePlugin.warning('请输入 OpenAPI 规范 URL')
        return
      }
      
      this.loading = true
      this.error = null
      this.specLoaded = false
      
      try {
        // 销毁之前的实例
        if (this.swaggerUI) {
          const container = document.getElementById('swagger-ui')
          if (container) {
            container.innerHTML = ''
          }
        }
        
        // 创建新的Swagger UI实例
        this.swaggerUI = SwaggerUIBundle({
          url: this.specUrl,
          dom_id: '#swagger-ui',
          deepLinking: this.settings.deepLinking,
          displayRequestDuration: this.settings.displayRequestDuration,
          showExtensions: this.settings.showExtensions,
          showCommonExtensions: this.settings.showCommonExtensions,
          docExpansion: this.settings.docExpansion,
          defaultModelsExpandDepth: this.settings.defaultModelsExpandDepth,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: 'BaseLayout',
          onComplete: () => {
            this.loading = false
            this.specLoaded = true
            MessagePlugin.success('API 规范加载成功！')
          },
          onFailure: (err) => {
            this.loading = false
            this.error = err.message || '加载失败，请检查URL是否正确'
            MessagePlugin.error('加载失败：' + this.error)
          }
        })
        
        // 设置超时
        setTimeout(() => {
          if (this.loading) {
            this.loading = false
            this.specLoaded = true // 可能已经加载成功但onComplete没触发
          }
        }, 5000)
        
      } catch (err) {
        this.loading = false
        this.error = err.message || '加载失败'
        MessagePlugin.error('加载失败：' + this.error)
      }
    },
    
    // 加载示例API
    loadExample(example) {
      this.specUrl = example.url
      this.loadSpec()
    },
    
    // 切换深色模式
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      document.body.classList.toggle('swagger-dark-mode', this.darkMode)
    },
    
    // 保存设置
    saveSettings() {
      this.showSettings = false
      if (this.specLoaded) {
        this.loadSpec() // 重新加载以应用新设置
      }
      MessagePlugin.success('设置已保存')
    }
  },
  beforeDestroy() {
    // 清理
    document.body.classList.remove('swagger-dark-mode')
  }
}
</script>

<style scoped>
.swagger-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
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
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 15s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-30px) translateX(20px);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-15px) translateX(-20px);
    opacity: 0.5;
  }
  75% {
    transform: translateY(-40px) translateX(10px);
    opacity: 0.7;
  }
}

/* 控制栏 */
.control-bar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.control-bar-inner {
  max-width: 1600px;
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
  background: linear-gradient(135deg, #00d4ff, #7c3aed);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
}

.logo-text h1 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.logo-text p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
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
  gap: 8px;
}

.action-buttons .t-button {
  color: rgba(255, 255, 255, 0.8);
}

/* 主体内容 */
.main-content {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 80px);
}

/* 欢迎页面 */
.welcome-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 24px;
}

.welcome-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 48px;
  max-width: 900px;
  width: 100%;
  text-align: center;
}

.welcome-icon {
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 24px;
}

.welcome-card h2 {
  font-size: 28px;
  color: white;
  margin: 0 0 12px 0;
}

.welcome-card > p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin: 0 0 40px 0;
}

.quick-start {
  margin-bottom: 40px;
}

.quick-start h3,
.features h3 {
  font-size: 18px;
  color: white;
  margin: 0 0 20px 0;
  text-align: left;
}

.example-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.example-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.example-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.5);
  transform: translateX(8px);
}

.example-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
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
  color: white;
  margin: 0 0 4px 0;
}

.example-info p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.arrow-icon {
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.example-card:hover .arrow-icon {
  color: #00d4ff;
  transform: translateX(4px);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #00d4ff;
}

.feature-item span {
  font-size: 14px;
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
  color: white;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: #00d4ff;
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  border-right-color: #7c3aed;
  animation-delay: 0.2s;
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
}

.spinner-ring:nth-child(3) {
  border-bottom-color: #f59e0b;
  animation-delay: 0.4s;
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-card h3 {
  font-size: 20px;
  margin: 0 0 8px 0;
}

.loading-card p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  word-break: break-all;
}

/* Swagger容器 */
.swagger-container {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

#swagger-ui {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
  color: white;
  background: rgba(239, 68, 68, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  padding: 48px;
  max-width: 500px;
}

.error-icon {
  color: #ef4444;
  margin-bottom: 16px;
}

.error-card h3 {
  font-size: 20px;
  margin: 0 0 12px 0;
}

.error-card p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 24px 0;
}

/* 弹窗样式 */
.examples-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.example-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.example-item:hover {
  background: #e8e8e8;
  transform: translateY(-2px);
}

.example-item-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.example-item-info {
  flex: 1;
}

.example-item-info h4 {
  font-size: 16px;
  color: #333;
  margin: 0 0 4px 0;
}

.example-item-info p {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px 0;
}

.example-item-info code {
  font-size: 11px;
  color: #999;
  background: rgba(0, 0, 0, 0.05);
  padding: 4px 8px;
  border-radius: 4px;
  word-break: break-all;
}

.settings-dialog {
  padding: 12px 0;
}

/* 深色模式 */
.dark-mode #swagger-ui {
  background: #1a1a2e;
  filter: invert(0.88) hue-rotate(180deg);
}

/* 响应式 */
@media (max-width: 1024px) {
  .control-bar-inner {
    flex-wrap: wrap;
  }
  
  .url-input-section {
    order: 3;
    width: 100%;
    flex-wrap: wrap;
  }
  
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .welcome-card {
    padding: 32px 20px;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .logo-text h1 {
    font-size: 16px;
  }
}
</style>

<style>
/* Swagger UI 全局样式覆盖 */
#swagger-ui .swagger-ui {
  font-family: inherit;
}

#swagger-ui .swagger-ui .topbar {
  display: none;
}

#swagger-ui .swagger-ui .info {
  margin: 30px 0;
}

#swagger-ui .swagger-ui .info .title {
  font-size: 28px;
}

#swagger-ui .swagger-ui .opblock-tag {
  font-size: 18px;
  border-bottom: 1px solid #eee;
}

#swagger-ui .swagger-ui .opblock {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
}

#swagger-ui .swagger-ui .opblock .opblock-summary {
  border-radius: 8px;
}

#swagger-ui .swagger-ui .opblock.opblock-get {
  border-color: #61affe;
  background: rgba(97, 175, 254, 0.1);
}

#swagger-ui .swagger-ui .opblock.opblock-post {
  border-color: #49cc90;
  background: rgba(73, 204, 144, 0.1);
}

#swagger-ui .swagger-ui .opblock.opblock-put {
  border-color: #fca130;
  background: rgba(252, 161, 48, 0.1);
}

#swagger-ui .swagger-ui .opblock.opblock-delete {
  border-color: #f93e3e;
  background: rgba(249, 62, 62, 0.1);
}

#swagger-ui .swagger-ui .btn {
  border-radius: 6px;
}

#swagger-ui .swagger-ui .btn.execute {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

#swagger-ui .swagger-ui .btn.execute:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

#swagger-ui .swagger-ui select {
  border-radius: 6px;
}

#swagger-ui .swagger-ui input[type=text],
#swagger-ui .swagger-ui textarea {
  border-radius: 6px;
}

#swagger-ui .swagger-ui .model-box {
  border-radius: 8px;
}

/* 深色模式下的Swagger UI */
body.swagger-dark-mode #swagger-ui .swagger-ui {
  background: #1a1a2e;
  color: #e0e0e0;
}
</style>
