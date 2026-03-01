<template>
    <el-dropdown placement="bottom" class="m-r-10px">
        <el-avatar :size="25" :src="circleUrl" />
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script lang="ts" setup>
import router from '@/router';
import { useSystemStore } from '@/stores';
import { Avatar } from '@element-plus/icons-vue'
const loginOut = () => {
    router.push('/login')
    useSystemStore().logOut()
}

const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
})

const { circleUrl } = toRefs(state)
</script>