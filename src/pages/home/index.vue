<template>
  <div class="api-documentation-container">
    <!-- 头部导航 -->
    <div class="doc-header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="doc-title">ER API Center</h1>
          <p class="doc-subtitle">企业资源领域API集成平台</p>
        </div>
        <div class="header-actions">
          <t-button theme="primary" @click="handleGetStarted">
            <template #icon><t-icon name="play-circle" /></template>
            快速开始
          </t-button>
          <t-button theme="default" @click="handleViewDocs">
            <template #icon><t-icon name="book" /></template>
            查看文档
          </t-button>
        </div>
      </div>
    </div>

    <!-- API概览统计 -->
    <div class="api-overview">
      <t-row :gutter="20">
        <t-col :span="3">
          <div class="overview-card">
            <div class="overview-icon primary">
              <t-icon name="api" />
            </div>
            <div class="overview-content">
              <div class="overview-value">{{ apiStats.total }}</div>
              <div class="overview-label">API总数</div>
            </div>
          </div>
        </t-col>
        <t-col :span="3">
          <div class="overview-card">
            <div class="overview-icon success">
              <t-icon name="check-circle" />
            </div>
            <div class="overview-content">
              <div class="overview-value">{{ apiStats.production }}</div>
              <div class="overview-label">生产环境</div>
            </div>
          </div>
        </t-col>
        <t-col :span="3">
          <div class="overview-card">
            <div class="overview-icon warning">
              <t-icon name="user" />
            </div>
            <div class="overview-content">
              <div class="overview-value">{{ apiStats.developers }}</div>
              <div class="overview-label">开发者数量</div>
            </div>
          </div>
        </t-col>
        <t-col :span="3">
          <div class="overview-card">
            <div class="overview-icon info">
              <t-icon name="time" />
            </div>
            <div class="overview-content">
              <div class="overview-value">{{ apiStats.uptime }}%</div>
              <div class="overview-label">服务可用性</div>
            </div>
          </div>
        </t-col>
      </t-row>
    </div>

    <!-- API分类展示 -->
    <div class="api-categories">
      <div class="section-header">
        <h2>API分类</h2>
        <p>按业务领域分类的API接口</p>
      </div>
      
      <div class="category-grid">
        <!-- 员工管理API -->
        <div class="category-card">
          <div class="category-header">
            <div class="category-icon employee">
              <t-icon name="usergroup" />
            </div>
            <div class="category-info">
              <h3>员工管理</h3>
              <span class="api-count">{{ apiCategories.employee.count }} 个API</span>
            </div>
          </div>
          <div class="category-apis">
            <div v-for="api in apiCategories.employee.apis" :key="api.name" class="api-item">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
        </div>

        <!-- 组织架构API -->
        <div class="category-card">
          <div class="category-header">
            <div class="category-icon organization">
              <t-icon name="chart" />
            </div>
            <div class="category-info">
              <h3>组织架构</h3>
              <span class="api-count">{{ apiCategories.organization.count }} 个API</span>
            </div>
          </div>
          <div class="category-apis">
            <div v-for="api in apiCategories.organization.apis" :key="api.name" class="api-item">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
        </div>

        <!-- 考勤管理API -->
        <div class="category-card">
          <div class="category-header">
            <div class="category-icon attendance">
              <t-icon name="time" />
            </div>
            <div class="category-info">
              <h3>考勤管理</h3>
              <span class="api-count">{{ apiCategories.attendance.count }} 个API</span>
            </div>
          </div>
          <div class="category-apis">
            <div v-for="api in apiCategories.attendance.apis" :key="api.name" class="api-item">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
        </div>

        <!-- 薪酬福利API -->
        <div class="category-card">
          <div class="category-header">
            <div class="category-icon compensation">
              <t-icon name="money-circle" />
            </div>
            <div class="category-info">
              <h3>薪酬福利</h3>
              <span class="api-count">{{ apiCategories.compensation.count }} 个API</span>
            </div>
          </div>
          <div class="category-apis">
            <div v-for="api in apiCategories.compensation.apis" :key="api.name" class="api-item">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
        </div>

        <!-- 绩效管理API -->
        <div class="category-card">
          <div class="category-header">
            <div class="category-icon performance">
              <t-icon name="chart-line" />
            </div>
            <div class="category-info">
              <h3>绩效管理</h3>
              <span class="api-count">{{ apiCategories.performance.count }} 个API</span>
            </div>
          </div>
          <div class="category-apis">
            <div v-for="api in apiCategories.performance.apis" :key="api.name" class="api-item">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
        </div>

        <!-- 培训发展API -->
        <div class="category-card">
          <div class="category-header">
            <div class="category-icon training">
              <t-icon name="graduation-cap" />
            </div>
            <div class="category-info">
              <h3>培训发展</h3>
              <span class="api-count">{{ apiCategories.training.count }} 个API</span>
            </div>
          </div>
          <div class="category-apis">
            <div v-for="api in apiCategories.training.apis" :key="api.name" class="api-item">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 开发指南 -->
    <div class="developer-guide">
      <div class="section-header">
        <h2>开发者指南</h2>
        <p>快速了解如何使用ER API</p>
      </div>
      
      <div class="guide-steps">
        <div class="step-card">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>申请应用</h3>
            <p>注册开发者账号并创建应用，获取AppKey和AppSecret</p>
            <t-button theme="primary" size="small" @click="handleStepGuide('apply')">
              立即申请
            </t-button>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>接口授权</h3>
            <p>配置应用权限，申请需要调用的API接口访问权限</p>
            <t-button theme="primary" size="small" @click="handleStepGuide('auth')">
              查看教程
            </t-button>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>获取令牌</h3>
            <p>使用AppKey和AppSecret获取访问令牌(Access Token)</p>
            <t-button theme="primary" size="small" @click="handleStepGuide('token')">
              Token文档
            </t-button>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">4</div>
          <div class="step-content">
            <h3>调用接口</h3>
            <p>使用Access Token调用API接口，支持多种编程语言</p>
            <t-button theme="primary" size="small" @click="handleStepGuide('call')">
              代码示例
            </t-button>
          </div>
        </div>
      </div>
    </div>

    <!-- API调用示例 -->
    <div class="api-examples">
      <div class="section-header">
        <h2>调用示例</h2>
        <p>查看不同编程语言的API调用代码示例</p>
      </div>

      <t-tabs v-model="activeTab" theme="card">
        <t-tab-panel value="curl" label="cURL">
          <div class="code-example">
            <pre><code>{{ codeExamples.curl }}</code></pre>
          </div>
        </t-tab-panel>
        <t-tab-panel value="javascript" label="JavaScript">
          <div class="code-example">
            <pre><code>{{ codeExamples.javascript }}</code></pre>
          </div>
        </t-tab-panel>
        <t-tab-panel value="python" label="Python">
          <div class="code-example">
            <pre><code>{{ codeExamples.python }}</code></pre>
          </div>
        </t-tab-panel>
        <t-tab-panel value="java" label="Java">
          <div class="code-example">
            <pre><code>{{ codeExamples.java }}</code></pre>
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>

    <!-- API状态监控 -->
    <div class="api-status">
      <div class="section-header">
        <h2>服务状态</h2>
        <p>实时API服务状态和性能监控</p>
      </div>

      <div class="status-grid">
        <div class="status-item">
          <div class="status-indicator online"></div>
          <div class="status-info">
            <div class="status-title">员工管理API</div>
            <div class="status-desc">响应时间: {{ apiStatus.employee.responseTime }}ms</div>
          </div>
          <t-tag theme="success">正常</t-tag>
        </div>

        <div class="status-item">
          <div class="status-indicator online"></div>
          <div class="status-info">
            <div class="status-title">组织架构API</div>
            <div class="status-desc">响应时间: {{ apiStatus.organization.responseTime }}ms</div>
          </div>
          <t-tag theme="success">正常</t-tag>
        </div>

        <div class="status-item">
          <div class="status-indicator warning"></div>
          <div class="status-info">
            <div class="status-title">考勤管理API</div>
            <div class="status-desc">响应时间: {{ apiStatus.attendance.responseTime }}ms</div>
          </div>
          <t-tag theme="warning">缓慢</t-tag>
        </div>

        <div class="status-item">
          <div class="status-indicator online"></div>
          <div class="status-info">
            <div class="status-title">薪酬福利API</div>
            <div class="status-desc">响应时间: {{ apiStatus.compensation.responseTime }}ms</div>
          </div>
          <t-tag theme="success">正常</t-tag>
        </div>
      </div>
    </div>

    <!-- 支持与帮助 -->
    <div class="support-section">
      <div class="section-header">
        <h2>支持与帮助</h2>
        <p>获取技术支持和帮助资源</p>
      </div>

      <div class="support-grid">
        <div class="support-card">
          <t-icon name="help-circle" size="48px" />
          <h3>帮助文档</h3>
          <p>详细的API文档和使用指南</p>
          <t-button theme="default" @click="handleSupport('docs')">查看文档</t-button>
        </div>

        <div class="support-card">
          <t-icon name="service" size="48px" />
          <h3>技术支持</h3>
          <p>7x24小时技术支持服务</p>
          <t-button theme="default" @click="handleSupport('support')">联系支持</t-button>
        </div>

        <div class="support-card">
          <t-icon name="chat" size="48px" />
          <h3>开发者社区</h3>
          <p>与其他开发者交流经验</p>
          <t-button theme="default" @click="handleSupport('community')">加入社区</t-button>
        </div>

        <div class="support-card">
          <t-icon name="mail" size="48px" />
          <h3>意见反馈</h3>
          <p>向我们提供宝贵的意见和建议</p>
          <t-button theme="default" @click="handleSupport('feedback')">提交反馈</t-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon as TIcon } from 'tdesign-icons-vue'

export default {
  name: 'ApiDocumentation',
  components: {
    TIcon
  },
  data() {
    return {
      activeTab: 'curl',
      
      // API统计数据
      apiStats: {
        total: 128,
        production: 96,
        developers: 356,
        uptime: 99.9
      },

      // API分类数据
      apiCategories: {
        employee: {
          count: 24,
          apis: [
            { method: 'GET', name: '/api/employees', description: '获取员工列表' },
            { method: 'POST', name: '/api/employees', description: '创建新员工' },
            { method: 'PUT', name: '/api/employees/{id}', description: '更新员工信息' }
          ]
        },
        organization: {
          count: 18,
          apis: [
            { method: 'GET', name: '/api/departments', description: '获取部门列表' },
            { method: 'GET', name: '/api/positions', description: '获取职位信息' },
            { method: 'POST', name: '/api/departments', description: '创建新部门' }
          ]
        },
        attendance: {
          count: 22,
          apis: [
            { method: 'GET', name: '/api/attendance/records', description: '获取考勤记录' },
            { method: 'POST', name: '/api/attendance/checkin', description: '员工打卡' },
            { method: 'GET', name: '/api/attendance/summary', description: '考勤统计' }
          ]
        },
        compensation: {
          count: 20,
          apis: [
            { method: 'GET', name: '/api/salary', description: '获取薪资信息' },
            { method: 'POST', name: '/api/salary/calculate', description: '计算薪资' },
            { method: 'GET', name: '/api/benefits', description: '获取福利信息' }
          ]
        },
        performance: {
          count: 16,
          apis: [
            { method: 'GET', name: '/api/performance/reviews', description: '获取绩效评估' },
            { method: 'POST', name: '/api/performance/evaluate', description: '提交绩效评估' },
            { method: 'GET', name: '/api/performance/goals', description: '获取目标管理' }
          ]
        },
        training: {
          count: 28,
          apis: [
            { method: 'GET', name: '/api/training/courses', description: '获取培训课程' },
            { method: 'POST', name: '/api/training/enroll', description: '报名培训' },
            { method: 'GET', name: '/api/training/records', description: '培训记录' }
          ]
        }
      },

      // API服务状态
      apiStatus: {
        employee: { responseTime: 120 },
        organization: { responseTime: 85 },
        attendance: { responseTime: 350 },
        compensation: { responseTime: 95 }
      },

      // 代码示例
      codeExamples: {
        curl: `curl -X GET "https://api.er.com/v1/employees" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json"`,

        javascript: `const fetch = require('node-fetch');

const response = await fetch('https://api.er.com/v1/employees', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,

        python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.er.com/v1/employees', 
    headers=headers
)

data = response.json()
print(data)`,

        java: `import java.net.http.*;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.er.com/v1/employees"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .GET()
    .build();

HttpResponse<String> response = 
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
      }
    }
  },
  methods: {
    handleGetStarted() {
      this.$message.success('跳转到快速开始指南');
    },
    handleViewDocs() {
      this.$message.success('跳转到API文档');
    },
    handleTryApi(api) {
      this.$message.info(`试用API: ${api.name}`);
    },
    handleStepGuide(step) {
      const guideMap = {
        'apply': '申请应用',
        'auth': '接口授权',
        'token': '获取令牌',
        'call': '调用接口'
      };
      this.$message.info(`查看${guideMap[step]}教程`);
    },
    handleSupport(type) {
      const supportMap = {
        'docs': '帮助文档',
        'support': '技术支持',
        'community': '开发者社区',
        'feedback': '意见反馈'
      };
      this.$message.info(`跳转到${supportMap[type]}`);
    }
  }
}
</script>

<style scoped>
.api-documentation-container {
  padding: 0;
  background-color: var(--td-bg-color-container);
  min-height: 100vh;
}

/* 头部样式 */
.doc-header {
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  color: white;
  padding: 48px 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.doc-title {
  font-size: 36px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.doc-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 16px;
}

/* API概览样式 */
.api-overview {
  max-width: 1200px;
  margin: -24px auto 48px;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

.overview-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.overview-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.overview-icon.primary { background: #e6f7ff; color: #1890ff; }
.overview-icon.success { background: #f6ffed; color: #52c41a; }
.overview-icon.warning { background: #fffbe6; color: #faad14; }
.overview-icon.info { background: #f0f5ff; color: #597ef7; }

.overview-content {
  flex: 1;
}

.overview-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  line-height: 1;
}

.overview-label {
  font-size: 14px;
  color: var(--td-text-color-secondary);
  margin-top: 4px;
}

/* 通用区块样式 */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--td-text-color-primary);
}

.section-header p {
  font-size: 16px;
  color: var(--td-text-color-secondary);
  margin: 0;
}

/* API分类样式 */
.api-categories {
  max-width: 1200px;
  margin: 0 auto 64px;
  padding: 0 24px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 24px;
}

.category-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--td-component-border);
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
}

.category-icon.employee { background: #e6f7ff; color: #1890ff; }
.category-icon.organization { background: #f6ffed; color: #52c41a; }
.category-icon.attendance { background: #fffbe6; color: #faad14; }
.category-icon.compensation { background: #fff1f0; color: #ff4d4f; }
.category-icon.performance { background: #f9f0ff; color: #722ed1; }
.category-icon.training { background: #e6fffb; color: #13c2c2; }

.category-info h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.api-count {
  font-size: 14px;
  color: var(--td-text-color-secondary);
}

.category-apis {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.api-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  background: var(--td-bg-color-container-hover);
  transition: background-color 0.2s;
}

.api-item:hover {
  background: var(--td-bg-color-container-select);
}

.api-method {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
  min-width: 50px;
  text-align: center;
}

.api-method.GET { background: #e6fffb; color: #13c2c2; }
.api-method.POST { background: #f6ffed; color: #52c41a; }
.api-method.PUT { background: #fff7e6; color: #fa8c16; }
.api-method.DELETE { background: #fff1f0; color: #ff4d4f; }

.api-info {
  flex: 1;
}

.api-name {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}

.api-desc {
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

/* 开发者指南样式 */
.developer-guide {
  max-width: 1200px;
  margin: 0 auto 64px;
  padding: 0 24px;
}

.guide-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.step-card {
  background: white;
  border-radius: 8px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.step-number {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: #0052d9;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
}

.step-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--td-text-color-primary);
}

.step-content p {
  font-size: 14px;
  color: var(--td-text-color-secondary);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

/* 代码示例样式 */
.api-examples {
  max-width: 1200px;
  margin: 0 auto 64px;
  padding: 0 24px;
}

.code-example {
  background: #282c34;
  border-radius: 8px;
  padding: 24px;
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #abb2bf;
}

/* API状态样式 */
.api-status {
  max-width: 1200px;
  margin: 0 auto 64px;
  padding: 0 24px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.status-item {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.online { background: #52c41a; }
.status-indicator.warning { background: #faad14; }
.status-indicator.offline { background: #ff4d4f; }

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.status-desc {
  font-size: 14px;
  color: var(--td-text-color-secondary);
}

/* 支持帮助样式 */
.support-section {
  background: var(--td-bg-color-page);
  padding: 64px 24px;
}

.support-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.support-card {
  background: white;
  border-radius: 8px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.support-card:hover {
  transform: translateY(-2px);
}

.support-card .t-icon {
  color: #0052d9;
  margin-bottom: 16px;
}

.support-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--td-text-color-primary);
}

.support-card p {
  font-size: 14px;
  color: var(--td-text-color-secondary);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .guide-steps {
    grid-template-columns: 1fr;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .support-grid {
    grid-template-columns: 1fr;
  }
}
</style>