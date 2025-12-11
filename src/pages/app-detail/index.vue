<template>
  <div class="app-detail-container">
    <!-- 头部 -->
    <div class="detail-header">
      <div class="header-content">
        <t-button theme="default" variant="text" @click="$router.back()" class="back-btn">
          <t-icon name="chevron-left" />返回
        </t-button>
        <div class="header-info" v-if="appInfo">
          <div class="app-icon" :class="appInfo.statusClass">
            <t-icon :name="appInfo.icon" size="32px" />
          </div>
          <div class="header-title">
            <h1>{{ appInfo.name }}</h1>
            <p>{{ appInfo.description }}</p>
          </div>
          <div class="app-status" :class="appInfo.statusClass">
            <t-icon :name="appInfo.status === 'approved' ? 'check-circle' : 'time'" size="16px" />
            {{ appInfo.statusText }}
          </div>
        </div>
      </div>
    </div>

    <!-- 应用详情内容 -->
    <div class="detail-content" v-if="appInfo">
      <div class="content-grid">
        <!-- 左侧主要信息 -->
        <div class="main-info">
          <!-- 基本信息卡片 -->
          <div class="info-card">
            <div class="card-header">
              <h2><t-icon name="info-circle" />基本信息</h2>
            </div>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">应用ID</span>
                <span class="info-value">{{ appInfo.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">应用名称</span>
                <span class="info-value">{{ appInfo.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">站点地址</span>
                <span class="info-value link">
                  <a :href="appInfo.siteUrl" target="_blank">{{ appInfo.siteUrl }}</a>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">应用描述</span>
                <span class="info-value">{{ appInfo.description }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">审核状态</span>
                <span class="info-value">
                  <span class="status-tag" :class="appInfo.statusClass">{{ appInfo.statusText }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- 凭证信息卡片 -->
          <div class="info-card" v-if="appInfo.status === 'approved'">
            <div class="card-header">
              <h2><t-icon name="secured" />应用凭证</h2>
              <span class="security-tip">
                <t-icon name="error-circle" size="14px" />
                请妥善保管，切勿泄露
              </span>
            </div>
            <div class="credentials-list">
              <div class="credential-item">
                <div class="credential-header">
                  <span class="credential-label">AppKey</span>
                  <div class="credential-actions">
                    <t-button size="small" variant="text" @click="toggleShow('appKey')">
                      <t-icon :name="showAppKey ? 'browse' : 'browse-off'" />
                      {{ showAppKey ? '隐藏' : '显示' }}
                    </t-button>
                    <t-button size="small" variant="text" @click="copyToClipboard(appInfo.appKey, 'AppKey')">
                      <t-icon name="copy" />复制
                    </t-button>
                  </div>
                </div>
                <div class="credential-value">
                  {{ showAppKey ? appInfo.appKey : maskKey(appInfo.appKey) }}
                </div>
              </div>
              <div class="credential-item">
                <div class="credential-header">
                  <span class="credential-label">AppSecret</span>
                  <div class="credential-actions">
                    <t-button size="small" variant="text" @click="toggleShow('appSecret')">
                      <t-icon :name="showAppSecret ? 'browse' : 'browse-off'" />
                      {{ showAppSecret ? '隐藏' : '显示' }}
                    </t-button>
                    <t-button size="small" variant="text" @click="copyToClipboard(appInfo.appSecret, 'AppSecret')">
                      <t-icon name="copy" />复制
                    </t-button>
                  </div>
                </div>
                <div class="credential-value">
                  {{ showAppSecret ? appInfo.appSecret : maskKey(appInfo.appSecret) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 审核中提示 -->
          <div class="info-card pending-card" v-else>
            <div class="pending-content">
              <t-icon name="time" size="48px" />
              <h3>应用正在审核中</h3>
              <p>您的申请正在审核中，预计1-3个工作日内完成审核。审核通过后将为您分配AppKey和AppSecret。</p>
            </div>
          </div>

          <!-- 已绑定的API和字段 -->
          <div class="info-card" v-if="appInfo.status === 'approved' && appInfo.bindingApis && appInfo.bindingApis.length > 0">
            <div class="card-header">
              <h2><t-icon name="api" />已绑定API</h2>
              <span class="binding-count">共 {{ appInfo.bindingApis.length }} 个API</span>
            </div>
            <div class="binding-api-list">
              <div 
                v-for="binding in appInfo.bindingApis" 
                :key="binding.apiId" 
                class="binding-api-item"
              >
                <div class="binding-api-header">
                  <span class="api-method" :class="binding.apiMethod">{{ binding.apiMethod }}</span>
                  <span class="api-name">{{ binding.apiName }}</span>
                  <span class="api-desc">{{ binding.apiDescription }}</span>
                </div>
                <div class="binding-fields">
                  <span class="fields-label">返回字段：</span>
                  <div class="fields-tags">
                    <t-tag 
                      v-for="field in binding.fields" 
                      :key="field" 
                      size="small" 
                      variant="light"
                      theme="primary"
                    >
                      {{ field }}
                    </t-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 未绑定API提示 -->
          <div class="info-card empty-binding" v-else-if="appInfo.status === 'approved'">
            <div class="empty-content">
              <t-icon name="api" size="48px" />
              <h3>暂未绑定API</h3>
              <p>该应用尚未绑定任何API接口，请先进行接口授权</p>
              <t-button theme="primary" @click="handleAuth">
                <t-icon name="lock-on" />立即授权
              </t-button>
            </div>
          </div>
        </div>

        <!-- 右侧快捷操作 -->
        <div class="side-actions">
          <div class="action-card">
            <h3>快捷操作</h3>
            <div class="action-list">
              <t-button 
                block 
                theme="primary" 
                @click="handleAuth"
                :disabled="appInfo.status !== 'approved'"
              >
                <t-icon name="lock-on" />接口授权
              </t-button>
              <t-button 
                block 
                theme="default" 
                @click="handleDebug"
                :disabled="appInfo.status !== 'approved'"
              >
                <t-icon name="play-circle" />在线调试
              </t-button>
              <t-button block theme="default" @click="handleViewDocs">
                <t-icon name="book" />查看文档
              </t-button>
            </div>
          </div>

          <div class="action-card" v-if="appInfo.status === 'approved'">
            <h3>使用统计</h3>
            <div class="stats-list">
              <div class="stat-item">
                <span class="stat-value">{{ stats.apiCalls }}</span>
                <span class="stat-label">今日调用</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.successRate }}%</span>
                <span class="stat-label">成功率</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.avgLatency }}ms</span>
                <span class="stat-label">平均延迟</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 应用不存在 -->
    <div class="not-found" v-else>
      <t-icon name="info-circle" size="64px" />
      <h2>应用不存在</h2>
      <p>未找到该应用信息</p>
      <t-button theme="primary" @click="$router.push('/my-apps')">返回应用列表</t-button>
    </div>
  </div>
</template>

<script>
import { Icon as TIcon } from 'tdesign-icons-vue'
import { MessagePlugin } from 'tdesign-vue'
import { getAppById } from '@/constants/approvedApps'

export default {
  name: 'AppDetail',
  components: {
    TIcon
  },
  data() {
    return {
      appInfo: null,
      showAppKey: false,
      showAppSecret: false,
      stats: {
        apiCalls: 1256,
        successRate: 99.2,
        avgLatency: 85
      }
    }
  },
  mounted() {
    const appId = this.$route.query.appId
    if (appId) {
      this.appInfo = getAppById(appId)
    }
  },
  methods: {
    maskKey(key) {
      if (!key) return '******'
      if (key.length <= 8) return '******'
      return key.substring(0, 4) + '****' + key.substring(key.length - 4)
    },
    toggleShow(type) {
      if (type === 'appKey') {
        this.showAppKey = !this.showAppKey
      } else {
        this.showAppSecret = !this.showAppSecret
      }
    },
    copyToClipboard(text, label) {
      navigator.clipboard.writeText(text).then(() => {
        MessagePlugin.success(`${label}已复制到剪贴板`)
      }).catch(() => {
        MessagePlugin.error('复制失败，请手动复制')
      })
    },
    handleAuth() {
      this.$router.push({
        path: '/api-auth',
        query: { appId: this.appInfo.id }
      })
    },
    handleDebug() {
      this.$router.push('/api-debug')
    },
    handleViewDocs() {
      this.$router.push('/api-docs')
    }
  }
}
</script>

<style scoped>
.app-detail-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.detail-header {
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  color: white;
  padding: 32px 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  color: white;
  margin-bottom: 16px;
}

.back-btn ::v-deep .t-button__text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.app-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
}

.header-title {
  flex: 1;
}

.header-title h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.header-title p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.app-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.2);
}

.app-status.approved {
  background: rgba(0, 168, 112, 0.3);
}

.app-status.pending {
  background: rgba(236, 144, 0, 0.3);
}

/* 内容区域 */
.detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.main-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 信息卡片 */
.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #262626;
  display: flex;
  align-items: center;
  gap: 8px;
}

.security-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ec9000;
  font-size: 13px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
}

.info-label {
  width: 100px;
  flex-shrink: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.info-value {
  flex: 1;
  color: #262626;
  font-size: 14px;
}

.info-value.link a {
  color: #0052d9;
  text-decoration: none;
}

.info-value.link a:hover {
  text-decoration: underline;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.status-tag.approved {
  background: rgba(0, 168, 112, 0.1);
  color: #00a870;
}

.status-tag.pending {
  background: rgba(236, 144, 0, 0.1);
  color: #ec9000;
}

/* 凭证信息 */
.credentials-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.credential-item {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
}

.credential-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.credential-label {
  font-size: 13px;
  color: #8c8c8c;
}

.credential-actions {
  display: flex;
  gap: 8px;
}

.credential-actions .t-button ::v-deep .t-button__text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.credential-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #262626;
  word-break: break-all;
}

/* 审核中卡片 */
.pending-card {
  text-align: center;
}

.pending-content {
  padding: 40px 20px;
}

.pending-content .t-icon {
  color: #ec9000;
  margin-bottom: 16px;
}

.pending-content h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #262626;
}

.pending-content p {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
  line-height: 1.6;
}

/* 已绑定API样式 */
.binding-count {
  font-size: 13px;
  color: #0052d9;
  background: rgba(0, 82, 217, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.binding-api-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.binding-api-item {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #0052d9;
}

.binding-api-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.api-method {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.api-method.GET { background: #e6fffb; color: #13c2c2; }
.api-method.POST { background: #f6ffed; color: #52c41a; }
.api-method.PUT { background: #fff7e6; color: #fa8c16; }
.api-method.DELETE { background: #fff1f0; color: #ff4d4f; }

.api-name {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.api-desc {
  font-size: 13px;
  color: #8c8c8c;
}

.binding-fields {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.fields-label {
  font-size: 13px;
  color: #8c8c8c;
  flex-shrink: 0;
  line-height: 24px;
}

.fields-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.binding-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
  text-align: right;
}

.binding-actions .t-button ::v-deep .t-button__text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 未绑定API提示 */
.empty-binding {
  text-align: center;
}

.empty-content {
  padding: 40px 20px;
}

.empty-content .t-icon {
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-content h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #262626;
}

.empty-content p {
  margin: 0 0 24px 0;
  color: #8c8c8c;
  font-size: 14px;
}

.empty-content .t-button ::v-deep .t-button__text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 右侧操作区 */
.side-actions {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.action-card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #262626;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-list .t-button ::v-deep .t-button__text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #0052d9;
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
}

/* 未找到 */
.not-found {
  text-align: center;
  padding: 100px 24px;
}

.not-found .t-icon {
  color: #d9d9d9;
  margin-bottom: 24px;
}

.not-found h2 {
  margin: 0 0 12px 0;
  color: #262626;
}

.not-found p {
  margin: 0 0 24px 0;
  color: #8c8c8c;
}

/* 响应式 */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .header-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-item {
    flex-direction: column;
    gap: 4px;
  }
  
  .info-label {
    width: auto;
  }
}
</style>
