<template>
  <div class="home-container">
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
        <t-col :span="6">
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
        <t-col :span="6">
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
      </t-row>
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
              立即申请
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

    <!-- API分类展示 -->
    <div class="api-categories">
      <div class="section-header">
        <h2>ER领域分类</h2>
        <p>按业务领域分类的API接口</p>
      </div>
      
      <div class="category-grid">
        <!-- 员工管理API -->
        <div class="category-card" @click="handleGoToSystemDetail('employee')">
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
            <div v-for="api in apiCategories.employee.apis" :key="api.id" class="api-item" @click="handleGoToApiDetail(api, $event)">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
                <div class="api-metrics">
                  <div class="metric-chart" :id="`chart-${api.id}`" :ref="`chart-${api.id}`"></div>
                  <div class="metric-data">
                    <span class="response-time">{{ api.avgResponseTime }}ms</span>
                    <span class="success-rate" :class="{ 'high': api.successRate > 95, 'medium': api.successRate > 80 }">{{ api.successRate }}%</span>
                  </div>
                </div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click.stop="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
        </div>

        <!-- 组织架构API -->
        <div class="category-card" @click="handleGoToSystemDetail('organization')">
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
            <div v-for="api in apiCategories.organization.apis" :key="api.id" class="api-item" @click="handleGoToApiDetail(api, $event)">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
                <div class="api-metrics">
                  <div class="metric-chart" :id="`chart-${api.id}`" :ref="`chart-${api.id}`"></div>
                  <div class="metric-data">
                    <span class="response-time">{{ api.avgResponseTime }}ms</span>
                    <span class="success-rate" :class="{ 'high': api.successRate > 95, 'medium': api.successRate > 80 }">{{ api.successRate }}%</span>
                  </div>
                </div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click.stop="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
        </div>

        <!-- 考勤管理API -->
        <div class="category-card" @click="handleGoToSystemDetail('attendance')">
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
            <div v-for="api in apiCategories.attendance.apis" :key="api.id" class="api-item" @click="handleGoToApiDetail(api, $event)">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
                <div class="api-metrics">
                  <div class="metric-chart" :id="`chart-${api.id}`" :ref="`chart-${api.id}`"></div>
                  <div class="metric-data">
                    <span class="response-time">{{ api.avgResponseTime }}ms</span>
                    <span class="success-rate" :class="{ 'high': api.successRate > 95, 'medium': api.successRate > 80 }">{{ api.successRate }}%</span>
                  </div>
                </div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click.stop="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
        </div>

        <!-- 薪酬福利API -->
        <div class="category-card" @click="handleGoToSystemDetail('compensation')">
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
            <div v-for="api in apiCategories.compensation.apis" :key="api.id" class="api-item" @click="handleGoToApiDetail(api, $event)">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
                <div class="api-metrics">
                  <div class="metric-chart" :id="`chart-${api.id}`" :ref="`chart-${api.id}`"></div>
                  <div class="metric-data">
                    <span class="response-time">{{ api.avgResponseTime }}ms</span>
                    <span class="success-rate" :class="{ 'high': api.successRate > 95, 'medium': api.successRate > 80 }">{{ api.successRate }}%</span>
                  </div>
                </div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click.stop="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
        </div>

        <!-- 绩效管理API -->
        <div class="category-card" @click="handleGoToSystemDetail('performance')">
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
            <div v-for="api in apiCategories.performance.apis" :key="api.id" class="api-item" @click="handleGoToApiDetail(api, $event)">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
                <div class="api-metrics">
                  <div class="metric-chart" :id="`chart-${api.id}`" :ref="`chart-${api.id}`"></div>
                  <div class="metric-data">
                    <span class="response-time">{{ api.avgResponseTime }}ms</span>
                    <span class="success-rate" :class="{ 'high': api.successRate > 95, 'medium': api.successRate > 80 }">{{ api.successRate }}%</span>
                  </div>
                </div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click.stop="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
        </div>

        <!-- 培训发展API -->
        <div class="category-card" @click="handleGoToSystemDetail('training')">
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
            <div v-for="api in apiCategories.training.apis" :key="api.id" class="api-item" @click="handleGoToApiDetail(api, $event)">
              <div class="api-method" :class="api.method">{{ api.method }}</div>
              <div class="api-info">
                <div class="api-name">{{ api.name }}</div>
                <div class="api-desc">{{ api.description }}</div>
                <div class="api-metrics">
                  <div class="metric-chart" :id="`chart-${api.id}`" :ref="`chart-${api.id}`"></div>
                  <div class="metric-data">
                    <span class="response-time">{{ api.avgResponseTime }}ms</span>
                    <span class="success-rate" :class="{ 'high': api.successRate > 95, 'medium': api.successRate > 80 }">{{ api.successRate }}%</span>
                  </div>
                </div>
              </div>
              <t-button size="small" theme="primary" variant="text" @click.stop="handleTryApi(api)">
                试用
              </t-button>
            </div>
          </div>
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
import * as echarts from 'echarts'

export default {
  name: 'HomePage',
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
            { id: 'emp-list', method: 'GET', name: '/api/employees', description: '获取员工列表', avgResponseTime: 156, successRate: 99.2, chartData: [120, 156, 134, 178, 145, 167, 152] },
            { id: 'emp-create', method: 'POST', name: '/api/employees', description: '创建新员工', avgResponseTime: 234, successRate: 98.8, chartData: [245, 223, 256, 267, 234, 245, 228] },
            { id: 'emp-update', method: 'PUT', name: '/api/employees/{id}', description: '更新员工信息', avgResponseTime: 189, successRate: 99.5, chartData: [167, 189, 178, 195, 182, 188, 191] }
          ]
        },
        organization: {
          count: 18,
          apis: [
            { id: 'dept-list', method: 'GET', name: '/api/departments', description: '获取部门列表', avgResponseTime: 134, successRate: 99.6, chartData: [145, 134, 156, 128, 139, 147, 132] },
            { id: 'pos-list', method: 'GET', name: '/api/positions', description: '获取职位信息', avgResponseTime: 128, successRate: 99.8, chartData: [134, 128, 125, 132, 129, 131, 126] },
            { id: 'dept-create', method: 'POST', name: '/api/departments', description: '创建新部门', avgResponseTime: 267, successRate: 98.2, chartData: [278, 267, 289, 256, 274, 281, 263] }
          ]
        },
        attendance: {
          count: 22,
          apis: [
            { id: 'att-records', method: 'GET', name: '/api/attendance/records', description: '获取考勤记录', avgResponseTime: 189, successRate: 98.9, chartData: [178, 189, 195, 182, 188, 192, 185] },
            { id: 'att-checkin', method: 'POST', name: '/api/attendance/checkin', description: '员工打卡', avgResponseTime: 145, successRate: 99.1, chartData: [156, 145, 139, 148, 142, 147, 144] },
            { id: 'att-summary', method: 'GET', name: '/api/attendance/summary', description: '考勤统计', avgResponseTime: 278, successRate: 97.8, chartData: [289, 278, 295, 267, 281, 287, 276] }
          ]
        },
        compensation: {
          count: 20,
          apis: [
            { id: 'sal-info', method: 'GET', name: '/api/salary', description: '获取薪资信息', avgResponseTime: 234, successRate: 99.4, chartData: [245, 234, 228, 239, 231, 236, 232] },
            { id: 'sal-calc', method: 'POST', name: '/api/salary/calculate', description: '计算薪资', avgResponseTime: 456, successRate: 97.5, chartData: [445, 456, 467, 448, 459, 452, 463] },
            { id: 'benefits-info', method: 'GET', name: '/api/benefits', description: '获取福利信息', avgResponseTime: 198, successRate: 99.0, chartData: [189, 198, 206, 192, 201, 195, 203] }
          ]
        },
        performance: {
          count: 16,
          apis: [
            { id: 'perf-reviews', method: 'GET', name: '/api/performance/reviews', description: '获取绩效评估', avgResponseTime: 267, successRate: 98.3, chartData: [278, 267, 256, 274, 261, 269, 263] },
            { id: 'perf-evaluate', method: 'POST', name: '/api/performance/evaluate', description: '提交绩效评估', avgResponseTime: 334, successRate: 96.9, chartData: [323, 334, 345, 328, 339, 331, 336] },
            { id: 'perf-goals', method: 'GET', name: '/api/performance/goals', description: '获取目标管理', avgResponseTime: 145, successRate: 99.2, chartData: [156, 145, 139, 148, 142, 147, 144] }
          ]
        },
        training: {
          count: 28,
          apis: [
            { id: 'train-courses', method: 'GET', name: '/api/training/courses', description: '获取培训课程', avgResponseTime: 189, successRate: 98.7, chartData: [178, 189, 195, 182, 188, 192, 185] },
            { id: 'train-enroll', method: 'POST', name: '/api/training/enroll', description: '报名培训', avgResponseTime: 223, successRate: 97.8, chartData: [234, 223, 215, 228, 219, 225, 221] },
            { id: 'train-records', method: 'GET', name: '/api/training/records', description: '培训记录', avgResponseTime: 156, successRate: 99.1, chartData: [145, 156, 148, 159, 152, 157, 154] }
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

      // 异常API统计
      exceptionStats: {
        critical: 8,
        criticalTrend: '12%',
        warning: 15,
        warningTrend: '8%',
        avgResponseTime: 456,
        responseTimeTrend: '持平',
        resolved: 23,
        resolvedTrend: '15%'
      },

      // 异常时间范围
      exceptionTimeRange: '24h',

      // 异常搜索过滤
      exceptionFilter: '',

      // 异常API列表
      exceptions: [
        {
          id: 'exc_001',
          severity: 'critical',
          system: '员工管理',
          api: { method: 'GET', name: '/api/employees' },
          endpoint: 'api.er.com/v1/employees',
          responseTime: 1234,
          successRate: 85.2,
          errorCount: 45,
          error: { code: 500, message: '数据库连接超时' },
          lastOccurred: new Date(Date.now() - 300000), // 5分钟前
          status: 'unresolved'
        },
        {
          id: 'exc_002',
          severity: 'critical',
          system: '考勤管理',
          api: { method: 'POST', name: '/api/attendance/checkin' },
          endpoint: 'api.er.com/v1/attendance/checkin',
          responseTime: 2345,
          successRate: 72.8,
          errorCount: 28,
          error: { code: 502, message: '考勤设备离线' },
          lastOccurred: new Date(Date.now() - 600000), // 10分钟前
          status: 'investigating'
        },
        {
          id: 'exc_003',
          severity: 'warning',
          system: '组织架构',
          api: { method: 'GET', name: '/api/departments' },
          endpoint: 'api.er.com/v1/departments',
          responseTime: 567,
          successRate: 94.5,
          errorCount: 12,
          error: { code: 408, message: '请求超时' },
          lastOccurred: new Date(Date.now() - 900000), // 15分钟前
          status: 'resolved'
        },
        {
          id: 'exc_004',
          severity: 'critical',
          system: '薪酬福利',
          api: { method: 'GET', name: '/api/salary' },
          endpoint: 'api.er.com/v1/salary',
          responseTime: 3456,
          successRate: 67.3,
          errorCount: 67,
          error: { code: 503, message: '薪资计算服务不可用' },
          lastOccurred: new Date(Date.now() - 1200000), // 20分钟前
          status: 'unresolved'
        },
        {
          id: 'exc_005',
          severity: 'warning',
          system: '绩效管理',
          api: { method: 'POST', name: '/api/performance/evaluate' },
          endpoint: 'api.er.com/v1/performance/evaluate',
          responseTime: 892,
          successRate: 91.2,
          errorCount: 8,
          error: { code: 429, message: '请求频率过高' },
          lastOccurred: new Date(Date.now() - 1800000), // 30分钟前
          status: 'resolved'
        }
      ],

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
  computed: {
    filteredExceptions() {
      if (!this.exceptionFilter) return this.exceptions;
      
      const filter = this.exceptionFilter.toLowerCase();
      return this.exceptions.filter(exception => 
        exception.system.toLowerCase().includes(filter) ||
        (exception.api && exception.api.name && exception.api.name.toLowerCase().includes(filter)) ||
        exception.error.message.toLowerCase().includes(filter)
      );
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
      // 跳转到API调试页面，传递API信息并锁定URL不可更换
      this.$router.push({
        path: '/api-debug',
        query: {
          url: `https://api.er.com/v1${api.name.replace('/api', '')}`,
          method: api.method,
          apiName: api.description,
          locked: 'true'  // 标记为锁定模式，不可更换API
        }
      });
    },
    handleStepGuide(step) {
      if (step === 'apply') {
        // 跳转到申请应用页面
        this.$router.push('/app-apply');
        return;
      }
      
      if (step === 'auth') {
        // 跳转到接口授权页面
        this.$router.push('/api-auth');
        return;
      }
      
      if (step === 'token') {
        // 跳转到Token文档页面
        this.$router.push('/token');
        return;
      }
      
      if (step === 'call') {
        // 跳转到API在线调试页面
        this.$router.push('/api-debug');
        return;
      }
    },
    handleSupport(type) {
      const supportMap = {
        'docs': '帮助文档',
        'support': '技术支持',
        'community': '开发者社区',
        'feedback': '意见反馈'
      };
      this.$message.info(`跳转到${supportMap[type]}`);
    },
    handleGoToApiDetail(api, event) {
      // 阻止事件冒泡，避免触发分类卡片的跳转
      if (event) {
        event.stopPropagation();
      }
      
      // 跳转到API详情页面
      this.$router.push({
        name: 'ApiDetail',
        query: { 
          apiId: api.id,
          systemType: this.getApiSystemType(api.id)
        }
      });
      this.$message.success(`查看API详情: ${api.name}`);
    },
    
    getApiSystemType(apiId) {
      // 根据API ID判断所属系统类型
      const systemMap = {
        'emp-': 'employee',
        'dept-': 'organization',
        'pos-': 'organization',
        'att-': 'attendance',
        'sal-': 'compensation',
        'benefits-': 'compensation',
        'perf-': 'performance',
        'train-': 'training'
      };
      
      for (const [prefix, systemType] of Object.entries(systemMap)) {
        if (apiId.startsWith(prefix)) {
          return systemType;
        }
      }
      return 'employee'; // 默认返回员工管理系统
    },
    handleGoToSystemDetail(systemType) {
      const systemNames = {
        employee: '员工管理',
        organization: '组织架构', 
        attendance: '考勤管理',
        compensation: '薪酬福利',
        performance: '绩效管理',
        training: '培训发展'
      };
      
      const systemData = {
        name: systemNames[systemType],
        type: systemType,
        apis: this.apiCategories[systemType]?.apis || [],
        count: this.apiCategories[systemType]?.count || 0
      };
      console.log(123);
      
      // 跳转到系统详情页
      this.$router.push({
        name: 'SystemDetail',
        query: { systemType: systemType }
      });
    },
    initApiCharts() {
      this.$nextTick(() => {
        // 初始化所有API的性能图表
        Object.values(this.apiCategories).forEach(category => {
          category.apis.forEach(api => {
            this.initSingleChart(api);
          });
        });
      });
    },
    initSingleChart(api) {
      const chartDom = document.getElementById(`chart-${api.id}`);
      if (!chartDom) return;
      
      const chart = echarts.init(chartDom);
      const option = {
        grid: {
          left: '0%',
          right: '0%',
          top: '0%',
          bottom: '0%',
          containLabel: false
        },
        xAxis: {
          type: 'category',
          show: false,
          data: ['', '', '', '', '', '', '']
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [{
          data: api.chartData,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: api.avgResponseTime > 200 ? '#ff4d4f' : api.avgResponseTime > 100 ? '#faad14' : '#52c41a'
          },
          areaStyle: {
            opacity: 0.1,
            color: api.avgResponseTime > 200 ? '#ff4d4f' : api.avgResponseTime > 100 ? '#faad14' : '#52c41a'
          }
        }]
      };
      
      chart.setOption(option);
      
      // 添加resize监听
      window.addEventListener('resize', () => {
        chart.resize();
      });
    },

    // 异常API相关方法
    refreshExceptions() {
      this.$message.success('异常数据已刷新');
      // 这里可以调用实际的数据刷新接口
    },

    viewAllExceptions() {
      this.$message.info('跳转到异常管理页面');
      // 跳转到详细的异常管理页面
    },

    viewExceptionDetail(exception) {
      const apiName = exception.api && exception.api.name ? exception.api.name : '未知API';
      this.$message.info(`查看异常详情: ${apiName}`);
      // 跳转到异常详情页面
    },

    getSeverityIcon(severity) {
      const icons = {
        'critical': 'error-circle',
        'warning': 'error-triangle',
        'info': 'info-circle'
      };
      return icons[severity] || 'error-circle';
    },

    formatTime(timestamp) {
      const now = new Date();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      
      if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else {
        return timestamp.toLocaleString('zh-CN', { 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    },

    initExceptionChart() {
      const chartDom = document.getElementById('exceptionTrendChart');
      if (!chartDom) return;
      
      const chart = echarts.init(chartDom);
      const option = {
        title: { show: false },
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['严重异常', '一般异常', '响应时间'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '5%'
        },
        xAxis: {
          type: 'category',
          data: this.generateExceptionTimeLabels()
        },
        yAxis: [
          {
            type: 'value',
            name: '异常次数',
            position: 'left'
          },
          {
            type: 'value',
            name: '响应时间(ms)',
            position: 'right'
          }
        ],
        series: [
          {
            name: '严重异常',
            type: 'line',
            data: this.generateExceptionData('critical'),
            itemStyle: { color: '#ff4d4f' },
            smooth: true
          },
          {
            name: '一般异常',
            type: 'line',
            data: this.generateExceptionData('warning'),
            itemStyle: { color: '#faad14' },
            smooth: true
          },
          {
            name: '响应时间',
            type: 'bar',
            yAxisIndex: 1,
            data: this.generateExceptionData('responseTime'),
            itemStyle: { color: '#1890ff' },
            opacity: 0.3
          }
        ]
      };
      
      chart.setOption(option);
      window.addEventListener('resize', () => chart.resize());
    },

    generateExceptionTimeLabels() {
      const labels = [];
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now - i * 3600000);
        labels.push(time.getHours() + ':00');
      }
      return labels;
    },

    generateExceptionData(type) {
      const dataLength = 24;
      
      switch (type) {
        case 'critical':
          return Array.from({ length: dataLength }, () => 
            Math.floor(Math.random() * 10) + 2
          );
        case 'warning':
          return Array.from({ length: dataLength }, () => 
            Math.floor(Math.random() * 15) + 5
          );
        case 'responseTime':
          return Array.from({ length: dataLength }, () => 
            Math.floor(Math.random() * 800) + 200
          );
        default:
          return Array.from({ length: dataLength }, () => 0);
      }
    }
  },
  mounted() {
    // 页面加载完成后初始化所有API性能图表
    this.initApiCharts();
    // 初始化异常趋势图表
    this.initExceptionChart();
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
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  cursor: pointer;
}

.api-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.api-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--td-text-color-primary);
}

.api-desc {
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

.api-metrics {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.metric-chart {
  width: 80px;
  height: 24px;
}

.metric-data {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 500;
}

.response-time {
  color: var(--td-text-color-secondary);
}

.success-rate {
  color: #ff4d4f;
  padding: 2px 6px;
  border-radius: 10px;
  background: rgba(255, 77, 79, 0.1);
}

.success-rate.medium {
  color: #faad14;
  background: rgba(250, 173, 20, 0.1);
}

.success-rate.high {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
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