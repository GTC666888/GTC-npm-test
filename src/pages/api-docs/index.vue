<template>
  <div class="api-docs-container">
    <!-- 头部导航 -->
    <div class="docs-header">
      <div class="header-content">
        <div class="header-left">
          <t-button theme="default" variant="text" @click="goBack">
            <template #icon><t-icon name="chevron-left" /></template>
            返回
          </t-button>
        </div>
        <div class="header-center">
          <h1 class="docs-title">API 文档中心</h1>
          <p class="docs-subtitle">ER领域主数据接口文档</p>
        </div>
        <div class="header-right">
          <t-input
            v-model="searchKeyword"
            placeholder="搜索API..."
            clearable
            style="width: 280px"
          >
            <template #prefix-icon><t-icon name="search" /></template>
          </t-input>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="stat-item">
        <div class="stat-value">{{ totalCategories }}</div>
        <div class="stat-label">API分类</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ totalApis }}</div>
        <div class="stat-label">接口总数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ totalFields }}</div>
        <div class="stat-label">字段总数</div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="docs-main">
      <!-- 左侧分类导航 -->
      <div class="docs-sidebar">
        <div class="sidebar-title">API分类</div>
        <div class="category-nav">
          <div
            v-for="category in categories"
            :key="category.key"
            class="nav-category"
            :class="{ active: activeCategory === category.key }"
            @click="scrollToCategory(category.key)"
          >
            <div class="nav-category-header">
              <div class="nav-icon" :class="category.key">
                <t-icon :name="category.icon" />
              </div>
              <span class="nav-name">{{ category.name }}</span>
              <span class="nav-count">{{ category.apis.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧文档内容 -->
      <div class="docs-content" ref="docsContent">
        <!-- 分类区块 -->
        <div
          v-for="category in filteredCategories"
          :key="category.key"
          :ref="'category-' + category.key"
          class="category-section"
        >
          <!-- 一级：分类标题 -->
          <div class="category-header" :class="category.key">
            <div class="category-icon" :class="category.key">
              <t-icon :name="category.icon" size="28px" />
            </div>
            <div class="category-info">
              <h2 class="category-name">{{ category.name }}</h2>
              <p class="category-desc">{{ category.erList.join('、') }}</p>
              <div class="category-stats">
                <span class="stat-badge">{{ category.apis.length }} 个接口</span>
                <span class="stat-badge">{{ getCategoryFieldCount(category) }} 个字段</span>
              </div>
            </div>
            <div class="category-actions">
              <t-button 
                size="small" 
                theme="default"
                @click="toggleCategoryExpand(category.key)"
              >
                {{ expandedCategories[category.key] ? '收起全部' : '展开全部' }}
                <template #suffix>
                  <t-icon :name="expandedCategories[category.key] ? 'chevron-up' : 'chevron-down'" />
                </template>
              </t-button>
            </div>
          </div>

          <!-- 二级：API列表 -->
          <div class="api-list">
            <div
              v-for="api in category.apis"
              :key="api.id"
              class="api-card"
              :class="{ expanded: expandedApis[api.id] }"
            >
              <!-- API 头部 -->
              <div class="api-header" @click="toggleApiExpand(api.id)">
                <div class="api-method" :class="api.method">{{ api.method }}</div>
                <div class="api-path">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
                <div class="api-metrics-mini">
                  <span class="metric-time">{{ api.avgResponseTime }}ms</span>
                  <span class="metric-rate" :class="{ high: api.successRate >= 99 }">{{ api.successRate }}%</span>
                </div>
                <t-icon 
                  :name="expandedApis[api.id] ? 'chevron-up' : 'chevron-down'" 
                  class="expand-icon"
                />
              </div>

              <!-- API 详情（展开后显示） -->
              <div v-if="expandedApis[api.id]" class="api-detail">
                <!-- 字段列表 -->
                <div class="fields-section">
                  <div class="section-title">
                    <t-icon name="view-list" />
                    <span>请求字段 ({{ api.fields ? api.fields.length : 0 }})</span>
                  </div>
                  <div class="fields-table" v-if="api.fields && api.fields.length > 0">
                    <div class="table-header">
                      <div class="col-name">字段名</div>
                      <div class="col-type">类型</div>
                      <div class="col-required">必填</div>
                      <div class="col-desc">描述</div>
                    </div>
                    <div 
                      v-for="field in api.fields" 
                      :key="field.name" 
                      class="table-row"
                    >
                      <div class="col-name">
                        <code>{{ field.name }}</code>
                        <span class="field-label">{{ field.label }}</span>
                      </div>
                      <div class="col-type">
                        <span class="type-tag" :class="field.type">{{ field.type }}</span>
                      </div>
                      <div class="col-required">
                        <span v-if="field.required" class="required-yes">是</span>
                        <span v-else class="required-no">否</span>
                      </div>
                      <div class="col-desc">{{ field.description }}</div>
                    </div>
                  </div>
                  <div v-else class="no-fields">暂无字段信息</div>
                </div>

                <!-- 操作按钮 -->
                <div class="api-actions">
                  <t-button theme="primary" size="small" @click="handleTryApi(api)">
                    <template #icon><t-icon name="play-circle" /></template>
                    在线调试
                  </t-button>
                  <t-button theme="default" size="small" @click="handleViewDetail(api, category.key)">
                    <template #icon><t-icon name="file" /></template>
                    查看详情
                  </t-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 无搜索结果 -->
        <div v-if="filteredCategories.length === 0" class="no-results">
          <t-icon name="search" size="48px" />
          <p>未找到匹配的API</p>
          <t-button theme="primary" @click="searchKeyword = ''">清除搜索</t-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon as TIcon } from 'tdesign-icons-vue'
import { ER_CATEGORIES, getApiCategoriesArray, getTotalApiCount } from '@/constants/erCategories'

export default {
  name: 'ApiDocs',
  components: {
    TIcon
  },
  data() {
    return {
      searchKeyword: '',
      activeCategory: 'groupEmployment',
      expandedCategories: {
        groupEmployment: false,
        informalEmployment: false,
        compliance: false,
        jingman: false
      },
      expandedApis: {}
    }
  },
  computed: {
    categories() {
      return getApiCategoriesArray()
    },
    totalCategories() {
      return this.categories.length
    },
    totalApis() {
      return getTotalApiCount()
    },
    totalFields() {
      let count = 0
      this.categories.forEach(cat => {
        cat.apis.forEach(api => {
          if (api.fields) {
            count += api.fields.length
          }
        })
      })
      return count
    },
    filteredCategories() {
      if (!this.searchKeyword.trim()) {
        return this.categories
      }
      
      const keyword = this.searchKeyword.toLowerCase()
      return this.categories.map(category => {
        const filteredApis = category.apis.filter(api => 
          api.name.toLowerCase().includes(keyword) ||
          api.description.toLowerCase().includes(keyword) ||
          api.method.toLowerCase().includes(keyword) ||
          (api.fields && api.fields.some(f => 
            f.name.toLowerCase().includes(keyword) ||
            f.label.toLowerCase().includes(keyword) ||
            f.description.toLowerCase().includes(keyword)
          ))
        )
        return {
          ...category,
          apis: filteredApis
        }
      }).filter(category => category.apis.length > 0)
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    scrollToCategory(categoryKey) {
      this.activeCategory = categoryKey
      const ref = this.$refs['category-' + categoryKey]
      if (ref && ref[0]) {
        ref[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      let currentCategory = 'groupEmployment'
      
      this.categories.forEach(category => {
        const ref = this.$refs['category-' + category.key]
        if (ref && ref[0]) {
          const rect = ref[0].getBoundingClientRect()
          if (rect.top <= 150) {
            currentCategory = category.key
          }
        }
      })
      
      this.activeCategory = currentCategory
    },
    toggleCategoryExpand(categoryKey) {
      this.expandedCategories[categoryKey] = !this.expandedCategories[categoryKey]
      
      // 展开/收起该分类下所有API
      const category = this.categories.find(c => c.key === categoryKey)
      if (category) {
        category.apis.forEach(api => {
          this.$set(this.expandedApis, api.id, this.expandedCategories[categoryKey])
        })
      }
    },
    toggleApiExpand(apiId) {
      this.$set(this.expandedApis, apiId, !this.expandedApis[apiId])
    },
    getCategoryFieldCount(category) {
      let count = 0
      category.apis.forEach(api => {
        if (api.fields) {
          count += api.fields.length
        }
      })
      return count
    },
    handleTryApi(api) {
      this.$router.push({
        path: '/api-debug',
        query: {
          url: `https://api.er.com/v1${api.name.replace('/api', '')}`,
          method: api.method,
          apiName: api.description,
          apiId: api.id,
          locked: 'true'
        }
      })
    },
    handleViewDetail(api, categoryKey) {
      this.$router.push({
        name: 'ApiDetail',
        query: {
          apiId: api.id,
          systemType: categoryKey
        }
      })
    }
  }
}
</script>

<style scoped>
.api-docs-container {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 头部样式 */
.docs-header {
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  color: white;
  padding: 24px;
}

.header-content {
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  width: 200px;
}

.header-center {
  text-align: center;
  flex: 1;
}

.docs-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.docs-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.header-right {
  width: 300px;
  display: flex;
  justify-content: flex-end;
}

/* 统计概览 */
.stats-overview {
  max-width: 1920px;
  margin: -20px auto 0;
  padding: 0 24px;
  display: flex;
  gap: 20px;
  position: relative;
  z-index: 10;
}

.stat-item {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #0052d9;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 主内容区域 */
.docs-main {
  max-width: 1920px;
  margin: 24px auto 0;
  padding: 0 24px 48px;
  display: flex;
  gap: 24px;
}

/* 左侧导航 */
.docs-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  height: fit-content;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.category-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-category {
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-category:hover {
  background: #f5f7fa;
}

.nav-category.active {
  background: #e6f4ff;
}

.nav-category-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.nav-icon.groupEmployment { background: #e6f7ff; color: #1890ff; }
.nav-icon.informalEmployment { background: #f6ffed; color: #52c41a; }
.nav-icon.compliance { background: #fff1f0; color: #ff4d4f; }
.nav-icon.jingman { background: #f9f0ff; color: #722ed1; }

.nav-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.nav-count {
  font-size: 12px;
  color: #999;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 右侧文档内容 */
.docs-content {
  flex: 1;
  min-width: 0;
}

/* 分类区块 */
.category-section {
  margin-bottom: 32px;
}

.category-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

.category-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-icon.groupEmployment { background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%); color: #1890ff; }
.category-icon.informalEmployment { background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%); color: #52c41a; }
.category-icon.compliance { background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%); color: #ff4d4f; }
.category-icon.jingman { background: linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%); color: #722ed1; }

.category-info {
  flex: 1;
}

.category-name {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #333;
}

.category-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
}

.category-stats {
  display: flex;
  gap: 12px;
}

.stat-badge {
  font-size: 12px;
  color: #666;
  background: #f5f7fa;
  padding: 4px 10px;
  border-radius: 12px;
}

/* API列表 */
.api-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.api-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.2s;
}

.api-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.api-card.expanded {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.api-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.api-header:hover {
  background: #fafafa;
}

.api-method {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  min-width: 56px;
  text-align: center;
}

.api-method.GET { background: #e6fffb; color: #13c2c2; }
.api-method.POST { background: #f6ffed; color: #52c41a; }
.api-method.PUT { background: #fff7e6; color: #fa8c16; }
.api-method.DELETE { background: #fff1f0; color: #ff4d4f; }

.api-path {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  min-width: 240px;
}

.api-desc {
  flex: 1;
  font-size: 13px;
  color: #666;
}

.api-metrics-mini {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.metric-time {
  color: #999;
}

.metric-rate {
  color: #52c41a;
  font-weight: 500;
}

.metric-rate.high {
  color: #52c41a;
}

.expand-icon {
  color: #999;
  transition: transform 0.2s;
}

/* API详情 */
.api-detail {
  border-top: 1px solid #f0f0f0;
  padding: 20px;
  background: #fafafa;
}

.fields-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.section-title .t-icon {
  color: #0052d9;
}

.fields-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.table-header {
  display: flex;
  background: #fafafa;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  border-bottom: 1px solid #e8e8e8;
}

.table-row {
  display: flex;
  padding: 12px 16px;
  font-size: 13px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #fafafa;
}

.col-name {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.col-name code {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  color: #d4380d;
  background: #fff2e8;
  padding: 2px 6px;
  border-radius: 4px;
}

.field-label {
  font-size: 11px;
  color: #999;
}

.col-type {
  width: 100px;
}

.type-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.type-tag.string { background: #e6f7ff; color: #1890ff; }
.type-tag.number { background: #f6ffed; color: #52c41a; }
.type-tag.boolean { background: #fff7e6; color: #fa8c16; }
.type-tag.date { background: #f9f0ff; color: #722ed1; }
.type-tag.array { background: #fff1f0; color: #ff4d4f; }
.type-tag.object { background: #f0f5ff; color: #2f54eb; }
.type-tag.file { background: #e6fffb; color: #13c2c2; }

.col-required {
  width: 60px;
  text-align: center;
}

.required-yes {
  color: #ff4d4f;
  font-weight: 500;
}

.required-no {
  color: #999;
}

.col-desc {
  flex: 1;
  color: #666;
}

.no-fields {
  padding: 24px;
  text-align: center;
  color: #999;
  background: white;
  border-radius: 8px;
  border: 1px dashed #d9d9d9;
}

.api-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

/* 无搜索结果 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #999;
}

.no-results .t-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-results p {
  margin: 0 0 20px 0;
  font-size: 16px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .docs-sidebar {
    width: 240px;
  }
  
  .api-path {
    min-width: 180px;
  }
}

@media (max-width: 1024px) {
  .docs-sidebar {
    display: none;
  }
  
  .stats-overview {
    flex-wrap: wrap;
  }
  
  .stat-item {
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-left, .header-right {
    width: 100%;
  }
  
  .header-right {
    justify-content: center;
  }
  
  .stats-overview {
    flex-direction: column;
  }
  
  .api-header {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .api-path {
    min-width: 100%;
    order: 2;
  }
  
  .api-desc {
    order: 3;
    width: 100%;
  }
  
  .api-metrics-mini {
    order: 1;
  }
  
  .table-header,
  .table-row {
    flex-wrap: wrap;
  }
  
  .col-name {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .col-type,
  .col-required {
    width: auto;
  }
  
  .col-desc {
    width: 100%;
    margin-top: 8px;
  }
}
</style>
