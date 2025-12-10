# ER API 开发指南

## 当前项目依赖分析

### Vue相关依赖
- **vue**: `^2.6.14` - Vue 2.6 核心框架
- **vue-template-compiler**: `~2.6.14` - Vue 2 模板编译器
- **@vue/composition-api**: `^1.7.2` - Vue 2 的 Composition API 支持

### UI组件库依赖
- **tdesign-vue**: `1.14.2` - TDesign Vue 2 组件库
- **tdesign-icons-vue**: `0.4.1` - TDesign 图标库

### 图表可视化依赖
- **echarts**: `6.0.0` - 图表可视化库

### API调用相关依赖
当前项目使用 **浏览器原生 fetch API** 进行API调用，并开发了基于现有依赖的完整API工具链。

## API工具链架构

### 1. API服务层 (`src/utils/api.js`)
基于 fetch API 封装的完整HTTP客户端，提供：
- 统一的请求配置和拦截器
- 自动认证处理
- 响应数据自动解析
- 错误处理和重试机制
- 请求缓存支持
- 批量请求处理

```javascript
// 使用示例
import apiService from '@/utils/api'

// 基本请求
const response = await apiService.get('/users', { page: 1, pageSize: 20 })

// 带配置的请求
const user = await apiService.post('/users', {
  name: '张三',
  email: 'zhangsan@example.com'
})

// 批量请求
const results = await apiService.batch([
  { method: 'GET', url: '/users' },
  { method: 'GET', url: '/roles' }
])
```

### 2. ER API 封装 (`src/utils/api.js`)
提供企业资源领域API的具体封装：

```javascript
import { ER_API } from '@/utils/api'

// 员工管理
const employees = await ER_API.employees.list({ page: 1, pageSize: 20 })
const newEmployee = await ER_API.employees.create({
  name: '新员工',
  department: '技术部'
})

// 部门管理
const departments = await ER_API.departments.list()

// 考勤管理
const attendanceRecords = await ER_API.attendance.records({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
})
```

### 3. 数据管理器 (`src/utils/dataManager.js`)
基于 Vue 2.6 + Composition API 的响应式数据管理：

```javascript
import dataManager from '@/utils/dataManager'

// 缓存数据
dataManager.setCache('users', userData, 300000) // 5分钟缓存
const cachedUsers = dataManager.getCache('users')

// 批量操作
const results = await dataManager.batchOperation(
  [user1, user2, user3],
  user => apiService.post('/users', user)
)

// 数据转换
const groupedUsers = dataManager.group(users, user => user.department)
const activeUsers = dataManager.filter(users, user => user.status === 'active')
```

### 4. 通知服务 (`src/utils/notification.js`)
统一的通知管理系统：

```javascript
import notificationService from '@/utils/notification'

// 各种类型通知
notificationService.success('操作成功')
notificationService.error('操作失败')
notificationService.warning('注意')
notificationService.info('提示信息')

// API请求通知
const apiNotify = notificationService.apiRequest('POST', '/users', {
  loadingMessage: '正在创建用户...',
  successMessage: '用户创建成功',
  errorMessage: '用户创建失败'
})

// 进度通知
notificationService.progress('文件上传', current, total)

// 批量操作通知
notificationService.batch(operations)
```

### 5. Vue插件集成 (`src/plugins/erApiPlugin.js`)
将所有工具集成到Vue实例中：

```javascript
// 在组件中使用
export default {
  api: { // 定义组件API配置
    getUsers: 'GET:/users',
    createUser: 'POST:/users'
  },
  methods: {
    async loadUsers() {
      try {
        // 自动创建API方法
        const users = await this.getUsers({ page: 1 })
        
        // 使用便捷方法
        const response = await this.$callApiWithLoading('POST', '/users', userData)
        
        // Token管理
        this.$setToken('your-token')
        const token = this.$getToken()
        
      } catch (error) {
        // 自动错误处理和通知
        this.$notification.error('加载失败')
      }
    }
  }
}
```

## 完整使用示例

### 1. 在组件中定义API配置
```vue
<template>
  <div>
    <t-button @click="loadUsers" :loading="loading">加载用户</t-button>
    <t-table :data="users" />
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  api: {
    listUsers: 'GET:/users',
    createUser: 'POST:/users',
    updateUser: 'PUT:/users/:id'
  },
  data() {
    return {
      users: [],
      loading: false
    }
  },
  async created() {
    // 使用插件提供的自动API方法
    await this.loadUsers()
  },
  methods: {
    async loadUsers() {
      try {
        // 自动创建的API方法，带加载状态和错误处理
        this.users = await this.listUsers({ page: 1, pageSize: 20 })
        this.$notification.success('用户加载成功')
      } catch (error) {
        this.$notification.error('用户加载失败')
      }
    },
    
    async handleCreate() {
      const newUser = {
        name: '新用户',
        email: 'new@example.com'
      }
      
      try {
        const user = await this.createUser(newUser)
        this.users.push(user)
        this.$notification.success('用户创建成功')
      } catch (error) {
        this.$notification.error('用户创建失败')
      }
    }
  }
}
</script>
```

### 2. 高级API操作
```javascript
// 使用API服务直接调用
import apiService from '@/utils/api'

// 请求重试
const user = await apiService.requestWithRetry(
  'GET', 
  '/users/123', 
  {}, 
  3 // 重试3次
)

// 请求缓存
const users = apiService.cache(
  'users_list',
  () => apiService.get('/users'),
  60000 // 缓存1分钟
)

// 文件上传
const formData = new FormData()
formData.append('file', file)
formData.append('description', '用户头像')

const response = await apiService.upload('/upload', formData)
```

### 3. 数据管理高级用法
```javascript
import dataManager from '@/utils/dataManager'

// 响应式计算
const computedValue = dataManager.transform(
  data,
  items => items.filter(item => item.active)
)

// 数据验证
const validation = dataManager.validate(
  formData,
  {
    name: { required: true, label: '姓名', max: 50 },
    email: { required: true, label: '邮箱', pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ }
  }
)

if (!validation.isValid) {
  console.log('验证错误:', validation.errors)
}

// 数据导出
dataManager.export(
  users, 
  '用户数据', 
  'excel' // 支持json, csv, xml格式
)
```

### 4. 自定义插件扩展
```javascript
import ERApiPlugin from '@/plugins/erApiPlugin'

// 添加自定义API模块
ERApiPlugin.createApiModule('custom', {
  list: 'GET:/custom/data',
  create: 'POST:/custom/data',
  update: 'PUT:/custom/data/:id'
})

// 使用自定义配置
ERApiPlugin.configure({
  baseURL: 'https://your-api.com/v1',
  timeout: 15000,
  retryTimes: 5
})
```

## 技术特点

### 1. 基于现有依赖
- 完全基于当前项目的Vue 2.6、TDesign、ECharts等依赖
- 无需引入额外的第三方库
- 利用浏览器原生fetch API
- 充分发挥@vue/composition-api的能力

### 2. 企业级功能
- 完整的请求拦截器系统
- 自动错误处理和重试
- 智能缓存机制
- 批量操作支持
- 响应式数据管理
- 统一的通知系统

### 3. 开发者友好
- 丰富的API封装
- 简洁的调用接口
- 完善的TypeScript类型支持（可扩展）
- 详细的使用文档和示例

### 4. 高度可扩展
- 插件化架构
- 模块化设计
- 自定义配置支持
- 事件驱动架构

## 性能优化

### 1. 请求优化
- 自动请求去重
- 智能缓存策略
- 连接池管理
- 请求压缩

### 2. 数据管理优化
- 响应式数据更新
- 虚拟滚动支持（可扩展）
- 数据懒加载
- 内存管理

### 3. 用户体验优化
- 加载状态指示
- 错误友好提示
- 操作反馈机制
- 离线支持（可扩展）

这套工具链完全基于当前项目依赖，提供了企业级的API调用能力，无需引入额外的第三方库即可实现完整的API开发和管理功能。