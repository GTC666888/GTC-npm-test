<template>
  <div class="api-auth-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <t-button theme="default" variant="text" @click="$router.back()">
          <template #icon><t-icon name="chevron-left" /></template>
          返回
        </t-button>
        <div class="header-title">
          <h1>接口授权</h1>
          <p>为已通过审核的应用配置API访问权限，并自定义返回字段</p>
        </div>
      </div>
    </div>

    <div class="auth-content">
      <!-- 步骤指示器 -->
      <div class="steps-container">
        <t-steps :current="currentStep" theme="dot">
          <t-step-item title="选择应用" content="选择需要授权的应用" />
          <t-step-item title="选择API" content="选择需要访问的API接口" />
          <t-step-item title="配置字段" content="自定义API返回字段" />
          <t-step-item title="提交申请" content="确认并提交授权申请" />
        </t-steps>
      </div>

      <!-- 步骤1: 选择应用 -->
      <div v-show="currentStep === 0" class="step-panel">
        <div class="panel-header">
          <h2>选择应用</h2>
          <p>请选择一个已通过审核的应用进行API授权</p>
        </div>

        <div class="app-list">
          <div 
            v-for="app in approvedApps" 
            :key="app.id" 
            class="app-card"
            :class="{ 'selected': selectedApp && selectedApp.id === app.id }"
            @click="selectApp(app)"
          >
            <div class="app-icon">
              <t-icon name="app" size="32px" />
            </div>
            <div class="app-info">
              <h3>{{ app.name }}</h3>
              <p class="app-url">{{ app.siteUrl }}</p>
              <p class="app-desc">{{ app.description }}</p>
              <div class="app-meta">
                <t-tag theme="success" size="small">已审核</t-tag>
                <span class="app-key">AppKey: {{ app.appKey }}</span>
              </div>
            </div>
            <div class="app-select-icon">
              <t-icon v-if="selectedApp && selectedApp.id === app.id" name="check-circle-filled" />
            </div>
          </div>
        </div>

        <div class="step-actions">
          <t-button theme="primary" size="large" @click="nextStep" :disabled="!selectedApp">
            下一步
          </t-button>
        </div>
      </div>

      <!-- 步骤2: 选择API -->
      <div v-show="currentStep === 1" class="step-panel">
        <div class="panel-header">
          <h2>选择API接口</h2>
          <p>选择应用需要访问的API接口，支持按业务领域筛选和关键词搜索</p>
        </div>

        <!-- 搜索和筛选工具栏 -->
        <div class="toolbar">
          <t-input 
            v-model="apiSearchKeyword" 
            placeholder="搜索API接口..." 
            clearable
            style="width: 300px;"
          >
            <template #prefix-icon>
              <t-icon name="search" />
            </template>
          </t-input>

          <t-select 
            v-model="selectedCategory" 
            placeholder="按业务领域筛选" 
            clearable
            style="width: 200px;"
          >
            <t-option value="all" label="全部领域" />
            <t-option value="employee" label="员工管理" />
            <t-option value="organization" label="组织架构" />
            <t-option value="attendance" label="考勤管理" />
            <t-option value="compensation" label="薪酬福利" />
            <t-option value="performance" label="绩效管理" />
            <t-option value="training" label="培训发展" />
          </t-select>

          <div class="selection-stats">
            已选择 <span class="count">{{ selectedApis.length }}</span> 个API
          </div>
        </div>

        <!-- API列表 -->
        <div class="api-list">
          <div v-for="category in filteredApiCategories" :key="category.key" class="api-category">
            <div class="category-header">
              <div class="category-title">
                <t-icon :name="category.icon" />
                <span>{{ category.name }}</span>
                <t-tag theme="primary" variant="light">{{ category.apis.length }} 个API</t-tag>
              </div>
              <t-checkbox 
                :checked="isCategorySelected(category.key)"
                :indeterminate="isCategoryIndeterminate(category.key)"
                @change="toggleCategory(category.key)"
              >
                全选
              </t-checkbox>
            </div>

            <div class="api-items">
              <div v-for="api in category.apis" :key="api.id" class="api-item">
                <t-checkbox 
                  :value="api.id"
                  :checked="selectedApis.includes(api.id)"
                  @change="toggleApi(api.id)"
                >
                  <div class="api-item-content">
                    <div class="api-item-header">
                      <span class="api-method" :class="api.method">{{ api.method }}</span>
                      <span class="api-name">{{ api.name }}</span>
                    </div>
                    <div class="api-item-desc">{{ api.description }}</div>
                  </div>
                </t-checkbox>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <t-button theme="default" size="large" @click="prevStep">
            上一步
          </t-button>
          <t-button theme="primary" size="large" @click="nextStep" :disabled="selectedApis.length === 0">
            下一步
          </t-button>
        </div>
      </div>

      <!-- 步骤3: 配置字段 -->
      <div v-show="currentStep === 2" class="step-panel">
        <div class="panel-header">
          <h2>配置返回字段</h2>
          <p>为每个API选择需要返回的字段，未选择的字段将不会在响应中返回</p>
        </div>

        <div class="field-config-list">
          <div v-for="apiId in selectedApis" :key="apiId" class="field-config-card">
            <template v-if="getApiById(apiId)">
              <div class="config-card-header">
                <div class="api-info">
                  <span class="api-method" :class="getApiById(apiId).method">{{ getApiById(apiId).method }}</span>
                  <span class="api-name">{{ getApiById(apiId).name }}</span>
                </div>
                <t-checkbox 
                  :checked="isAllFieldsSelected(apiId)"
                  :indeterminate="isSomeFieldsSelected(apiId)"
                  @change="toggleAllFields(apiId)"
                >
                  全选
                </t-checkbox>
              </div>

              <div class="field-list">
                <t-checkbox-group v-if="apiFieldSelections[apiId]" v-model="apiFieldSelections[apiId]">
                  <div class="field-grid">
                    <div v-for="field in getApiById(apiId).fields" :key="field.name" class="field-item">
                    <t-checkbox :value="field.name">
                      <div class="field-content">
                        <div class="field-name">
                          {{ field.name }}
                          <t-tag v-if="field.required" theme="danger" size="small" variant="light">必需</t-tag>
                        </div>
                        <div class="field-type">{{ field.type }}</div>
                        <div class="field-desc">{{ field.description }}</div>
                      </div>
                      </t-checkbox>
                    </div>
                  </div>
                </t-checkbox-group>
              </div>
            </template>
          </div>
        </div>

        <div class="step-actions">
          <t-button theme="default" size="large" @click="prevStep">
            上一步
          </t-button>
          <t-button theme="primary" size="large" @click="nextStep">
            下一步
          </t-button>
        </div>
      </div>

      <!-- 步骤4: 完成授权 -->
      <div v-show="currentStep === 3" class="step-panel">
        <div class="panel-header">
          <h2>确认授权信息</h2>
          <p>请确认以下授权配置信息，提交后将生效</p>
        </div>

        <div class="summary-section">
          <!-- 应用信息 -->
          <div class="summary-card">
            <h3>应用信息</h3>
            <div v-if="selectedApp" class="summary-content">
              <div class="summary-item">
                <span class="label">应用名称：</span>
                <span class="value">{{ selectedApp.name }}</span>
              </div>
              <div class="summary-item">
                <span class="label">站点地址：</span>
                <span class="value">{{ selectedApp.siteUrl }}</span>
              </div>
              <div class="summary-item">
                <span class="label">AppKey：</span>
                <span class="value">{{ selectedApp.appKey }}</span>
              </div>
            </div>
          </div>

          <!-- API授权列表 -->
          <div class="summary-card">
            <h3>API授权列表 ({{ selectedApis.length }}个)</h3>
            <div class="summary-api-list">
              <div v-for="apiId in selectedApis" :key="apiId" class="summary-api-item">
                <template v-if="getApiById(apiId)">
                  <div class="api-header">
                    <span class="api-method" :class="getApiById(apiId).method">{{ getApiById(apiId).method }}</span>
                    <span class="api-name">{{ getApiById(apiId).name }}</span>
                  </div>
                  <div class="api-fields">
                    <span class="fields-label">返回字段：</span>
                    <template v-if="apiFieldSelections[apiId]">
                      <t-tag 
                        v-for="fieldName in apiFieldSelections[apiId]" 
                        :key="fieldName" 
                        size="small" 
                        variant="outline"
                      >
                        {{ fieldName }}
                      </t-tag>
                    </template>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <t-button theme="default" size="large" @click="prevStep">
            上一步
          </t-button>
          <t-button 
            theme="primary" 
            size="large" 
            @click="submitAuthorization"
            :loading="submitting"
          >
            <t-icon name="check" />
            提交申请
          </t-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon as TIcon } from 'tdesign-icons-vue'
import { MessagePlugin } from 'tdesign-vue'

export default {
  name: 'ApiAuth',
  components: {
    TIcon
  },
  data() {
    return {
      currentStep: 0,
      submitting: false,
      
      // 选中的应用
      selectedApp: null,
      
      // 已审核通过的应用列表
      approvedApps: [
        {
          id: 'app-001',
          name: '人力资源管理',
          siteUrl: 'https://hr.company.com',
          description: '企业内部人力资源管理平台，用于员工信息管理、考勤统计、薪资核算等',
          appKey: 'ak_1234567890abcdef',
          appSecret: 'as_abcdef1234567890',
          status: 'approved'
        },
        {
          id: 'app-002',
          name: '移动办公APP',
          siteUrl: 'https://mobile.company.com',
          description: '移动端办公应用，支持移动打卡、请假审批、工资查询等功能',
          appKey: 'ak_fedcba0987654321',
          appSecret: 'as_0987654321fedcba',
          status: 'approved'
        },
        {
          id: 'app-003',
          name: '数据分析平台',
          siteUrl: 'https://analytics.company.com',
          description: '企业数据分析平台，用于人力资源数据统计和可视化分析',
          appKey: 'ak_abcd1234efgh5678',
          appSecret: 'as_5678efghabcd1234',
          status: 'approved'
        }
      ],
      
      // API选择相关
      apiSearchKeyword: '',
      selectedCategory: 'all',
      selectedApis: [],
      
      // API字段选择
      apiFieldSelections: {},
      
      // API分类数据
      apiCategories: [
        {
          key: 'groupEmployment',
          name: '集团用工',
          icon: 'usergroup',
          apis: [
            { 
              id: 'group-emp-list', 
              method: 'GET', 
              name: '/api/group/employees', 
              description: '获取集团员工列表',
              fields: [
                { name: 'id', type: 'string', description: '员工ID', required: true },
                { name: 'name', type: 'string', description: '员工姓名', required: true },
                { name: 'email', type: 'string', description: '邮箱地址', required: false },
                { name: 'phone', type: 'string', description: '手机号码', required: false },
                { name: 'department', type: 'string', description: '所属部门', required: false },
                { name: 'position', type: 'string', description: '职位', required: false },
                { name: 'hireDate', type: 'date', description: '入职日期', required: false },
                { name: 'status', type: 'string', description: '员工状态', required: true }
              ]
            },
            { 
              id: 'group-contract', 
              method: 'GET', 
              name: '/api/group/contracts', 
              description: '集团劳动合同管理',
              fields: [
                { name: 'id', type: 'string', description: '合同ID', required: true },
                { name: 'employeeId', type: 'string', description: '员工ID', required: true },
                { name: 'contractType', type: 'string', description: '合同类型', required: true },
                { name: 'startDate', type: 'date', description: '合同开始日期', required: true },
                { name: 'endDate', type: 'date', description: '合同结束日期', required: false },
                { name: 'status', type: 'string', description: '合同状态', required: true }
              ]
            },
            { 
              id: 'group-transfer', 
              method: 'POST', 
              name: '/api/group/transfer', 
              description: '集团内部调动',
              fields: [
                { name: 'id', type: 'string', description: '调动ID', required: true },
                { name: 'employeeId', type: 'string', description: '员工ID', required: true },
                { name: 'fromDepartment', type: 'string', description: '原部门', required: true },
                { name: 'toDepartment', type: 'string', description: '目标部门', required: true },
                { name: 'transferDate', type: 'date', description: '调动日期', required: true },
                { name: 'status', type: 'string', description: '调动状态', required: true }
              ]
            }
          ]
        },
        {
          key: 'informalEmployment',
          name: '非正式用工',
          icon: 'user',
          apis: [
            { 
              id: 'temp-emp-list', 
              method: 'GET', 
              name: '/api/temp/employees', 
              description: '获取临时工列表',
              fields: [
                { name: 'id', type: 'string', description: '临时工ID', required: true },
                { name: 'name', type: 'string', description: '姓名', required: true },
                { name: 'phone', type: 'string', description: '联系电话', required: true },
                { name: 'workType', type: 'string', description: '工作类型', required: true },
                { name: 'startDate', type: 'date', description: '开始日期', required: true },
                { name: 'endDate', type: 'date', description: '结束日期', required: false },
                { name: 'status', type: 'string', description: '状态', required: true }
              ]
            },
            { 
              id: 'outsource-manage', 
              method: 'GET', 
              name: '/api/outsource/manage', 
              description: '外包人员管理',
              fields: [
                { name: 'id', type: 'string', description: '外包人员ID', required: true },
                { name: 'name', type: 'string', description: '姓名', required: true },
                { name: 'company', type: 'string', description: '外包公司', required: true },
                { name: 'project', type: 'string', description: '项目名称', required: false },
                { name: 'contractPeriod', type: 'string', description: '合同期限', required: false },
                { name: 'status', type: 'string', description: '状态', required: true }
              ]
            },
            { 
              id: 'flexible-work', 
              method: 'POST', 
              name: '/api/flexible/work', 
              description: '灵活用工管理',
              fields: [
                { name: 'id', type: 'string', description: '灵活用工ID', required: true },
                { name: 'workerId', type: 'string', description: '工作者ID', required: true },
                { name: 'workType', type: 'string', description: '工作类型', required: true },
                { name: 'workHours', type: 'number', description: '工作时长', required: false },
                { name: 'payRate', type: 'number', description: '薪酬标准', required: false },
                { name: 'status', type: 'string', description: '状态', required: true }
              ]
            }
          ]
        },
        {
          key: 'compliance',
          name: '合规',
          icon: 'secured',
          apis: [
            { 
              id: 'legal-check', 
              method: 'GET', 
              name: '/api/compliance/legal', 
              description: '法律合规检查',
              fields: [
                { name: 'id', type: 'string', description: '检查ID', required: true },
                { name: 'checkType', type: 'string', description: '检查类型', required: true },
                { name: 'checkDate', type: 'date', description: '检查日期', required: true },
                { name: 'result', type: 'string', description: '检查结果', required: true },
                { name: 'riskLevel', type: 'string', description: '风险等级', required: false },
                { name: 'recommendations', type: 'array', description: '建议措施', required: false }
              ]
            },
            { 
              id: 'audit-report', 
              method: 'POST', 
              name: '/api/compliance/audit', 
              description: '合规审计报告',
              fields: [
                { name: 'id', type: 'string', description: '审计ID', required: true },
                { name: 'auditPeriod', type: 'string', description: '审计周期', required: true },
                { name: 'auditScope', type: 'string', description: '审计范围', required: true },
                { name: 'findings', type: 'array', description: '审计发现', required: false },
                { name: 'complianceScore', type: 'number', description: '合规评分', required: true },
                { name: 'status', type: 'string', description: '审计状态', required: true }
              ]
            },
            { 
              id: 'risk-assess', 
              method: 'GET', 
              name: '/api/compliance/risk', 
              description: '风险评估管理',
              fields: [
                { name: 'id', type: 'string', description: '风险ID', required: true },
                { name: 'riskType', type: 'string', description: '风险类型', required: true },
                { name: 'riskLevel', type: 'string', description: '风险等级', required: true },
                { name: 'probability', type: 'number', description: '发生概率', required: false },
                { name: 'impact', type: 'number', description: '影响程度', required: false },
                { name: 'mitigationPlan', type: 'string', description: '缓解计划', required: false }
              ]
            }
          ]
        },
        {
          key: 'jingman',
          name: '敬满',
          icon: 'heart',
          apis: [
            { 
              id: 'jm-employee', 
              method: 'GET', 
              name: '/api/jingman/employees', 
              description: '敬满员工管理',
              fields: [
                { name: 'id', type: 'string', description: '员工ID', required: true },
                { name: 'name', type: 'string', description: '员工姓名', required: true },
                { name: 'age', type: 'number', description: '年龄', required: false },
                { name: 'serviceYears', type: 'number', description: '服务年限', required: false },
                { name: 'specialNeeds', type: 'array', description: '特殊需求', required: false },
                { name: 'careLevel', type: 'string', description: '关怀等级', required: false }
              ]
            },
            { 
              id: 'jm-welfare', 
              method: 'POST', 
              name: '/api/jingman/welfare', 
              description: '敬满福利管理',
              fields: [
                { name: 'id', type: 'string', description: '福利ID', required: true },
                { name: 'employeeId', type: 'string', description: '员工ID', required: true },
                { name: 'welfareType', type: 'string', description: '福利类型', required: true },
                { name: 'amount', type: 'number', description: '福利金额', required: false },
                { name: 'effectiveDate', type: 'date', description: '生效日期', required: true },
                { name: 'status', type: 'string', description: '福利状态', required: true }
              ]
            },
            { 
              id: 'jm-service', 
              method: 'GET', 
              name: '/api/jingman/service', 
              description: '敬满服务管理',
              fields: [
                { name: 'id', type: 'string', description: '服务ID', required: true },
                { name: 'serviceType', type: 'string', description: '服务类型', required: true },
                { name: 'serviceProvider', type: 'string', description: '服务提供方', required: false },
                { name: 'serviceDate', type: 'date', description: '服务日期', required: true },
                { name: 'beneficiaries', type: 'array', description: '受益人员', required: false },
                { name: 'feedback', type: 'string', description: '服务反馈', required: false }
              ]
            }
          ]
        }
      ]
    }
  },
  computed: {
    filteredApiCategories() {
      let categories = this.apiCategories
      
      // 按分类筛选
      if (this.selectedCategory && this.selectedCategory !== 'all') {
        categories = categories.filter(cat => cat.key === this.selectedCategory)
      }
      
      // 按关键词搜索
      if (this.apiSearchKeyword) {
        const keyword = this.apiSearchKeyword.toLowerCase()
        categories = categories.map(cat => ({
          ...cat,
          apis: cat.apis.filter(api => 
            api.name.toLowerCase().includes(keyword) ||
            api.description.toLowerCase().includes(keyword)
          )
        })).filter(cat => cat.apis.length > 0)
      }
      
      return categories
    }
  },
  methods: {
    // 选择应用
    selectApp(app) {
      this.selectedApp = app
    },
    
    // 步骤导航
    nextStep() {
      if (this.currentStep === 0 && !this.selectedApp) {
        MessagePlugin.warning('请先选择一个应用')
        return
      }
      if (this.currentStep === 1 && this.selectedApis.length === 0) {
        MessagePlugin.warning('请至少选择一个API接口')
        return
      }
      if (this.currentStep === 2) {
        // 初始化字段选择（默认选中所有必需字段）
        this.selectedApis.forEach(apiId => {
          if (!this.apiFieldSelections[apiId]) {
            const api = this.getApiById(apiId)
            this.$set(this.apiFieldSelections, apiId, api.fields.filter(f => f.required).map(f => f.name))
          }
        })
      }
      this.currentStep++
    },
    
    prevStep() {
      this.currentStep--
    },
    
    // API选择相关
    toggleApi(apiId) {
      const index = this.selectedApis.indexOf(apiId)
      if (index > -1) {
        this.selectedApis.splice(index, 1)
        // 移除字段选择
        this.$delete(this.apiFieldSelections, apiId)
      } else {
        this.selectedApis.push(apiId)
      }
    },
    
    toggleCategory(categoryKey) {
      const category = this.apiCategories.find(cat => cat.key === categoryKey)
      if (!category) return
      
      const categoryApiIds = category.apis.map(api => api.id)
      const allSelected = categoryApiIds.every(id => this.selectedApis.includes(id))
      
      if (allSelected) {
        // 取消全选
        this.selectedApis = this.selectedApis.filter(id => !categoryApiIds.includes(id))
        categoryApiIds.forEach(id => {
          this.$delete(this.apiFieldSelections, id)
        })
      } else {
        // 全选
        categoryApiIds.forEach(id => {
          if (!this.selectedApis.includes(id)) {
            this.selectedApis.push(id)
          }
        })
      }
    },
    
    isCategorySelected(categoryKey) {
      const category = this.apiCategories.find(cat => cat.key === categoryKey)
      if (!category) return false
      
      const categoryApiIds = category.apis.map(api => api.id)
      return categoryApiIds.length > 0 && categoryApiIds.every(id => this.selectedApis.includes(id))
    },
    
    isCategoryIndeterminate(categoryKey) {
      const category = this.apiCategories.find(cat => cat.key === categoryKey)
      if (!category) return false
      
      const categoryApiIds = category.apis.map(api => api.id)
      const selectedCount = categoryApiIds.filter(id => this.selectedApis.includes(id)).length
      return selectedCount > 0 && selectedCount < categoryApiIds.length
    },
    
    // 字段选择相关
    toggleAllFields(apiId) {
      const api = this.getApiById(apiId)
      if (!api) return
      
      const allFieldNames = api.fields.map(f => f.name)
      const currentSelection = this.apiFieldSelections[apiId] || []
      
      if (currentSelection.length === allFieldNames.length) {
        // 取消全选，但保留必需字段
        this.$set(this.apiFieldSelections, apiId, api.fields.filter(f => f.required).map(f => f.name))
      } else {
        // 全选
        this.$set(this.apiFieldSelections, apiId, allFieldNames)
      }
    },
    
    isAllFieldsSelected(apiId) {
      const api = this.getApiById(apiId)
      if (!api) return false
      
      const allFieldNames = api.fields.map(f => f.name)
      const currentSelection = this.apiFieldSelections[apiId] || []
      return currentSelection.length === allFieldNames.length
    },
    
    isSomeFieldsSelected(apiId) {
      const api = this.getApiById(apiId)
      if (!api) return false
      
      const allFieldNames = api.fields.map(f => f.name)
      const currentSelection = this.apiFieldSelections[apiId] || []
      return currentSelection.length > 0 && currentSelection.length < allFieldNames.length
    },
    
    // 获取API信息
    getApiById(apiId) {
      for (const category of this.apiCategories) {
        const api = category.apis.find(a => a.id === apiId)
        if (api) return api
      }
      return null
    },
    
    // 提交授权
    submitAuthorization() {
      this.submitting = true
      
      // 模拟提交
      setTimeout(() => {
        MessagePlugin.success({
          content: '授权申请提交成功！API权限配置已生效',
          duration: 3000
        })
        
        this.submitting = false
        
        // 重置并返回
        setTimeout(() => {
          this.$router.push('/')
        }, 1500)
      }, 1500)
    }
  }
}
</script>

<style scoped>
.api-auth-container {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px 0;
  margin-bottom: 32px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.header-title {
  margin-top: 16px;
}

.header-title h1 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.header-title p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

/* 内容区域 */
.auth-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

/* 步骤指示器 */
.steps-container {
  background: white;
  padding: 32px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 步骤面板 */
.step-panel {
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.panel-header {
  margin-bottom: 32px;
}

.panel-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.panel-header p {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

/* 应用列表 */
.app-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.app-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.app-card:hover {
  border-color: #0052d9;
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.15);
}

.app-card.selected {
  border-color: #0052d9;
  background: #f0f5ff;
}

.app-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.app-info {
  flex: 1;
}

.app-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.app-url {
  font-size: 13px;
  color: #0052d9;
  margin: 0 0 8px 0;
}

.app-desc {
  font-size: 13px;
  color: #595959;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.app-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #8c8c8c;
}

.app-key {
  font-family: 'Monaco', 'Consolas', monospace;
}

.app-select-icon {
  flex-shrink: 0;
  font-size: 24px;
  color: #0052d9;
}

/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.selection-stats {
  margin-left: auto;
  font-size: 14px;
  color: #595959;
}

.selection-stats .count {
  font-size: 18px;
  font-weight: 600;
  color: #0052d9;
  margin: 0 4px;
}

/* API列表 */
.api-list {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.api-category {
  margin-bottom: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.api-items {
  padding: 12px;
}

.api-item {
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}

.api-item:hover {
  background: #fafafa;
}

.api-item-content {
  flex: 1;
  margin-left: 8px;
}

.api-item-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.api-method {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
}

.api-method.GET { background: #e6fffb; color: #13c2c2; }
.api-method.POST { background: #f6ffed; color: #52c41a; }
.api-method.PUT { background: #fff7e6; color: #fa8c16; }
.api-method.DELETE { background: #fff1f0; color: #ff4d4f; }

.api-name {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.api-item-desc {
  font-size: 13px;
  color: #8c8c8c;
}

/* 字段配置 */
.field-config-list {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.field-config-card {
  margin-bottom: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.config-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.field-list {
  padding: 20px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.field-item {
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  transition: all 0.2s;
}

.field-item:hover {
  border-color: #0052d9;
  background: #f0f5ff;
}

.field-content {
  margin-left: 8px;
}

.field-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 4px;
}

.field-type {
  font-size: 12px;
  color: #0052d9;
  font-family: 'Monaco', 'Consolas', monospace;
  margin-bottom: 4px;
}

.field-desc {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.4;
}

/* 摘要信息 */
.summary-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.summary-card {
  padding: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.summary-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 16px 0;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  font-size: 14px;
}

.summary-item .label {
  color: #8c8c8c;
  min-width: 100px;
}

.summary-item .value {
  color: #262626;
  font-weight: 500;
}

.summary-api-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-api-item {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.api-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.api-fields {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.fields-label {
  font-size: 13px;
  color: #8c8c8c;
}

/* 步骤操作 */
.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #e8e8e8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-list {
    grid-template-columns: 1fr;
  }
  
  .field-grid {
    grid-template-columns: 1fr;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar .t-input,
  .toolbar .t-select {
    width: 100% !important;
  }
  
  .selection-stats {
    margin-left: 0;
    text-align: center;
  }
}
</style>
