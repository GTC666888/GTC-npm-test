/**
 * Vue 2.6 响应式数据管理器
 * 利用现有依赖提供数据管理能力
 */
import { reactive, computed } from '@vue/composition-api'

class DataManager {
  constructor() {
    this.state = reactive({
      apiResponses: {},
      loading: false,
      error: null,
      cache: {},
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0
      }
    })
    
    this.listeners = {}
  }

  /**
   * 设置加载状态
   */
  setLoading(loading) {
    this.state.loading = loading
  }

  /**
   * 设置错误信息
   */
  setError(error) {
    this.state.error = error
  }

  /**
   * 清除错误信息
   */
  clearError() {
    this.state.error = null
  }

  /**
   * 缓存数据
   */
  setCache(key, data, ttl = 300000) {
    this.state.cache[key] = {
      data,
      timestamp: Date.now(),
      ttl
    }
  }

  /**
   * 获取缓存数据
   */
  getCache(key) {
    const cached = this.state.cache[key]
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      delete this.state.cache[key]
      return null
    }
    
    return cached.data
  }

  /**
   * 设置API响应数据
   */
  setApiResponse(key, data) {
    this.state.apiResponses[key] = {
      data,
      timestamp: Date.now()
    }
  }

  /**
   * 获取API响应数据
   */
  getApiResponse(key) {
    return this.state.apiResponses[key]?.data
  }

  /**
   * 设置分页信息
   */
  setPagination(pagination) {
    this.state.pagination = { ...this.state.pagination, ...pagination }
  }

  /**
   * 重置分页
   */
  resetPagination() {
    this.state.pagination = {
      page: 1,
      pageSize: 20,
      total: 0
    }
  }

  /**
   * 计算属性：当前页数据
   */
  getCurrentPageData(totalData) {
    return computed(() => {
      const { page, pageSize } = this.state.pagination
      const start = (page - 1) * pageSize
      const end = start + pageSize
      return totalData?.slice(start, end) || []
    })
  }

  /**
   * 计算属性：总页数
   */
  getTotalPages(total) {
    return computed(() => {
      const { pageSize } = this.state.pagination
      return Math.ceil(total / pageSize)
    })
  }

  /**
   * 批量操作
   */
  async batchOperation(operations, operationFn) {
    this.setLoading(true)
    this.clearError()
    
    try {
      const results = await Promise.allSettled(
        operations.map(op => operationFn(op))
      )
      
      const successful = results.filter(r => r.status === 'fulfilled')
      const failed = results.filter(r => r.status === 'rejected')
      
      if (failed.length > 0) {
        throw new Error(`${failed.length} 个操作失败`)
      }
      
      this.setLoading(false)
      return successful.map(r => r.value)
      
    } catch (error) {
      this.setError(error)
      this.setLoading(false)
      throw error
    }
  }

  /**
   * 事件监听器
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  /**
   * 移除事件监听器
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
  }

  /**
   * 触发事件
   */
  emit(event, ...args) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(...args))
    }
  }

  /**
   * 数据变换器
   */
  transform(data, transformFn) {
    return computed(() => transformFn(data))
  }

  /**
   * 数据过滤器
   */
  filter(data, filterFn) {
    return computed(() => data.filter(filterFn))
  }

  /**
   * 数据排序器
   */
  sort(data, sortFn) {
    return computed(() => [...data].sort(sortFn))
  }

  /**
   * 数据分组
   */
  group(data, groupFn) {
    return computed(() => {
      const groups = {}
      data.forEach(item => {
        const key = groupFn(item)
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(item)
      })
      return groups
    })
  }

  /**
   * 数据统计
   */
  statistics(data, statsFn) {
    return computed(() => statsFn(data))
  }

  /**
   * 数据搜索
   */
  search(data, searchTerm, searchFields) {
    return computed(() => {
      if (!searchTerm) return data
      
      const term = searchTerm.toLowerCase()
      return data.filter(item => 
        searchFields.some(field => {
          const value = item[field]
          return value && value.toString().toLowerCase().includes(term)
        })
      )
    })
  }

  /**
   * 数据验证
   */
  validate(data, rules) {
    const errors = {}
    
    Object.keys(rules).forEach(field => {
      const fieldRules = rules[field]
      const value = data[field]
      
      fieldRules.forEach(rule => {
        if (rule.required && (!value || value.toString().trim() === '')) {
          errors[field] = errors[field] || []
          errors[field].push(`${rule.label || field} 是必填的`)
        }
        
        if (rule.min && value && value.length < rule.min) {
          errors[field] = errors[field] || []
          errors[field].push(`${rule.label || field} 至少需要 ${rule.min} 个字符`)
        }
        
        if (rule.max && value && value.length > rule.max) {
          errors[field] = errors[field] || []
          errors[field].push(`${rule.label || field} 最多 ${rule.max} 个字符`)
        }
        
        if (rule.pattern && value && !rule.pattern.test(value)) {
          errors[field] = errors[field] || []
          errors[field].push(`${rule.label || field} 格式不正确`)
        }
        
        if (rule.validator && value && !rule.validator(value)) {
          errors[field] = errors[field] || []
          errors[field].push(rule.message || `${rule.label || field} 验证失败`)
        }
      })
    })
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * 数据格式化
   */
  format(data, formatFn) {
    return computed(() => formatFn(data))
  }

  /**
   * 数据导出
   */
  export(data, filename, format = 'json') {
    let content, mimeType
    
    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2)
        mimeType = 'application/json'
        break
      case 'csv':
        if (!Array.isArray(data) || data.length === 0) return
        const headers = Object.keys(data[0])
        content = [
          headers.join(','),
          ...data.map(row => headers.map(h => row[h] || '').join(','))
        ].join('\n')
        mimeType = 'text/csv'
        break
      case 'xml':
        content = this.toXML(data)
        mimeType = 'application/xml'
        break
      default:
        content = JSON.stringify(data, null, 2)
        mimeType = 'application/json'
    }
    
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * 转换为XML
   */
  toXML(obj, rootName = 'root') {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>`
    
    const processValue = (value, key) => {
      if (value === null || value === undefined) return ''
      if (typeof value === 'object') {
        return Object.entries(value)
          .map(([k, v]) => processValue(v, k))
          .join('')
      }
      return `<${key}>${value}</${key}>`
    }
    
    if (typeof obj === 'object') {
      xml += Object.entries(obj)
        .map(([key, value]) => processValue(value, key))
        .join('')
    } else {
      xml += processValue(obj, 'data')
    }
    
    xml += `</${rootName}>`
    return xml
  }

  /**
   * 清除所有数据
   */
  clear() {
    this.state.apiResponses = {}
    this.state.cache = {}
    this.state.error = null
    this.resetPagination()
  }
}

// 创建默认实例
const dataManager = new DataManager()

// 导出类和实例
export { DataManager }
export default dataManager