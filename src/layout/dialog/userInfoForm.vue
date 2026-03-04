<template>
    <s-form :formData="formData" :formItems="formItems" :rules="rules" :showButtons="false" @submit="handleSubmit">
        <template #before>
            <div class="flex items-center gap-[10px] p-[10px] justify-center">
                <!-- 图像预览 -->
                <div class="text-align-center">
                    <el-image class="m-b-5px" v-if="formData.avatar" :src="formData.avatar"
                        :preview-src-list="[formData.avatar]" fit="cover" />
                    <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess">
                        <el-button type="primary">选择图片</el-button>
                    </el-upload>
                </div>
            </div>
        </template>
    </s-form>
</template>
<script setup lang="ts">

const formData = reactive({
    username: '',
    password: '',
    email: '',
    role: '',
    status: true,
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

const formItems = [
    {
        type: 'input',
        prop: 'username',
        label: '用户名',
        placeholder: '请输入用户名',
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
        },
    },
    {
        type: 'select',
        prop: 'role',
        label: '角色',
        placeholder: '请选择角色',
        optionType: 'select',
        options: [
            { label: '管理员', value: 'admin' },
            { label: '普通用户', value: 'user' },
            { label: '访客', value: 'guest' },
        ],
        props: {
            disabled: true,
        },
    },
    {
        type: 'radio-group',
        prop: 'gender',
        label: '性别',
        optionType: 'radio-group',
        options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
        ],
        props: {
            disabled: true,
        },
    },
    {
        type: 'switch',
        prop: 'status',
        label: '状态',
        props: {
            disabled: true,
        },
    },
]

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
}
const handleAvatarSuccess = (response: any, file: any) => {
    // 根据实际 API 返回结构调整
    const url = response.url || response.data?.url
    formData.avatar = url
}
const handleSubmit = (data:any) => {
    console.log('提交数据:', data)
}
</script>