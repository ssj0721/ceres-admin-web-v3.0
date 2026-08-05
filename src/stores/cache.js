import { defineStore } from 'pinia'

const MAX_CACHE_AGE = 60 * 60 * 1000 // 1小时缓存有效期

export const useCacheStore = defineStore('routeCache', {
  state: () => ({
    cacheMap: new Map(), // 使用Map保证顺序和唯一性
    maxCacheSize: 5      // 最大缓存数量
  }),
  actions: {
    // 保存组件状态
    saveState(key, state) {
      if (this.cacheMap.size >= this.maxCacheSize) {
        // 实现LRU缓存淘汰策略
        const oldestKey = [...this.cacheMap.keys()].shift()
        this.cacheMap.delete(oldestKey)
      }

      this.cacheMap.set(key, {
        ...state,
        timestamp: Date.now()
      })

      // 持久化到localStorage
      localStorage.setItem(`cache:${key}`, JSON.stringify({
        ...state,
        timestamp: Date.now()
      }))
    },

    // 获取组件状态
    getState(key) {
      const cached = this.cacheMap.get(key)
      if (!cached) {
        const saved = localStorage.getItem(`cache:${key}`)
        return saved ? JSON.parse(saved) : null
      }
      return cached
    },

    // 清理过期缓存
    cleanup() {
      const now = Date.now()
      this.cacheMap.forEach((value, key) => {
        if (now - value.timestamp > MAX_CACHE_AGE) {
          this.cacheMap.delete(key)
          localStorage.removeItem(`cache:${key}`)
        }
      })
    }
  }
})