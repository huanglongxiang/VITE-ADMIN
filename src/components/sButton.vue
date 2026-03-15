<template >
    <el-button 
        v-bind="$attrs"
        :disabled="isDisabled || disabled"
        :loading="isDisabled && !disabled"
        @click="handleClick"
    >
        <template v-if="$slots.icon" #icon>
            <slot name="icon"></slot>
        </template>
        <slot></slot>
    </el-button>
</template>
<script setup lang="ts">
import type { ButtonProps } from "./Interface/componentsInterface";

const props = withDefaults(defineProps<ButtonProps>(), {
    disabled: false,
    cooldown: 2000
})

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const isDisabled = ref(false)

const handleClick = (event: MouseEvent) => {
    if (isDisabled.value || props.disabled) return
    
    emit('click', event)
    
    isDisabled.value = true
    setTimeout(() => {
        isDisabled.value = false
    }, props.cooldown)
}
</script>