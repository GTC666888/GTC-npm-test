<template>
  <div class="token-container">
    <!-- 头部 -->
    <div class="token-header">
      <div class="header-content">
        <t-button theme="default" variant="text" @click="$router.back()" class="back-btn">
          <t-icon name="chevron-left" />返回
        </t-button>
        <div class="header-title">
          <h1>获取访问令牌</h1>
          <p>使用AppKey和AppSecret获取Access Token，用于API接口调用认证</p>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="token-content">
      <div class="content-wrapper">
        <!-- 左侧：获取Token -->
        <div class="main-panel">
          <!-- 凭证输入区 -->
          <div class="credential-section">
            <div class="section-header">
              <div class="section-icon">
                <t-icon name="secured" size="24px" />
              </div>
              <div class="section-info">
                <h2>应用凭证</h2>
                <p>输入您的AppKey和AppSecret以获取访问令牌</p>
              </div>
            </div>

            <t-form :data="credentials" :rules="credentialRules" ref="credentialForm" label-width="100px" class="credential-form">
              <t-form-item label="AppKey" name="appKey">
                <t-input 
                  v-model="credentials.appKey" 
                  placeholder="请输入AppKey" 
                  clearable
                  size="large"
                >
                  <template #prefix-icon>
                    <t-icon name="user" />
                  </template>
                </t-input>
              </t-form-item>

              <t-form-item label="AppSecret" name="appSecret">
                <t-input 
                  v-model="credentials.appSecret" 
                  :type="showSecret ? 'text' : 'password'"
                  placeholder="请输入AppSecret" 
                  clearable
                  size="large"
                >
                  <template #prefix-icon>
                    <t-icon name="lock-on" />
                  </template>
                  <template #suffix-icon>
                    <t-icon 
                      :name="showSecret ? 'browse' : 'browse-off'" 
                      @click="showSecret = !showSecret" 
                      style="cursor: pointer;"
                    />
                  </template>
                </t-input>
              </t-form-item>

              <t-form-item label="授权范围" name="scope">
                <t-select 
                  v-model="credentials.scope" 
                  placeholder="选择授权范围（可选）"
                  clearable
                  size="large"
                  multiple
                >
                  <t-option value="read" label="读取权限 (read)">
                    <div class="scope-option">
                      <span class="scope-name">读取权限</span>
                      <span class="scope-desc">read - 允许读取数据</span>
                    </div>
                  </t-option>
                  <t-option value="write" label="写入权限 (write)">
                    <div class="scope-option">
                      <span class="scope-name">写入权限</span>
                      <span class="scope-desc">write - 允许写入数据</span>
                    </div>
                  </t-option>
                  <t-option value="admin" label="管理权限 (admin)">
                    <div class="scope-option">
                      <span class="scope-name">管理权限</span>
                      <span class="scope-desc">admin - 允许管理操作</span>
                    </div>
                  </t-option>
                </t-select>
              </t-form-item>

              <div class="form-actions">
                <t-button 
                  theme="primary" 
                  size="large" 
                  block
                  @click="getAccessToken" 
                  :loading="loading"
                >
                  <t-icon name="play-circle" />获取访问令牌
                </t-button>
              </div>
            </t-form>
          </div>

          <!-- Token结果区 -->
          <div class="token-result-section" v-if="tokenData">
            <div class="section-header success">
              <div class="section-icon">
                <t-icon name="check-circle" size="24px" />
              </div>
              <div class="section-info">
                <h2>令牌获取成功</h2>
                <p>请妥善保管您的访问令牌，不要泄露给他人</p>
              </div>
            </div>

            <div class="token-info-card">
              <!-- Access Token -->
              <div class="token-field">
                <div class="field-header">
                  <span class="field-label">Access Token</span>
                  <div class="field-actions">
                    <t-button variant="text" size="small" @click="copyToClipboard(tokenData.accessToken, 'Access Token')">
                      <t-icon name="file-copy" />复制
                    </t-button>
                  </div>
                </div>
                <div class="field-value token-value">
                  <code>{{ tokenData.accessToken }}</code>
                </div>
              </div>

              <!-- Token类型 -->
              <div class="token-meta">
                <div class="meta-item">
                  <span class="meta-label">令牌类型</span>
                  <span class="meta-value">
                    <t-tag theme="primary" variant="light">{{ tokenData.tokenType }}</t-tag>
                  </span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">有效期</span>
                  <span class="meta-value">
                    <t-tag theme="success" variant="light">{{ tokenData.expiresIn }} 秒</t-tag>
                  </span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">过期时间</span>
                  <span class="meta-value">{{ tokenData.expiresAt }}</span>
                </div>
                <div class="meta-item" v-if="tokenData.scope">
                  <span class="meta-label">授权范围</span>
                  <span class="meta-value">
                    <t-tag v-for="s in tokenData.scope.split(' ')" :key="s" theme="warning" variant="light" style="margin-right: 4px;">{{ s }}</t-tag>
                  </span>
                </div>
              </div>

              <!-- Refresh Token（如果有） -->
              <div class="token-field" v-if="tokenData.refreshToken">
                <div class="field-header">
                  <span class="field-label">Refresh Token</span>
                  <div class="field-actions">
                    <t-button variant="text" size="small" @click="copyToClipboard(tokenData.refreshToken, 'Refresh Token')">
                      <t-icon name="file-copy" />复制
                    </t-button>
                  </div>
                </div>
                <div class="field-value token-value">
                  <code>{{ tokenData.refreshToken }}</code>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="token-actions">
                <t-button theme="default" @click="copyAllTokenInfo">
                  <t-icon name="file-copy" />复制全部信息
                </t-button>
                <t-button theme="primary" variant="outline" @click="refreshAccessToken" :loading="refreshing" v-if="tokenData.refreshToken">
                  <t-icon name="refresh" />刷新令牌
                </t-button>
                <t-button theme="danger" variant="outline" @click="clearToken">
                  <t-icon name="delete" />清除令牌
                </t-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：帮助说明 -->
        <div class="help-panel">
          <!-- 使用说明 -->
          <div class="help-card">
            <h3><t-icon name="help-circle" /> 使用说明</h3>
            <div class="help-content">
              <div class="help-step">
                <span class="step-num">1</span>
                <div class="step-content">
                  <strong>输入凭证</strong>
                  <p>填写您应用审核通过后获得的AppKey和AppSecret</p>
                </div>
              </div>
              <div class="help-step">
                <span class="step-num">2</span>
                <div class="step-content">
                  <strong>选择范围</strong>
                  <p>根据需要选择授权范围，默认为全部权限</p>
                </div>
              </div>
              <div class="help-step">
                <span class="step-num">3</span>
                <div class="step-content">
                  <strong>获取令牌</strong>
                  <p>点击按钮获取Access Token</p>
                </div>
              </div>
              <div class="help-step">
                <span class="step-num">4</span>
                <div class="step-content">
                  <strong>调用接口</strong>
                  <p>在API请求头中携带Token进行认证</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 请求示例 -->
          <div class="help-card">
            <h3><t-icon name="code" /> 请求示例</h3>
            <div class="code-block">
              <div class="code-header">
                <span>获取Token请求</span>
                <t-button variant="text" size="small" @click="copyRequestExample">
                  <t-icon name="file-copy" />
                </t-button>
              </div>
              <pre><code>POST /oauth/token HTTP/1.1
Host: api.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=YOUR_APP_KEY
&client_secret=YOUR_APP_SECRET
&scope=read write</code></pre>
            </div>
          </div>

          <!-- 使用Token示例 -->
          <div class="help-card">
            <h3><t-icon name="api" /> 使用Token</h3>
            <div class="code-block">
              <div class="code-header">
                <span>API调用示例</span>
                <t-button variant="text" size="small" @click="copyUsageExample">
                  <t-icon name="file-copy" />
                </t-button>
              </div>
              <pre><code>GET /api/v1/group/employees HTTP/1.1
Host: api.example.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json</code></pre>
            </div>
          </div>

          <!-- 安全提示 -->
          <div class="help-card warning">
            <h3><t-icon name="error-circle" /> 安全提示</h3>
            <ul class="warning-list">
              <li>Access Token 具有时效性，过期后需重新获取</li>
              <li>请勿将 AppSecret 暴露在前端代码中</li>
              <li>建议在服务端调用获取Token接口</li>
              <li>Token 泄露后请及时重置 AppSecret</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon as TIcon } from 'tdesign-icons-vue'
import { MessagePlugin } from 'tdesign-vue'

export default {
  name: 'Token',
  components: {
    TIcon
  },
  data() {
    return {
      loading: false,
      refreshing: false,
      showSecret: false,
      
      // 凭证输入
      credentials: {
        appKey: '',
        appSecret: '',
        scope: []
      },
      
      // 验证规则
      credentialRules: {
        appKey: [
          { required: true, message: '请输入AppKey', type: 'error' }
        ],
        appSecret: [
          { required: true, message: '请输入AppSecret', type: 'error' }
        ]
      },
      
      // Token数据
      tokenData: null
    }
  },
  methods: {
    // 获取访问令牌
    getAccessToken() {
      this.$refs.credentialForm.validate().then(result => {
        if (result !== true) {
          MessagePlugin.warning('请填写完整的凭证信息')
          return
        }
        
        this.loading = true
        
        // 模拟获取Token
        setTimeout(() => {
          const now = new Date()
          const expiresIn = 7200 // 2小时
          const expiresAt = new Date(now.getTime() + expiresIn * 1000)
          
          this.tokenData = {
            accessToken: this.generateToken(64),
            tokenType: 'Bearer',
            expiresIn: expiresIn,
            expiresAt: this.formatDateTime(expiresAt),
            scope: this.credentials.scope.length > 0 ? this.credentials.scope.join(' ') : 'read write admin',
            refreshToken: this.generateToken(48)
          }
          
          this.loading = false
          MessagePlugin.success('访问令牌获取成功！')
        }, 1500)
      })
    },
    
    // 刷新访问令牌
    refreshAccessToken() {
      if (!this.tokenData || !this.tokenData.refreshToken) {
        MessagePlugin.warning('没有可用的Refresh Token')
        return
      }
      
      this.refreshing = true
      
      // 模拟刷新Token
      setTimeout(() => {
        const now = new Date()
        const expiresIn = 7200
        const expiresAt = new Date(now.getTime() + expiresIn * 1000)
        
        this.tokenData.accessToken = this.generateToken(64)
        this.tokenData.expiresAt = this.formatDateTime(expiresAt)
        
        this.refreshing = false
        MessagePlugin.success('访问令牌已刷新！')
      }, 1000)
    },
    
    // 清除令牌
    clearToken() {
      this.tokenData = null
      MessagePlugin.info('令牌已清除')
    },
    
    // 生成随机Token
    generateToken(length) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    },
    
    // 格式化日期时间
    formatDateTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    
    // 复制到剪贴板
    copyToClipboard(text, name) {
      navigator.clipboard.writeText(text).then(() => {
        MessagePlugin.success(`${name} 已复制到剪贴板`)
      }).catch(() => {
        MessagePlugin.error('复制失败，请手动复制')
      })
    },
    
    // 复制全部Token信息
    copyAllTokenInfo() {
      if (!this.tokenData) return
      
      const info = `Access Token: ${this.tokenData.accessToken}
Token Type: ${this.tokenData.tokenType}
Expires In: ${this.tokenData.expiresIn} 秒
Expires At: ${this.tokenData.expiresAt}
Scope: ${this.tokenData.scope}
${this.tokenData.refreshToken ? 'Refresh Token: ' + this.tokenData.refreshToken : ''}`
      
      this.copyToClipboard(info, '令牌信息')
    },
    
    // 复制请求示例
    copyRequestExample() {
      const example = `POST /oauth/token HTTP/1.1
Host: api.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=YOUR_APP_KEY&client_secret=YOUR_APP_SECRET&scope=read write`
      this.copyToClipboard(example, '请求示例')
    },
    
    // 复制使用示例
    copyUsageExample() {
      const example = `GET /api/v1/group/employees HTTP/1.1
Host: api.example.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json`
      this.copyToClipboard(example, '使用示例')
    }
  }
}
</script>

<style scoped>
.token-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.token-header {
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  color: white;
  padding: 32px 24px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.back-btn {
  color: white;
  margin-bottom: 16px;
}

.header-title h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
}

.header-title p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.token-content {
  max-width: 1400px;
  margin: -40px auto 0;
  padding: 0 24px 48px;
}

.content-wrapper {
  display: flex;
  gap: 24px;
}

.main-panel {
  flex: 1;
  min-width: 0;
}

.help-panel {
  width: 360px;
  flex-shrink: 0;
}

/* 凭证输入区 */
.credential-section,
.token-result-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header.success .section-icon {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.section-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.section-info h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #262626;
}

.section-info p {
  margin: 0;
  font-size: 14px;
  color: #8c8c8c;
}

.credential-form {
  max-width: 600px;
}

.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

/* Token结果区 */
.token-info-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 24px;
}

.token-field {
  margin-bottom: 20px;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #595959;
}

.field-value {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px 16px;
}

.field-value.token-value {
  overflow-x: auto;
}

.field-value code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #0052d9;
  word-break: break-all;
}

.token-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 12px;
  color: #8c8c8c;
}

.meta-value {
  font-size: 14px;
  color: #262626;
}

.token-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

/* 帮助面板 */
.help-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.help-card.warning {
  background: #fffbe6;
  border: 1px solid #ffe58f;
}

.help-card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #262626;
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-card.warning h3 {
  color: #d48806;
}

.help-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.help-step {
  display: flex;
  gap: 12px;
}

.step-num {
  width: 24px;
  height: 24px;
  background: #0052d9;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content strong {
  display: block;
  font-size: 14px;
  color: #262626;
  margin-bottom: 4px;
}

.step-content p {
  margin: 0;
  font-size: 13px;
  color: #8c8c8c;
}

.code-block {
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #2d2d2d;
  color: #8c8c8c;
  font-size: 12px;
}

.code-header .t-button {
  color: #8c8c8c;
}

.code-block pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #d4d4d4;
  line-height: 1.6;
}

.warning-list {
  margin: 0;
  padding-left: 20px;
}

.warning-list li {
  font-size: 13px;
  color: #d48806;
  margin-bottom: 8px;
  line-height: 1.5;
}

.warning-list li:last-child {
  margin-bottom: 0;
}

.scope-option {
  display: flex;
  flex-direction: column;
}

.scope-name {
  font-weight: 500;
}

.scope-desc {
  font-size: 12px;
  color: #8c8c8c;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .help-panel {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .token-meta {
    grid-template-columns: 1fr;
  }
  
  .token-actions {
    flex-direction: column;
  }
  
  .token-actions .t-button {
    width: 100%;
  }
}
</style>
