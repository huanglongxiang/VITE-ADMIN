<template>
    <el-divider content-position="left">布局设置</el-divider>
    <div class="flex justify-between">
        <el-tooltip content="左侧模式" placement="bottom">
            <div class="w-90px h-90px layoutSelect">
                <el-container class="w-100% h-100%">
                    <el-aside class="w-25px bg-[rgb(121,187,255)]"></el-aside>
                    <el-container>
                        <el-header class="w-100% h-20px bg-[#ccc]"></el-header>
                        <el-main class="bg-[#ececec]"></el-main>
                    </el-container>
                </el-container>
            </div>
        </el-tooltip>
        <el-tooltip content="混合模式" placement="bottom">
            <div class="w-90px h-90px layoutSelect">
            <el-container class="w-100% h-100%">
                <el-header class="w-100% h-20px bg-[#ccc]"></el-header>
                <el-container>
                    <el-aside class="w-25px bg-[rgb(121,187,255)]"></el-aside>
                    <el-main class="bg-[#ececec]"></el-main>
                </el-container>
            </el-container>
        </div>
        </el-tooltip>
        <el-tooltip content="顶部模式" placement="bottom">
             <div class="w-90px h-90px layoutSelect">
                <el-container class="w-100% h-100%">
                    <el-header class="h-20px bg-[rgb(121,187,255)]"></el-header>
                    <el-main class="bg-[#ececec]"></el-main>
                </el-container>
            </div>
        </el-tooltip>
    </div>
    <el-divider content-position="left">配置设置</el-divider>
    <el-form
        class="drawerFrom"
        label-position="right"
        label-width="auto"
        :model="formLabelAlign"
    >
        <el-form-item label="显示标签栏" label-position="right">
           <el-switch v-model="formLabelAlign.isLabelTag" ></el-switch>
        </el-form-item>
        <el-form-item label="显示logo" label-position="right">
           <el-switch v-model="formLabelAlign.islogo" ></el-switch>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">

const formLabelAlign = reactive({
  isLabelTag: false,
  islogo: false,
})
</script>
<style scoped lang="scss" >
    .layoutSelect{
        cursor: pointer;
        box-sizing: border-box;
        border-radius: 5px;
        overflow: hidden;
        border: 2px solid transparent;
        &:hover{
            border: 2px solid rgb(121,187,255);
        }
    }
    .drawerFrom{
        :deep(.el-form-item__content){
            flex-direction: row-reverse;
        }
    }
</style>