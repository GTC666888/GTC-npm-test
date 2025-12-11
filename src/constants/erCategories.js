/**
 * ER领域分类数据常量
 * 包含四大类：集团用工、非正式用工、合规、敬满
 */

export const ER_CATEGORIES = {
  groupEmployment: {
    key: 'groupEmployment',
    name: '集团用工',
    icon: 'usergroup',
    count: 32,
    erList: ["入职", "离职", "异动（调动 派驻）", "人事合同", "校友会"],
    apis: [
      { id: 'group-emp-list', method: 'GET', name: '/api/group/employees', description: '获取集团员工列表', avgResponseTime: 156, successRate: 99.2, chartData: [120, 156, 134, 178, 145, 167, 152], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '员工唯一标识符，格式为EMP+8位数字', required: true },
        { name: 'name', type: 'string', label: '姓名', description: '员工真实姓名', required: true },
        { name: 'department', type: 'string', label: '部门', description: '员工所属部门名称', required: false },
        { name: 'position', type: 'string', label: '职位', description: '员工当前职位名称', required: false },
        { name: 'status', type: 'string', label: '状态', description: '员工状态：在职/离职/休假', required: false }
      ] },
      { id: 'group-emp-create', method: 'POST', name: '/api/group/employees', description: '创建集团员工', avgResponseTime: 234, successRate: 98.8, chartData: [245, 223, 256, 267, 234, 245, 228], fields: [
        { name: 'name', type: 'string', label: '姓名', description: '员工真实姓名，2-20个字符', required: true },
        { name: 'idCard', type: 'string', label: '身份证号', description: '18位有效身份证号码', required: true },
        { name: 'department', type: 'string', label: '部门', description: '入职部门ID或名称', required: true },
        { name: 'position', type: 'string', label: '职位', description: '入职职位ID或名称', required: true },
        { name: 'entryDate', type: 'date', label: '入职日期', description: '入职日期，格式YYYY-MM-DD', required: true }
      ] },
      { id: 'group-contract', method: 'GET', name: '/api/group/contracts', description: '集团劳动合同管理', avgResponseTime: 189, successRate: 99.5, chartData: [167, 189, 178, 195, 182, 188, 191], fields: [
        { name: 'contractId', type: 'string', label: '合同ID', description: '合同唯一标识符', required: true },
        { name: 'employeeId', type: 'string', label: '员工ID', description: '关联的员工ID', required: true },
        { name: 'contractType', type: 'string', label: '合同类型', description: '固定期限/无固定期限/劳务合同', required: false },
        { name: 'startDate', type: 'date', label: '开始日期', description: '合同生效日期', required: false },
        { name: 'endDate', type: 'date', label: '结束日期', description: '合同到期日期', required: false }
      ] },
      { id: 'group-transfer', method: 'POST', name: '/api/group/transfer', description: '集团内部调动', avgResponseTime: 267, successRate: 98.3, chartData: [278, 267, 256, 274, 261, 269, 263], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '被调动员工的ID', required: true },
        { name: 'fromDept', type: 'string', label: '原部门', description: '调动前所在部门', required: true },
        { name: 'toDept', type: 'string', label: '目标部门', description: '调动后目标部门', required: true },
        { name: 'effectiveDate', type: 'date', label: '生效日期', description: '调动生效日期', required: true },
        { name: 'reason', type: 'string', label: '调动原因', description: '调动原因说明', required: false }
      ] },
      { id: 'group-onboard', method: 'POST', name: '/api/group/onboard', description: '入职办理', avgResponseTime: 178, successRate: 99.1, chartData: [165, 178, 172, 185, 176, 180, 174], fields: [
        { name: 'candidateId', type: 'string', label: '候选人ID', description: '招聘系统中的候选人ID', required: true },
        { name: 'entryDate', type: 'date', label: '入职日期', description: '正式入职日期', required: true },
        { name: 'department', type: 'string', label: '部门', description: '入职部门', required: true },
        { name: 'position', type: 'string', label: '职位', description: '入职职位', required: true },
        { name: 'mentor', type: 'string', label: '导师', description: '入职导师员工ID', required: false }
      ] },
      { id: 'group-offboard', method: 'POST', name: '/api/group/offboard', description: '离职办理', avgResponseTime: 198, successRate: 98.9, chartData: [185, 198, 192, 205, 196, 200, 194], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '离职员工ID', required: true },
        { name: 'lastDay', type: 'date', label: '最后工作日', description: '最后一个工作日', required: true },
        { name: 'reason', type: 'string', label: '离职原因', description: '离职原因分类', required: true },
        { name: 'handover', type: 'string', label: '交接人', description: '工作交接人员工ID', required: false }
      ] },
      { id: 'group-dispatch', method: 'POST', name: '/api/group/dispatch', description: '派驻管理', avgResponseTime: 212, successRate: 99.0, chartData: [200, 212, 206, 218, 210, 214, 208], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '被派驻员工ID', required: true },
        { name: 'targetCompany', type: 'string', label: '派驻公司', description: '派驻目标公司名称', required: true },
        { name: 'startDate', type: 'date', label: '开始日期', description: '派驻开始日期', required: true },
        { name: 'endDate', type: 'date', label: '结束日期', description: '派驻结束日期', required: false }
      ] },
      { id: 'group-alumni', method: 'GET', name: '/api/group/alumni', description: '校友会管理', avgResponseTime: 145, successRate: 99.4, chartData: [132, 145, 138, 152, 142, 148, 140], fields: [
        { name: 'alumniId', type: 'string', label: '校友ID', description: '校友唯一标识', required: true },
        { name: 'name', type: 'string', label: '姓名', description: '校友姓名', required: false },
        { name: 'company', type: 'string', label: '当前公司', description: '校友当前就职公司', required: false }
      ] },
      { id: 'group-position', method: 'GET', name: '/api/group/positions', description: '职位信息查询', avgResponseTime: 123, successRate: 99.6, chartData: [110, 123, 116, 130, 120, 126, 118], fields: [
        { name: 'positionId', type: 'string', label: '职位ID', description: '职位唯一标识', required: true },
        { name: 'positionName', type: 'string', label: '职位名称', description: '职位名称', required: false },
        { name: 'level', type: 'number', label: '职级', description: '职位对应职级', required: false }
      ] },
      { id: 'group-dept', method: 'GET', name: '/api/group/departments', description: '部门信息查询', avgResponseTime: 134, successRate: 99.5, chartData: [121, 134, 127, 141, 131, 137, 129], fields: [
        { name: 'deptId', type: 'string', label: '部门ID', description: '部门唯一标识', required: true },
        { name: 'deptName', type: 'string', label: '部门名称', description: '部门名称', required: false },
        { name: 'parentDept', type: 'string', label: '上级部门', description: '上级部门ID', required: false }
      ] },
      { id: 'group-rank', method: 'GET', name: '/api/group/ranks', description: '职级信息查询', avgResponseTime: 118, successRate: 99.7, chartData: [105, 118, 111, 125, 115, 121, 113], fields: [
        { name: 'rankId', type: 'string', label: '职级ID', description: '职级唯一标识', required: true },
        { name: 'rankName', type: 'string', label: '职级名称', description: '职级名称', required: false }
      ] },
      { id: 'group-probation', method: 'POST', name: '/api/group/probation', description: '试用期管理', avgResponseTime: 187, successRate: 98.8, chartData: [174, 187, 180, 194, 184, 190, 182], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '试用期员工ID', required: true },
        { name: 'startDate', type: 'date', label: '开始日期', description: '试用期开始日期', required: true },
        { name: 'endDate', type: 'date', label: '结束日期', description: '试用期结束日期', required: true },
        { name: 'status', type: 'string', label: '状态', description: '试用期状态：进行中/已通过/未通过', required: false }
      ] },
      { id: 'group-regular', method: 'POST', name: '/api/group/regular', description: '转正办理', avgResponseTime: 203, successRate: 99.2, chartData: [190, 203, 196, 210, 200, 206, 198], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '转正员工ID', required: true },
        { name: 'regularDate', type: 'date', label: '转正日期', description: '正式转正日期', required: true },
        { name: 'evaluation', type: 'string', label: '评价', description: '试用期评价内容', required: false }
      ] },
      { id: 'group-renew', method: 'POST', name: '/api/group/renew', description: '合同续签', avgResponseTime: 225, successRate: 98.7, chartData: [212, 225, 218, 232, 222, 228, 220], fields: [
        { name: 'contractId', type: 'string', label: '合同ID', description: '待续签合同ID', required: true },
        { name: 'newEndDate', type: 'date', label: '新结束日期', description: '续签后的合同结束日期', required: true },
        { name: 'terms', type: 'string', label: '条款', description: '续签合同条款变更说明', required: false }
      ] },
      { id: 'group-history', method: 'GET', name: '/api/group/history', description: '员工履历查询', avgResponseTime: 167, successRate: 99.3, chartData: [154, 167, 160, 174, 164, 170, 162], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '查询员工ID', required: true },
        { name: 'startDate', type: 'date', label: '开始日期', description: '履历查询开始日期', required: false },
        { name: 'endDate', type: 'date', label: '结束日期', description: '履历查询结束日期', required: false }
      ] },
      { id: 'group-cert', method: 'GET', name: '/api/group/certificates', description: '证书资质查询', avgResponseTime: 145, successRate: 99.4, chartData: [132, 145, 138, 152, 142, 148, 140], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '查询员工ID', required: true },
        { name: 'certType', type: 'string', label: '证书类型', description: '证书类型筛选', required: false }
      ] },
      { id: 'group-edu', method: 'GET', name: '/api/group/education', description: '学历信息查询', avgResponseTime: 128, successRate: 99.6, chartData: [115, 128, 121, 135, 125, 131, 123], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '查询员工ID', required: true },
        { name: 'degree', type: 'string', label: '学历', description: '学历等级筛选', required: false }
      ] },
      { id: 'group-family', method: 'GET', name: '/api/group/family', description: '家庭成员信息', avgResponseTime: 136, successRate: 99.5, chartData: [123, 136, 129, 143, 133, 139, 131], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '查询员工ID', required: true },
        { name: 'relation', type: 'string', label: '关系', description: '家庭成员关系筛选', required: false }
      ] },
      { id: 'group-emergency', method: 'GET', name: '/api/group/emergency', description: '紧急联系人', avgResponseTime: 112, successRate: 99.8, chartData: [99, 112, 105, 119, 109, 115, 107], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '查询员工ID', required: true },
        { name: 'contactName', type: 'string', label: '联系人姓名', description: '紧急联系人姓名', required: false },
        { name: 'phone', type: 'string', label: '电话', description: '紧急联系人电话', required: false }
      ] },
      { id: 'group-bank', method: 'GET', name: '/api/group/bank', description: '银行卡信息', avgResponseTime: 98, successRate: 99.9, chartData: [85, 98, 91, 105, 95, 101, 93], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '查询员工ID', required: true },
        { name: 'bankName', type: 'string', label: '银行名称', description: '开户银行名称', required: false },
        { name: 'accountNo', type: 'string', label: '账号', description: '银行卡号（脱敏）', required: false }
      ] },
      { id: 'group-social', method: 'GET', name: '/api/group/social', description: '社保公积金信息', avgResponseTime: 156, successRate: 99.2, chartData: [143, 156, 149, 163, 153, 159, 151], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '查询员工ID', required: true },
        { name: 'socialNo', type: 'string', label: '社保号', description: '社保账号', required: false },
        { name: 'fundNo', type: 'string', label: '公积金号', description: '公积金账号', required: false }
      ] },
      { id: 'group-leave-type', method: 'GET', name: '/api/group/leave-types', description: '假期类型查询', avgResponseTime: 89, successRate: 99.9, chartData: [76, 89, 82, 96, 86, 92, 84], fields: [
        { name: 'leaveType', type: 'string', label: '假期类型', description: '假期类型名称', required: true },
        { name: 'days', type: 'number', label: '天数', description: '可用天数', required: false }
      ] },
      { id: 'group-org-change', method: 'POST', name: '/api/group/org-change', description: '组织架构变更', avgResponseTime: 278, successRate: 98.5, chartData: [265, 278, 271, 285, 275, 281, 273], fields: [
        { name: 'changeType', type: 'string', label: '变更类型', description: '新增/合并/拆分/撤销', required: true },
        { name: 'effectiveDate', type: 'date', label: '生效日期', description: '变更生效日期', required: true },
        { name: 'description', type: 'string', label: '描述', description: '变更详细说明', required: false }
      ] },
      { id: 'group-batch-import', method: 'POST', name: '/api/group/batch-import', description: '批量导入员工', avgResponseTime: 456, successRate: 97.8, chartData: [443, 456, 449, 463, 453, 459, 451], fields: [
        { name: 'file', type: 'file', label: '文件', description: '导入文件（Excel格式）', required: true },
        { name: 'template', type: 'string', label: '模板', description: '使用的导入模板ID', required: true }
      ] },
      { id: 'group-batch-export', method: 'GET', name: '/api/group/batch-export', description: '批量导出员工', avgResponseTime: 345, successRate: 98.2, chartData: [332, 345, 338, 352, 342, 348, 340], fields: [
        { name: 'format', type: 'string', label: '格式', description: '导出格式：xlsx/csv', required: true },
        { name: 'fields', type: 'array', label: '字段', description: '需要导出的字段列表', required: false }
      ] },
      { id: 'group-photo', method: 'POST', name: '/api/group/photo', description: '员工照片上传', avgResponseTime: 234, successRate: 99.0, chartData: [221, 234, 227, 241, 231, 237, 229], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '上传照片的员工ID', required: true },
        { name: 'photo', type: 'file', label: '照片', description: '员工照片文件（jpg/png）', required: true }
      ] },
      { id: 'group-sign', method: 'POST', name: '/api/group/sign', description: '电子签名管理', avgResponseTime: 189, successRate: 99.3, chartData: [176, 189, 182, 196, 186, 192, 184], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '签名员工ID', required: true },
        { name: 'signature', type: 'file', label: '签名', description: '电子签名图片', required: true }
      ] },
      { id: 'group-archive', method: 'GET', name: '/api/group/archive', description: '档案管理', avgResponseTime: 167, successRate: 99.4, chartData: [154, 167, 160, 174, 164, 170, 162], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '查询员工ID', required: true },
        { name: 'archiveType', type: 'string', label: '档案类型', description: '档案类型筛选', required: false }
      ] },
      { id: 'group-blacklist', method: 'GET', name: '/api/group/blacklist', description: '黑名单查询', avgResponseTime: 98, successRate: 99.8, chartData: [85, 98, 91, 105, 95, 101, 93], fields: [
        { name: 'idCard', type: 'string', label: '身份证号', description: '查询身份证号', required: true },
        { name: 'reason', type: 'string', label: '原因', description: '加入黑名单原因', required: false }
      ] },
      { id: 'group-rehire', method: 'POST', name: '/api/group/rehire', description: '返聘管理', avgResponseTime: 245, successRate: 98.6, chartData: [232, 245, 238, 252, 242, 248, 240], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '返聘员工原ID', required: true },
        { name: 'rehireDate', type: 'date', label: '返聘日期', description: '返聘生效日期', required: true }
      ] },
      { id: 'group-secondment', method: 'POST', name: '/api/group/secondment', description: '借调管理', avgResponseTime: 223, successRate: 98.9, chartData: [210, 223, 216, 230, 220, 226, 218], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '被借调员工ID', required: true },
        { name: 'targetDept', type: 'string', label: '目标部门', description: '借调目标部门', required: true },
        { name: 'duration', type: 'number', label: '时长', description: '借调时长（月）', required: true }
      ] },
      { id: 'group-report', method: 'GET', name: '/api/group/report', description: '人事报表', avgResponseTime: 312, successRate: 98.4, chartData: [299, 312, 305, 319, 309, 315, 307], fields: [
        { name: 'reportType', type: 'string', label: '报表类型', description: '报表类型：人员统计/流动分析等', required: true },
        { name: 'dateRange', type: 'string', label: '日期范围', description: '报表日期范围', required: true }
      ] }
    ]
  },
  informalEmployment: {
    key: 'informalEmployment',
    name: '非正式用工',
    icon: 'user',
    count: 28,
    erList: ["OA账号", "功能权限", "站点访问权限", "限制性名单", "黑名单", "直管子公司（ E人事）", "Q外包"],
    apis: [
      { id: 'temp-emp-list', method: 'GET', name: '/api/temp/employees', description: '获取临时工列表', avgResponseTime: 134, successRate: 99.6, chartData: [145, 134, 156, 128, 139, 147, 132], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '临时工唯一标识', required: true },
        { name: 'name', type: 'string', label: '姓名', description: '临时工姓名', required: false },
        { name: 'type', type: 'string', label: '类型', description: '临时工类型分类', required: false }
      ] },
      { id: 'temp-contract', method: 'POST', name: '/api/temp/contracts', description: '临时工合同管理', avgResponseTime: 128, successRate: 99.8, chartData: [134, 128, 125, 132, 129, 131, 126], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '临时工ID', required: true },
        { name: 'contractType', type: 'string', label: '合同类型', description: '临时工合同类型', required: true },
        { name: 'startDate', type: 'date', label: '开始日期', description: '合同开始日期', required: true },
        { name: 'endDate', type: 'date', label: '结束日期', description: '合同结束日期', required: true }
      ] },
      { id: 'outsource-manage', method: 'GET', name: '/api/outsource/manage', description: '外包人员管理', avgResponseTime: 267, successRate: 98.2, chartData: [278, 267, 289, 256, 274, 281, 263], fields: [
        { name: 'outsourceId', type: 'string', label: '外包ID', description: '外包人员唯一标识', required: true },
        { name: 'vendor', type: 'string', label: '供应商', description: '外包供应商名称', required: false },
        { name: 'project', type: 'string', label: '项目', description: '所属项目名称', required: false }
      ] },
      { id: 'flexible-work', method: 'POST', name: '/api/flexible/work', description: '灵活用工管理', avgResponseTime: 189, successRate: 98.9, chartData: [178, 189, 195, 182, 188, 192, 185], fields: [
        { name: 'workerId', type: 'string', label: '工人ID', description: '灵活用工人员ID', required: true },
        { name: 'workType', type: 'string', label: '工作类型', description: '工作类型分类', required: true },
        { name: 'schedule', type: 'string', label: '排班', description: '工作排班安排', required: false }
      ] },
      { id: 'oa-account-create', method: 'POST', name: '/api/oa/account/create', description: 'OA账号创建', avgResponseTime: 156, successRate: 99.3, chartData: [143, 156, 149, 163, 153, 159, 151], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '关联员工ID', required: true },
        { name: 'username', type: 'string', label: '用户名', description: 'OA系统用户名', required: true },
        { name: 'email', type: 'string', label: '邮箱', description: '企业邮箱地址', required: true }
      ] },
      { id: 'oa-account-disable', method: 'POST', name: '/api/oa/account/disable', description: 'OA账号禁用', avgResponseTime: 112, successRate: 99.7, chartData: [99, 112, 105, 119, 109, 115, 107], fields: [
        { name: 'accountId', type: 'string', label: '账号ID', description: 'OA账号ID', required: true },
        { name: 'reason', type: 'string', label: '原因', description: '禁用原因说明', required: true }
      ] },
      { id: 'oa-account-query', method: 'GET', name: '/api/oa/account/query', description: 'OA账号查询', avgResponseTime: 89, successRate: 99.9, chartData: [76, 89, 82, 96, 86, 92, 84], fields: [
        { name: 'accountId', type: 'string', label: '账号ID', description: 'OA账号ID', required: true },
        { name: 'status', type: 'string', label: '状态', description: '账号状态筛选', required: false }
      ] },
      { id: 'func-perm-grant', method: 'POST', name: '/api/permission/grant', description: '功能权限授予', avgResponseTime: 178, successRate: 99.1, chartData: [165, 178, 171, 185, 175, 181, 173], fields: [
        { name: 'accountId', type: 'string', label: '账号ID', description: '被授权账号ID', required: true },
        { name: 'permissions', type: 'array', label: '权限列表', description: '授予的权限代码列表', required: true }
      ] },
      { id: 'func-perm-revoke', method: 'POST', name: '/api/permission/revoke', description: '功能权限撤销', avgResponseTime: 145, successRate: 99.4, chartData: [132, 145, 138, 152, 142, 148, 140], fields: [
        { name: 'accountId', type: 'string', label: '账号ID', description: '被撤销账号ID', required: true },
        { name: 'permissions', type: 'array', label: '权限列表', description: '撤销的权限代码列表', required: true }
      ] },
      { id: 'func-perm-query', method: 'GET', name: '/api/permission/query', description: '功能权限查询', avgResponseTime: 98, successRate: 99.8, chartData: [85, 98, 91, 105, 95, 101, 93], fields: [
        { name: 'accountId', type: 'string', label: '账号ID', description: '查询账号ID', required: true }
      ] },
      { id: 'site-access-grant', method: 'POST', name: '/api/site/access/grant', description: '站点访问授权', avgResponseTime: 167, successRate: 99.2, chartData: [154, 167, 160, 174, 164, 170, 162], fields: [
        { name: 'accountId', type: 'string', label: '账号ID', description: '被授权账号ID', required: true },
        { name: 'sites', type: 'array', label: '站点列表', description: '授权访问的站点列表', required: true }
      ] },
      { id: 'site-access-revoke', method: 'POST', name: '/api/site/access/revoke', description: '站点访问撤销', avgResponseTime: 134, successRate: 99.5, chartData: [121, 134, 127, 141, 131, 137, 129], fields: [
        { name: 'accountId', type: 'string', label: '账号ID', description: '被撤销账号ID', required: true },
        { name: 'sites', type: 'array', label: '站点列表', description: '撤销访问的站点列表', required: true }
      ] },
      { id: 'site-access-query', method: 'GET', name: '/api/site/access/query', description: '站点访问查询', avgResponseTime: 112, successRate: 99.7, chartData: [99, 112, 105, 119, 109, 115, 107], fields: [
        { name: 'accountId', type: 'string', label: '账号ID', description: '查询账号ID', required: true }
      ] },
      { id: 'restrict-list-add', method: 'POST', name: '/api/restrict/add', description: '限制性名单添加', avgResponseTime: 189, successRate: 98.9, chartData: [176, 189, 182, 196, 186, 192, 184], fields: [
        { name: 'idCard', type: 'string', label: '身份证号', description: '被限制人身份证号', required: true },
        { name: 'reason', type: 'string', label: '原因', description: '加入限制名单原因', required: true },
        { name: 'expireDate', type: 'date', label: '过期日期', description: '限制到期日期', required: false }
      ] },
      { id: 'restrict-list-remove', method: 'DELETE', name: '/api/restrict/remove', description: '限制性名单移除', avgResponseTime: 156, successRate: 99.2, chartData: [143, 156, 149, 163, 153, 159, 151], fields: [
        { name: 'recordId', type: 'string', label: '记录ID', description: '限制名单记录ID', required: true }
      ] },
      { id: 'restrict-list-query', method: 'GET', name: '/api/restrict/query', description: '限制性名单查询', avgResponseTime: 98, successRate: 99.8, chartData: [85, 98, 91, 105, 95, 101, 93], fields: [
        { name: 'idCard', type: 'string', label: '身份证号', description: '查询身份证号', required: true }
      ] },
      { id: 'blacklist-add', method: 'POST', name: '/api/blacklist/add', description: '黑名单添加', avgResponseTime: 178, successRate: 99.0, chartData: [165, 178, 171, 185, 175, 181, 173], fields: [
        { name: 'idCard', type: 'string', label: '身份证号', description: '被加入黑名单人身份证号', required: true },
        { name: 'reason', type: 'string', label: '原因', description: '加入黑名单原因', required: true }
      ] },
      { id: 'blacklist-remove', method: 'DELETE', name: '/api/blacklist/remove', description: '黑名单移除', avgResponseTime: 145, successRate: 99.3, chartData: [132, 145, 138, 152, 142, 148, 140], fields: [
        { name: 'recordId', type: 'string', label: '记录ID', description: '黑名单记录ID', required: true }
      ] },
      { id: 'blacklist-query', method: 'GET', name: '/api/blacklist/query', description: '黑名单查询', avgResponseTime: 89, successRate: 99.9, chartData: [76, 89, 82, 96, 86, 92, 84], fields: [
        { name: 'idCard', type: 'string', label: '身份证号', description: '查询身份证号', required: true }
      ] },
      { id: 'subsidiary-emp-list', method: 'GET', name: '/api/subsidiary/employees', description: '直管子公司员工列表', avgResponseTime: 198, successRate: 98.8, chartData: [185, 198, 191, 205, 195, 201, 193], fields: [
        { name: 'companyId', type: 'string', label: '公司ID', description: '子公司唯一标识', required: true },
        { name: 'status', type: 'string', label: '状态', description: '员工状态筛选', required: false }
      ] },
      { id: 'subsidiary-emp-sync', method: 'POST', name: '/api/subsidiary/sync', description: '直管子公司数据同步', avgResponseTime: 345, successRate: 97.9, chartData: [332, 345, 338, 352, 342, 348, 340], fields: [
        { name: 'companyId', type: 'string', label: '公司ID', description: '子公司唯一标识', required: true },
        { name: 'syncType', type: 'string', label: '同步类型', description: '全量同步/增量同步', required: true }
      ] },
      { id: 'q-outsource-list', method: 'GET', name: '/api/q-outsource/list', description: 'Q外包人员列表', avgResponseTime: 156, successRate: 99.4, chartData: [143, 156, 149, 163, 153, 159, 151], fields: [
        { name: 'projectId', type: 'string', label: '项目ID', description: '项目唯一标识', required: true },
        { name: 'status', type: 'string', label: '状态', description: '人员状态筛选', required: false }
      ] },
      { id: 'q-outsource-create', method: 'POST', name: '/api/q-outsource/create', description: 'Q外包人员创建', avgResponseTime: 234, successRate: 98.7, chartData: [221, 234, 227, 241, 231, 237, 229], fields: [
        { name: 'name', type: 'string', label: '姓名', description: '外包人员姓名', required: true },
        { name: 'idCard', type: 'string', label: '身份证号', description: '18位身份证号', required: true },
        { name: 'vendor', type: 'string', label: '供应商', description: '外包供应商名称', required: true },
        { name: 'projectId', type: 'string', label: '项目ID', description: '所属项目ID', required: true }
      ] },
      { id: 'q-outsource-update', method: 'PUT', name: '/api/q-outsource/update', description: 'Q外包人员更新', avgResponseTime: 189, successRate: 99.1, chartData: [176, 189, 182, 196, 186, 192, 184], fields: [
        { name: 'outsourceId', type: 'string', label: '外包ID', description: '外包人员ID', required: true },
        { name: 'updateFields', type: 'object', label: '更新字段', description: '需要更新的字段对象', required: true }
      ] },
      { id: 'q-outsource-delete', method: 'DELETE', name: '/api/q-outsource/delete', description: 'Q外包人员删除', avgResponseTime: 145, successRate: 99.5, chartData: [132, 145, 138, 152, 142, 148, 140], fields: [
        { name: 'outsourceId', type: 'string', label: '外包ID', description: '外包人员ID', required: true }
      ] },
      { id: 'intern-manage', method: 'GET', name: '/api/intern/manage', description: '实习生管理', avgResponseTime: 167, successRate: 99.3, chartData: [154, 167, 160, 174, 164, 170, 162], fields: [
        { name: 'internId', type: 'string', label: '实习生ID', description: '实习生唯一标识', required: true },
        { name: 'status', type: 'string', label: '状态', description: '实习状态筛选', required: false }
      ] },
      { id: 'intern-convert', method: 'POST', name: '/api/intern/convert', description: '实习生转正', avgResponseTime: 223, successRate: 98.9, chartData: [210, 223, 216, 230, 220, 226, 218], fields: [
        { name: 'internId', type: 'string', label: '实习生ID', description: '实习生唯一标识', required: true },
        { name: 'convertDate', type: 'date', label: '转正日期', description: '转正生效日期', required: true },
        { name: 'department', type: 'string', label: '部门', description: '转正后部门', required: true }
      ] },
      { id: 'labor-dispatch', method: 'GET', name: '/api/labor/dispatch', description: '劳务派遣管理', avgResponseTime: 198, successRate: 99.0, chartData: [185, 198, 191, 205, 195, 201, 193], fields: [
        { name: 'dispatchId', type: 'string', label: '派遣ID', description: '派遣记录ID', required: true },
        { name: 'status', type: 'string', label: '状态', description: '派遣状态筛选', required: false }
      ] }
    ]
  },
  compliance: {
    key: 'compliance',
    name: '合规',
    icon: 'secured',
    count: 24,
    erList: ["申诉"],
    apis: [
      { id: 'legal-check', method: 'GET', name: '/api/compliance/legal', description: '法律合规检查', avgResponseTime: 189, successRate: 98.9, chartData: [178, 189, 195, 182, 188, 192, 185], fields: [
        { name: 'checkType', type: 'string', label: '检查类型', description: '合规检查类型分类', required: true },
        { name: 'targetId', type: 'string', label: '目标ID', description: '检查目标对象ID', required: true }
      ] },
      { id: 'audit-report', method: 'POST', name: '/api/compliance/audit', description: '合规审计报告', avgResponseTime: 145, successRate: 99.1, chartData: [156, 145, 139, 148, 142, 147, 144], fields: [
        { name: 'auditType', type: 'string', label: '审计类型', description: '审计类型分类', required: true },
        { name: 'dateRange', type: 'string', label: '日期范围', description: '审计日期范围', required: true }
      ] },
      { id: 'risk-assess', method: 'GET', name: '/api/compliance/risk', description: '风险评估管理', avgResponseTime: 278, successRate: 97.8, chartData: [289, 278, 295, 267, 281, 287, 276], fields: [
        { name: 'riskType', type: 'string', label: '风险类型', description: '风险类型分类', required: true },
        { name: 'level', type: 'string', label: '级别', description: '风险等级筛选', required: false }
      ] },
      { id: 'policy-check', method: 'POST', name: '/api/compliance/policy', description: '政策合规验证', avgResponseTime: 234, successRate: 99.4, chartData: [245, 234, 228, 239, 231, 236, 232], fields: [
        { name: 'policyId', type: 'string', label: '政策ID', description: '政策唯一标识', required: true },
        { name: 'content', type: 'string', label: '内容', description: '待验证内容', required: true }
      ] },
      { id: 'appeal-submit', method: 'POST', name: '/api/appeal/submit', description: '申诉提交', avgResponseTime: 156, successRate: 99.3, chartData: [143, 156, 149, 163, 153, 159, 151], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '申诉人员工ID', required: true },
        { name: 'appealType', type: 'string', label: '申诉类型', description: '申诉类型分类', required: true },
        { name: 'content', type: 'string', label: '内容', description: '申诉详细内容', required: true }
      ] },
      { id: 'appeal-query', method: 'GET', name: '/api/appeal/query', description: '申诉查询', avgResponseTime: 112, successRate: 99.7, chartData: [99, 112, 105, 119, 109, 115, 107], fields: [
        { name: 'appealId', type: 'string', label: '申诉ID', description: '申诉记录ID', required: true }
      ] },
      { id: 'appeal-process', method: 'PUT', name: '/api/appeal/process', description: '申诉处理', avgResponseTime: 198, successRate: 98.8, chartData: [185, 198, 191, 205, 195, 201, 193], fields: [
        { name: 'appealId', type: 'string', label: '申诉ID', description: '申诉记录ID', required: true },
        { name: 'result', type: 'string', label: '处理结果', description: '申诉处理结果', required: true },
        { name: 'comment', type: 'string', label: '备注', description: '处理备注说明', required: false }
      ] },
      { id: 'appeal-close', method: 'POST', name: '/api/appeal/close', description: '申诉关闭', avgResponseTime: 134, successRate: 99.5, chartData: [121, 134, 127, 141, 131, 137, 129], fields: [
        { name: 'appealId', type: 'string', label: '申诉ID', description: '申诉记录ID', required: true },
        { name: 'closeReason', type: 'string', label: '关闭原因', description: '申诉关闭原因', required: true }
      ] },
      { id: 'labor-law-check', method: 'GET', name: '/api/labor-law/check', description: '劳动法合规检查', avgResponseTime: 267, successRate: 98.2, chartData: [254, 267, 260, 274, 264, 270, 262], fields: [
        { name: 'checkItem', type: 'string', label: '检查项', description: '劳动法检查项目', required: true },
        { name: 'targetId', type: 'string', label: '目标ID', description: '检查目标ID', required: true }
      ] },
      { id: 'contract-compliance', method: 'GET', name: '/api/contract/compliance', description: '合同合规审查', avgResponseTime: 223, successRate: 98.9, chartData: [210, 223, 216, 230, 220, 226, 218], fields: [
        { name: 'contractId', type: 'string', label: '合同ID', description: '待审查合同ID', required: true }
      ] },
      { id: 'salary-compliance', method: 'GET', name: '/api/salary/compliance', description: '薪资合规检查', avgResponseTime: 189, successRate: 99.1, chartData: [176, 189, 182, 196, 186, 192, 184], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '检查员工ID', required: true },
        { name: 'month', type: 'string', label: '月份', description: '检查月份（YYYY-MM）', required: true }
      ] },
      { id: 'overtime-compliance', method: 'GET', name: '/api/overtime/compliance', description: '加班合规检查', avgResponseTime: 156, successRate: 99.4, chartData: [143, 156, 149, 163, 153, 159, 151], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '检查员工ID', required: true },
        { name: 'dateRange', type: 'string', label: '日期范围', description: '检查日期范围', required: true }
      ] },
      { id: 'leave-compliance', method: 'GET', name: '/api/leave/compliance', description: '休假合规检查', avgResponseTime: 134, successRate: 99.6, chartData: [121, 134, 127, 141, 131, 137, 129], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '检查员工ID', required: true },
        { name: 'year', type: 'number', label: '年份', description: '检查年份', required: true }
      ] },
      { id: 'social-insurance-check', method: 'GET', name: '/api/social-insurance/check', description: '社保合规检查', avgResponseTime: 178, successRate: 99.2, chartData: [165, 178, 171, 185, 175, 181, 173], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '检查员工ID', required: true }
      ] },
      { id: 'tax-compliance', method: 'GET', name: '/api/tax/compliance', description: '税务合规检查', avgResponseTime: 198, successRate: 98.9, chartData: [185, 198, 191, 205, 195, 201, 193], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '检查员工ID', required: true },
        { name: 'year', type: 'number', label: '年份', description: '检查年份', required: true }
      ] },
      { id: 'data-privacy-check', method: 'GET', name: '/api/data-privacy/check', description: '数据隐私合规', avgResponseTime: 145, successRate: 99.5, chartData: [132, 145, 138, 152, 142, 148, 140], fields: [
        { name: 'dataType', type: 'string', label: '数据类型', description: '数据类型分类', required: true },
        { name: 'scope', type: 'string', label: '范围', description: '检查范围', required: false }
      ] },
      { id: 'gdpr-compliance', method: 'GET', name: '/api/gdpr/compliance', description: 'GDPR合规检查', avgResponseTime: 212, successRate: 98.7, chartData: [199, 212, 205, 219, 209, 215, 207], fields: [
        { name: 'dataSubject', type: 'string', label: '数据主体', description: '数据主体标识', required: true },
        { name: 'processType', type: 'string', label: '处理类型', description: '数据处理类型', required: true }
      ] },
      { id: 'audit-log', method: 'GET', name: '/api/audit/log', description: '审计日志查询', avgResponseTime: 89, successRate: 99.9, chartData: [76, 89, 82, 96, 86, 92, 84], fields: [
        { name: 'startDate', type: 'date', label: '开始日期', description: '日志查询开始日期', required: true },
        { name: 'endDate', type: 'date', label: '结束日期', description: '日志查询结束日期', required: true },
        { name: 'action', type: 'string', label: '操作', description: '操作类型筛选', required: false }
      ] },
      { id: 'compliance-report', method: 'GET', name: '/api/compliance/report', description: '合规报告生成', avgResponseTime: 345, successRate: 98.1, chartData: [332, 345, 338, 352, 342, 348, 340], fields: [
        { name: 'reportType', type: 'string', label: '报告类型', description: '合规报告类型', required: true },
        { name: 'dateRange', type: 'string', label: '日期范围', description: '报告日期范围', required: true }
      ] },
      { id: 'violation-record', method: 'GET', name: '/api/violation/record', description: '违规记录查询', avgResponseTime: 123, successRate: 99.6, chartData: [110, 123, 116, 130, 120, 126, 118], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '查询员工ID', required: true }
      ] },
      { id: 'violation-handle', method: 'POST', name: '/api/violation/handle', description: '违规处理', avgResponseTime: 234, successRate: 98.8, chartData: [221, 234, 227, 241, 231, 237, 229], fields: [
        { name: 'violationId', type: 'string', label: '违规ID', description: '违规记录ID', required: true },
        { name: 'handleResult', type: 'string', label: '处理结果', description: '违规处理结果', required: true }
      ] },
      { id: 'compliance-train', method: 'GET', name: '/api/compliance/training', description: '合规培训记录', avgResponseTime: 156, successRate: 99.3, chartData: [143, 156, 149, 163, 153, 159, 151], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '查询员工ID', required: true }
      ] },
      { id: 'ethics-report', method: 'POST', name: '/api/ethics/report', description: '道德举报', avgResponseTime: 178, successRate: 99.1, chartData: [165, 178, 171, 185, 175, 181, 173], fields: [
        { name: 'reportType', type: 'string', label: '举报类型', description: '道德举报类型', required: true },
        { name: 'content', type: 'string', label: '内容', description: '举报详细内容', required: true },
        { name: 'anonymous', type: 'boolean', label: '匿名', description: '是否匿名举报', required: false }
      ] },
      { id: 'compliance-cert', method: 'GET', name: '/api/compliance/certificate', description: '合规证书管理', avgResponseTime: 134, successRate: 99.5, chartData: [121, 134, 127, 141, 131, 137, 129], fields: [
        { name: 'certType', type: 'string', label: '证书类型', description: '合规证书类型', required: true },
        { name: 'status', type: 'string', label: '状态', description: '证书状态筛选', required: false }
      ] }
    ]
  },
  jingman: {
    key: 'jingman',
    name: '敬满',
    icon: 'heart',
    count: 20,
    erList: ["敬满"],
    apis: [
      { id: 'jm-employee', method: 'GET', name: '/api/jingman/employees', description: '敬满员工管理', avgResponseTime: 234, successRate: 99.4, chartData: [245, 234, 228, 239, 231, 236, 232], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '敬满员工唯一标识', required: true },
        { name: 'status', type: 'string', label: '状态', description: '员工状态筛选', required: false }
      ] },
      { id: 'jm-welfare', method: 'POST', name: '/api/jingman/welfare', description: '敬满福利管理', avgResponseTime: 456, successRate: 97.5, chartData: [445, 456, 467, 448, 459, 452, 463], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '福利受益员工ID', required: true },
        { name: 'welfareType', type: 'string', label: '福利类型', description: '福利类型分类', required: true },
        { name: 'amount', type: 'number', label: '金额', description: '福利金额（元）', required: true }
      ] },
      { id: 'jm-service', method: 'GET', name: '/api/jingman/service', description: '敬满服务管理', avgResponseTime: 198, successRate: 99.0, chartData: [189, 198, 206, 192, 201, 195, 203], fields: [
        { name: 'serviceId', type: 'string', label: '服务ID', description: '服务唯一标识', required: true },
        { name: 'type', type: 'string', label: '类型', description: '服务类型筛选', required: false }
      ] },
      { id: 'jm-support', method: 'POST', name: '/api/jingman/support', description: '敬满支持服务', avgResponseTime: 189, successRate: 98.7, chartData: [178, 189, 195, 182, 188, 192, 185], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '申请支持员工ID', required: true },
        { name: 'supportType', type: 'string', label: '支持类型', description: '支持服务类型', required: true },
        { name: 'description', type: 'string', label: '描述', description: '支持需求描述', required: true }
      ] },
      { id: 'jm-satisfaction', method: 'GET', name: '/api/jingman/satisfaction', description: '员工满意度调查', avgResponseTime: 156, successRate: 99.3, chartData: [143, 156, 149, 163, 153, 159, 151], fields: [
        { name: 'surveyId', type: 'string', label: '调查ID', description: '满意度调查ID', required: true },
        { name: 'period', type: 'string', label: '周期', description: '调查周期筛选', required: false }
      ] },
      { id: 'jm-feedback', method: 'POST', name: '/api/jingman/feedback', description: '员工反馈提交', avgResponseTime: 134, successRate: 99.6, chartData: [121, 134, 127, 141, 131, 137, 129], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '反馈员工ID', required: true },
        { name: 'feedbackType', type: 'string', label: '反馈类型', description: '反馈类型分类', required: true },
        { name: 'content', type: 'string', label: '内容', description: '反馈详细内容', required: true }
      ] },
      { id: 'jm-care', method: 'GET', name: '/api/jingman/care', description: '员工关怀服务', avgResponseTime: 178, successRate: 99.1, chartData: [165, 178, 171, 185, 175, 181, 173], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '关怀对象员工ID', required: true },
        { name: 'careType', type: 'string', label: '关怀类型', description: '关怀类型筛选', required: false }
      ] },
      { id: 'jm-birthday', method: 'GET', name: '/api/jingman/birthday', description: '生日祝福管理', avgResponseTime: 98, successRate: 99.8, chartData: [85, 98, 91, 105, 95, 101, 93], fields: [
        { name: 'month', type: 'number', label: '月份', description: '查询月份（1-12）', required: true }
      ] },
      { id: 'jm-anniversary', method: 'GET', name: '/api/jingman/anniversary', description: '入职周年管理', avgResponseTime: 112, successRate: 99.7, chartData: [99, 112, 105, 119, 109, 115, 107], fields: [
        { name: 'month', type: 'number', label: '月份', description: '查询月份（1-12）', required: true },
        { name: 'years', type: 'number', label: '年数', description: '入职年数筛选', required: false }
      ] },
      { id: 'jm-health', method: 'GET', name: '/api/jingman/health', description: '员工健康管理', avgResponseTime: 167, successRate: 99.2, chartData: [154, 167, 160, 174, 164, 170, 162], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '查询员工ID', required: true },
        { name: 'checkType', type: 'string', label: '检查类型', description: '健康检查类型', required: false }
      ] },
      { id: 'jm-eap', method: 'GET', name: '/api/jingman/eap', description: 'EAP心理援助', avgResponseTime: 189, successRate: 98.9, chartData: [176, 189, 182, 196, 186, 192, 184], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '申请员工ID', required: true },
        { name: 'serviceType', type: 'string', label: '服务类型', description: 'EAP服务类型', required: false }
      ] },
      { id: 'jm-activity', method: 'GET', name: '/api/jingman/activity', description: '员工活动管理', avgResponseTime: 145, successRate: 99.4, chartData: [132, 145, 138, 152, 142, 148, 140], fields: [
        { name: 'activityId', type: 'string', label: '活动ID', description: '活动唯一标识', required: true },
        { name: 'status', type: 'string', label: '状态', description: '活动状态筛选', required: false }
      ] },
      { id: 'jm-club', method: 'GET', name: '/api/jingman/club', description: '员工社团管理', avgResponseTime: 123, successRate: 99.5, chartData: [110, 123, 116, 130, 120, 126, 118], fields: [
        { name: 'clubId', type: 'string', label: '社团ID', description: '社团唯一标识', required: true }
      ] },
      { id: 'jm-reward', method: 'POST', name: '/api/jingman/reward', description: '员工奖励管理', avgResponseTime: 198, successRate: 98.8, chartData: [185, 198, 191, 205, 195, 201, 193], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '奖励员工ID', required: true },
        { name: 'rewardType', type: 'string', label: '奖励类型', description: '奖励类型分类', required: true },
        { name: 'amount', type: 'number', label: '金额', description: '奖励金额（元）', required: true }
      ] },
      { id: 'jm-recognition', method: 'POST', name: '/api/jingman/recognition', description: '员工认可管理', avgResponseTime: 167, successRate: 99.2, chartData: [154, 167, 160, 174, 164, 170, 162], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '被认可员工ID', required: true },
        { name: 'recognitionType', type: 'string', label: '认可类型', description: '认可类型分类', required: true },
        { name: 'reason', type: 'string', label: '原因', description: '认可原因说明', required: true }
      ] },
      { id: 'jm-survey', method: 'GET', name: '/api/jingman/survey', description: '员工调研管理', avgResponseTime: 212, successRate: 98.7, chartData: [199, 212, 205, 219, 209, 215, 207], fields: [
        { name: 'surveyId', type: 'string', label: '调研ID', description: '调研唯一标识', required: true },
        { name: 'status', type: 'string', label: '状态', description: '调研状态筛选', required: false }
      ] },
      { id: 'jm-suggestion', method: 'POST', name: '/api/jingman/suggestion', description: '员工建议管理', avgResponseTime: 145, successRate: 99.4, chartData: [132, 145, 138, 152, 142, 148, 140], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '建议员工ID', required: true },
        { name: 'category', type: 'string', label: '类别', description: '建议类别分类', required: true },
        { name: 'content', type: 'string', label: '内容', description: '建议详细内容', required: true }
      ] },
      { id: 'jm-complaint', method: 'POST', name: '/api/jingman/complaint', description: '员工投诉管理', avgResponseTime: 178, successRate: 99.0, chartData: [165, 178, 171, 185, 175, 181, 173], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '投诉员工ID', required: true },
        { name: 'complaintType', type: 'string', label: '投诉类型', description: '投诉类型分类', required: true },
        { name: 'content', type: 'string', label: '内容', description: '投诉详细内容', required: true }
      ] },
      { id: 'jm-exit-interview', method: 'POST', name: '/api/jingman/exit-interview', description: '离职面谈管理', avgResponseTime: 223, successRate: 98.6, chartData: [210, 223, 216, 230, 220, 226, 218], fields: [
        { name: 'employeeId', type: 'string', label: '员工ID', description: '离职员工ID', required: true },
        { name: 'interviewDate', type: 'date', label: '面谈日期', description: '面谈安排日期', required: true },
        { name: 'feedback', type: 'string', label: '反馈', description: '面谈反馈内容', required: false }
      ] },
      { id: 'jm-engagement', method: 'GET', name: '/api/jingman/engagement', description: '员工敬业度分析', avgResponseTime: 267, successRate: 98.3, chartData: [254, 267, 260, 274, 264, 270, 262], fields: [
        { name: 'period', type: 'string', label: '周期', description: '分析周期', required: true },
        { name: 'department', type: 'string', label: '部门', description: '部门筛选', required: false }
      ] }
    ]
  }
}

/**
 * 获取所有分类的数组形式（用于下拉选择等场景）
 */
export const getApiCategoriesArray = () => {
  return Object.values(ER_CATEGORIES).map(cat => ({
    key: cat.key,
    name: cat.name,
    icon: cat.icon,
    count: cat.count,
    erList: cat.erList,
    apis: cat.apis
  }))
}

/**
 * 获取所有API的总数量
 */
export const getTotalApiCount = () => {
  return Object.values(ER_CATEGORIES).reduce((sum, cat) => sum + cat.apis.length, 0)
}

/**
 * 根据API ID获取API详情
 */
export const getApiById = (apiId) => {
  for (const category of Object.values(ER_CATEGORIES)) {
    const api = category.apis.find(a => a.id === apiId)
    if (api) {
      return { ...api, category: category.key, categoryName: category.name }
    }
  }
  return null
}

/**
 * 根据分类key获取分类数据
 */
export const getCategoryByKey = (key) => {
  return ER_CATEGORIES[key] || null
}

export default ER_CATEGORIES
