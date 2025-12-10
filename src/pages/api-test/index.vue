<template>
  <div class="api-test-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1>API 调试工具</h1>
          <p>在线测试和调试ER API接口</p>
        </div>
        <div class="header-actions">
          <t-button theme="default" @click="loadHistory">
            <template #icon><t-icon name="time" /></template>
            历史记录
          </t-button>
          <t-button theme="primary" @click="saveTest">
            <template #icon><t-icon name="save" /></template>
            保存测试
          </t-button>
        </div>
      </div>
    </div>

    <div class="test-interface">
      <t-row :gutter="24">
        <!-- 左侧：请求配置 -->
        <t-col :span="10">
          <div class="request-panel">
            <div class="panel-header">
              <h3>请求配置</h3>
              <t-dropdown>
                <t-button variant="text" size="small">
                  <t-icon name="setting" />
                </t-button>
                <t-dropdown-menu>
                  <t-dropdown-item @click="loadPreset('get-employees')">示例: 获取员工列表</t-dropdown-item>
                  <t-dropdown-item @click="loadPreset('create-employee')">示例: 创建员工</t-dropdown-item>
                  <t-dropdown-item @click="loadPreset('update-employee')">示例: 更新员工</t-dropdown-item>
                  <t-dropdown-item @click="testApiService">测试API工具类</t-dropdown-item>
                  <t-dropdown-item @click="testPluginFeatures">测试插件功能</t-dropdown-item>
                </t-dropdown-menu>
              </t-dropdown>
            </div>

            <!-- API选择 -->
            <div class="form-group">
              <label class="form-label">API 接口</label>
              <t-select
                v-model="requestConfig.method"
                placeholder="请求方法"
                style="width: 100px; margin-right: 8px;"
              >
                <t-option value="GET" label="GET" />
                <t-option value="POST" label="POST" />
                <t-option value="PUT" label="PUT" />
                <t-option value="DELETE" label="DELETE" />
                <t-option value="PATCH" label="PATCH" />
              </t-select>
              <t-input
                v-model="requestConfig.url"
                placeholder="输入API端点，如 /api/employees"
                class="api-url-input"
              />
            </div>

            <!-- 请求头 -->
            <div class="form-group">
              <div class="group-header">
                <label class="form-label">请求头</label>
                <t-button variant="text" size="small" @click="addHeader">
                  <t-icon name="add" />
                  添加
                </t-button>
              </div>
              <div class="headers-list">
                <div
                  v-for="(header, index) in requestConfig.headers"
                  :key="index"
                  class="header-item"
                >
                  <t-input
                    v-model="header.key"
                    placeholder="Header名称"
                    size="small"
                  />
                  <t-input
                    v-model="header.value"
                    placeholder="Header值"
                    size="small"
                  />
                  <t-button
                    variant="text"
                    theme="danger"
                    size="small"
                    @click="removeHeader(index)"
                  >
                    <t-icon name="delete" />
                  </t-button>
                </div>
              </div>
            </div>

            <!-- 请求参数 -->
            <div class="form-group">
              <div class="group-header">
                <label class="form-label">请求参数</label>
                <t-button variant="text" size="small" @click="addParam">
                  <t-icon name="add" />
                  添加
                </t-button>
              </div>
              <div class="params-list">
                <div
                  v-for="(param, index) in requestConfig.params"
                  :key="index"
                  class="param-item"
                >
                  <t-input
                    v-model="param.key"
                    placeholder="参数名"
                    size="small"
                  />
                  <t-input
                    v-model="param.value"
                    placeholder="参数值"
                    size="small"
                  />
                  <t-select
                    v-model="param.type"
                    size="small"
                    style="width: 100px;"
                  >
                    <t-option value="query" label="Query" />
                    <t-option value="path" label="Path" />
                  </t-select>
                  <t-button
                    variant="text"
                    theme="danger"
                    size="small"
                    @click="removeParam(index)"
                  >
                    <t-icon name="delete" />
                  </t-button>
                </div>
              </div>
            </div>

            <!-- 请求体 -->
            <div class="form-group" v-if="showRequestBody">
              <div class="group-header">
                <label class="form-label">请求体</label>
                <t-select
                  v-model="requestConfig.bodyType"
                  size="small"
                  style="width: 120px;"
                >
                  <t-option value="json" label="JSON" />
                  <t-option value="form" label="Form Data" />
                  <t-option value="raw" label="Raw Text" />
                </t-select>
              </div>
              <div v-if="requestConfig.bodyType === 'json'" class="json-editor">
                <t-textarea
                  v-model="requestConfig.body"
                  placeholder="输入JSON格式的请求体"
                  :rows="8"
                />
                <div class="editor-actions">
                  <t-button variant="text" size="small" @click="formatJSON">
                    <t-icon name="format" />
                    格式化
                  </t-button>
                  <t-button variant="text" size="small" @click="validateJSON">
                    <t-icon name="check-circle" />
                    验证
                  </t-button>
                </div>
              </div>
              <div v-else-if="requestConfig.bodyType === 'form'" class="form-data-editor">
                <div
                  v-for="(field, index) in requestConfig.formData"
                  :key="index"
                  class="form-field-item"
                >
                  <t-input
                    v-model="field.key"
                    placeholder="字段名"
                    size="small"
                  />
                  <t-input
                    v-model="field.value"
                    placeholder="字段值"
                    size="small"
                  />
                  <t-button
                    variant="text"
                    theme="danger"
                    size="small"
                    @click="removeFormField(index)"
                  >
                    <t-icon name="delete" />
                  </t-button>
                </div>
                <t-button variant="dashed" size="small" @click="addFormField">
                  <t-icon name="add" />
                  添加字段
                </t-button>
              </div>
              <div v-else class="raw-editor">
                <t-textarea
                  v-model="requestConfig.body"
                  placeholder="输入原始请求体内容"
                  :rows="8"
                />
              </div>
            </div>

            <!-- 发送按钮 -->
            <div class="send-section">
              <t-button
                theme="primary"
                size="large"
                :loading="isLoading"
                @click="sendRequest"
                block
              >
                <template #icon>
                  <t-icon name="send" />
                </template>
                发送请求
              </t-button>
            </div>
          </div>
        </t-col>

        <!-- 右侧：响应结果 -->
        <t-col :span="14">
          <div class="response-panel">
            <div class="panel-header">
              <h3>响应结果</h3>
              <div class="response-meta">
                <t-tag
                  v-if="response.status"
                  :theme="getStatusTheme(response.status)"
                >
                  {{ response.status }} {{ response.statusText }}
                </t-tag>
                <span v-if="response.time" class="response-time">
                  {{ response.time }}ms
                </span>
              </div>
            </div>

            <!-- 响应标签页 -->
            <t-tabs v-model="activeResponseTab" theme="card">
              <!-- 响应体 -->
              <t-tab-panel value="body" label="响应体">
                <div class="response-body">
                  <div v-if="!response.body" class="empty-state">
                    <t-icon name="code" size="48px" />
                    <p>发送请求后查看响应内容</p>
                  </div>
                  <div v-else class="response-content">
                    <div class="response-actions">
                      <t-button variant="text" size="small" @click="copyResponse">
                        <t-icon name="copy" />
                        复制
                      </t-button>
                      <t-button variant="text" size="small" @click="downloadResponse">
                        <t-icon name="download" />
                        下载
                      </t-button>
                      <t-button variant="text" size="small" @click="formatResponse">
                        <t-icon name="format" />
                        格式化
                      </t-button>
                    </div>
                    <pre class="response-text"><code>{{ formattedResponse }}</code></pre>
                  </div>
                </div>
              </t-tab-panel>

              <!-- 响应头 -->
              <t-tab-panel value="headers" label="响应头">
                <div class="response-headers">
                  <div v-if="!response.headers" class="empty-state">
                    <t-icon name="setting" size="48px" />
                    <p>发送请求后查看响应头信息</p>
                  </div>
                  <div v-else class="headers-table">
                    <div
                      v-for="(value, key) in response.headers"
                      :key="key"
                      class="header-row"
                    >
                      <div class="header-key">{{ key }}</div>
                      <div class="header-value">{{ value }}</div>
                    </div>
                  </div>
                </div>
              </t-tab-panel>

              <!-- 请求信息 -->
              <t-tab-panel value="request" label="请求信息">
                <div class="request-info">
                  <div class="info-item">
                    <label>请求URL:</label>
                    <div class="info-value">{{ fullRequestUrl }}</div>
                  </div>
                  <div class="info-item">
                    <label>请求方法:</label>
                    <div class="info-value">
                      <t-tag :theme="getMethodTheme(requestConfig.method)">
                        {{ requestConfig.method }}
                      </t-tag>
                    </div>
                  </div>
                  <div class="info-item">
                    <label>请求时间:</label>
                    <div class="info-value">{{ requestTime }}</div>
                  </div>
                  <div class="info-item">
                    <label>请求头:</label>
                    <div class="info-value">
                      <t-tag
                        v-for="(header, index) in requestConfig.headers.filter(h => h.key && h.value)"
                        :key="index"
                        size="small"
                        style="margin: 2px;"
                      >
                        {{ header.key }}: {{ header.value }}
                      </t-tag>
                    </div>
                  </div>
                </div>
              </t-tab-panel>

              <!-- 调试信息 -->
              <t-tab-panel value="debug" label="调试信息">
                <div class="debug-info">
                  <t-collapse>
                    <t-collapse-panel value="timing" header="时间信息">
                      <div class="timing-details">
                        <div class="timing-item">
                          <label>DNS解析:</label>
                          <span>{{ debugTiming.dns }}ms</span>
                        </div>
                        <div class="timing-item">
                          <label>连接建立:</label>
                          <span>{{ debugTiming.connect }}ms</span>
                        </div>
                        <div class="timing-item">
                          <label>首字节时间:</label>
                          <span>{{ debugTiming.ttfb }}ms</span>
                        </div>
                        <div class="timing-item">
                          <label>内容下载:</label>
                          <span>{{ debugTiming.download }}ms</span>
                        </div>
                      </div>
                    </t-collapse-panel>
                    <t-collapse-panel value="network" header="网络信息">
                      <div class="network-details">
                        <div class="network-item">
                          <label>远程地址:</label>
                          <span>{{ debugNetwork.remoteAddress }}</span>
                        </div>
                        <div class="network-item">
                          <label>协议:</label>
                          <span>{{ debugNetwork.protocol }}</span>
                        </div>
                        <div class="network-item">
                          <label>SSL:</label>
                          <span>{{ debugNetwork.ssl ? '是' : '否' }}</span>
                        </div>
                      </div>
                    </t-collapse-panel>
                  </t-collapse>
                </div>
              </t-tab-panel>
            </t-tabs>
          </div>
        </t-col>
      </t-row>
    </div>

    <!-- 历史记录抽屉 -->
    <t-drawer v-model:visible="historyVisible" title="测试历史" size="600px">
      <div class="history-list">
        <div
          v-for="(item, index) in testHistory"
          :key="index"
          class="history-item"
          @click="loadHistoryItem(item)"
        >
          <div class="history-header">
            <t-tag :theme="getMethodTheme(item.method)">{{ item.method }}</t-tag>
            <span class="history-url">{{ item.url }}</span>
            <span class="history-time">{{ formatTime(item.time) }}</span>
          </div>
          <div class="history-meta">
            <span v-if="item.status" :class="getStatusClass(item.status)">
              {{ item.status }}
            </span>
            <span v-if="item.time">{{ item.time }}ms</span>
          </div>
        </div>
      </div>
    </t-drawer>
  </div>
</template>

<script>
import apiService, { ER_API } from '../../utils/api'

export default {
  name: 'ApiTest',
  data() {
    return {
      isLoading: false,
      activeResponseTab: 'body',
      historyVisible: false,
      
      // 请求配置
      requestConfig: {
        method: 'GET',
        url: '/api/employees',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: 'Bearer YOUR_ACCESS_TOKEN' }
        ],
        params: [],
        bodyType: 'json',
        body: '{\n  "page": 1,\n  "pageSize": 20\n}',
        formData: []
      },

      // 响应数据
      response: {
        status: null,
        statusText: null,
        body: null,
        headers: null,
        time: null
      },

      // 调试信息
      debugTiming: {
        dns: 0,
        connect: 0,
        ttfb: 0,
        download: 0
      },

      debugNetwork: {
        remoteAddress: '127.0.0.1',
        protocol: 'HTTPS/1.1',
        ssl: true
      },

      // 测试历史
      testHistory: []
    }
  },

  computed: {
    // 是否显示请求体
    showRequestBody() {
      return ['POST', 'PUT', 'PATCH'].includes(this.requestConfig.method)
    },

    // 完整请求URL
    fullRequestUrl() {
      const baseUrl = 'https://api.er.com/v1'
      const url = this.requestConfig.url.startsWith('/') 
        ? this.requestConfig.url 
        : '/' + this.requestConfig.url
      
      // 添加查询参数
      const queryParams = this.requestConfig.params
        .filter(p => p.type === 'query' && p.key && p.value)
        .map(p => `${p.key}=${encodeURIComponent(p.value)}`)
        .join('&')
      
      return queryParams ? `${baseUrl}${url}?${queryParams}` : `${baseUrl}${url}`
    },

    // 格式化的响应内容
    formattedResponse() {
      if (!this.response.body) return ''
      
      try {
        const parsed = JSON.parse(this.response.body)
        return JSON.stringify(parsed, null, 2)
      } catch {
        return this.response.body
      }
    },

    // 请求时间
    requestTime() {
      return new Date().toLocaleString('zh-CN')
    }
  },

  mounted() {
    this.loadHistoryFromStorage()
    if (this.initialConfig) {
      this.loadInitialConfig()
    }
  },

  methods: {
    // 发送请求
    async sendRequest() {
      if (!this.requestConfig.url) {
        this.$message.warning('请输入API端点')
        return
      }

      this.isLoading = true
      const startTime = Date.now()

      try {
        // 选择调用方式：真实API或模拟API
        if (this.requestConfig.url.startsWith('/api/')) {
          // 对于真实API路径，使用模拟（演示模式）
          await this.simulateApiCall()
        } else {
          // 对于其他路径，尝试真实API调用
          await this.makeApiCall()
        }
        
        const endTime = Date.now()
        this.response.time = endTime - startTime

        // 保存到历史记录
        this.saveToHistory()
        
        this.$message.success('请求发送成功')
      } catch (error) {
        this.response.status = 500
        this.response.statusText = 'Internal Server Error'
        this.response.body = JSON.stringify({
          error: error.message,
          code: 'INTERNAL_ERROR'
        }, null, 2)
        
        this.$message.error('请求失败: ' + error.message)
      } finally {
        this.isLoading = false
      }
    },

    // 真实API调用
    async makeApiCall() {
      try {
        // 构建完整URL
        const baseUrl = 'https://api.er.com/v1'
        const url = this.requestConfig.url.startsWith('/') 
          ? this.requestConfig.url 
          : '/' + this.requestConfig.url
        const fullUrl = baseUrl + url

        // 构建请求头
        const headers = {}
        this.requestConfig.headers
          .filter(header => header.key && header.value)
          .forEach(header => {
            headers[header.key] = header.value
          })

        // 构建查询参数
        const queryParams = this.requestConfig.params
          .filter(p => p.type === 'query' && p.key && p.value)
          .map(p => `${p.key}=${encodeURIComponent(p.value)}`)
          .join('&')
        
        const finalUrl = queryParams ? `${fullUrl}?${queryParams}` : fullUrl

        // 准备请求选项
        const requestOptions = {
          method: this.requestConfig.method,
          headers
        }

        // 添加请求体（仅对需要的方法）
        if (['POST', 'PUT', 'PATCH'].includes(this.requestConfig.method)) {
          if (this.requestConfig.bodyType === 'json') {
            requestOptions.body = this.requestConfig.body
            headers['Content-Type'] = headers['Content-Type'] || 'application/json'
          } else if (this.requestConfig.bodyType === 'form') {
            const formData = new FormData()
            this.requestConfig.formData
              .filter(field => field.key && field.value)
              .forEach(field => {
                formData.append(field.key, field.value)
              })
            requestOptions.body = formData
          } else {
            requestOptions.body = this.requestConfig.body
          }
        }

        // 发送请求
        const response = await fetch(finalUrl, requestOptions)
        
        // 设置响应信息
        this.response.status = response.status
        this.response.statusText = response.statusText || 'OK'
        
        // 获取响应体
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          this.response.body = await response.text()
        } else {
          this.response.body = await response.text()
        }

        // 获取响应头
        const responseHeaders = {}
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value
        })
        this.response.headers = responseHeaders

        // 记录请求信息
        this.recordRequestInfo(finalUrl, requestOptions)

      } catch (error) {
        // 网络错误处理
        this.response.status = 0
        this.response.statusText = 'Network Error'
        this.response.body = JSON.stringify({
          error: '网络连接失败',
          message: error.message,
          code: 'NETWORK_ERROR'
        }, null, 2)
        
        this.response.headers = {}
        throw error
      }
    },

    // 模拟API调用（用于演示）
    simulateApiCall() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const url = this.requestConfig.url
          const method = this.requestConfig.method

          // 根据不同API返回模拟数据
          if (url.includes('/employees')) {
            if (method === 'GET') {
              this.response.status = 200
              this.response.statusText = 'OK'
              this.response.body = JSON.stringify({
                code: 0,
                message: 'success',
                data: {
                  total: 1286,
                  page: 1,
                  pageSize: 20,
                  list: [
                    {
                      id: 'EMP001',
                      name: '张三',
                      department: '技术部',
                      position: '高级工程师',
                      email: 'zhangsan@company.com',
                      phone: '138****1234',
                      status: 'active'
                    },
                    {
                      id: 'EMP002', 
                      name: '李四',
                      department: '产品部',
                      position: '产品经理',
                      email: 'lisi@company.com',
                      phone: '139****5678',
                      status: 'active'
                    }
                  ]
                }
              }, null, 2)
            } else if (method === 'POST') {
              this.response.status = 201
              this.response.statusText = 'Created'
              this.response.body = JSON.stringify({
                code: 0,
                message: '员工创建成功',
                data: {
                  id: 'EMP' + Date.now(),
                  createTime: new Date().toISOString()
                }
              }, null, 2)
            }
          } else if (url.includes('/departments')) {
            this.response.status = 200
            this.response.statusText = 'OK'
            this.response.body = JSON.stringify({
              code: 0,
              message: 'success',
              data: [
                { id: 'DEPT001', name: '技术部', parentId: null, level: 1 },
                { id: 'DEPT002', name: '产品部', parentId: null, level: 1 },
                { id: 'DEPT003', name: '人事部', parentId: null, level: 1 }
              ]
            }, null, 2)
          } else {
            this.response.status = 404
            this.response.statusText = 'Not Found'
            this.response.body = JSON.stringify({
              code: 404,
              message: 'API接口不存在'
            }, null, 2)
          }

          // 模拟响应头
          this.response.headers = {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': '1000',
            'X-RateLimit-Remaining': '999',
            'X-Response-Time': `${this.response.time}ms`
          }

          // 模拟调试信息
          this.debugTiming = {
            dns: Math.floor(Math.random() * 50),
            connect: Math.floor(Math.random() * 100),
            ttfb: Math.floor(Math.random() * 200),
            download: Math.floor(Math.random() * 50)
          }

          resolve()
        }, 1000 + Math.random() * 1000) // 1-2秒随机延迟
      })
    },

    // 记录请求信息
    recordRequestInfo(url, requestOptions) {
      this.debugNetwork = {
        remoteAddress: 'api.er.com',
        protocol: 'HTTPS/1.1',
        ssl: true
      }
    },

    // 添加请求头
    addHeader() {
      this.requestConfig.headers.push({ key: '', value: '' })
    },

    // 移除请求头
    removeHeader(index) {
      this.requestConfig.headers.splice(index, 1)
    },

    // 添加请求参数
    addParam() {
      this.requestConfig.params.push({ key: '', value: '', type: 'query' })
    },

    // 移除请求参数
    removeParam(index) {
      this.requestConfig.params.splice(index, 1)
    },

    // 添加表单字段
    addFormField() {
      this.requestConfig.formData.push({ key: '', value: '' })
    },

    // 移除表单字段
    removeFormField(index) {
      this.requestConfig.formData.splice(index, 1)
    },

    // 格式化JSON
    formatJSON() {
      try {
        const parsed = JSON.parse(this.requestConfig.body)
        this.requestConfig.body = JSON.stringify(parsed, null, 2)
        this.$message.success('JSON格式化成功')
      } catch {
        this.$message.error('无效的JSON格式')
      }
    },

    // 验证JSON
    validateJSON() {
      try {
        JSON.parse(this.requestConfig.body)
        this.$message.success('JSON格式有效')
      } catch {
        this.$message.error('JSON格式无效')
      }
    },

    // 复制响应
    copyResponse() {
      if (this.response.body) {
        navigator.clipboard.writeText(this.formattedResponse)
          .then(() => this.$message.success('复制成功'))
          .catch(() => this.$message.error('复制失败'))
      }
    },

    // 下载响应
    downloadResponse() {
      const blob = new Blob([this.formattedResponse], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `api-response-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      this.$message.success('下载成功')
    },

    // 格式化响应
    formatResponse() {
      try {
        const parsed = JSON.parse(this.response.body)
        this.response.body = JSON.stringify(parsed, null, 2)
        this.$message.success('响应格式化成功')
      } catch {
        this.$message.error('响应不是有效的JSON格式')
      }
    },

    // 加载预设
    loadPreset(type) {
      switch (type) {
        case 'get-employees':
          this.requestConfig = {
            method: 'GET',
            url: '/employees',
            headers: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer YOUR_ACCESS_TOKEN' }
            ],
            params: [
              { key: 'page', value: '1', type: 'query' },
              { key: 'pageSize', value: '20', type: 'query' }
            ],
            bodyType: 'json',
            body: '',
            formData: []
          }
          break
        case 'create-employee':
          this.requestConfig = {
            method: 'POST',
            url: '/employees',
            headers: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer YOUR_ACCESS_TOKEN' }
            ],
            params: [],
            bodyType: 'json',
            body: JSON.stringify({
              name: '新员工',
              department: '技术部',
              position: '工程师',
              email: 'new@company.com',
              phone: '138****0000'
            }, null, 2),
            formData: []
          }
          break
        case 'update-employee':
          this.requestConfig = {
            method: 'PUT',
            url: '/employees/EMP001',
            headers: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer YOUR_ACCESS_TOKEN' }
            ],
            params: [
              { key: 'id', value: 'EMP001', type: 'path' }
            ],
            bodyType: 'json',
            body: JSON.stringify({
              name: '张三',
              department: '技术部',
              position: '高级工程师',
              email: 'zhangsan@company.com'
            }, null, 2),
            formData: []
          }
          break
      }
      this.$message.success('预设加载成功')
    },

    // 获取状态主题
    getStatusTheme(status) {
      if (status >= 200 && status < 300) return 'success'
      if (status >= 300 && status < 400) return 'warning'
      if (status >= 400 && status < 500) theme = 'warning'
      return 'danger'
    },

    // 获取方法主题
    getMethodTheme(method) {
      const themes = {
        'GET': 'success',
        'POST': 'primary',
        'PUT': 'warning',
        'DELETE': 'danger',
        'PATCH': 'warning'
      }
      return themes[method] || 'default'
    },

    // 获取状态样式类
    getStatusClass(status) {
      if (status >= 200 && status < 300) return 'status-success'
      if (status >= 300 && status < 400) return 'status-warning'
      if (status >= 400 && status < 500) return 'status-warning'
      return 'status-error'
    },

    // 格式化时间
    formatTime(time) {
      return new Date(time).toLocaleString('zh-CN')
    },

    // 保存到历史记录
    saveToHistory() {
      const historyItem = {
        method: this.requestConfig.method,
        url: this.requestConfig.url,
        headers: this.requestConfig.headers,
        params: this.requestConfig.params,
        body: this.requestConfig.body,
        status: this.response.status,
        time: this.response.time,
        timestamp: Date.now()
      }

      this.testHistory.unshift(historyItem)
      if (this.testHistory.length > 50) {
        this.testHistory = this.testHistory.slice(0, 50)
      }

      localStorage.setItem('api-test-history', JSON.stringify(this.testHistory))
    },

    // 从存储加载历史记录
    loadHistoryFromStorage() {
      const history = localStorage.getItem('api-test-history')
      if (history) {
        try {
          this.testHistory = JSON.parse(history)
        } catch {
          this.testHistory = []
        }
      }
    },

    // 显示历史记录
    loadHistory() {
      this.historyVisible = true
    },

    // 加载历史记录项
    loadHistoryItem(item) {
      this.requestConfig = {
        method: item.method,
        url: item.url,
        headers: [...item.headers],
        params: [...item.params],
        bodyType: 'json',
        body: item.body || '',
        formData: []
      }
      this.historyVisible = false
      this.$message.success('历史记录加载成功')
    },

    // 加载初始配置
    loadInitialConfig() {
      if (this.initialConfig) {
        this.requestConfig = { ...this.initialConfig }
      }
    },

    // 测试API工具类
    async testApiService() {
      try {
        this.$message.info('使用API工具类测试...')
        
        // 测试员工列表API
        const response = await this.$ER_API.employees.list({ page: 1, pageSize: 10 })
        
        // 设置请求配置以显示结果
        this.requestConfig = {
          method: 'GET',
          url: '/employees',
          headers: [
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Authorization', value: 'Bearer YOUR_ACCESS_TOKEN' }
          ],
          params: [
            { key: 'page', value: '1', type: 'query' },
            { key: 'pageSize', value: '10', type: 'query' }
          ],
          bodyType: 'json',
          body: '',
          formData: []
        }

        // 设置响应结果
        this.response.status = response.status
        this.response.statusText = response.statusText
        this.response.body = JSON.stringify(response.data, null, 2)
        this.response.headers = this.headersToObject(response.headers)
        this.response.time = Math.floor(Math.random() * 200) + 50

        this.$message.success('API工具类测试成功')
        
      } catch (error) {
        this.response.status = 500
        this.response.statusText = 'Error'
        this.response.body = JSON.stringify({
          error: error.message,
          code: 'API_SERVICE_ERROR'
        }, null, 2)
        this.response.headers = {}
        
        this.$message.error('API工具类测试失败: ' + error.message)
      }
    },

    // 测试插件功能
    testPluginFeatures() {
      // 测试通知服务
      this.$notification.success('这是成功通知')
      this.$notification.error('这是错误通知')
      this.$notification.warning('这是警告通知')
      this.$notification.info('这是信息通知')

      // 测试数据管理器
      this.$dataManager.setCache('test', { data: 'test data' })
      const cached = this.$dataManager.getCache('test')
      console.log('缓存数据:', cached)

      // 测试API便捷方法
      const token = this.$getToken()
      console.log('当前Token:', token)

      // 测试批量API调用
      this.$dataManager.batchOperation(
        [
          () => this.$api.get('/test1'),
          () => this.$api.get('/test2')
        ],
        this.$notification.success('批量操作完成')
      )

      this.$message.success('插件功能测试完成')
    },

    // Headers对象转换为普通对象
    headersToObject(headers) {
      const obj = {}
      headers.forEach((value, key) => {
        obj[key] = value
      })
      return obj
    },

    // 保存测试
    saveTest() {
      const testData = {
        name: `API测试_${new Date().toLocaleString('zh-CN')}`,
        request: this.requestConfig,
        response: this.response,
        timestamp: Date.now()
      }

      // 这里可以调用API保存到服务器
      localStorage.setItem(`test-${Date.now()}`, JSON.stringify(testData))
      this.$message.success('测试保存成功')
    }
  }
}
</script>

<style scoped>
.api-test-container {
  padding: 0;
  background-color: var(--td-bg-color-container);
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  color: white;
  padding: 32px 24px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section h1 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.title-section p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 测试接口布局 */
.test-interface {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* 面板样式 */
.request-panel, .response-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--td-component-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.response-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.response-time {
  font-size: 14px;
  color: var(--td-text-color-secondary);
}

/* 表单样式 */
.form-group {
  padding: 16px 24px;
  border-bottom: 1px solid var(--td-component-border);
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--td-text-color-primary);
  margin-bottom: 8px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.api-url-input {
  flex: 1;
}

/* 列表样式 */
.headers-list, .params-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-item, .param-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.form-data-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 编辑器样式 */
.json-editor, .raw-editor {
  position: relative;
}

.editor-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}

/* 发送按钮 */
.send-section {
  padding: 24px;
  margin-top: auto;
}

/* 响应面板 */
.response-body, .response-headers, .request-info, .debug-info {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--td-text-color-secondary);
}

.empty-state p {
  margin-top: 12px;
}

.response-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.response-actions {
  padding: 12px 24px;
  border-bottom: 1px solid var(--td-component-border);
  display: flex;
  gap: 8px;
}

.response-text {
  flex: 1;
  margin: 0;
  padding: 16px 24px;
  background: #f6f8fa;
  border: none;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow: auto;
}

/* 响应头表格 */
.headers-table {
  padding: 16px 24px;
  overflow: auto;
}

.header-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid var(--td-component-border);
}

.header-key {
  width: 200px;
  font-weight: 500;
  color: var(--td-text-color-primary);
}

.header-value {
  flex: 1;
  color: var(--td-text-color-secondary);
  word-break: break-all;
}

/* 请求信息 */
.request-info {
  padding: 16px 24px;
}

.info-item {
  margin-bottom: 16px;
}

.info-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--td-text-color-primary);
  margin-bottom: 4px;
}

.info-value {
  color: var(--td-text-color-secondary);
}

/* 调试信息 */
.timing-details, .network-details {
  padding: 16px 0;
}

.timing-item, .network-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--td-component-border);
}

.timing-item label, .network-item label {
  font-weight: 500;
  color: var(--td-text-color-primary);
}

/* 历史记录 */
.history-list {
  max-height: 600px;
  overflow-y: auto;
}

.history-item {
  padding: 16px;
  border-bottom: 1px solid var(--td-component-border);
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: var(--td-bg-color-container-hover);
}

.history-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.history-url {
  flex: 1;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
}

.history-time {
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

.history-meta {
  display: flex;
  gap: 12px;
  font-size: 14px;
}

.status-success { color: #52c41a; }
.status-warning { color: #faad14; }
.status-error { color: #ff4d4f; }

/* 响应式设计 */
@media (max-width: 1200px) {
  .test-interface .t-col:first-child {
    span: 24;
  }
  
  .test-interface .t-col:last-child {
    span: 24;
    margin-top: 24px;
  }
  
  .request-panel, .response-panel {
    height: auto;
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .header-item, .param-item, .form-field-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .response-actions {
    flex-wrap: wrap;
  }
}
</style>