<template>
  <el-container class="w-screen h-screen">
    <el-aside class="max-w-200px h-screen absolute transition-width duration-300 ease-in-out w-auto">
      <TransitionGroup name="list">
        <el-header key="header" class="w-200px h-50px p-0 flex items-center justify-center bg-[rgb(121,187,255)] c-#fff "
          v-show="!getIsCollapse">AdminSystem</el-header>
        <LeftNav key="leftNav"></LeftNav>
      </TransitionGroup>
    </el-aside>
    <el-main class="p-0 transition-[margin-left] duration-300 ease-in-out" :class="marginLeft">
      <TopHeader></TopHeader>
      <el-main class="p-0 h-[calc(100vh-92px)] bg-[rgb(244,244,245)] overflow-auto">
        <router-view v-slot="{ Component,route }">
          <transition name="view">
            <keep-alive v-if="route.meta.keepAlive"> 
              <component :is="Component" />
            </keep-alive>
            <component v-else :is="Component" />
          </transition>
        </router-view>
        <el-backtop :right="100" :bottom="100" ></el-backtop>
      </el-main>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import LeftNav from "./modules/leftNav.vue";
import TopHeader from "./modules/topHeader.vue";
// 布局组件无需复杂逻辑

import { useSystemStore } from '../stores/modules/system'
import { storeToRefs } from 'pinia'

const systemStore = useSystemStore()

const { getIsCollapse } = storeToRefs(systemStore)

let navWidth = ref('max-w-200px')
let marginLeft = ref('m-l-64px')

const handleChangeFun = () => {
  nextTick(() => {
    if (getIsCollapse.value) {
      navWidth.value = 'max-w-64px'
      marginLeft.value = 'm-l-64px'
    } else {
      navWidth.value = 'max-w-200px'
      marginLeft.value = 'm-l-200px'
    }
  })
}

watch(() => getIsCollapse.value, handleChangeFun)

onMounted(() => {
  if (getIsCollapse.value) {
    navWidth.value = 'max-w-64px'
    marginLeft.value = 'm-l-64px'
  } else {
    navWidth.value = 'max-w-200px'
    marginLeft.value = 'm-l-200px'
  }
})
</script>

