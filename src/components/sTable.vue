<template>
    <div class="s-table"> 
        <header class="m-b-10px">
            <el-row class="justify-between">
                <div>
                    <slot name="LeftButton">
                        <el-button :icon="Plus" size="small" type="primary">添加</el-button>
                        <el-button :icon="Minus" size="small" type="danger">删除</el-button>
                    </slot>
                </div>
                <div class="flex items-center">
                   <s-icon icon="RefreshRight"></s-icon>
                </div>
            </el-row>
        </header>
        <aside>
            <el-table></el-table>
        </aside>
        <footer class="m-t-10px">分页区域</footer>
    </div>
</template>
<script setup lang="ts">
import { Minus, Plus } from '@element-plus/icons-vue';

 

</script>