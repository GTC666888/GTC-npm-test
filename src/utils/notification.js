/**
 * 通知服务 - 基于 TDesign 和 Vue 2.6
 * 利用现有依赖提供统一的通知管理
 */

class NotificationService {
  constructor() {
    this.queue = []
    this.isProcessing = false
    this.config = {
      maxQueue: 50,
      defaultDuration: 3000,
      position: 'top-right'
    }
    this.listeners = {}
  }

  /**
   * 显示成功通知
   */
  success(content, options = {}) {
    return this.show({
      theme: 'success',
      content,
      icon: 'check-circle',
      ...options
    })
  }

  /**
   * 显示错误通知
   */
  error(content, options = {}) {
    return this.show({
      theme: 'danger',
      content,
      icon: 'close-circle',
      duration: 5000,
      ...options
    })
  }

  /**
   * 显示警告通知
   */
  warning(content, options = {}) {
    return this.show({
      theme: 'warning',
      content,
      icon: 'error-circle',
      duration: 4000,
      ...options
    })
  }

  /**
   * 显示信息通知
   */
  info(content, options = {}) {
    return this.show({
      theme: 'info',
      content,
      icon: 'info-circle',
      ...options
    })
  }

  /**
   * 显示加载通知
   */
  loading(content, options = {}) {
    return this.show({
      theme: 'info',
      content,
      icon: 'loading',
      duration: 0, // 不自动关闭
      ...options
    })
  }

  /**
   * 显示通知
   */
  show(options) {
    const notification = {
      id: this.generateId(),
      timestamp: Date.now(),
      duration: this.config.defaultDuration,
      position: this.config.position,
      ...options
    }

    this.queue.push(notification)
    this.processQueue()

    return notification.id
  }

  /**
   * 关闭指定通知
   */
  close(id) {
    const index = this.queue.findIndex(n => n.id === id)
    if (index > -1) {
      const notification = this.queue[index]
      this.queue.splice(index, 1)
      this.emit('close', notification)
      return true
    }
    return false
  }

  /**
   * 关闭所有通知
   */
  closeAll() {
    const notifications = [...this.queue]
    this.queue = []
    notifications.forEach(notification => {
      this.emit('close', notification)
    })
  }

  /**
   * 配置通知服务
   */
  configure(options) {
    this.config = { ...this.config, ...options }
  }

  /**
   * 生成唯一ID
   */
  generateId() {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 处理通知队列
   */
  async processQueue() {
    if (this.isProcessing) return
    
    this.isProcessing = true
    
    while (this.queue.length > 0) {
      const notification = this.queue[0]
      
      // 限制队列大小
      if (this.queue.length > this.config.maxQueue) {
        this.queue.shift()
        continue
      }

      try {
        await this.displayNotification(notification)
        
        // 设置自动关闭
        if (notification.duration > 0) {
          setTimeout(() => {
            this.close(notification.id)
          }, notification.duration)
        }
        
        // 从队列中移除
        this.queue.shift()
        
      } catch (error) {
        console.error('显示通知失败:', error)
        this.queue.shift()
      }
      
      // 防止阻塞UI
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    this.isProcessing = false
  }

  /**
   * 显示通知（需要根据具体UI框架实现）
   */
  displayNotification(notification) {
    return new Promise((resolve) => {
      // 发送通知显示事件
      this.emit('show', notification)
      resolve()
    })
  }

  /**
   * API请求通知
   */
  apiRequest(method, url, options = {}) {
    const id = this.info(`正在${method} ${url}...`, {
      duration: 0
    })

    return {
      id,
      success: (data) => {
        this.close(id)
        this.success(`${method} ${url} 请求成功`, options)
        return data
      },
      error: (error) => {
        this.close(id)
        this.error(`${method} ${url} 请求失败: ${error.message}`, options)
        throw error
      }
    }
  }

  /**
   * 批量操作通知
   */
  batch(operations, options = {}) {
    const { showProgress = true, showResult = true } = options
    
    if (showProgress) {
      this.info(`正在执行批量操作...`, {
        duration: 0
      })
    }

    return operations
      .then(results => {
        this.closeAll()
        if (showResult) {
          this.success(`批量操作完成: ${results.length} 个任务成功`, options)
        }
        return results
      })
      .catch(error => {
        this.closeAll()
        if (showResult) {
          this.error(`批量操作失败: ${error.message}`, options)
        }
        throw error
      })
  }

  /**
   * 进度通知
   */
  progress(title, current, total, options = {}) {
    const percentage = Math.round((current / total) * 100)
    const content = `${title}: ${current}/${total} (${percentage}%)`
    
    // 查找现有的进度通知
    const existingNotification = this.queue.find(n => 
      n.title === title && n.type === 'progress'
    )

    if (existingNotification) {
      // 更新现有通知
      existingNotification.content = content
      existingNotification.percentage = percentage
      this.emit('update', existingNotification)
    } else {
      // 创建新的进度通知
      this.show({
        title,
        content,
        type: 'progress',
        percentage,
        duration: 0,
        ...options
      })
    }

    // 如果完成，自动关闭
    if (current >= total) {
      setTimeout(() => {
        this.close(title + '_progress')
        this.success(`${title} 完成!`, options)
      }, 1000)
    }
  }

  /**
   * 文件上传通知
   */
  fileUpload(file, onProgress) {
    const id = this.info(`正在上传文件: ${file.name}`, {
      duration: 0
    })

    return {
      id,
      progress: (percent) => {
        if (onProgress) onProgress(percent)
        
        // 查找并更新通知
        const notification = this.queue.find(n => n.id === id)
        if (notification) {
          notification.content = `上传 ${file.name}: ${percent}%`
          notification.percentage = percent
          this.emit('update', notification)
        }
      },
      success: (response) => {
        this.close(id)
        this.success(`文件 ${file.name} 上传成功`)
        return response
      },
      error: (error) => {
        this.close(id)
        this.error(`文件 ${file.name} 上传失败: ${error.message}`)
        throw error
      }
    }
  }

  /**
   * 表单验证通知
   */
  formValidation(errors) {
    if (Object.keys(errors).length === 0) {
      this.success('表单验证通过')
      return true
    }

    const errorMessages = Object.values(errors).flat()
    const message = `发现 ${errorMessages.length} 个验证错误:\n${errorMessages.join('\n')}`
    this.error(message)
    return false
  }

  /**
   * 状态通知
   */
  systemStatus(status, details) {
    const statusConfig = {
      online: { theme: 'success', icon: 'check-circle', message: '服务正常' },
      offline: { theme: 'danger', icon: 'close-circle', message: '服务离线' },
      maintenance: { theme: 'warning', icon: 'time', message: '服务维护' },
      error: { theme: 'danger', icon: 'error-circle', message: '服务错误' }
    }

    const config = statusConfig[status] || statusConfig.error
    return this[config.theme](config.message + (details ? `\n${details}` : ''), {
      duration: status === 'maintenance' ? 0 : this.config.defaultDuration
    })
  }

  /**
   * 事件监听
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  /**
   * 移除事件监听
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
}

// 创建默认实例
const notificationService = new NotificationService()

// Vue 插件
const NotificationPlugin = {
  install(Vue, options = {}) {
    notificationService.configure(options)
    
    // 添加全局方法
    Vue.prototype.$notification = notificationService
    
    // 添加全局指令
    Vue.directive('notification', {
      bind(el, binding) {
        const { value, arg, modifiers } = binding
        
        if (modifiers.success) {
          notificationService.success(value)
        } else if (modifiers.error) {
          notificationService.error(value)
        } else if (modifiers.warning) {
          notificationService.warning(value)
        } else if (modifiers.info) {
          notificationService.info(value)
        } else {
          notificationService.show(value)
        }
      }
    })
  }
}

// 导出
export { NotificationService, NotificationPlugin }
export default notificationService