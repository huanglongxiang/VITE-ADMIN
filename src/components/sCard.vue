<template>
   <el-card v-bind="$attrs">
        <template #header>
            <slot name="header"></slot>
        </template>
        <slot></slot>
        <template #footer>
            <slot name="footer"></slot>
        </template>
   </el-card>
</template>
<script lang="ts" setup>

</script>
<style lang="scss">
    
</style>