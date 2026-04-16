<template>
    <div class="login-main w-70%">
        <el-row>
            <el-col>
                <div class="m-b[15px]">
                    <span class="font-size-[30px] font-600">欢迎</span>
                    <span class="color-[#2D5CF6] font-size-[30px] font-600">登录</span>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="font-size-[14px] color-[#8C8C8C] m-b[37px]">输入您的账号和密码登录</el-col>
        </el-row>
        <s-form label-position="top" :formData="formData" :formItems="formItems" :rules="rules" :showButtons="false">
            <template #captcha>
                <div class="flex w-100%">
                    <el-input v-model="formData.captcha" placeholder="请输入验证码" >
                        <template #prefix>
                            <s-icon svg-name="验证码1" :size="16"></s-icon>
                        </template>
                    </el-input>
                    <div class="w-150px h-40px bg-blue"></div>
                </div>
            </template>
        </s-form>
        <el-row class="m-b-50px">
            <el-col :span="5">
                <el-checkbox v-model="formData.isRememberPsd" label="记住密码" />
            </el-col>
            <el-col :span="4" :offset="15" class="items-center" style="display: flex;">
                <el-button type="primary" link>忘记密码</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-button type="primary" class="w-100% bg-#2D5CF6 h-40px" @click="onSubmit">登录</el-button>
            </el-col>

        </el-row>
    </div>
</template>
<script setup lang="ts">
import type { RuleForm } from '@/api/interface/userInterface'
import router from '@/router'
import type { FormRules } from 'element-plus'

const formData = reactive({
    username: '',
    password: '',
    captcha: '',
    isRememberPsd: false
})


const formItems = [
    {
        type: 'input',
        prop: 'username',
        label: '用户名',
        placeholder: '请输入用户名',
        props: {
            style: { height: '40px' },
            prefixIcon: 'User'
        }
    },
    {
        type: 'input',
        prop: 'password',
        label: '密码',
        placeholder: '请输入密码',
        props: {
            type: 'password',
            showPassword: true,
            disabled: false,
            prefixIcon: 'Lock',
            style: { height: '40px' }
        },
    },
    {
        type: '',
        prop: 'captcha',
        label: '验证码',
        placeholder: '请输入验证码',

    }
]


const rules = reactive<FormRules<RuleForm>>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ]
})




const onSubmit = () => {
    if(!formData.username || !formData.password || !formData.captcha) {
        ElMessage.error('请登录信息信息')
        return
    }
    
    router.push('/home')
}
</script>