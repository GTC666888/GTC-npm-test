# 接口授权页面

## 功能概述

接口授权页面允许已通过审核的应用申请API访问权限，并为每个API自定义返回字段。这是一个四步流程的向导式页面，提供直观的用户体验。

## 页面路由

- **路径**: `/api-auth`
- **名称**: `ApiAuth`
- **组件**: `src/pages/api-auth/index.vue`

## 功能特性

### 1. 四步授权流程

#### 步骤1: 选择应用
- 展示所有已通过审核的应用列表
- 卡片式展示，包含应用名称、站点地址、描述和AppKey
- 支持单选应用
- 选中状态高亮显示

**应用信息包含：**
- 应用名称
- 站点地址
- 应用描述
- AppKey（部分显示）
- 审核状态标签

#### 步骤2: 选择API接口
- 按业务领域分类展示所有可用API
- 支持关键词搜索API
- 支持按业务领域筛选
- 支持单选和批量全选
- 实时显示已选择的API数量

**支持的业务领域：**
- 员工管理（3个API）
- 组织架构（2个API）
- 考勤管理（2个API）
- 薪酬福利（1个API）
- 绩效管理（1个API）
- 培训发展（1个API）

**API信息展示：**
- HTTP方法（GET/POST/PUT/DELETE）
- API路径
- API描述

#### 步骤3: 配置返回字段
- 为每个选中的API配置返回字段
- 支持单选和全选字段
- 必需字段自动选中且标记
- 字段信息包含名称、类型和描述

**字段配置功能：**
- 字段名称显示
- 字段类型标注（string/number/date/object/array等）
- 字段描述说明
- 必需字段标记（红色标签）
- 全选/取消全选功能
- 网格布局，清晰展示

**示例字段（员工列表API）：**
- id (string) - 员工ID [必需]
- name (string) - 员工姓名 [必需]
- email (string) - 邮箱地址
- phone (string) - 手机号码
- department (string) - 所属部门
- position (string) - 职位
- hireDate (date) - 入职日期
- status (string) - 员工状态 [必需]

#### 步骤4: 确认授权
- 展示完整的授权配置摘要
- 显示应用信息
- 列出所有授权的API及其选中的返回字段
- 确认后提交授权申请

**摘要信息包含：**
- 应用基本信息（名称、地址、AppKey）
- API授权列表（方法、路径、返回字段）
- 字段标签展示

### 2. 用户体验优化

- **步骤指示器**: 清晰的进度展示
- **响应式设计**: 支持移动端和桌面端
- **智能验证**: 每步都有必要的验证
- **实时反馈**: 选择状态实时更新
- **搜索筛选**: 快速定位所需API
- **批量操作**: 支持按分类批量选择
- **字段网格**: 清晰的字段布局
- **标签展示**: 直观的字段类型和状态

### 3. 数据结构

#### 应用数据
```javascript
{
  id: 'app-001',
  name: '人力资源管理系统',
  siteUrl: 'https://hr.company.com',
  description: '企业内部人力资源管理平台',
  appKey: 'ak_1234567890abcdef',
  appSecret: 'as_abcdef1234567890',
  status: 'approved'
}
```

#### API数据
```javascript
{
  id: 'emp-list',
  method: 'GET',
  name: '/api/employees',
  description: '获取员工列表',
  fields: [
    {
      name: 'id',
      type: 'string',
      description: '员工ID',
      required: true
    },
    // ... 更多字段
  ]
}
```

#### 字段选择数据
```javascript
apiFieldSelections: {
  'emp-list': ['id', 'name', 'email', 'status'],
  'dept-list': ['id', 'name', 'manager']
}
```

## 界面预览

### 主要区域

1. **页面头部**:
   - 返回按钮
   - 页面标题："接口授权"
   - 页面描述
   - 渐变紫色背景

2. **步骤指示器**:
   - 4个步骤的进度展示
   - 当前步骤高亮
   - 点状主题

3. **步骤面板**:
   - 根据当前步骤显示不同内容
   - 白色背景卡片
   - 清晰的标题和说明

4. **操作按钮**:
   - 上一步/下一步按钮
   - 提交授权按钮
   - 居中对齐

## 使用流程

1. **访问页面**: 从首页点击"接口授权"按钮，或直接访问 `/api-auth`

2. **选择应用**: 
   - 浏览已审核通过的应用列表
   - 点击选择一个应用
   - 点击"下一步"

3. **选择API**: 
   - 使用搜索框或筛选器查找API
   - 勾选需要的API接口
   - 支持按分类全选
   - 点击"下一步"

4. **配置字段**: 
   - 为每个API选择需要返回的字段
   - 必需字段自动选中
   - 可以全选或单选字段
   - 点击"下一步"

5. **确认提交**: 
   - 检查授权配置摘要
   - 确认无误后点击"提交授权"

6. **完成**: 系统显示成功消息，授权配置生效

## 技术实现

### 组件技术栈
- **框架**: Vue 2
- **UI库**: TDesign Vue
- **图标**: TDesign Icons
- **路由**: Vue Router

### 核心功能代码

#### 应用选择
```javascript
selectApp(app) {
  this.selectedApp = app
}
```

#### API选择
```javascript
toggleApi(apiId) {
  const index = this.selectedApis.indexOf(apiId)
  if (index > -1) {
    this.selectedApis.splice(index, 1)
    this.$delete(this.apiFieldSelections, apiId)
  } else {
    this.selectedApis.push(apiId)
  }
}
```

#### 字段配置
```javascript
toggleAllFields(apiId) {
  const api = this.getApiById(apiId)
  const allFieldNames = api.fields.map(f => f.name)
  const currentSelection = this.apiFieldSelections[apiId] || []
  
  if (currentSelection.length === allFieldNames.length) {
    // 保留必需字段
    this.$set(this.apiFieldSelections, apiId, 
      api.fields.filter(f => f.required).map(f => f.name))
  } else {
    // 全选
    this.$set(this.apiFieldSelections, apiId, allFieldNames)
  }
}
```

## 设计规范

- **主色调**: #667eea 到 #764ba2 渐变
- **成功色**: #52c41a
- **警告色**: #faad14
- **错误色**: #ff4d4f
- **圆角**: 8px
- **间距**: 标准24px
- **卡片阴影**: 0 2px 8px rgba(0, 0, 0, 0.08)

## 后续优化建议

1. **权限管理**: 
   - 支持权限有效期设置
   - 支持权限撤销功能
   - 权限变更历史记录

2. **字段管理**: 
   - 字段级别的权限控制
   - 敏感字段标记和保护
   - 字段映射和转换

3. **审批流程**: 
   - 添加管理员审批环节
   - 审批状态跟踪
   - 审批通知

4. **使用统计**: 
   - API调用统计
   - 字段使用频率分析
   - 性能监控

5. **批量操作**: 
   - 支持多应用批量授权
   - 授权模板保存和复用
   - 快速授权预设

6. **高级功能**: 
   - 字段过滤规则配置
   - 数据脱敏设置
   - 请求频率限制
   - IP白名单配置

## 相关文件

- 页面组件: `src/pages/api-auth/index.vue`
- 路由配置: `src/router/index.js`
- 首页入口: `src/pages/home/index.vue`

## 更新日志

### v1.0.0 (2024-12-10)
- 🎉 初始版本发布
- ✨ 实现四步授权流程
- ✨ 支持应用选择
- ✨ 支持API选择和搜索筛选
- ✨ 支持字段级别的返回配置
- ✨ 完整的授权摘要展示
- 🎨 响应式设计，支持移动端
- 📝 完善的文档说明

## 常见问题

**Q: 如何修改已授权的API字段？**
A: 重新进入授权流程，选择相同的应用和API，重新配置字段后提交即可覆盖原有配置。

**Q: 必需字段可以取消选择吗？**
A: 不可以。必需字段是API正常工作所必需的，系统会自动选中并保持选中状态。

**Q: 可以为不同应用配置相同API的不同字段吗？**
A: 可以。每个应用的API授权配置是独立的，可以根据应用需求配置不同的返回字段。

**Q: 授权配置何时生效？**
A: 提交授权后立即生效。应用可以立即使用配置的API和字段。

**Q: 如何查看应用的授权历史？**
A: 目前版本暂不支持，后续版本将添加授权历史查看功能。
