<template>
    <el-dropdown placement="bottom" class="m-r-10px">
        <el-avatar :size="25" :src="circleUrl" />
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="handleUserInfo">个人中心</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script lang="ts" setup>
import router from '@/router';
import { useSystemStore } from '@/stores';
import { createDialog } from '@/hooks/useDialog';
import userInfoForm from "../dialog/userInfoForm.vue";
const loginOut = () => {
    router.push('/login')
    useSystemStore().logOut()
}
const handleUserInfo = () => {
    createDialog({
        title: '个人信息',
        width: '30%',
        content: userInfoForm,
        isFloote: true,
        onClose: () => {
          console.log('对话框已关闭');
        },
    })
}

const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
})

const { circleUrl } = toRefs(state)
</script>