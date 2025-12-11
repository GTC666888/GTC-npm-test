<template>
  <div class="home-container">
    <!-- 头部导航 -->
    <div class="doc-header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="doc-title">ER MainData Center</h1>
          <p class="doc-subtitle">ER领域主数据API集成平台</p>
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
          <t-button theme="default" @click="handleSwitchToB">
            <template #icon><t-icon name="chart" /></template>
            管理端
          </t-button>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content-wrapper">
      <!-- 左侧边栏 - 已申请应用 -->
      <div class="left-sidebar">
        <!-- 已申请应用模块 -->
        <div class="applied-apps-section">
          <div class="guide-header">
            <h3>已申请应用</h3>
            <p>我的应用列表</p>
          </div>
          
          <div class="applied-apps-list">
            <div class="app-item" v-for="app in appliedApps" :key="app.id" @click="handleViewApp(app)">
              <div class="step-icon-large" :class="app.statusClass">
                <t-icon :name="app.icon" size="24px" />
              </div>
              <div class="step-info">
                <h4>{{ app.name }}</h4>
                <p>{{ app.description }}</p>
              </div>
              <div class="app-status" :class="app.statusClass">{{ app.statusText }}</div>
            </div>
            <div class="empty-apps" v-if="appliedApps.length === 0">
              <t-icon name="inbox" size="32px" />
              <p>暂无申请的应用</p>
            </div>
          </div>
          
          <div class="apply-new-btn" @click="handleStepGuide('apply')">
            <t-icon name="add" />
            <span>申请新应用</span>
          </div>
        </div>
      </div>

      <!-- 中间主内容 -->
      <div class="main-content">
        <!-- 开发流程模块 -->
        <div class="dev-process-section">
          <div class="section-header">
            <h2>申请流程</h2>
            <p>API申请流程指引</p>
          </div>
          
          <div class="flowchart" ref="flowchart">
            <!-- 主流程 -->
            <div class="flowchart-row main-row" ref="flowchartRow">
              <!-- 申请人 -->
              <div class="flow-node start-node">
                <div class="node-circle">
                  <t-icon name="user" size="28px" />
                </div>
                <span class="node-label">申请人</span>
              </div>
              
              <div class="flow-connector">
                <div class="connector-line connector-line-first"></div>
                <t-icon name="chevron-right" class="connector-arrow" />
              </div>
              
              <!-- 判断：业务系统是否已接入 -->
              <div class="flow-node decision-node" ref="decisionNode">
                <div class="node-diamond">
                  <div class="diamond-content">
                    <t-icon name="help-circle" size="20px" />
                    <span>业务系统<br/>是否已接入<br/>ER领域主数据</span>
                  </div>
                </div>
              </div>
              
              <div class="flow-connector with-label">
                <div class="connector-line"></div>
                <span class="connector-label no-label">否</span>
                <t-icon name="chevron-right" class="connector-arrow" />
              </div>
              
              <!-- 申请接入 -->
              <div class="flow-node process-node clickable" ref="applyNode" @click="handleFlowNodeClick('apply')">
                <div class="node-card blue">
                  <div class="card-icon">
                    <t-icon name="file-add" size="24px" />
                  </div>
                  <span class="card-title">申请接入</span>
                </div>
              </div>
              
              <div class="flow-connector">
                <div class="connector-line"></div>
                <t-icon name="chevron-right" class="connector-arrow" />
              </div>
              
              <!-- 选择&提交接口+字段 -->
              <div class="flow-node process-node clickable" ref="submitNode" @click="handleFlowNodeClick('submit')">
                <div class="node-card blue">
                  <div class="card-icon">
                    <t-icon name="check-double" size="24px" />
                  </div>
                  <span class="card-title">选择&提交</span>
                  <span class="card-subtitle">接口+字段</span>
                </div>
              </div>
              
              <div class="flow-connector">
                <div class="connector-line"></div>
                <t-icon name="chevron-right" class="connector-arrow" />
              </div>
              
              <!-- 管理员审核 -->
              <div class="flow-node process-node"
                   @mouseenter="showTooltip($event, 'admin')" 
                   @mouseleave="hideTooltip">
                <div class="node-card green">
                  <div class="card-icon">
                    <t-icon name="user-checked" size="24px" />
                  </div>
                  <span class="card-title">管理员审核</span>
                </div>
              </div>
              
              <div class="flow-connector">
                <div class="connector-line"></div>
                <t-icon name="chevron-right" class="connector-arrow" />
              </div>
              
              <!-- 对接 -->
              <div class="flow-node process-node clickable"
                   @click="handleFlowNodeClick('debug')"
                   @mouseenter="showTooltip($event, 'connect')" 
                   @mouseleave="hideTooltip">
                <div class="node-card orange">
                  <div class="card-icon">
                    <t-icon name="link" size="24px" />
                  </div>
                  <span class="card-title">对接</span>
                </div>
              </div>
            </div>
            
            <!-- 分支线：是 -->
            <div class="flowchart-branch" :style="branchStyle">
              <div class="branch-down">
                <div class="branch-vertical-line"></div>
              </div>
              <div class="branch-horizontal-line" :style="{ width: branchHorizontalWidth + 'px' }">
                <span class="branch-label">是</span>
              </div>
              <div class="branch-up">
                <div class="branch-vertical-up"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tooltip teleport to body -->
        <teleport to="body">
          <div class="flowchart-tooltip" 
               v-show="tooltipVisible" 
               :style="tooltipStyle">
            <template v-if="activeTooltip === 'admin'">
              <div class="tooltip-header">
                <t-icon name="check-circle" size="16px" />
                <span>审核通过后</span>
              </div>
              <ul class="tooltip-list">
                <li><t-icon name="key" size="14px" />提供 appId / token</li>
                <li><t-icon name="file-paste" size="14px" />对接所需要素</li>
              </ul>
            </template>
            <template v-else-if="activeTooltip === 'connect'">
              <div class="tooltip-header">
                <t-icon name="file-code" size="16px" />
                <span>开始对接</span>
              </div>
              <ul class="tooltip-list">
                <li><t-icon name="book" size="14px" />查阅对接文档</li>
                <li><t-icon name="code" size="14px" />调用API接口</li>
              </ul>
            </template>
          </div>
        </teleport>

        <!-- API分类展示 -->
        <div class="api-categories">
          <div class="section-header">
            <h2>ER领域分类</h2>
            <p>按业务领域分类的API接口</p>
          </div>
      
      <div class="category-grid">
        <!-- 集团用工API -->
        <div class="category-card" @click="handleGoToSystemDetail('groupEmployment')">
          <div class="category-header">
            <div class="category-icon groupEmployment">
              <t-icon name="usergroup" />
            </div>
            <div class="category-info">
              <h3>集团用工</h3>
              <div class="er-list" :title="apiCategories.groupEmployment.erList.join('、')">{{ apiCategories.groupEmployment.erList.join('、') }}</div>
              <span class="api-count">{{ apiCategories.groupEmployment.count }} 个API</span>
            </div>
          </div>
          <div class="category-apis" :class="{ 'expanded': expandedCategories.groupEmployment }">
            <div v-for="(api, index) in apiCategories.groupEmployment.apis" :key="api.id" class="api-item" v-show="expandedCategories.groupEmployment || index < 3" @click="handleGoToApiDetail(api, $event)">
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
          <div class="category-expand" @click.stop="toggleCategory('groupEmployment')">
            <span>{{ expandedCategories.groupEmployment ? '收起' : `展开全部 ${apiCategories.groupEmployment.apis.length} 个API` }}</span>
            <t-icon :name="expandedCategories.groupEmployment ? 'chevron-up' : 'chevron-down'" />
          </div>
        </div>

        <!-- 非正式用工API -->
        <div class="category-card" @click="handleGoToSystemDetail('informalEmployment')">
          <div class="category-header">
            <div class="category-icon informalEmployment">
              <t-icon name="user" />
            </div>
            <div class="category-info">
              <h3>非正式用工</h3>
              <div class="er-list" :title="apiCategories.informalEmployment.erList.join('、')">{{ apiCategories.informalEmployment.erList.join('、') }}</div>
              <span class="api-count">{{ apiCategories.informalEmployment.count }} 个API</span>
            </div>
          </div>
          <div class="category-apis" :class="{ 'expanded': expandedCategories.informalEmployment }">
            <div v-for="(api, index) in apiCategories.informalEmployment.apis" :key="api.id" class="api-item" v-show="expandedCategories.informalEmployment || index < 3" @click="handleGoToApiDetail(api, $event)">
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
          <div class="category-expand" v-if="apiCategories.informalEmployment.apis.length > 3" @click.stop="toggleCategory('informalEmployment')">
            <span>{{ expandedCategories.informalEmployment ? '收起' : `展开全部 ${apiCategories.informalEmployment.apis.length} 个API` }}</span>
            <t-icon :name="expandedCategories.informalEmployment ? 'chevron-up' : 'chevron-down'" />
          </div>
        </div>

        <!-- 合规API -->
        <div class="category-card" @click="handleGoToSystemDetail('compliance')">
          <div class="category-header">
            <div class="category-icon compliance">
              <t-icon name="secured" />
            </div>
            <div class="category-info">
              <h3>合规</h3>
              <div class="er-list" :title="apiCategories.compliance.erList.join('、')">{{ apiCategories.compliance.erList.join('、') }}</div>
              <span class="api-count">{{ apiCategories.compliance.count }} 个API</span>
            </div>
          </div>
          <div class="category-apis" :class="{ 'expanded': expandedCategories.compliance }">
            <div v-for="(api, index) in apiCategories.compliance.apis" :key="api.id" class="api-item" v-show="expandedCategories.compliance || index < 3" @click="handleGoToApiDetail(api, $event)">
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
          <div class="category-expand" v-if="apiCategories.compliance.apis.length > 3" @click.stop="toggleCategory('compliance')">
            <span>{{ expandedCategories.compliance ? '收起' : `展开全部 ${apiCategories.compliance.apis.length} 个API` }}</span>
            <t-icon :name="expandedCategories.compliance ? 'chevron-up' : 'chevron-down'" />
          </div>
        </div>

        <!-- 敬满API -->
        <div class="category-card" @click="handleGoToSystemDetail('jingman')">
          <div class="category-header">
            <div class="category-icon jingman">
              <t-icon name="heart" />
            </div>
            <div class="category-info">
              <h3>敬满</h3>
              <div class="er-list" :title="apiCategories.jingman.erList.join('、')">{{ apiCategories.jingman.erList.join('、') }}</div>
              <span class="api-count">{{ apiCategories.jingman.count }} 个API</span>
            </div>
          </div>
          <div class="category-apis" :class="{ 'expanded': expandedCategories.jingman }">
            <div v-for="(api, index) in apiCategories.jingman.apis" :key="api.id" class="api-item" v-show="expandedCategories.jingman || index < 3" @click="handleGoToApiDetail(api, $event)">
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
          <div class="category-expand" v-if="apiCategories.jingman.apis.length > 3" @click.stop="toggleCategory('jingman')">
            <span>{{ expandedCategories.jingman ? '收起' : `展开全部 ${apiCategories.jingman.apis.length} 个API` }}</span>
            <t-icon :name="expandedCategories.jingman ? 'chevron-up' : 'chevron-down'" />
          </div>
        </div>
      </div>
    </div>
      </div>
      <!-- 中间主内容结束 -->

      <!-- 右侧固定区域 -->
      <div class="right-sidebar">
        <!-- 开发者指南 -->
        <div class="developer-guide-sidebar">
          <div class="guide-header">
            <h3>开发者指南</h3>
            <p>快速开始使用API</p>
          </div>
          
          <div class="guide-steps-vertical">
            <div class="step-item" @click="handleStepGuide('apply')">
              <div class="step-icon-large">
                <t-icon name="file-add" size="24px" />
              </div>
              <div class="step-info">
                <h4>申请应用</h4>
                <p>获取AppKey和AppSecret</p>
              </div>
              <t-icon name="chevron-right" />
            </div>

            <div class="step-item" @click="handleStepGuide('auth')">
              <div class="step-icon-large">
                <t-icon name="lock-on" size="24px" />
              </div>
              <div class="step-info">
                <h4>接口授权</h4>
                <p>配置API访问权限</p>
              </div>
              <t-icon name="chevron-right" />
            </div>

            <div class="step-item" @click="handleStepGuide('call')">
              <div class="step-icon-large">
                <t-icon name="play-circle" size="24px" />
              </div>
              <div class="step-info">
                <h4>调用接口</h4>
                <p>开始使用API</p>
              </div>
              <t-icon name="chevron-right" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 主内容区域结束 -->

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
import { ER_CATEGORIES } from '@/constants/erCategories'
import { APPROVED_APPS } from '@/constants/approvedApps'

export default {
  name: 'HomePage',
  components: {
    TIcon
  },
  data() {
    return {
      activeTab: 'curl',
      
      // Tooltip状态
      tooltipVisible: false,
      activeTooltip: '',
      tooltipStyle: {
        top: '0px',
        left: '0px'
      },
      
      // 分支线样式
      branchStyle: {
        left: '0px',
        top: '0px'
      },
      branchHorizontalWidth: 300,
      
      // 分类展开状态
      expandedCategories: {
        groupEmployment: false,
        informalEmployment: false,
        compliance: false,
        jingman: false
      },

      // API分类数据 - 使用公共常量
      apiCategories: ER_CATEGORIES,

      // 已申请应用列表 - 使用公共常量
      appliedApps: APPROVED_APPS,

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
      // 快速开始：跳转到API调试页面
      this.$router.push('/api-debug');
    },
    showTooltip(event, type) {
      const rect = event.currentTarget.getBoundingClientRect();
      this.activeTooltip = type;
      this.tooltipStyle = {
        top: `${rect.bottom + 12}px`,
        left: `${rect.left + rect.width / 2}px`
      };
      this.tooltipVisible = true;
    },
    hideTooltip() {
      this.tooltipVisible = false;
    },
    handleFlowNodeClick(type) {
      const routes = {
        apply: '/app-apply',
        submit: '/api-auth',
        debug: '/api-debug'
      };
      if (routes[type]) {
        this.$router.push(routes[type]);
      }
    },
    calculateBranchPosition() {
      this.$nextTick(() => {
        const flowchart = this.$refs.flowchart;
        const decisionNode = this.$refs.decisionNode;
        const submitNode = this.$refs.submitNode;
        
        if (!flowchart || !decisionNode || !submitNode) return;
        
        const flowchartRect = flowchart.getBoundingClientRect();
        const decisionRect = decisionNode.getBoundingClientRect();
        const submitRect = submitNode.getBoundingClientRect();
        
        // 分支起点：判断节点底部中心
        const branchLeft = decisionRect.left - flowchartRect.left + decisionRect.width / 2;
        const branchTop = decisionRect.top - flowchartRect.top + decisionRect.height - 10;
        
        // 分支终点：选择&提交节点顶部中心
        const endX = submitRect.left - flowchartRect.left + submitRect.width / 2;
        
        // 计算水平线宽度
        this.branchHorizontalWidth = Math.abs(endX - branchLeft);
        
        this.branchStyle = {
          left: branchLeft + 'px',
          top: 132 + 'px'
        };
      });
    },
    toggleCategory(category) {
      this.expandedCategories[category] = !this.expandedCategories[category];
    },
    handleViewApp(app) {
      this.$message.info(`查看应用: ${app.name}`);
    },
    handleViewDocs() {
      this.$router.push('/api-docs');
    },
    handleTryApi(api) {
      // 跳转到API调试页面，传递API信息并锁定URL不可更换
      this.$router.push({
        path: '/api-debug',
        query: {
          url: `https://api.er.com/v1${api.name.replace('/api', '')}`,
          method: api.method,
          apiName: api.description,
          apiId: api.id,
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
      
      if (step === 'call') {
        // 跳转到API在线调试页面
        this.$router.push('/api-debug');
        return;
      }
    },
    handleSwitchToB() {
      // 切换到企业监控版（B端版本）
      this.$router.push('/home-b2b');
      this.$message.success('已切换到管理端');
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
      // 根据API ID判断所属分类类型
      const systemMap = {
        'group-': 'groupEmployment',
        'temp-': 'informalEmployment',
        'outsource-': 'informalEmployment',
        'flexible-': 'informalEmployment',
        'legal-': 'compliance',
        'audit-': 'compliance',
        'risk-': 'compliance',
        'policy-': 'compliance',
        'jm-': 'jingman'
      };
      
      for (const [prefix, systemType] of Object.entries(systemMap)) {
        if (apiId.startsWith(prefix)) {
          return systemType;
        }
      }
      return 'groupEmployment'; // 默认返回集团用工
    },
    handleGoToSystemDetail(systemType) {
      const systemNames = {
        groupEmployment: '集团用工',
        informalEmployment: '非正式用工', 
        compliance: '合规',
        jingman: '敬满'
      };
      
      const systemData = {
        name: systemNames[systemType],
        type: systemType,
        apis: this.apiCategories[systemType]?.apis || [],
        count: this.apiCategories[systemType]?.count || 0
      };
      console.log(123);
      
      // 跳转到详情页
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
    // 计算分支线位置
    this.calculateBranchPosition();
    // 监听窗口大小变化
    window.addEventListener('resize', this.calculateBranchPosition);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateBranchPosition);
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
  max-width: 1920px;
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
  margin: 0 0 32px;
}

/* 开发流程模块样式 */
.dev-process-section {
  margin-bottom: 32px;
  background: white;
  border-radius: 12px;
  padding: 24px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: visible;
}

.dev-process-section .section-header {
  margin-bottom: 24px;
}

/* 流程图样式 */
.flowchart {
  position: relative;
  padding: 16px 0 60px;
  overflow-x: auto;
  overflow-y: visible;
  min-width: 100%;
}

.flowchart-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0;
  min-width: 800px;
  overflow: visible;
}

.flow-node {
  z-index: 999;
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;
}

/* 开始节点 - 圆形带图标 */
.start-node .node-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.35);
}

.start-node .node-label {
  margin-top: 6px;
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

/* 判断节点 - 菱形 */
.decision-node {
  padding: 10px;
}

.decision-node .node-diamond {
  width: 110px;
  height: 110px;
  background: linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%);
  border: 2px solid #faad14;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(250, 173, 20, 0.25);
}

.decision-node .diamond-content {
  transform: rotate(-45deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.decision-node .diamond-content .t-icon {
  color: #d48806;
  font-size: 16px;
}

.decision-node .diamond-content span {
  font-size: 10px;
  text-align: center;
  line-height: 1.2;
  color: #856404;
}

/* 处理节点 - 卡片样式 */
.node-card {
  min-width: 90px;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  transition: all 0.3s ease;
}

.node-card:hover {
  transform: translateY(-2px);
}

.flow-node.clickable {
  cursor: pointer;
}

.flow-node.clickable .node-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.node-card .card-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-card .card-icon .t-icon {
  color: white;
  font-size: 18px;
}

.node-card .card-title {
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.node-card .card-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: -2px;
}

.node-card.blue {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  box-shadow: 0 3px 10px rgba(24, 144, 255, 0.35);
}

.node-card.green {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  box-shadow: 0 3px 10px rgba(82, 196, 26, 0.35);
}

.node-card.orange {
  background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
  box-shadow: 0 3px 10px rgba(250, 140, 22, 0.35);
}

/* 连接线 */
.flow-connector {
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
  min-width: 20px;
}

.connector-line {
  width: 100%;
  height: 2px;
  background: #d9d9d9;
  position: relative;
}

.connector-line-first {
  left: -14px;
}

.connector-line::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border-left: 6px solid #d9d9d9;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.connector-arrow {
  display: none;
}

.flow-connector.with-label {
  width: 55px;
}

.connector-label {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 500;
  padding: 1px 8px;
  border-radius: 8px;
}

.connector-label.no-label {
  background: #fff1f0;
  color: #ff4d4f;
}

/* 分支线 */
.flowchart-branch {
  position: absolute;
  display: flex;
  align-items: stretch;
}

.branch-down {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.branch-vertical-line {
  width: 2px;
  height: 40px;
  background: #d9d9d9;
}

.branch-horizontal-line {
  height: 2px;
  background: #d9d9d9;
  align-self: flex-end;
  position: relative;
}

.branch-label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 8px;
  font-size: 11px;
  font-weight: 500;
  padding: 1px 8px;
  border-radius: 8px;
  background: #f6ffed;
  color: #52c41a;
  white-space: nowrap;
}

.branch-up {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.branch-vertical-up {
  width: 2px;
  flex: 1;
  background: #d9d9d9;
  position: relative;
}

.branch-vertical-up::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 6px solid #d9d9d9;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.category-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
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
  overflow: hidden;
}

.category-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  flex-shrink: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
}

.category-icon.groupEmployment { background: #e6f7ff; color: #1890ff; }
.category-icon.informalEmployment { background: #f6ffed; color: #52c41a; }
.category-icon.compliance { background: #fff1f0; color: #ff4d4f; }
.category-icon.jingman { background: #f9f0ff; color: #722ed1; }

.category-info {
  flex: 1;
  min-width: 0;
}

.category-info h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  width: 100%;
}

.er-list {
  font-size: 12px;
  color: var(--td-text-color-secondary);
  margin-bottom: 4px;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  max-height: 2.8em;
}

.api-count {
  font-size: 14px;
  color: var(--td-text-color-secondary);
  width: 100%;
}

.category-apis {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-apis.expanded {
  max-height: 400px;
  overflow-y: auto;
}

.category-expand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--td-component-border);
  color: #0052d9;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-expand:hover {
  background: var(--td-bg-color-container-hover);
  border-radius: 6px;
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

/* 主内容区域布局 */
.main-content-wrapper {
  display: flex;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 24px;
  gap: 24px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

/* 左侧边栏 - 已申请应用 */
.left-sidebar {
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  height: fit-content;
}

/* 右侧固定区域 */
.right-sidebar {
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 已申请应用模块 */
.applied-apps-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.applied-apps-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.app-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--td-bg-color-container);
}

.app-item:hover {
  background: var(--td-bg-color-container-hover);
  transform: translateX(4px);
}

.app-item .step-icon-large.approved {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.app-item .step-icon-large.pending {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
}

.app-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.app-status.approved {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.app-status.pending {
  background: rgba(250, 173, 20, 0.1);
  color: #faad14;
}

.empty-apps {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  color: var(--td-text-color-placeholder);
}

.empty-apps p {
  margin: 8px 0 0;
  font-size: 13px;
}

.apply-new-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-new-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.3);
}

/* 右侧固定开发者指南 */
.developer-guide-sidebar {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.guide-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--td-component-border);
}

.guide-header h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: var(--td-text-color-primary);
}

.guide-header p {
  font-size: 14px;
  color: var(--td-text-color-secondary);
  margin: 0;
}

.guide-steps-vertical {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--td-bg-color-container);
}

.step-item:hover {
  background: var(--td-bg-color-container-hover);
  transform: translateX(4px);
}

.step-icon-large {
  width: 48px;
  height: 48px;
  min-width: 48px;
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-icon-large .t-icon {
  font-size: 24px;
  color: white !important;
}

.step-item .step-number {
  position: static;
  transform: none;
  width: 28px;
  height: 28px;
  min-width: 28px;
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.step-info {
  flex: 1;
  min-width: 0;
}

.step-info h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--td-text-color-primary);
}

.step-info p {
  font-size: 13px;
  color: var(--td-text-color-secondary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.step-item .t-icon {
  color: var(--td-text-color-placeholder);
  font-size: 18px;
}

/* 代码示例样式 */
.api-examples {
  max-width: 1920px;
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
  max-width: 1920px;
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
  max-width: 1920px;
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
/* 大屏幕 1920px+ */
@media (min-width: 1600px) {
  .left-sidebar,
  .right-sidebar {
    width: 360px;
  }
  
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* 中大屏幕 1400px - 1600px */
@media (max-width: 1600px) and (min-width: 1200px) {
  .left-sidebar,
  .right-sidebar {
    width: 300px;
  }
}

/* 中等屏幕 1024px - 1200px */
@media (max-width: 1200px) and (min-width: 1024px) {
  .left-sidebar,
  .right-sidebar {
    width: 260px;
  }
  
  .step-icon-large {
    width: 40px;
    height: 40px;
    min-width: 40px;
  }
  
  .step-icon-large .t-icon {
    font-size: 20px;
  }
}

/* 平板及以下 < 1024px */
@media (max-width: 1024px) {
  .main-content-wrapper {
    flex-direction: column;
  }
  
  .left-sidebar,
  .right-sidebar {
    width: 100%;
    position: static;
    margin-bottom: 24px;
  }
  
  .left-sidebar {
    order: -2;
  }
  
  .right-sidebar {
    order: -1;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .applied-apps-section,
  .developer-guide-sidebar {
    flex: 1;
    min-width: 280px;
  }
  
  .guide-steps-vertical {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .step-item {
    flex: 1;
    min-width: 200px;
  }
  
  .flowchart {
    overflow-x: auto;
  }
  
  .flowchart-branch {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .main-content-wrapper {
    padding: 0 16px;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .guide-steps-vertical {
    flex-direction: column;
  }
  
  .step-item {
    min-width: auto;
  }
  
  .support-grid {
    grid-template-columns: 1fr;
  }
  
  .flowchart {
    padding: 20px 0 40px;
  }
  
  .flowchart-row {
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }
  
  .flow-connector {
    display: none;
  }
  
  .flowchart-branch {
    display: none;
  }
  
  .node-tooltip {
    display: none;
  }
  
  .dev-process-section {
    padding: 20px;
  }
}
</style>

<!-- 全局tooltip样式（teleport到body需要非scoped样式） -->
<style>
.flowchart-tooltip {
  position: fixed;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  padding: 14px 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border: 1px solid #f0f0f0;
  min-width: 160px;
  z-index: 9999;
  pointer-events: none;
}

.flowchart-tooltip::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
}

.flowchart-tooltip .tooltip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.flowchart-tooltip .tooltip-header .t-icon {
  color: #52c41a;
}

.flowchart-tooltip .tooltip-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.flowchart-tooltip .tooltip-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
  padding: 4px 0;
}

.flowchart-tooltip .tooltip-list li .t-icon {
  color: #1890ff;
}
</style>