<template>
  <el-container class="w-screen h-screen">
    <!-- 侧边栏：响应式控制 -->
    <el-aside 
      class="h-screen absolute transition-width duration-300 ease-in-out w-auto z-100"
      :class="[
        getIsCollapse ? 'max-w-64px' : 'max-w-200px',
        isMobile ? 'transform transition-transform duration-300' : '',
        isMobile && !showMobileSidebar ? '-translate-x-full' : 'translate-x-0'
      ]"
    >
      <TransitionGroup name="list">
        <el-header 
          key="header" 
          class="w-200px h-50px p-0 flex items-center justify-center bg-[rgb(121,187,255)] c-#fff"
          v-show="!getIsCollapse && !isMobile"
        >
          AdminSystem
        </el-header>
        <LeftNav key="leftNav"></LeftNav>
      </TransitionGroup>
    </el-aside>

    <!-- 主内容区 -->
    <el-main 
      class="p-0 transition-[margin-left] duration-300 ease-in-out w-full" 
      :class="marginLeft"
    >
      <!-- 移动端顶部 Header -->
      <TopHeader>
        <!-- 移动端汉堡菜单按钮 -->
        <template #mobile-toggle>
          <div v-if="isMobile" class="flex items-center" @click="toggleMobileSidebar">
            <s-icon icon="Menu" class="text-xl cursor-pointer"></s-icon>
          </div>
        </template>
      </TopHeader>
      
      <!-- 内容区域：高度自适应 -->
      <el-main 
        class="p-0 bg-[rgb(244,244,245)] overflow-auto layout-main"
        :class="isMobile ? 'h-[calc(100vh-60px)]' : 'h-[calc(100vh-92px)]'"
      >
        <router-view v-slot="{ Component,route }">
          <transition name="view">
            <keep-alive v-if="route.meta.keepAlive"> 
              <component :is="Component" />
            </keep-alive>
            <component v-else :is="Component" />
          </transition>
        </router-view>
        <el-backtop :right="100" :bottom="100"></el-backtop>
      </el-main>
    </el-main>

    <!-- 移动端遮罩层 -->
    <div 
      v-if="isMobile && showMobileSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-99"
      @click="toggleMobileSidebar"
    ></div>
  </el-container>
</template>

<script setup lang="ts">
import LeftNav from "./modules/leftNav.vue";
import TopHeader from "./modules/topHeader.vue";

import { useSystemStore } from '../stores/modules/system'
import { storeToRefs } from 'pinia'

const systemStore = useSystemStore()
const { getIsCollapse } = storeToRefs(systemStore)

// 响应式状态
const isMobile = ref(false)
const showMobileSidebar = ref(false)

let navWidth = ref('max-w-200px')
let marginLeft = ref('m-l-64px')

/**
 * 检测屏幕尺寸
 */
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  
  if (isMobile.value) {
    navWidth.value = 'max-w-64px'
    marginLeft.value = ''
  } else {
    navWidth.value = getIsCollapse.value ? 'max-w-64px' : 'max-w-200px'
    marginLeft.value = getIsCollapse.value ? 'm-l-64px' : 'm-l-200px'
  }
}

/**
 * 切换移动端侧边栏显示
 */
const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
}

const handleChangeFun = () => {
  nextTick(() => {
    if (!isMobile.value) {
      if (getIsCollapse.value) {
        navWidth.value = 'max-w-64px'
        marginLeft.value = 'm-l-64px'
      } else {
        navWidth.value = 'max-w-200px'
        marginLeft.value = 'm-l-200px'
      }
    }
  })
}

watch(() => getIsCollapse.value, handleChangeFun)

onMounted(() => {
  checkMobile()
  
  if (getIsCollapse.value) {
    navWidth.value = 'max-w-64px'
    marginLeft.value = 'm-l-64px'
  } else {
    navWidth.value = 'max-w-200px'
    marginLeft.value = 'm-l-200px'
  }
  
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped lang="scss">
.layout-main {
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>