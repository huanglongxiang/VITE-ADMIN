<template>
    <div class="loginPage w-100vw h-100vh flex items-center justify-center">
        <el-container class="h-100vh">
            <el-aside class="w-70vw">
                <Banner></Banner>
            </el-aside>
            <el-main class="w-30vw bg-[#fff] flex justify-center p-t-[20vh]">
                <input-login></input-login>
            </el-main>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import Banner from './bg/bg.vue';
import InputLogin from './inputLogin/inputLogin.vue'

</script>
<style lang="scss" scoped>
@use '@/styles/images-variables.scss' as *;
.loginPage{
    background-image: $sbg;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;  // 确保最小高度为视口高度
     // 移动端优化
    @media (max-width: 768px) {
        background-position: center 20%;  // 移动端调整聚焦位置
    }
}
</style>