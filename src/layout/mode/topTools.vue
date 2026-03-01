<template>
    <el-tooltip effect="dark" content="文档" placement="bottom">
        <el-icon size="20" class="cursor-pointer m-r-20px">
            <Warning />
        </el-icon>
    </el-tooltip>
    <el-popover placement="bottom" :popper-style="{paddingBottom: '0px'}" trigger="click" :width="300">
            <template #reference>
                 <el-badge :value="12" class="cursor-pointer m-r-20px w-20px h-20px">
                        <el-icon size="20">
                            <Message />
                        </el-icon>
                    </el-badge>
            </template>
            <MessageContent></MessageContent>
        </el-popover> 
    <el-tooltip effect="dark" content="全屏" placement="bottom">
        <el-icon size="20" class="cursor-pointer m-r-20px" @click="full">
            <FullScreen />
        </el-icon>
    </el-tooltip>
        
    <el-tooltip effect="dark" content="布局设置" placement="bottom">
        <el-icon size="20" class="cursor-pointer m-r-20px" @click="setting">
            <Tools />
        </el-icon>
    </el-tooltip>
    <el-tooltip effect="dark" content="锁屏" placement="bottom">
        <el-icon size="20" class="cursor-pointer m-r-20px">
            <Lock />
        </el-icon>
    </el-tooltip>
    <!-- 设置选项抽屉 -->
    <el-drawer v-model="drawer" :with-header="false" size="20%" append-to="#app">
        <Drawer />
    </el-drawer>
</template>
<script setup lang="ts">
import { Warning, Lock, FullScreen, Message, Tools } from '@element-plus/icons-vue'
import screenfull from 'screenfull';
import MessageContent from './message.vue';
import Drawer from './drawer.vue';

const drawer = ref(false)


const isFullscreen = ref(false);

// 全屏
const full = () => {
    if (screenfull.isEnabled) {
        // 添加进入全屏前的动画
        if (!isFullscreen.value) {
            screenfull.request();
            isFullscreen.value = true;
        } else {
            screenfull.exit();
            isFullscreen.value = false;
        }
    }
}

// 设置
const setting = () => {
    drawer.value = true;
}

</script>