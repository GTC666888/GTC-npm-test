<template>
  <div class="api-debug-container">
    <!-- Loading遮罩 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="loading-text">请求发送中...</div>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- 顶部标题栏 -->
    <div class="debug-header">
      <div class="header-left">
        <span class="title">在线运行</span>
        <span v-if="isLocked && apiName" class="api-name-badge">{{ apiName }}</span>
      </div>
      <div class="header-right">
        <t-button theme="default" variant="text" @click="handleClose">
          <t-icon name="close" />
        </t-button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="debug-content">
      <!-- 请求区域 -->
      <div class="request-section">
        <!-- URL输入行 -->
        <div class="url-row">
          <t-select v-model="request.method" class="method-select" :disabled="isLocked" :popup-props="{ overlayClassName: 'dark-popup' }">
            <t-option value="GET">GET</t-option>
            <t-option value="POST">POST</t-option>
            <t-option value="PUT">PUT</t-option>
            <t-option value="DELETE">DELETE</t-option>
            <t-option value="PATCH">PATCH</t-option>
            <t-option value="HEAD">HEAD</t-option>
            <t-option value="OPTIONS">OPTIONS</t-option>
          </t-select>
        <div class="url-input-wrapper" :class="{ 'is-locked': isLocked }">
            <t-icon name="link" class="url-icon" />
            <input 
              v-model="request.url" 
              class="url-input" 
              placeholder="输入请求URL..."
              :disabled="isLocked"
              :title="isLocked ? '试用模式下不可更换API' : ''"
              @keyup.enter="sendRequest"
            />
            <t-icon v-if="isLocked" name="lock-on" class="lock-icon" />
          </div>
          <t-button theme="primary" class="send-btn" :loading="loading" @click="sendRequest">
            发 送
          </t-button>
        </div>

        <!-- 鉴权区域 -->
        <div class="auth-section">
          <div class="section-title">鉴权</div>
          <div class="auth-row">
            <t-select v-model="request.authType" class="auth-type-select" :popup-props="{ overlayClassName: 'dark-popup' }">
              <t-option value="bearer">Bearer</t-option>
              <t-option value="basic">Basic Auth</t-option>
              <t-option value="apikey">API Key</t-option>
              <t-option value="none">无鉴权</t-option>
            </t-select>
            <div class="token-input-wrapper">
              <input 
                v-model="request.token" 
                :type="showToken ? 'text' : 'password'"
                class="token-input" 
                placeholder="Token"
              />
              <t-icon 
                :name="showToken ? 'browse' : 'browse-off'" 
                class="toggle-icon"
                @click="showToken = !showToken"
              />
            </div>
          </div>
        </div>

        <!-- Headers区域 -->
        <div class="headers-section">
          <div class="section-title">Headers</div>
          <div class="headers-list">
            <div v-for="(header, index) in request.headers" :key="index" class="header-item">
              <t-checkbox v-model="header.enabled" class="header-checkbox" />
              <input v-model="header.key" class="header-key" placeholder="Header名称" />
              <input v-model="header.value" class="header-value" placeholder="Header值" />
            </div>
            <div class="add-header" @click="addHeader">
              <t-icon name="add" />
              <span>添加参数</span>
            </div>
          </div>
        </div>

        <!-- Body区域 -->
        <div class="body-section">
          <div class="section-header">
            <span class="section-title">Body</span>
            <t-select v-model="request.bodyType" class="body-type-select" :popup-props="{ overlayClassName: 'dark-popup' }">
              <t-option value="json">JSON</t-option>
              <t-option value="form">Form Data</t-option>
              <t-option value="urlencoded">URL Encoded</t-option>
              <t-option value="raw">Raw</t-option>
              <t-option value="none">None</t-option>
            </t-select>
          </div>
          <div class="body-editor-wrapper">
            <div class="editor-toolbar">
              <span class="editor-lang">JSON</span>
              <div class="toolbar-actions">
                <t-dropdown :options="exampleOptions" @click="loadExample">
                  <t-button variant="text" size="small">示例 <t-icon name="chevron-down" /></t-button>
                </t-dropdown>
                <t-button variant="text" size="small" @click="clearBody">
                  <t-icon name="delete" />
                </t-button>
              </div>
            </div>
            <div class="code-editor">
              <div class="line-numbers">
                <div v-for="n in bodyLineCount" :key="n" class="line-number">{{ n }}</div>
              </div>
              <textarea 
                v-model="request.body" 
                class="code-textarea"
                spellcheck="false"
                @input="updateLineCount"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- 响应区域 -->
      <div class="response-section" :class="{ 'has-response': response.data }">
        <!-- 响应标签栏 -->
        <div class="response-tabs">
          <div 
            v-for="tab in responseTabs" 
            :key="tab.key"
            class="response-tab"
            :class="{ active: activeResponseTab === tab.key }"
            @click="activeResponseTab = tab.key"
          >
            {{ tab.label }}
            <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
          </div>
          <div class="response-meta">
            <span class="status-badge" :class="statusClass">{{ response.status || '---' }}</span>
            <span class="meta-item">{{ response.time || '---' }}ms</span>
            <span class="meta-item">{{ response.size || '---' }}B</span>
          </div>
        </div>

        <!-- 响应内容 -->
        <div class="response-content">
          <!-- Body响应 -->
          <div v-if="activeResponseTab === 'body'" class="response-body">
            <div class="body-toolbar">
              <div class="format-options">
                <span 
                  v-for="fmt in formatOptions" 
                  :key="fmt"
                  class="format-option"
                  :class="{ active: responseFormat === fmt }"
                  @click="responseFormat = fmt"
                >{{ fmt }}</span>
              </div>
              <div class="body-actions">
                <t-select v-model="responseEncoding" class="encoding-select" :popup-props="{ overlayClassName: 'dark-popup' }">
                  <t-option value="utf8">utf8</t-option>
                  <t-option value="gbk">gbk</t-option>
                  <t-option value="iso-8859-1">iso-8859-1</t-option>
                </t-select>
                <t-icon name="filter" class="action-icon" />
                <t-icon name="download" class="action-icon" @click="downloadResponse" />
                <t-icon name="file-copy" class="action-icon" @click="copyResponse" />
                <t-icon name="search" class="action-icon" />
              </div>
            </div>
            <div class="response-code">
              <div class="line-numbers">
                <div v-for="n in responseLineCount" :key="n" class="line-number">{{ n }}</div>
              </div>
              <pre class="code-content"><code v-html="highlightedResponse"></code></pre>
            </div>
          </div>

          <!-- Headers响应 -->
          <div v-if="activeResponseTab === 'headers'" class="response-headers">
            <div v-for="(value, key) in response.headers" :key="key" class="header-row">
              <span class="header-key">{{ key }}</span>
              <span class="header-value">{{ value }}</span>
            </div>
          </div>

          <!-- Cookies响应 -->
          <div v-if="activeResponseTab === 'cookies'" class="response-cookies">
            <div v-if="response.cookies && response.cookies.length">
              <div v-for="(cookie, index) in response.cookies" :key="index" class="cookie-row">
                <span class="cookie-name">{{ cookie.name }}</span>
                <span class="cookie-value">{{ cookie.value }}</span>
              </div>
            </div>
            <div v-else class="empty-state">暂无Cookie信息</div>
          </div>

          <!-- 空状态 -->
          <div v-if="!response.data && activeResponseTab === 'body'" class="empty-response">
            <t-icon name="send" class="empty-icon" />
            <p>点击发送按钮执行请求</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ApiDebug',
  data() {
    return {
      loading: false,
      showToken: false,
      isLocked: false,  // 是否为锁定模式（试用模式）
      apiName: '',      // API名称（锁定模式显示）
      
      // 请求配置
      request: {
        method: 'POST',
        url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        authType: 'bearer',
        token: '',
        bodyType: 'json',
        body: `{
  "model": "<YOUR_MODEL_EP>",
  "content": [
    {
      "type": "text",
      "text": "戴着帽子的老爷爷面带微笑往前走 --ratio 1:1 --fps 24 --dur 5"
    }
  ]
}`,
        headers: [
          { enabled: true, key: 'Content-Type', value: 'application/json' },
          { enabled: true, key: 'Authorization', value: 'Bearer {{ARK_API_KEY}}' }
        ]
      },
      
      // 响应数据
      response: {
        status: 401,
        time: 392,
        size: 210,
        data: null,
        headers: {},
        cookies: []
      },
      
      // UI状态
      activeResponseTab: 'body',
      responseFormat: 'Pretty',
      responseEncoding: 'utf8',
      bodyLineCount: 9,
      
      // 示例选项
      exampleOptions: [
        { content: '聊天补全', value: 'chat' },
        { content: '图像生成', value: 'image' },
        { content: '文本嵌入', value: 'embedding' }
      ],
      
      // 格式选项
      formatOptions: ['Pretty', 'Raw', 'Preview']
    }
  },
  computed: {
    responseTabs() {
      return [
        { key: 'body', label: 'Body' },
        { key: 'cookies', label: 'Cookie' },
        { key: 'headers', label: 'Header', count: Object.keys(this.response.headers).length || 6 },
      ]
    },
    statusClass() {
      const status = this.response.status
      if (!status) return ''
      if (status >= 200 && status < 300) return 'success'
      if (status >= 300 && status < 400) return 'redirect'
      if (status >= 400 && status < 500) return 'client-error'
      return 'server-error'
    },
    responseLineCount() {
      if (!this.response.data) return 1
      const text = typeof this.response.data === 'string' 
        ? this.response.data 
        : JSON.stringify(this.response.data, null, 2)
      return text.split('\n').length
    },
    highlightedResponse() {
      if (!this.response.data) return ''
      
      let text = typeof this.response.data === 'string' 
        ? this.response.data 
        : JSON.stringify(this.response.data, null, 2)
      
      if (this.responseFormat === 'Raw') {
        return this.escapeHtml(text)
      }
      
      // 简单的JSON语法高亮
      return this.highlightJson(text)
    }
  },
  methods: {
    handleClose() {
      this.$router.back()
    },
    
    addHeader() {
      this.request.headers.push({ enabled: true, key: '', value: '' })
    },
    
    updateLineCount() {
      this.bodyLineCount = (this.request.body.match(/\n/g) || []).length + 1
    },
    
    clearBody() {
      this.request.body = ''
      this.bodyLineCount = 1
    },
    
    loadExample(option) {
      const examples = {
        chat: `{
  "model": "<YOUR_MODEL_EP>",
  "messages": [
    {
      "role": "user",
      "content": "你好，请介绍一下你自己"
    }
  ],
  "max_tokens": 1024,
  "temperature": 0.7
}`,
        image: `{
  "model": "<YOUR_MODEL_EP>",
  "prompt": "一只可爱的猫咪在阳光下睡觉",
  "n": 1,
  "size": "1024x1024"
}`,
        embedding: `{
  "model": "<YOUR_MODEL_EP>",
  "input": "这是一段需要向量化的文本"
}`
      }
      this.request.body = examples[option.value] || ''
      this.updateLineCount()
    },
    
    async sendRequest() {
      this.loading = true
      const startTime = Date.now()
      
      // 模拟网络延迟 (200-800ms)
      const mockDelay = Math.floor(Math.random() * 600) + 200
      
      await new Promise(resolve => setTimeout(resolve, mockDelay))
      
      // 根据请求URL和方法生成模拟响应
      const mockResponse = this.generateMockResponse()
      
      this.response = {
        status: mockResponse.status,
        time: Date.now() - startTime,
        size: JSON.stringify(mockResponse.data).length,
        data: mockResponse.data,
        headers: mockResponse.headers,
        cookies: []
      }
      
      this.loading = false
    },
    
    // 生成模拟响应数据
    generateMockResponse() {
      const url = this.request.url.toLowerCase()
      const method = this.request.method.toUpperCase()
      
      // 解析请求body
      let requestBody = {}
      if (this.request.body && this.request.bodyType === 'json') {
        try {
          requestBody = JSON.parse(this.request.body)
        } catch (e) {
          requestBody = {}
        }
      }
      
      // 模拟响应头
      const mockHeaders = {
        'content-type': 'application/json',
        'x-request-id': this.generateRequestId(),
        'x-response-time': `${Math.floor(Math.random() * 100) + 50}ms`,
        'date': new Date().toUTCString()
      }
      
      // 检查是否提供了Token
      if (!this.request.token) {
        return {
          status: 401,
          data: {
            error: {
              code: "AuthenticationError",
              message: "the API key or AK/SK in the request is missing or invalid. request id: " + this.generateRequestId(),
              param: "",
              type: "Unauthorized"
            }
          },
          headers: mockHeaders
        }
      }
      
      // 根据URL类型生成对应的模拟数据
      if (url.includes('chat') || url.includes('completions')) {
        return this.mockChatResponse(requestBody, mockHeaders)
      } else if (url.includes('image') || url.includes('generation')) {
        return this.mockImageResponse(requestBody, mockHeaders)
      } else if (url.includes('embedding')) {
        return this.mockEmbeddingResponse(requestBody, mockHeaders)
      } else if (url.includes('model')) {
        return this.mockModelListResponse(mockHeaders)
      } else {
        // 通用API响应
        return this.mockGenericResponse(method, requestBody, mockHeaders)
      }
    },
    
    // 生成请求ID
    generateRequestId() {
      return 'req_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    },
    
    // 模拟Chat API响应
    mockChatResponse(requestBody, headers) {
      const model = requestBody.model || 'doubao-pro-32k'
      return {
        status: 200,
        data: {
          id: "chatcmpl-" + this.generateRequestId(),
          object: "chat.completion",
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: "您好！我是AI助手，这是一条模拟的响应消息。当前为调试模式，返回的是模拟数据而非真实API调用结果。\n\n如需测试真实API，请配置实际的API服务。"
              },
              finish_reason: "stop"
            }
          ],
          usage: {
            prompt_tokens: Math.floor(Math.random() * 100) + 20,
            completion_tokens: Math.floor(Math.random() * 200) + 50,
            total_tokens: Math.floor(Math.random() * 300) + 70
          }
        },
        headers
      }
    },
    
    // 模拟Image API响应
    mockImageResponse(requestBody, headers) {
      return {
        status: 200,
        data: {
          created: Math.floor(Date.now() / 1000),
          data: [
            {
              url: "https://example.com/mock-image-" + this.generateRequestId() + ".png",
              revised_prompt: requestBody.prompt || "模拟生成的图片"
            }
          ]
        },
        headers
      }
    },
    
    // 模拟Embedding API响应
    mockEmbeddingResponse(requestBody, headers) {
      // 生成模拟的embedding向量（1536维）
      const mockEmbedding = Array.from({ length: 1536 }, () => (Math.random() - 0.5) * 0.1)
      return {
        status: 200,
        data: {
          object: "list",
          data: [
            {
              object: "embedding",
              index: 0,
              embedding: mockEmbedding.slice(0, 10).concat(['... 更多维度数据省略 ...'])
            }
          ],
          model: requestBody.model || "text-embedding-ada-002",
          usage: {
            prompt_tokens: Math.floor(Math.random() * 50) + 10,
            total_tokens: Math.floor(Math.random() * 50) + 10
          }
        },
        headers
      }
    },
    
    // 模拟模型列表响应
    mockModelListResponse(headers) {
      return {
        status: 200,
        data: {
          object: "list",
          data: [
            { id: "doubao-pro-32k", object: "model", created: 1700000000, owned_by: "bytedance" },
            { id: "doubao-lite-4k", object: "model", created: 1700000000, owned_by: "bytedance" },
            { id: "doubao-vision", object: "model", created: 1700000000, owned_by: "bytedance" },
            { id: "doubao-embedding", object: "model", created: 1700000000, owned_by: "bytedance" }
          ]
        },
        headers
      }
    },
    
    // 模拟通用API响应
    mockGenericResponse(method, requestBody, headers) {
      if (method === 'GET') {
        return {
          status: 200,
          data: {
            success: true,
            message: "查询成功（模拟数据）",
            data: {
              id: Math.floor(Math.random() * 10000),
              name: "示例数据",
              description: "这是模拟返回的数据",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            pagination: {
              page: requestBody.page || 1,
              pageSize: requestBody.pageSize || 10,
              total: 100
            }
          },
          headers
        }
      } else if (method === 'POST') {
        return {
          status: 201,
          data: {
            success: true,
            message: "创建成功（模拟数据）",
            data: {
              id: Math.floor(Math.random() * 10000),
              ...requestBody,
              createdAt: new Date().toISOString()
            }
          },
          headers
        }
      } else if (method === 'PUT' || method === 'PATCH') {
        return {
          status: 200,
          data: {
            success: true,
            message: "更新成功（模拟数据）",
            data: {
              ...requestBody,
              updatedAt: new Date().toISOString()
            }
          },
          headers
        }
      } else if (method === 'DELETE') {
        return {
          status: 200,
          data: {
            success: true,
            message: "删除成功（模拟数据）"
          },
          headers
        }
      }
      
      return {
        status: 200,
        data: {
          success: true,
          message: "请求成功（模拟数据）",
          method: method,
          timestamp: new Date().toISOString()
        },
        headers
      }
    },
    
    copyResponse() {
      const text = typeof this.response.data === 'string' 
        ? this.response.data 
        : JSON.stringify(this.response.data, null, 2)
      navigator.clipboard.writeText(text)
      this.$message.success('已复制到剪贴板')
    },
    
    downloadResponse() {
      const text = typeof this.response.data === 'string' 
        ? this.response.data 
        : JSON.stringify(this.response.data, null, 2)
      const blob = new Blob([text], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'response.json'
      a.click()
      URL.revokeObjectURL(url)
    },
    
    escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    },
    
    highlightJson(json) {
      if (!json) return ''
      
      // 转义HTML
      json = this.escapeHtml(json)
      
      // 高亮JSON语法
      return json
        // 字符串值（包含中文）
        .replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match, p1) => {
          // 判断是否是键名（后面跟着冒号）
          return `<span class="json-string">"${p1}"</span>`
        })
        // 数字
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="json-number">$1</span>')
        // 布尔值和null
        .replace(/\b(true|false|null)\b/g, '<span class="json-boolean">$1</span>')
    },
    
    setDefaultBody(method) {
      // 根据请求方法设置默认Body
      if (method === 'GET' || method === 'DELETE' || method === 'HEAD') {
        this.request.body = ''
        this.request.bodyType = 'none'
      } else {
        this.request.body = `{
  "page": 1,
  "pageSize": 10
}`
        this.request.bodyType = 'json'
      }
      this.updateLineCount()
    },
    
    // 关闭页面
    handleClose() {
      this.$router.back()
    }
  },
  mounted() {
    // 检查路由参数，处理试用模式
    const { url, method, apiName, locked } = this.$route.query
    
    if (locked === 'true') {
      this.isLocked = true
      this.apiName = apiName || ''
      
      // 设置API信息
      if (url) {
        this.request.url = url
      }
      if (method) {
        this.request.method = method.toUpperCase()
      }
      
      // 根据API类型设置默认Body
      this.setDefaultBody(method)
      
      // 清空默认响应
      this.response.data = null
    } else {
      // 非试用模式，显示默认响应示例
      this.response.data = {
        error: {
          code: "AuthenticationError",
          message: "the API key or AK/SK in the request is missing or invalid. request id: 02176534905211115de161b16d50149cbf4122a430bab0f0686736",
          param: "",
          type: "Unauthorized"
        }
      }
    }
  }
}
</script>

<style scoped>
.api-debug-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1a1a2e;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  z-index: 1000;
}

/* Loading遮罩样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: #6366f1;
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  width: 65px;
  height: 65px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-right-color: #8b5cf6;
  animation-delay: 0.15s;
  animation-direction: reverse;
}

.spinner-ring:nth-child(3) {
  width: 50px;
  height: 50px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-bottom-color: #a855f7;
  animation-delay: 0.3s;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.spinner-ring:nth-child(1) {
  animation: spin1 1.5s linear infinite;
}

@keyframes spin1 {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 18px;
  font-weight: 500;
  color: #e0e0e0;
  letter-spacing: 2px;
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.loading-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  animation: bounce 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(1) {
  animation-delay: 0s;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 顶部标题栏 */
.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #16162a;
  border-bottom: 1px solid #2d2d4a;
}

.header-left .title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.header-left .api-name-badge {
  margin-left: 12px;
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
  font-weight: 500;
}

.header-right .t-button {
  color: #888;
}

.header-right .t-button:hover {
  color: #fff;
}

/* 主内容区 */
.debug-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px 20px;
  gap: 16px;
}

/* 请求区域 */
.request-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* URL输入行 */
.url-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.method-select {
  width: 100px;
  flex-shrink: 0;
}

.method-select :deep(.t-input) {
  background: #252542;
  border: 1px solid #3d3d5c;
  color: #4ecdc4;
  font-weight: 600;
}

.url-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #252542;
  border: 1px solid #3d3d5c;
  border-radius: 6px;
  padding: 0 12px;
}

.url-icon {
  color: #666;
  margin-right: 8px;
}

.url-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e0e0e0;
  font-size: 14px;
  padding: 10px 0;
  outline: none;
}

.url-input::placeholder {
  color: #666;
}

.url-input:disabled {
  color: #888;
  cursor: not-allowed;
}

.url-input-wrapper.is-locked {
  background: #1e1e38;
  border-color: #4d4d6a;
}

.url-input-wrapper .lock-icon {
  color: #667eea;
  margin-left: 8px;
}

.send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 10px 24px;
  font-weight: 500;
}

.send-btn:hover {
  background: linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%);
}

/* 鉴权区域 */
.auth-section {
  background: #1e1e38;
  border-radius: 8px;
  padding: 16px;
}

.section-title {
  font-size: 13px;
  color: #888;
  margin-bottom: 12px;
  font-weight: 500;
}

.auth-row {
  display: flex;
  gap: 12px;
}

.auth-type-select {
  width: 120px;
}

.auth-type-select :deep(.t-input) {
  background: #252542;
  border: 1px solid #3d3d5c;
  color: #e0e0e0;
}

.token-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #252542;
  border: 1px solid #3d3d5c;
  border-radius: 6px;
  padding: 0 12px;
}

.token-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e0e0e0;
  font-size: 14px;
  padding: 8px 0;
  outline: none;
}

.toggle-icon {
  color: #666;
  cursor: pointer;
}

.toggle-icon:hover {
  color: #888;
}

/* Headers区域 */
.headers-section {
  background: #1e1e38;
  border-radius: 8px;
  padding: 16px;
}

.headers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-checkbox :deep(.t-checkbox__input) {
  border-color: #3d3d5c;
}

.header-key,
.header-value {
  flex: 1;
  background: #252542;
  border: 1px solid #3d3d5c;
  border-radius: 4px;
  padding: 8px 12px;
  color: #e0e0e0;
  font-size: 13px;
  outline: none;
}

.header-key {
  color: #4ecdc4;
}

.header-value {
  color: #ffd93d;
}

.add-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  padding: 8px 0;
}

.add-header:hover {
  color: #888;
}

/* Body区域 */
.body-section {
  background: #1e1e38;
  border-radius: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #2d2d4a;
}

.body-type-select {
  width: 100px;
}

.body-type-select :deep(.t-input) {
  background: transparent;
  border: none;
  color: #888;
  font-size: 12px;
}

.body-editor-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #16162a;
  border-bottom: 1px solid #2d2d4a;
}

.editor-lang {
  color: #888;
  font-size: 12px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.toolbar-actions .t-button {
  color: #888;
  font-size: 12px;
}

.code-editor {
  flex: 1;
  display: flex;
  overflow: auto;
  background: #0d0d1a;
}

.line-numbers {
  padding: 12px 8px;
  background: #12122a;
  text-align: right;
  user-select: none;
  min-width: 40px;
}

.line-number {
  color: #444;
  font-size: 13px;
  line-height: 1.6;
  font-family: 'Monaco', 'Consolas', monospace;
}

.code-textarea {
  flex: 1;
  background: transparent;
  border: none;
  color: #e0e0e0;
  font-size: 13px;
  line-height: 1.6;
  font-family: 'Monaco', 'Consolas', monospace;
  padding: 12px;
  resize: none;
  outline: none;
}

/* 响应区域 */
.response-section {
  background: #1e1e38;
  border-radius: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 250px;
}

.response-tabs {
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #16162a;
  border-bottom: 1px solid #2d2d4a;
  border-radius: 8px 8px 0 0;
}

.response-tab {
  padding: 12px 16px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 6px;
}

.response-tab:hover {
  color: #888;
}

.response-tab.active {
  color: #e0e0e0;
  border-bottom-color: #667eea;
}

.tab-count {
  background: #3d3d5c;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
}

.response-meta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.success {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
}

.status-badge.client-error {
  background: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
}

.status-badge.server-error {
  background: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
}

.meta-item {
  color: #888;
  font-size: 12px;
}

.response-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.response-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.body-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #2d2d4a;
}

.format-options {
  display: flex;
  gap: 4px;
}

.format-option {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.format-option:hover {
  color: #888;
}

.format-option.active {
  background: #3d3d5c;
  color: #e0e0e0;
}

.body-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.encoding-select {
  width: 80px;
}

.encoding-select :deep(.t-input) {
  background: transparent;
  border: none;
  color: #888;
  font-size: 12px;
}

.action-icon {
  color: #666;
  cursor: pointer;
  font-size: 16px;
}

.action-icon:hover {
  color: #888;
}

.response-code {
  flex: 1;
  display: flex;
  overflow: auto;
  background: #0d0d1a;
}

.code-content {
  flex: 1;
  padding: 12px;
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  font-family: 'Monaco', 'Consolas', monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

/* JSON语法高亮 */
.code-content :deep(.json-string) {
  color: #ce9178;
}

.code-content :deep(.json-number) {
  color: #b5cea8;
}

.code-content :deep(.json-boolean) {
  color: #569cd6;
}

.code-content :deep(.json-key) {
  color: #9cdcfe;
}

/* Headers响应 */
.response-headers {
  padding: 16px;
}

.header-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #2d2d4a;
}

.header-row .header-key {
  width: 200px;
  background: transparent;
  border: none;
  padding: 0;
}

.header-row .header-value {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0;
}

/* Cookies响应 */
.response-cookies {
  padding: 16px;
}

.cookie-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #2d2d4a;
}

.cookie-name {
  color: #4ecdc4;
  width: 150px;
}

.cookie-value {
  color: #ffd93d;
}

.empty-state {
  color: #666;
  text-align: center;
  padding: 40px;
}

.empty-response {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* 全局深色下拉框样式 */
:deep(.dark-popup) {
  background: #252542 !important;
  border: 1px solid #3d3d5c !important;
}

:deep(.dark-popup .t-select-option) {
  color: #e0e0e0;
}

:deep(.dark-popup .t-select-option:hover) {
  background: #3d3d5c;
}

:deep(.t-select .t-input) {
  background: #252542;
  border-color: #3d3d5c;
  color: #e0e0e0;
}

:deep(.t-checkbox__input) {
  border-color: #3d3d5c;
  background: transparent;
}

:deep(.t-checkbox--checked .t-checkbox__input) {
  background: #667eea;
  border-color: #667eea;
}
</style>
