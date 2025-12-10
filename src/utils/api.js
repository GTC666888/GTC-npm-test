/**
 * API 工具类 - 基于现有依赖实现
 * 利用 Vue 2.6 和 TDesign 组件
 */
class ApiService {
  constructor() {
    this.baseURL = 'https://api.er.com/v1'
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    }
    this.interceptors = {
      request: [],
      response: []
    }
  }

  /**
   * 设置基础URL
   */
  setBaseURL(url) {
    this.baseURL = url
  }

  /**
   * 设置默认请求头
   */
  setDefaultHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers }
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor)
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor)
  }

  /**
   * 处理请求拦截器
   */
  async processRequestInterceptors(config) {
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config)
    }
    return config
  }

  /**
   * 处理响应拦截器
   */
  async processResponseInterceptors(response) {
    for (const interceptor of this.interceptors.response) {
      response = await interceptor(response)
    }
    return response
  }

  /**
   * 构建查询参数
   */
  buildQuery(params) {
    if (!params || Object.keys(params).length === 0) {
      return ''
    }
    
    return Object.entries(params)
      .filter(([key, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
  }

  /**
   * 通用请求方法
   */
  async request(method, url, options = {}) {
    try {
      // 构建配置
      const config = {
        method: method.toUpperCase(),
        url: url.startsWith('http') ? url : `${this.baseURL}${url}`,
        headers: { ...this.defaultHeaders, ...options.headers },
        ...options
      }

      // 处理请求拦截器
      const processedConfig = await this.processRequestInterceptors(config)

      // 添加查询参数
      if (processedConfig.params && !['POST', 'PUT', 'PATCH'].includes(processedConfig.method)) {
        const query = this.buildQuery(processedConfig.params)
        processedConfig.url = `${processedConfig.url}${query ? `?${query}` : ''}`
        delete processedConfig.params
      }

      // 发送请求
      const response = await fetch(processedConfig.url, processedConfig)

      // 处理响应拦截器
      return await this.processResponseInterceptors(response)

    } catch (error) {
      throw new Error(`API请求失败: ${error.message}`)
    }
  }

  /**
   * GET 请求
   */
  get(url, params = {}, options = {}) {
    return this.request('GET', url, { ...options, params })
  }

  /**
   * POST 请求
   */
  post(url, data = {}, options = {}) {
    return this.request('POST', url, {
      ...options,
      body: typeof data === 'string' ? data : JSON.stringify(data)
    })
  }

  /**
   * PUT 请求
   */
  put(url, data = {}, options = {}) {
    return this.request('PUT', url, {
      ...options,
      body: typeof data === 'string' ? data : JSON.stringify(data)
    })
  }

  /**
   * DELETE 请求
   */
  delete(url, options = {}) {
    return this.request('DELETE', url, options)
  }

  /**
   * PATCH 请求
   */
  patch(url, data = {}, options = {}) {
    return this.request('PATCH', url, {
      ...options,
      body: typeof data === 'string' ? data : JSON.stringify(data)
    })
  }

  /**
   * 上传文件
   */
  upload(url, formData, options = {}) {
    return this.request('POST', url, {
      ...options,
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options.headers
      }
    })
  }

  /**
   * 批量请求
   */
  async batch(requests) {
    const promises = requests.map(req => {
      const { method, url, ...options } = req
      return this.request(method, url, options)
    })
    
    return await Promise.all(promises)
  }

  /**
   * 请求重试
   */
  async requestWithRetry(method, url, options = {}, retries = 3) {
    let lastError
    
    for (let i = 0; i <= retries; i++) {
      try {
        return await this.request(method, url, options)
      } catch (error) {
        lastError = error
        if (i < retries) {
          // 指数退避延迟
          const delay = Math.pow(2, i) * 1000
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    throw lastError
  }

  /**
   * 缓存请求
   */
  cache(key, requestFn, ttl = 300000) { // 默认5分钟
    const cached = localStorage.getItem(`api_cache_${key}`)
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < ttl) {
        return data
      }
    }
    
    const result = requestFn()
    localStorage.setItem(`api_cache_${key}`, JSON.stringify({
      data: result,
      timestamp: Date.now()
    }))
    
    return result
  }

  /**
   * 清除缓存
   */
  clearCache(pattern = null) {
    if (pattern) {
      // 清除匹配模式的缓存
      Object.keys(localStorage)
        .filter(key => key.startsWith('api_cache_') && key.includes(pattern))
        .forEach(key => localStorage.removeItem(key))
    } else {
      // 清除所有API缓存
      Object.keys(localStorage)
        .filter(key => key.startsWith('api_cache_'))
        .forEach(key => localStorage.removeItem(key))
    }
  }
}

// 创建默认实例
const apiService = new ApiService()

// 添加默认的请求拦截器
apiService.addRequestInterceptor(async (config) => {
  // 添加时间戳防止缓存
  if (config.params) {
    config.params._t = Date.now()
  }
  
  // 添加认证token（如果有）
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// 添加默认的响应拦截器
apiService.addResponseInterceptor(async (response) => {
  // 检查响应状态
  if (!response.ok) {
    if (response.status === 401) {
      // Token过期，清除并跳转登录
      localStorage.removeItem('access_token')
      // 这里可以触发登录逻辑
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  // 自动解析JSON响应
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const data = await response.json()
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data
    }
  } else {
    const text = await response.text()
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: text
    }
  }
})

// ER API 具体方法
export const ER_API = {
  // 员工管理
  employees: {
    list: (params = {}) => apiService.get('/employees', params),
    create: (data) => apiService.post('/employees', data),
    update: (id, data) => apiService.put(`/employees/${id}`, data),
    delete: (id) => apiService.delete(`/employees/${id}`),
    get: (id) => apiService.get(`/employees/${id}`)
  },

  // 部门管理
  departments: {
    list: (params = {}) => apiService.get('/departments', params),
    create: (data) => apiService.post('/departments', data),
    update: (id, data) => apiService.put(`/departments/${id}`, data),
    delete: (id) => apiService.delete(`/departments/${id}`),
    get: (id) => apiService.get(`/departments/${id}`)
  },

  // 考勤管理
  attendance: {
    records: (params = {}) => apiService.get('/attendance/records', params),
    checkin: (data) => apiService.post('/attendance/checkin', data),
    checkout: (data) => apiService.post('/attendance/checkout', data),
    summary: (params = {}) => apiService.get('/attendance/summary', params)
  },

  // 薪酬管理
  salary: {
    list: (params = {}) => apiService.get('/salary', params),
    calculate: (data) => apiService.post('/salary/calculate', data),
    details: (id) => apiService.get(`/salary/${id}`)
  },

  // 绩效管理
  performance: {
    reviews: (params = {}) => apiService.get('/performance/reviews', params),
    evaluate: (data) => apiService.post('/performance/evaluate', data),
    goals: (params = {}) => apiService.get('/performance/goals', params)
  },

  // 培训管理
  training: {
    courses: (params = {}) => apiService.get('/training/courses', params),
    enroll: (data) => apiService.post('/training/enroll', data),
    records: (params = {}) => apiService.get('/training/records', params)
  }
}

// 导出默认实例和具体API
export default apiService
export { ApiService }