/**
 * 已审核通过的应用列表
 * 用于接口授权、应用申请等页面
 */

export const APPROVED_APPS = [
  {
    id: 'app-001',
    name: '人力资源管理',
    siteUrl: 'https://hr.company.com',
    description: '企业内部人力资源管理平台',
    appKey: 'ak_1234567890abcdef',
    appSecret: 'as_abcdef1234567890',
    status: 'approved',
    icon: 'user-circle',
    statusClass: 'approved',
    statusText: '已通过',
    // 已绑定的API和字段 - 使用erCategories中的真实API ID
    bindingApis: [
      {
        apiId: 'group-emp-list',
        apiName: '/api/group/employees',
        apiMethod: 'GET',
        apiDescription: '获取集团员工列表',
        fields: ['employeeId', 'name', 'department', 'position', 'status']
      },
      {
        apiId: 'group-contract',
        apiName: '/api/group/contracts',
        apiMethod: 'GET',
        apiDescription: '集团劳动合同管理',
        fields: ['contractId', 'employeeId', 'contractType', 'startDate', 'endDate']
      },
      {
        apiId: 'group-dept',
        apiName: '/api/group/departments',
        apiMethod: 'GET',
        apiDescription: '部门信息查询',
        fields: ['deptId', 'deptName', 'parentDept']
      }
    ]
  },
  {
    id: 'app-002',
    name: '移动办公APP',
    siteUrl: 'https://mobile.company.com',
    description: '移动端办公应用',
    appKey: 'ak_fedcba0987654321',
    appSecret: 'as_0987654321fedcba',
    status: 'approved',
    icon: 'mobile',
    statusClass: 'approved',
    statusText: '已通过',
    bindingApis: [
      {
        apiId: 'group-onboard',
        apiName: '/api/group/onboard',
        apiMethod: 'POST',
        apiDescription: '入职办理',
        fields: ['candidateId', 'entryDate', 'department', 'position']
      },
      {
        apiId: 'group-offboard',
        apiName: '/api/group/offboard',
        apiMethod: 'POST',
        apiDescription: '离职办理',
        fields: ['employeeId', 'lastDay', 'reason']
      }
    ]
  },
  {
    id: 'app-003',
    name: '数据分析平台',
    siteUrl: 'https://analytics.company.com',
    description: '企业数据分析平台',
    appKey: 'ak_abcd1234efgh5678',
    appSecret: 'as_5678efghabcd1234',
    status: 'approved',
    icon: 'chart-pie',
    statusClass: 'approved',
    statusText: '已通过',
    bindingApis: [
      {
        apiId: 'group-history',
        apiName: '/api/group/history',
        apiMethod: 'GET',
        apiDescription: '员工履历查询',
        fields: ['employeeId', 'startDate', 'endDate']
      },
      {
        apiId: 'group-position',
        apiName: '/api/group/positions',
        apiMethod: 'GET',
        apiDescription: '职位信息查询',
        fields: ['positionId', 'positionName', 'level']
      },
      {
        apiId: 'group-rank',
        apiName: '/api/group/ranks',
        apiMethod: 'GET',
        apiDescription: '职级信息查询',
        fields: ['rankId', 'rankName']
      }
    ]
  },
  {
    id: 'app-004',
    name: '智能招聘系统',
    siteUrl: 'https://recruit.company.com',
    description: '智能化招聘管理系统',
    appKey: '',
    appSecret: '',
    status: 'pending',
    icon: 'user-add',
    statusClass: 'pending',
    statusText: '审核中',
    bindingApis: []
  },
  {
    id: 'app-005',
    name: '培训学习平台',
    siteUrl: 'https://learn.company.com',
    description: '员工在线培训学习平台',
    appKey: '',
    appSecret: '',
    status: 'pending',
    icon: 'book-open',
    statusClass: 'pending',
    statusText: '审核中',
    bindingApis: []
  }
]

/**
 * 获取已通过审核的应用列表
 * @returns {Array}
 */
export function getApprovedAppsList() {
  return APPROVED_APPS.filter(app => app.status === 'approved')
}

/**
 * 获取审核中的应用列表
 * @returns {Array}
 */
export function getPendingAppsList() {
  return APPROVED_APPS.filter(app => app.status === 'pending')
}

/**
 * 根据ID获取应用
 * @param {string} appId 
 * @returns {Object|undefined}
 */
export function getAppById(appId) {
  return APPROVED_APPS.find(app => app.id === appId)
}

/**
 * 根据AppKey获取应用
 * @param {string} appKey 
 * @returns {Object|undefined}
 */
export function getAppByKey(appKey) {
  return APPROVED_APPS.find(app => app.appKey === appKey)
}

/**
 * 获取所有已审核应用
 * @returns {Array}
 */
export function getApprovedApps() {
  return [...APPROVED_APPS]
}
