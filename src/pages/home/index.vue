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
            企业监控版
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
                <div class="connector-line"></div>
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
                <li><t-icon name="key" size="14px" />提供 appId</li>
                <li><t-icon name="lock-on" size="14px" />提供 token</li>
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

            <div class="step-item" @click="handleStepGuide('token')">
              <div class="step-icon-large">
                <t-icon name="secured" size="24px" />
              </div>
              <div class="step-info">
                <h4>获取令牌</h4>
                <p>获取Access Token</p>
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
      
      // 已申请应用列表
      appliedApps: [
        { id: 'app-001', name: 'HR数据平台', description: 'AppKey: ak_hr****8f2d', icon: 'app', statusClass: 'approved', statusText: '已通过' },
        { id: 'app-002', name: '考勤管理助手', description: 'AppKey: ak_at****3e1a', icon: 'calendar', statusClass: 'approved', statusText: '已通过' },
        { id: 'app-003', name: '薪酬查询工具', description: '等待管理员审批', icon: 'money-circle', statusClass: 'pending', statusText: '审批中' }
      ],
      
      // API统计数据
      apiStats: {
        total: 104,  // 32+28+24+20 = 104
        production: 96,
        developers: 356,
        uptime: 99.9
      },

      // API分类数据
      apiCategories: {
        groupEmployment: {
          count: 32,
          erList: ["入职", "离职", "异动（调动 派驻）", "人事合同", "校友会"],
          apis: [
            { id: 'group-emp-list', method: 'GET', name: '/api/group/employees', description: '获取集团员工列表', avgResponseTime: 156, successRate: 99.2, chartData: [120, 156, 134, 178, 145, 167, 152] },
            { id: 'group-emp-create', method: 'POST', name: '/api/group/employees', description: '创建集团员工', avgResponseTime: 234, successRate: 98.8, chartData: [245, 223, 256, 267, 234, 245, 228] },
            { id: 'group-contract', method: 'GET', name: '/api/group/contracts', description: '集团劳动合同管理', avgResponseTime: 189, successRate: 99.5, chartData: [167, 189, 178, 195, 182, 188, 191] },
            { id: 'group-transfer', method: 'POST', name: '/api/group/transfer', description: '集团内部调动', avgResponseTime: 267, successRate: 98.3, chartData: [278, 267, 256, 274, 261, 269, 263] },
            { id: 'group-onboard', method: 'POST', name: '/api/group/onboard', description: '入职办理', avgResponseTime: 178, successRate: 99.1, chartData: [165, 178, 172, 185, 176, 180, 174] },
            { id: 'group-offboard', method: 'POST', name: '/api/group/offboard', description: '离职办理', avgResponseTime: 198, successRate: 98.9, chartData: [185, 198, 192, 205, 196, 200, 194] },
            { id: 'group-dispatch', method: 'POST', name: '/api/group/dispatch', description: '派驻管理', avgResponseTime: 212, successRate: 99.0, chartData: [200, 212, 206, 218, 210, 214, 208] },
            { id: 'group-alumni', method: 'GET', name: '/api/group/alumni', description: '校友会管理', avgResponseTime: 145, successRate: 99.4, chartData: [132, 145, 138, 152, 142, 148, 140] },
            { id: 'group-position', method: 'GET', name: '/api/group/positions', description: '职位信息查询', avgResponseTime: 123, successRate: 99.6, chartData: [110, 123, 116, 130, 120, 126, 118] },
            { id: 'group-dept', method: 'GET', name: '/api/group/departments', description: '部门信息查询', avgResponseTime: 134, successRate: 99.5, chartData: [121, 134, 127, 141, 131, 137, 129] },
            { id: 'group-rank', method: 'GET', name: '/api/group/ranks', description: '职级信息查询', avgResponseTime: 118, successRate: 99.7, chartData: [105, 118, 111, 125, 115, 121, 113] },
            { id: 'group-probation', method: 'POST', name: '/api/group/probation', description: '试用期管理', avgResponseTime: 187, successRate: 98.8, chartData: [174, 187, 180, 194, 184, 190, 182] },
            { id: 'group-regular', method: 'POST', name: '/api/group/regular', description: '转正办理', avgResponseTime: 203, successRate: 99.2, chartData: [190, 203, 196, 210, 200, 206, 198] },
            { id: 'group-renew', method: 'POST', name: '/api/group/renew', description: '合同续签', avgResponseTime: 225, successRate: 98.7, chartData: [212, 225, 218, 232, 222, 228, 220] },
            { id: 'group-history', method: 'GET', name: '/api/group/history', description: '员工履历查询', avgResponseTime: 167, successRate: 99.3, chartData: [154, 167, 160, 174, 164, 170, 162] },
            { id: 'group-cert', method: 'GET', name: '/api/group/certificates', description: '证书资质查询', avgResponseTime: 145, successRate: 99.4, chartData: [132, 145, 138, 152, 142, 148, 140] },
            { id: 'group-edu', method: 'GET', name: '/api/group/education', description: '学历信息查询', avgResponseTime: 128, successRate: 99.6, chartData: [115, 128, 121, 135, 125, 131, 123] },
            { id: 'group-family', method: 'GET', name: '/api/group/family', description: '家庭成员信息', avgResponseTime: 136, successRate: 99.5, chartData: [123, 136, 129, 143, 133, 139, 131] },
            { id: 'group-emergency', method: 'GET', name: '/api/group/emergency', description: '紧急联系人', avgResponseTime: 112, successRate: 99.8, chartData: [99, 112, 105, 119, 109, 115, 107] },
            { id: 'group-bank', method: 'GET', name: '/api/group/bank', description: '银行卡信息', avgResponseTime: 98, successRate: 99.9, chartData: [85, 98, 91, 105, 95, 101, 93] },
            { id: 'group-social', method: 'GET', name: '/api/group/social', description: '社保公积金信息', avgResponseTime: 156, successRate: 99.2, chartData: [143, 156, 149, 163, 153, 159, 151] },
            { id: 'group-leave-type', method: 'GET', name: '/api/group/leave-types', description: '假期类型查询', avgResponseTime: 89, successRate: 99.9, chartData: [76, 89, 82, 96, 86, 92, 84] },
            { id: 'group-org-change', method: 'POST', name: '/api/group/org-change', description: '组织架构变更', avgResponseTime: 278, successRate: 98.5, chartData: [265, 278, 271, 285, 275, 281, 273] },
            { id: 'group-batch-import', method: 'POST', name: '/api/group/batch-import', description: '批量导入员工', avgResponseTime: 456, successRate: 97.8, chartData: [443, 456, 449, 463, 453, 459, 451] },
            { id: 'group-batch-export', method: 'GET', name: '/api/group/batch-export', description: '批量导出员工', avgResponseTime: 345, successRate: 98.2, chartData: [332, 345, 338, 352, 342, 348, 340] },
            { id: 'group-photo', method: 'POST', name: '/api/group/photo', description: '员工照片上传', avgResponseTime: 234, successRate: 99.0, chartData: [221, 234, 227, 241, 231, 237, 229] },
            { id: 'group-sign', method: 'POST', name: '/api/group/sign', description: '电子签名管理', avgResponseTime: 189, successRate: 99.3, chartData: [176, 189, 182, 196, 186, 192, 184] },
            { id: 'group-archive', method: 'GET', name: '/api/group/archive', description: '档案管理', avgResponseTime: 167, successRate: 99.4, chartData: [154, 167, 160, 174, 164, 170, 162] },
            { id: 'group-blacklist', method: 'GET', name: '/api/group/blacklist', description: '黑名单查询', avgResponseTime: 98, successRate: 99.8, chartData: [85, 98, 91, 105, 95, 101, 93] },
            { id: 'group-rehire', method: 'POST', name: '/api/group/rehire', description: '返聘管理', avgResponseTime: 245, successRate: 98.6, chartData: [232, 245, 238, 252, 242, 248, 240] },
            { id: 'group-secondment', method: 'POST', name: '/api/group/secondment', description: '借调管理', avgResponseTime: 223, successRate: 98.9, chartData: [210, 223, 216, 230, 220, 226, 218] },
            { id: 'group-report', method: 'GET', name: '/api/group/report', description: '人事报表', avgResponseTime: 312, successRate: 98.4, chartData: [299, 312, 305, 319, 309, 315, 307] }
          ]
        },
        informalEmployment: {
          count: 28,
          erList: ["OA账号", "功能权限", "站点访问权限", "限制性名单", "黑名单", "直管子公司（ E人事）", "Q外包"],
          apis: [
            { id: 'temp-emp-list', method: 'GET', name: '/api/temp/employees', description: '获取临时工列表', avgResponseTime: 134, successRate: 99.6, chartData: [145, 134, 156, 128, 139, 147, 132] },
            { id: 'temp-contract', method: 'POST', name: '/api/temp/contracts', description: '临时工合同管理', avgResponseTime: 128, successRate: 99.8, chartData: [134, 128, 125, 132, 129, 131, 126] },
            { id: 'outsource-manage', method: 'GET', name: '/api/outsource/manage', description: '外包人员管理', avgResponseTime: 267, successRate: 98.2, chartData: [278, 267, 289, 256, 274, 281, 263] },
            { id: 'flexible-work', method: 'POST', name: '/api/flexible/work', description: '灵活用工管理', avgResponseTime: 189, successRate: 98.9, chartData: [178, 189, 195, 182, 188, 192, 185] },
            { id: 'oa-account-create', method: 'POST', name: '/api/oa/account/create', description: 'OA账号创建', avgResponseTime: 156, successRate: 99.3, chartData: [143, 156, 149, 163, 153, 159, 151] },
            { id: 'oa-account-disable', method: 'POST', name: '/api/oa/account/disable', description: 'OA账号禁用', avgResponseTime: 112, successRate: 99.7, chartData: [99, 112, 105, 119, 109, 115, 107] },
            { id: 'oa-account-query', method: 'GET', name: '/api/oa/account/query', description: 'OA账号查询', avgResponseTime: 89, successRate: 99.9, chartData: [76, 89, 82, 96, 86, 92, 84] },
            { id: 'func-perm-grant', method: 'POST', name: '/api/permission/grant', description: '功能权限授予', avgResponseTime: 178, successRate: 99.1, chartData: [165, 178, 171, 185, 175, 181, 173] },
            { id: 'func-perm-revoke', method: 'POST', name: '/api/permission/revoke', description: '功能权限撤销', avgResponseTime: 145, successRate: 99.4, chartData: [132, 145, 138, 152, 142, 148, 140] },
            { id: 'func-perm-query', method: 'GET', name: '/api/permission/query', description: '功能权限查询', avgResponseTime: 98, successRate: 99.8, chartData: [85, 98, 91, 105, 95, 101, 93] },
            { id: 'site-access-grant', method: 'POST', name: '/api/site/access/grant', description: '站点访问授权', avgResponseTime: 167, successRate: 99.2, chartData: [154, 167, 160, 174, 164, 170, 162] },
            { id: 'site-access-revoke', method: 'POST', name: '/api/site/access/revoke', description: '站点访问撤销', avgResponseTime: 134, successRate: 99.5, chartData: [121, 134, 127, 141, 131, 137, 129] },
            { id: 'site-access-query', method: 'GET', name: '/api/site/access/query', description: '站点访问查询', avgResponseTime: 112, successRate: 99.7, chartData: [99, 112, 105, 119, 109, 115, 107] },
            { id: 'restrict-list-add', method: 'POST', name: '/api/restrict/add', description: '限制性名单添加', avgResponseTime: 189, successRate: 98.9, chartData: [176, 189, 182, 196, 186, 192, 184] },
            { id: 'restrict-list-remove', method: 'DELETE', name: '/api/restrict/remove', description: '限制性名单移除', avgResponseTime: 156, successRate: 99.2, chartData: [143, 156, 149, 163, 153, 159, 151] },
            { id: 'restrict-list-query', method: 'GET', name: '/api/restrict/query', description: '限制性名单查询', avgResponseTime: 98, successRate: 99.8, chartData: [85, 98, 91, 105, 95, 101, 93] },
            { id: 'blacklist-add', method: 'POST', name: '/api/blacklist/add', description: '黑名单添加', avgResponseTime: 178, successRate: 99.0, chartData: [165, 178, 171, 185, 175, 181, 173] },
            { id: 'blacklist-remove', method: 'DELETE', name: '/api/blacklist/remove', description: '黑名单移除', avgResponseTime: 145, successRate: 99.3, chartData: [132, 145, 138, 152, 142, 148, 140] },
            { id: 'blacklist-query', method: 'GET', name: '/api/blacklist/query', description: '黑名单查询', avgResponseTime: 89, successRate: 99.9, chartData: [76, 89, 82, 96, 86, 92, 84] },
            { id: 'subsidiary-emp-list', method: 'GET', name: '/api/subsidiary/employees', description: '直管子公司员工列表', avgResponseTime: 198, successRate: 98.8, chartData: [185, 198, 191, 205, 195, 201, 193] },
            { id: 'subsidiary-emp-sync', method: 'POST', name: '/api/subsidiary/sync', description: '直管子公司数据同步', avgResponseTime: 345, successRate: 97.9, chartData: [332, 345, 338, 352, 342, 348, 340] },
            { id: 'q-outsource-list', method: 'GET', name: '/api/q-outsource/list', description: 'Q外包人员列表', avgResponseTime: 156, successRate: 99.4, chartData: [143, 156, 149, 163, 153, 159, 151] },
            { id: 'q-outsource-create', method: 'POST', name: '/api/q-outsource/create', description: 'Q外包人员创建', avgResponseTime: 234, successRate: 98.7, chartData: [221, 234, 227, 241, 231, 237, 229] },
            { id: 'q-outsource-update', method: 'PUT', name: '/api/q-outsource/update', description: 'Q外包人员更新', avgResponseTime: 189, successRate: 99.1, chartData: [176, 189, 182, 196, 186, 192, 184] },
            { id: 'q-outsource-delete', method: 'DELETE', name: '/api/q-outsource/delete', description: 'Q外包人员删除', avgResponseTime: 145, successRate: 99.5, chartData: [132, 145, 138, 152, 142, 148, 140] },
            { id: 'intern-manage', method: 'GET', name: '/api/intern/manage', description: '实习生管理', avgResponseTime: 167, successRate: 99.3, chartData: [154, 167, 160, 174, 164, 170, 162] },
            { id: 'intern-convert', method: 'POST', name: '/api/intern/convert', description: '实习生转正', avgResponseTime: 223, successRate: 98.9, chartData: [210, 223, 216, 230, 220, 226, 218] },
            { id: 'labor-dispatch', method: 'GET', name: '/api/labor/dispatch', description: '劳务派遣管理', avgResponseTime: 198, successRate: 99.0, chartData: [185, 198, 191, 205, 195, 201, 193] }
          ]
        },
        compliance: {
          count: 24,
          erList: ["申诉"],
          apis: [
            { id: 'legal-check', method: 'GET', name: '/api/compliance/legal', description: '法律合规检查', avgResponseTime: 189, successRate: 98.9, chartData: [178, 189, 195, 182, 188, 192, 185] },
            { id: 'audit-report', method: 'POST', name: '/api/compliance/audit', description: '合规审计报告', avgResponseTime: 145, successRate: 99.1, chartData: [156, 145, 139, 148, 142, 147, 144] },
            { id: 'risk-assess', method: 'GET', name: '/api/compliance/risk', description: '风险评估管理', avgResponseTime: 278, successRate: 97.8, chartData: [289, 278, 295, 267, 281, 287, 276] },
            { id: 'policy-check', method: 'POST', name: '/api/compliance/policy', description: '政策合规验证', avgResponseTime: 234, successRate: 99.4, chartData: [245, 234, 228, 239, 231, 236, 232] },
            { id: 'appeal-submit', method: 'POST', name: '/api/appeal/submit', description: '申诉提交', avgResponseTime: 156, successRate: 99.3, chartData: [143, 156, 149, 163, 153, 159, 151] },
            { id: 'appeal-query', method: 'GET', name: '/api/appeal/query', description: '申诉查询', avgResponseTime: 112, successRate: 99.7, chartData: [99, 112, 105, 119, 109, 115, 107] },
            { id: 'appeal-process', method: 'PUT', name: '/api/appeal/process', description: '申诉处理', avgResponseTime: 198, successRate: 98.8, chartData: [185, 198, 191, 205, 195, 201, 193] },
            { id: 'appeal-close', method: 'POST', name: '/api/appeal/close', description: '申诉关闭', avgResponseTime: 134, successRate: 99.5, chartData: [121, 134, 127, 141, 131, 137, 129] },
            { id: 'labor-law-check', method: 'GET', name: '/api/labor-law/check', description: '劳动法合规检查', avgResponseTime: 267, successRate: 98.2, chartData: [254, 267, 260, 274, 264, 270, 262] },
            { id: 'contract-compliance', method: 'GET', name: '/api/contract/compliance', description: '合同合规审查', avgResponseTime: 223, successRate: 98.9, chartData: [210, 223, 216, 230, 220, 226, 218] },
            { id: 'salary-compliance', method: 'GET', name: '/api/salary/compliance', description: '薪资合规检查', avgResponseTime: 189, successRate: 99.1, chartData: [176, 189, 182, 196, 186, 192, 184] },
            { id: 'overtime-compliance', method: 'GET', name: '/api/overtime/compliance', description: '加班合规检查', avgResponseTime: 156, successRate: 99.4, chartData: [143, 156, 149, 163, 153, 159, 151] },
            { id: 'leave-compliance', method: 'GET', name: '/api/leave/compliance', description: '休假合规检查', avgResponseTime: 134, successRate: 99.6, chartData: [121, 134, 127, 141, 131, 137, 129] },
            { id: 'social-insurance-check', method: 'GET', name: '/api/social-insurance/check', description: '社保合规检查', avgResponseTime: 178, successRate: 99.2, chartData: [165, 178, 171, 185, 175, 181, 173] },
            { id: 'tax-compliance', method: 'GET', name: '/api/tax/compliance', description: '税务合规检查', avgResponseTime: 198, successRate: 98.9, chartData: [185, 198, 191, 205, 195, 201, 193] },
            { id: 'data-privacy-check', method: 'GET', name: '/api/data-privacy/check', description: '数据隐私合规', avgResponseTime: 145, successRate: 99.5, chartData: [132, 145, 138, 152, 142, 148, 140] },
            { id: 'gdpr-compliance', method: 'GET', name: '/api/gdpr/compliance', description: 'GDPR合规检查', avgResponseTime: 212, successRate: 98.7, chartData: [199, 212, 205, 219, 209, 215, 207] },
            { id: 'audit-log', method: 'GET', name: '/api/audit/log', description: '审计日志查询', avgResponseTime: 89, successRate: 99.9, chartData: [76, 89, 82, 96, 86, 92, 84] },
            { id: 'compliance-report', method: 'GET', name: '/api/compliance/report', description: '合规报告生成', avgResponseTime: 345, successRate: 98.1, chartData: [332, 345, 338, 352, 342, 348, 340] },
            { id: 'violation-record', method: 'GET', name: '/api/violation/record', description: '违规记录查询', avgResponseTime: 123, successRate: 99.6, chartData: [110, 123, 116, 130, 120, 126, 118] },
            { id: 'violation-handle', method: 'POST', name: '/api/violation/handle', description: '违规处理', avgResponseTime: 234, successRate: 98.8, chartData: [221, 234, 227, 241, 231, 237, 229] },
            { id: 'compliance-train', method: 'GET', name: '/api/compliance/training', description: '合规培训记录', avgResponseTime: 156, successRate: 99.3, chartData: [143, 156, 149, 163, 153, 159, 151] },
            { id: 'ethics-report', method: 'POST', name: '/api/ethics/report', description: '道德举报', avgResponseTime: 178, successRate: 99.1, chartData: [165, 178, 171, 185, 175, 181, 173] },
            { id: 'compliance-cert', method: 'GET', name: '/api/compliance/certificate', description: '合规证书管理', avgResponseTime: 134, successRate: 99.5, chartData: [121, 134, 127, 141, 131, 137, 129] }
          ]
        },
        jingman: {
          count: 20,
          erList: ["敬满"],
          apis: [
            { id: 'jm-employee', method: 'GET', name: '/api/jingman/employees', description: '敬满员工管理', avgResponseTime: 234, successRate: 99.4, chartData: [245, 234, 228, 239, 231, 236, 232] },
            { id: 'jm-welfare', method: 'POST', name: '/api/jingman/welfare', description: '敬满福利管理', avgResponseTime: 456, successRate: 97.5, chartData: [445, 456, 467, 448, 459, 452, 463] },
            { id: 'jm-service', method: 'GET', name: '/api/jingman/service', description: '敬满服务管理', avgResponseTime: 198, successRate: 99.0, chartData: [189, 198, 206, 192, 201, 195, 203] },
            { id: 'jm-support', method: 'POST', name: '/api/jingman/support', description: '敬满支持服务', avgResponseTime: 189, successRate: 98.7, chartData: [178, 189, 195, 182, 188, 192, 185] },
            { id: 'jm-satisfaction', method: 'GET', name: '/api/jingman/satisfaction', description: '员工满意度调查', avgResponseTime: 156, successRate: 99.3, chartData: [143, 156, 149, 163, 153, 159, 151] },
            { id: 'jm-feedback', method: 'POST', name: '/api/jingman/feedback', description: '员工反馈提交', avgResponseTime: 134, successRate: 99.6, chartData: [121, 134, 127, 141, 131, 137, 129] },
            { id: 'jm-care', method: 'GET', name: '/api/jingman/care', description: '员工关怀服务', avgResponseTime: 178, successRate: 99.1, chartData: [165, 178, 171, 185, 175, 181, 173] },
            { id: 'jm-birthday', method: 'GET', name: '/api/jingman/birthday', description: '生日祝福管理', avgResponseTime: 98, successRate: 99.8, chartData: [85, 98, 91, 105, 95, 101, 93] },
            { id: 'jm-anniversary', method: 'GET', name: '/api/jingman/anniversary', description: '入职周年管理', avgResponseTime: 112, successRate: 99.7, chartData: [99, 112, 105, 119, 109, 115, 107] },
            { id: 'jm-health', method: 'GET', name: '/api/jingman/health', description: '员工健康管理', avgResponseTime: 167, successRate: 99.2, chartData: [154, 167, 160, 174, 164, 170, 162] },
            { id: 'jm-eap', method: 'GET', name: '/api/jingman/eap', description: 'EAP心理援助', avgResponseTime: 189, successRate: 98.9, chartData: [176, 189, 182, 196, 186, 192, 184] },
            { id: 'jm-activity', method: 'GET', name: '/api/jingman/activity', description: '员工活动管理', avgResponseTime: 145, successRate: 99.4, chartData: [132, 145, 138, 152, 142, 148, 140] },
            { id: 'jm-club', method: 'GET', name: '/api/jingman/club', description: '员工社团管理', avgResponseTime: 123, successRate: 99.5, chartData: [110, 123, 116, 130, 120, 126, 118] },
            { id: 'jm-reward', method: 'POST', name: '/api/jingman/reward', description: '员工奖励管理', avgResponseTime: 198, successRate: 98.8, chartData: [185, 198, 191, 205, 195, 201, 193] },
            { id: 'jm-recognition', method: 'POST', name: '/api/jingman/recognition', description: '员工认可管理', avgResponseTime: 167, successRate: 99.2, chartData: [154, 167, 160, 174, 164, 170, 162] },
            { id: 'jm-survey', method: 'GET', name: '/api/jingman/survey', description: '员工调研管理', avgResponseTime: 212, successRate: 98.7, chartData: [199, 212, 205, 219, 209, 215, 207] },
            { id: 'jm-suggestion', method: 'POST', name: '/api/jingman/suggestion', description: '员工建议管理', avgResponseTime: 145, successRate: 99.4, chartData: [132, 145, 138, 152, 142, 148, 140] },
            { id: 'jm-complaint', method: 'POST', name: '/api/jingman/complaint', description: '员工投诉管理', avgResponseTime: 178, successRate: 99.0, chartData: [165, 178, 171, 185, 175, 181, 173] },
            { id: 'jm-exit-interview', method: 'POST', name: '/api/jingman/exit-interview', description: '离职面谈管理', avgResponseTime: 223, successRate: 98.6, chartData: [210, 223, 216, 230, 220, 226, 218] },
            { id: 'jm-engagement', method: 'GET', name: '/api/jingman/engagement', description: '员工敬业度分析', avgResponseTime: 267, successRate: 98.3, chartData: [254, 267, 260, 274, 264, 270, 262] }
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
          top: branchTop + 'px'
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
    handleSwitchToB() {
      // 切换到企业监控版（B端版本）
      this.$router.push('/home-b2b');
      this.$message.success('已切换到企业监控版');
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

/* API概览样式 */
.api-overview {
  margin: -24px 0 32px;
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