import type { NavItemType, RouteConfig } from '@/layout/interface/layoutInterface'
import storage from './storage'
import { useSystemStore } from '@/stores'
export function traverseRouter(routes: NavItemType[]): NavItemType[] { 
    let _list: NavItemType[] = []
    function traverse(routes:NavItemType[], parentTitles: string[] = [], parentIndexes: string[] = []) {
        routes.forEach((_item:NavItemType) => {
             // 构建当前节点的完整链路
            const currentTitles = [...parentTitles, _item.title]
            const currentIndexes = [...parentIndexes, _item.index]
            
            if (_item.children && _item.children?.length > 0) {
                traverse(_item.children,currentTitles,currentIndexes)
            } else {
                _list.push(Object.assign(_item, {
                    titles: currentTitles,
                    indexes: currentIndexes,
                }))
            }
        })
    }
    traverse(routes)
    return _list
}

export const toOneChildrenPage = (item: string, callback: (item: string | null) => void) => {
    // 修复1: 明确定义 routes 的类型，避免 null 值和 any 类型问题
    const routes = storage.localStg.get<RouteConfig[]>("routes", [])
    
    // 修复2: 添加 null 检查和类型安全的遍历
    if (routes && Array.isArray(routes)) {
        for (let i = 0; i < routes.length; i++) {
            const element = routes[i]
            // 修复3: 添加类型检查确保 element 存在且有 path 属性
            if (element && typeof element.path === 'string' && element.path.includes(item)) {
                useSystemStore().setActiveIndex(element.path)
                callback(element.path)
                break
            }
        }
    }
    callback(null)
}