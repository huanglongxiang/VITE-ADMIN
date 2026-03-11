import type { NavItemType } from '@/layout/interface/layoutInterface'
import { defineStore } from 'pinia'

export const useTagViewStore = defineStore('tagView', {
    // 状态定义：响应式数据
    state: () => ({
        tagViews: [] as NavItemType[],
    }),
    // 计算属性：基于 state 派生的只读数据
    getters: {
        getTagViews: (state) => state.tagViews,
    },
    actions: {
        addTagView(tagView: NavItemType) {
            if (!this.tagViews.find(v => v.index === tagView.index)) {
                this.tagViews.push(tagView)
            }
        },
        removeTagView(tagView: NavItemType) {
            this.tagViews = this.tagViews.filter((item: NavItemType) => item.index !== tagView.index)
        },
        removeTagViewsAll() {
            this.tagViews = []
        },
    },
    // 持久化配置：将 state 数据持久化到本地存储（如 localStorage）
    persist: true,
})