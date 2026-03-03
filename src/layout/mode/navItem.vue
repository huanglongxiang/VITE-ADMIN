<template>
    <template v-for="item in navData">
        <!-- 一级菜单组 -->
        <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.index" >
            <template #title>
                <sIcon :icon="item.icon || 'location'"></sIcon>
                <span>{{ item.title }}</span>
            </template>
            <!-- 递归渲染菜单项 -->
            <NavItem :navData="item.children"></NavItem>
        </el-sub-menu>
        <!-- 一级菜单项 -->
        <el-menu-item v-else :index="item.index" @click="handleLink(item)">
            <sIcon :icon="item.icon || 'location'"></sIcon>
            <span>{{ item.title }}</span>
        </el-menu-item>
    </template>
</template>

<script lang="ts" setup>
import NavItem from '@/layout/mode/navItem.vue'
import { useSystemStore } from '@/stores/modules/system'
import type { NavItemType } from '@/interface/layoutInterface'


const systemStore = useSystemStore()

const props = defineProps({
    navData: {
        type: Array as PropType<NavItemType[]>,
        required: true
    }
})

const handleLink = (item: NavItemType) => {
    console.log(item)
    systemStore.addTagView(item)
}

</script>