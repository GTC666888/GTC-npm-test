<template>
  <div class="my-apps-container">
    <!-- 头部 -->
    <div class="apps-header">
      <div class="header-content">
        <t-button theme="default" variant="text" @click="$router.back()" class="back-btn">
          <t-icon name="chevron-left" />返回
        </t-button>
        <div class="header-title">
          <h1>我的应用</h1>
          <p>管理您已申请的应用和查看申请状态</p>
        </div>
        <div class="header-actions">
          <t-button theme="primary" @click="$router.push('/app-apply')">
            <t-icon name="add" />创建新应用
          </t-button>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-section">
      <div class="stats-card">
        <div class="stat-icon approved">
          <t-icon name="check-circle" size="24px" />
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ approvedApps.length }}</div>
          <div class="stat-label">已通过</div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stat-icon pending">
          <t-icon name="time" size="24px" />
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ pendingApps.length }}</div>
          <div class="stat-label">审核中</div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stat-icon total">
          <t-icon name="app" size="24px" />
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ allApps.length }}</div>
          <div class="stat-label">全部应用</div>
        </div>
      </div>
    </div>

    <!-- 应用列表 -->
    <div class="apps-content">
      <!-- 标签页切换 -->
      <div class="tabs-header">
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'approved' }"
          @click="activeTab = 'approved'"
        >
          <t-icon name="check-circle" />
          <span>我的应用</span>
          <span class="tab-count">{{ approvedApps.length }}</span>
        </div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'pending' }"
          @click="activeTab = 'pending'"
        >
          <t-icon name="time" />
          <span>申请中的应用</span>
          <span class="tab-count">{{ pendingApps.length }}</span>
        </div>
      </div>

      <!-- 已通过的应用 -->
      <div class="apps-list" v-show="activeTab === 'approved'">
        <div class="app-card" v-for="app in approvedApps" :key="app.id">
          <div class="app-icon" :class="app.statusClass">
            <t-icon :name="app.icon" size="32px" />
          </div>
          <div class="app-info">
            <div class="app-header">
              <h3>{{ app.name }}</h3>
              <div class="app-status approved">
                <t-icon name="check-circle" size="14px" />
                {{ app.statusText }}
              </div>
            </div>
            <p class="app-desc">{{ app.description }}</p>
            <div class="app-url">
              <t-icon name="link" size="14px" />
              <span>{{ app.siteUrl }}</span>
            </div>
            <div class="app-credentials">
              <div class="credential-item">
                <span class="credential-label">AppKey:</span>
                <span class="credential-value">{{ maskKey(app.appKey) }}</span>
                <t-icon name="copy" class="copy-icon" @click="copyToClipboard(app.appKey, 'AppKey')" />
              </div>
              <div class="credential-item">
                <span class="credential-label">AppSecret:</span>
                <span class="credential-value">{{ maskKey(app.appSecret) }}</span>
                <t-icon name="copy" class="copy-icon" @click="copyToClipboard(app.appSecret, 'AppSecret')" />
              </div>
            </div>
          </div>
          <div class="app-actions">
            <t-button theme="primary" variant="text" @click="handleAuth(app)">
              <t-icon name="lock-on" />接口授权
            </t-button>
            <t-button theme="default" variant="text" @click="handleDebug(app)">
              <t-icon name="play-circle" />在线调试
            </t-button>
          </div>
        </div>
        <div class="empty-state" v-if="approvedApps.length === 0">
          <t-icon name="inbox" size="48px" />
          <p>暂无已通过的应用</p>
          <t-button theme="primary" @click="$router.push('/app-apply')">创建新应用</t-button>
        </div>
      </div>

      <!-- 审核中的应用 -->
      <div class="apps-list" v-show="activeTab === 'pending'">
        <div class="app-card pending" v-for="app in pendingApps" :key="app.id">
          <div class="app-icon" :class="app.statusClass">
            <t-icon :name="app.icon" size="32px" />
          </div>
          <div class="app-info">
            <div class="app-header">
              <h3>{{ app.name }}</h3>
              <div class="app-status pending">
                <t-icon name="time" size="14px" />
                {{ app.statusText }}
              </div>
            </div>
            <p class="app-desc">{{ app.description }}</p>
            <div class="app-url">
              <t-icon name="link" size="14px" />
              <span>{{ app.siteUrl }}</span>
            </div>
            <div class="pending-info">
              <t-icon name="info-circle" size="14px" />
              <span>您的申请正在审核中，预计1-3个工作日内完成审核</span>
            </div>
          </div>
          <div class="app-actions">
            <t-button theme="default" variant="text" disabled>
              <t-icon name="time" />等待审核
            </t-button>
          </div>
        </div>
        <div class="empty-state" v-if="pendingApps.length === 0">
          <t-icon name="check-circle" size="48px" />
          <p>暂无审核中的应用</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon as TIcon } from 'tdesign-icons-vue'
import { MessagePlugin } from 'tdesign-vue'
import { APPROVED_APPS, getApprovedAppsList, getPendingAppsList } from '@/constants/approvedApps'

export default {
  name: 'MyApps',
  components: {
    TIcon
  },
  data() {
    return {
      activeTab: 'approved',
      allApps: APPROVED_APPS,
      approvedApps: getApprovedAppsList(),
      pendingApps: getPendingAppsList()
    }
  },
  methods: {
    maskKey(key) {
      if (!key) return ''
      if (key.length <= 8) return key
      return key.substring(0, 6) + '****' + key.substring(key.length - 4)
    },
    copyToClipboard(text, label) {
      navigator.clipboard.writeText(text).then(() => {
        MessagePlugin.success(`${label}已复制到剪贴板`)
      }).catch(() => {
        MessagePlugin.error('复制失败，请手动复制')
      })
    },
    handleAuth(app) {
      this.$router.push({
        path: '/api-auth',
        query: { appId: app.id }
      })
    },
    handleDebug(app) {
      this.$router.push('/api-debug')
    }
  }
}
</script>

<style scoped>
.my-apps-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.apps-header {
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  color: white;
  padding: 32px 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.back-btn {
  color: white;
  flex-shrink: 0;
}

.back-btn ::v-deep .t-button__text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
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

.header-actions {
  flex-shrink: 0;
}

.header-actions .t-button ::v-deep .t-button__text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 统计概览 */
.stats-section {
  max-width: 1200px;
  margin: -24px auto 24px;
  padding: 0 24px;
  display: flex;
  gap: 16px;
}

.stats-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.approved {
  background: rgba(0, 168, 112, 0.1);
  color: #00a870;
}

.stat-icon.pending {
  background: rgba(236, 144, 0, 0.1);
  color: #ec9000;
}

.stat-icon.total {
  background: rgba(0, 82, 217, 0.1);
  color: #0052d9;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #262626;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
}

/* 应用列表 */
.apps-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

.tabs-header {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.tab-item:hover {
  background: #f5f7fa;
}

.tab-item.active {
  background: #0052d9;
  color: white;
}

.tab-count {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.tab-item.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
}

.apps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.app-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.app-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.app-card.pending {
  opacity: 0.85;
}

.app-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.app-icon.approved {
  background: linear-gradient(135deg, #00a870 0%, #00c48c 100%);
  color: white;
}

.app-icon.pending {
  background: linear-gradient(135deg, #ec9000 0%, #f5a623 100%);
  color: white;
}

.app-info {
  flex: 1;
  min-width: 0;
}

.app-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.app-header h3 {
  margin: 0;
  font-size: 18px;
  color: #262626;
}

.app-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.app-status.approved {
  background: rgba(0, 168, 112, 0.1);
  color: #00a870;
}

.app-status.pending {
  background: rgba(236, 144, 0, 0.1);
  color: #ec9000;
}

.app-desc {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.app-url {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8c8c8c;
  font-size: 13px;
  margin-bottom: 12px;
}

.app-credentials {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.credential-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f7fa;
  padding: 8px 12px;
  border-radius: 6px;
}

.credential-label {
  color: #8c8c8c;
  font-size: 13px;
}

.credential-value {
  color: #262626;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
}

.copy-icon {
  color: #0052d9;
  cursor: pointer;
  transition: color 0.2s;
}

.copy-icon:hover {
  color: #0066ff;
}

.pending-info {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(236, 144, 0, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  color: #ec9000;
  font-size: 13px;
}

.app-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.app-actions .t-button ::v-deep .t-button__text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.empty-state {
  text-align: center;
  padding: 60px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.empty-state .t-icon {
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-state p {
  color: #8c8c8c;
  margin: 0 0 24px 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }
  
  .stats-section {
    flex-direction: column;
  }
  
  .app-card {
    flex-direction: column;
  }
  
  .app-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
  
  .app-credentials {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
