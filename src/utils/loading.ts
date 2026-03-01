import { ElLoading, type LoadingOptions } from 'element-plus'

// 模块内私有变量：保存 Loading 实例（模块单例，跨页面共享）
let loadingInstance: ReturnType<typeof ElLoading.service> | null = null

/**
 * 显示全局 Loading（跨页面可用，无 window 依赖）
 * @param options Loading 配置项
 */
export const showLoading = (options: LoadingOptions = {}) => {
  // 避免重复创建实例
  if (loadingInstance) {
    hideLoading()
  }

  const defaultOptions: LoadingOptions = {
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.5)',
    fullscreen: true,
    ...options
  }

  // 创建实例并保存到模块私有变量
  loadingInstance = ElLoading.service(defaultOptions)
}

/**
 * 隐藏全局 Loading（跨页面可用）
 */
export const hideLoading = () => {
  if (loadingInstance) {
    try {
      loadingInstance.close()
    } catch (error) {
      console.warn('Loading 实例关闭失败:', error)
    } finally {
      loadingInstance = null // 清空实例，避免内存泄漏
    }
  }
}

/**
 * 异步函数包装器：自动管理 Loading（推荐）
 * @param fn 异步函数
 * @param loadingOptions Loading 配置
 */
export const withLoading = async <T>(
  fn: () => Promise<T>,
  loadingOptions?: LoadingOptions
): Promise<T> => {
  try {
    showLoading(loadingOptions)
    return await fn()
  } catch (error) {
    console.error('异步操作失败:', error)
    throw error // 抛出错误，让调用方处理
  } finally {
    hideLoading()
  }
}

/**
 * 检查当前是否有 Loading 实例（可选）
 */
export const hasLoading = () => !!loadingInstance