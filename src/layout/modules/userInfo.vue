<template>
    <el-dropdown placement="bottom" class="m-r-10px" @visible-change="handleChange">
        <div class="userBox flex items-center cursor-pointer">
            <s-icon :size="25" svg-name="user" class="m-r-10px"></s-icon>
            <span class="m-r-10px"> 管理员</span>
            <s-icon :icon="isOpenDropdown ? 'ArrowUp':'ArrowDown'" :size="18"></s-icon>
        </div>
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
const isOpenDropdown = ref(false)

const handleChange = (val: boolean) => {
    isOpenDropdown.value = val
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


</script>