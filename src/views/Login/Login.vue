<template>
    <div class="bg-[rgb(244,244,245)] w-100vw h-100vh flex items-center justify-center">
        <el-card class="w-[500px] flex items-center justify-center">
            <div class="w-[300px]">
                <h3 class="text-center">AdminSystem</h3>
                <el-form ref="form" :model="formData"> 
                    <el-form-item>
                        <el-input :prefix-icon="User" placeholder="用户名" v-model="formData.username"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input :prefix-icon="Lock" placeholder="密码" :type="password" v-model="formData.password">
                            <template #append>
                                <el-button link @click="isShowPsw" :icon="type === 'hide' ? View  : Hide" ></el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="w-100%" type="primary" @click="onSubmit">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import router from '@/router'
import { Lock, User,View,Hide } from '@element-plus/icons-vue'



const formData = reactive({
    username: '',
    password: ''
})

const type = ref('hide')
const password = ref('password')
// 密码可见
const isShowPsw = () => {
    type.value = type.value === 'hide' ? 'view' : 'hide'
    if (type.value === 'view') {
        password.value = 'text'
    } else {
        password.value = 'password'
    }
}

const onSubmit = () => {
   router.push('/home')
}
</script>