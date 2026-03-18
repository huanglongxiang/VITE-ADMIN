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
                    <el-input v-model="formData.captcha" placeholder="请输入验证码" />
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
                <el-button type="primary" class="w-100% bg-#2D5CF6" @click="onSubmit">登录</el-button>
            </el-col>

        </el-row>
    </div>
</template>
<script lang="ts" setup>
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
            style: { height: '40px' }

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
interface RuleForm {
    username: string
    password: string
    captcha: string
}

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