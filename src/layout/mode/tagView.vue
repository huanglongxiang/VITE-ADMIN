<template>
    <el-header class="p-t-4px p-b-4px p-l-10px p-r-10px h-auto flex ">
        <el-scrollbar class="hidden-scrollbar flex-1">
            <div class="tagView flex">
                <transition-group name="list">
                    <el-tag :closable="getTagViews.length > 1" class="cursor-pointer m-r-5px"
                        :effect="route.meta.title === item.title ? 'dark' : 'plain'" :key="item.index"
                        @click="handleToView(item)" @close="handleClose(item)"
                        @contextmenu.prevent="handleMenuOpen(item, $event)" v-for="item in getTagViews">
                        {{ item.title }}
                    </el-tag>
                    <el-tag type="info" @click="handleCloseAll" v-if="getTagViews.length > 1"  class="cursor-pointer m-r-5px">
                        <div class="flex justify-center items-center">
                            <sIcon :icon="'CircleClose'" class="m-r-3px"></sIcon>
                            关闭全部
                        </div>
                    </el-tag>
                </transition-group>
            </div>
        </el-scrollbar>
        <ul v-show="isShowTagMenu" ref="contextMenuRef" class="
            shadow-[0px_0px_12px_rgba(0,0,0,0.12)] 
            ease-in-out 
            duration-0.3s 
            px-0 py-5px 
            absolute 
            z-10 m-0 
            bg-[#fff] 
            list-none 
            rounded 
            afterClass"
            :style="{ top: `${positionsTagMenu.y}px`, left: `${positionsTagMenu.x}px`, opacity: positionsTagMenu.opacityVal }">
            <li v-for="item in source" class="m-0 px-16px py-7px cursor-pointer hover:bg-blue-100 hover:text-blue-500">
                {{ item.value }}</li>
        </ul>
    </el-header>
</template>
<script lang="ts" setup>
import { useSystemStore } from '@/stores/modules/system'
import { storeToRefs } from 'pinia'
import { useRoute,useRouter } from 'vue-router'
import type { NavItemType } from '@/interface/layoutInterface'

import { localStg } from '@/utils/storage'

const route = useRoute()
const router = useRouter()
const systemStore = useSystemStore()

const { getTagViews } = storeToRefs(systemStore)
const isShowTagMenu = ref(false)
const handleToView = (item: NavItemType) => {
    router.push(item.index)
    systemStore.setActiveIndex(item.index)
}

const handleClose = (item: NavItemType) => {
    let _index = getTagViews.value.findIndex(v => v.index === item.index)
    let nextTagView = null;
    if (_index - 1 < 0) {
        nextTagView = getTagViews.value[_index + 1]
    } else {
        nextTagView = getTagViews.value[_index - 1]
    }
    systemStore.removeTagView(item)
    if (systemStore.activeIndex === item.index) {
        handleToView(nextTagView as NavItemType)
    }

}

const handleCloseAll = () => {
    systemStore.removeTagViewsAll();
    const routes = localStg.get("routes", []);
    if (routes && routes.length > 0) {
        const firstRoute = systemStore.menuList[0];
        if (firstRoute) {
            router.push('/home');
            systemStore.addTagView(firstRoute);
            systemStore.setActiveIndex(firstRoute.index);
        }
    }
}

const positionsTagMenu = ref({
    x: 0,
    y: 0,
    opacityVal: 0
})
const contextMenuRef = ref<HTMLElement | null>(null)
const handleMenuOpen = (item: NavItemType, e: MouseEvent) => {
    handleCloseMenu()
    setTimeout(() => {
        isShowTagMenu.value = true
        const target = e.target as HTMLElement;
        setTimeout(() => {
            let tagRect = target.closest(".el-tag")?.getBoundingClientRect()
            if (tagRect) {
                let { x, y } = tagRect;
                positionsTagMenu.value.x = x;
                positionsTagMenu.value.y = y + 27;
                if (contextMenuRef.value) {
                    let contextMenuRect = contextMenuRef.value.getBoundingClientRect();
                    if (tagRect.width > contextMenuRect.width) {
                        positionsTagMenu.value.x = positionsTagMenu.value.x + (tagRect.width - contextMenuRect.width) / 2;
                    } else if (tagRect.width < contextMenuRect.width) {
                        positionsTagMenu.value.x = positionsTagMenu.value.x - (contextMenuRect.width - tagRect.width) / 2;
                    }
                    setTimeout(() => {
                        positionsTagMenu.value.opacityVal = 1;
                    }, 200);
                }
            }
        });
    });
}
const handleCloseMenu = () => {
    isShowTagMenu.value = false
    positionsTagMenu.value.opacityVal = 0;
}

const source = ref([
    {
        value: '刷新',
    },
    {
        value: '关闭',
    },
    {
        value: '关闭其他',
    }
])
document.addEventListener('click', handleCloseMenu)
</script>
<style scoped lang="scss">
.afterClass::after {
    content: '';
    border: 5px solid #fff;
    width: 0;
    height: 0;
    line-height: 0;
    display: inline-block;
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
}
</style>