/**
 * ER API 插件 - 基于现有依赖
 * 整合API工具、数据管理、通知服务等
 */
import apiService, { ER_API } from '../utils/api'
import dataManager from '../utils/dataManager'
import notificationService, { NotificationPlugin } from '../utils/notification'

class ERApiPlugin {
  constructor() {
    this.apiService = apiService
    this.dataManager = dataManager
    this.notificationService = notificationService
    this.ER_API = ER_API
    
    this.plugins = []
    this.config = {
      baseURL: 'https://api.er.com/v1',
      timeout: 10000,
      retryTimes: 3,
      enableCache: true,
      cacheTimeout: 300000 // 5分钟
    }
  }

  /**
   * 安装插件
   */
  install(Vue, options = {}) {
    // 合并配置
    this.config = { ...this.config, ...options }
    
    // 配置API服务
    this.apiService.setBaseURL(this.config.baseURL)
    
    // 添加请求拦截器
    this.apiService.addRequestInterceptor(async (config) => {
      // 添加时间戳
      config.params = config.params || {}
      config.params._t = Date.now()
      
      // 添加认证信息
      const token = this.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      return config
    })
    
    // 添加响应拦截器
    this.apiService.addResponseInterceptor(async (response) => {
      // 缓存GET请求
      if (this.config.enableCache && response.config.method === 'GET') {
        const cacheKey = this.getCacheKey(response.config)
        this.dataManager.setCache(cacheKey, response.data, this.config.cacheTimeout)
      }
      
      return response
    })
    
    // 注入到Vue实例
    Vue.prototype.$api = this.apiService
    Vue.prototype.$dataManager = this.dataManager
    Vue.prototype.$notification = this.notificationService
    Vue.prototype.$ER_API = this.ER_API
    
    // 安装通知插件
    Vue.use(NotificationPlugin, {
      maxQueue: 50,
      defaultDuration: 3000
    })
    
    // 添加全局混入
    Vue.mixin({
      created() {
        // 为每个组件添加API便捷方法
        if (this.$options.name && this.$options.api) {
          this.setupApi()
        }
      },
      methods: {
        /**
         * 设置API
         */
        setupApi() {
          const apiConfig = this.$options.api
          Object.keys(apiConfig).forEach(key => {
            this[key] = this.createApiMethod(apiConfig[key])
          })
        },
        
        /**
         * 创建API方法
         */
        createApiMethod(methodConfig) {
          return async (...args) => {
            try {
              this.$dataManager.setLoading(true)
              this.$dataManager.clearError()
              
              const { method, url, params, options } = methodConfig
              const response = await this.$api[method](url, params, options)
              
              this.$dataManager.setApiResponse(method, response.data)
              this.$dataManager.setLoading(false)
              
              // 触发成功回调
              if (methodConfig.onSuccess) {
                methodConfig.onSuccess.call(this, response.data)
              }
              
              return response.data
              
            } catch (error) {
              this.$dataManager.setError(error)
              this.$dataManager.setLoading(false)
              
              // 触发错误回调
              if (methodConfig.onError) {
                methodConfig.onError.call(this, error)
              }
              
              throw error
            }
          }
        },
        
        /**
         * 便捷的API调用
         */
        $callApi(method, url, data = {}, options = {}) {
          return this.$api[method](url, data, options)
        },
        
        /**
         * 带加载状态的API调用
         */
        $callApiWithLoading(method, url, data = {}, options = {}) {
          return this.$callApi(method, url, data, options)
            .catch(error => {
              this.$notification.error(`请求失败: ${error.message}`)
              throw error
            })
        },
        
        /**
         * 获取Token
         */
        $getToken() {
          return this.getToken()
        },
        
        /**
         * 设置Token
         */
        $setToken(token) {
          this.setToken(token)
        },
        
        /**
         * 清除Token
         */
        $clearToken() {
          this.clearToken()
        }
      }
    })
  }

  /**
   * 获取Token
   */
  getToken() {
    return localStorage.getItem('er_access_token') || sessionStorage.getItem('er_access_token')
  }

  /**
   * 设置Token
   */
  setToken(token, remember = true) {
    if (remember) {
      localStorage.setItem('er_access_token', token)
    } else {
      sessionStorage.setItem('er_access_token', token)
    }
  }

  /**
   * 清除Token
   */
  clearToken() {
    localStorage.removeItem('er_access_token')
    sessionStorage.removeItem('er_access_token')
  }

  /**
   * 获取缓存键
   */
  getCacheKey(config) {
    const { method, url, params = {} } = config
    const paramStr = JSON.stringify(params)
    return `${method}_${url}_${btoa(paramStr)}`
  }

  /**
   * 添加子插件
   */
  use(plugin, options = {}) {
    if (typeof plugin.install === 'function') {
      plugin.install(this, options)
      this.plugins.push(plugin)
    }
  }

  /**
   * 配置插件
   */
  configure(options) {
    this.config = { ...this.config, ...options }
  }

  /**
   * 创建API模块
   */
  createApiModule(name, config = {}) {
    const module = {}
    
    Object.keys(config).forEach(key => {
      const [method, url] = config[key].split(':')
      module[key] = (params = {}, options = {}) => {
        return this.apiService[method.toLowerCase()](url, params, options)
      }
    })
    
    // 注册到ER_API
    this.ER_API[name] = module
    
    return module
  }

  /**
   * 批量注册API模块
   */
  registerModules(modules) {
    Object.keys(modules).forEach(name => {
      this.createApiModule(name, modules[name])
    })
  }
}

// 创建默认实例
const erApiPlugin = new ERApiPlugin()

// 注册默认API模块
erApiPlugin.registerModules({
  users: {
    list: 'GET:/users',
    create: 'POST:/users',
    update: 'PUT:/users/:id',
    delete: 'DELETE:/users/:id',
    get: 'GET:/users/:id'
  },
  roles: {
    list: 'GET:/roles',
    create: 'POST:/roles',
    update: 'PUT:/roles/:id',
    delete: 'DELETE:/roles/:id',
    get: 'GET:/roles/:id'
  },
  permissions: {
    list: 'GET:/permissions',
    create: 'POST:/permissions',
    update: 'PUT:/permissions/:id',
    delete: 'DELETE:/permissions/:id',
    get: 'GET:/permissions/:id'
  }
})

// 导出
export { ERApiPlugin }
export default erApiPlugin