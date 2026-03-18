<template>
    <!-- 表单容器 -->
    <el-form ref="formRef" :model="formData" :rules="computedRules" :label-width="labelWidth" :size="size"
        :disabled="disabled" v-bind="$attrs">
        
        <!-- 表单开始前自定义内容插槽 -->
        <slot name="before"></slot>

        <!-- 动态渲染表单项 -->
        <el-form-item 
            v-for="(item, index) in formItems" 
            :key="item.prop || index" 
            :label="item.label" 
            :prop="item.prop"
            :label-position="item.labelPosition" 
            :label-width="item.labelWidth" 
            :hidden="item.hidden"
            v-bind="item.formItemProps"
        >
            <!-- 根据类型动态渲染对应的表单组件 -->
            <component 
                v-if="item.type"
                :is="getComponent(item.type)" 
                v-model="formData[item.prop]"
                :placeholder="item.placeholder || `请输入${item.label}`" 
                :disabled="item.disabled ?? disabled"
                :readonly="item.readonly" 
                v-bind="mergeProps(item)"
            >
                <!-- 选项类组件（select、radio-group、checkbox-group） -->
                <template v-if="needOptions(item.type)">
                    <component 
                        :is="getOptionComponent(item.optionType)" 
                        v-for="(option, optIndex) in item.options"
                        :key="option.value ?? optIndex" 
                        :label="option.label" 
                        :value="option.value"
                        :disabled="option.disabled" 
                        v-bind="option.props" 
                    />
                </template>

                <!-- 自定义字段内容插槽 -->
                <slot :name="item.prop" :item="item" :index="index"></slot>
            </component>
            <slot v-else :name="item.prop"></slot>
        </el-form-item>

        <!-- 表单结束后自定义内容插槽 -->
        <slot name="after"></slot>

        <!-- 底部操作按钮区域 -->
        <slot name="footer">
            <el-form-item v-if="showButtons">
                <!-- 提交按钮 -->
                <s-button type="primary" @click="handleSubmit">
                    {{ submitText }}
                </s-button>
                    
                <!-- 重置按钮 -->
                <el-button v-if="showReset" @click="handleReset">重置</el-button>
                <!-- 取消按钮 -->
                <el-button v-if="showCancel" @click="handleCancel">取消</el-button>
            </el-form-item>
        </slot>
    </el-form>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormItem, FormProps } from '@/components/Interface/componentsInterface'

// Element Plus 表单组件导入
import {
    ElInput,       // 输入框
    ElInputNumber, // 数字输入框
    ElSelect,      // 下拉选择器
    ElOption,      // 选项
    ElRadio,       // 单选按钮
    ElRadioGroup,  // 单选组
    ElCheckbox,    // 复选框
    ElCheckboxGroup, // 复选组
    ElSwitch,      // 开关
    ElDatePicker,  // 日期选择器
    ElTimePicker,  // 时间选择器
    ElSlider,      // 滑块
    ElRate,        // 评分
    ElColorPicker, // 颜色选择器
    ElCascader,    // 级联选择器
    ElTransfer,    // 穿梭框
} from 'element-plus'

/**
 * 组件类型映射表
 * 将字符串类型映射到对应的 Element Plus 组件实例
 */
const componentMap: Record<string, Component> = {
    'input': ElInput,         // 文本输入框
    'textarea': ElInput,      // 多行文本框
    'password': ElInput,      // 密码输入框
    'number': ElInputNumber,  // 数字输入框
    'select': ElSelect,       // 下拉选择
    'radio': ElRadio,         // 单选按钮
    'radio-group': ElRadioGroup, // 单选组
    'checkbox': ElCheckbox,   // 复选框
    'checkbox-group': ElCheckboxGroup, // 复选组
    'switch': ElSwitch,       // 开关
    'date': ElDatePicker,     // 日期选择
    'time': ElTimePicker,     // 时间选择
    'datetime': ElDatePicker, // 日期时间选择
    'slider': ElSlider,       // 滑块
    'rate': ElRate,           // 评分
    'color': ElColorPicker,   // 颜色选择
    'cascader': ElCascader,   // 级联选择
    'transfer': ElTransfer,   // 穿梭框
}

/**
 * 选项组件映射表
 * 用于 select、radio-group、checkbox-group 等需要子选项的组件
 */
const optionComponentMap: Record<string, Component> = {
    'select': ElOption,       // 下拉选项
    'radio-group': ElRadio,   // 单选按钮
    'checkbox-group': ElCheckbox, // 复选按钮
}

// Props 定义，设置默认值
const props = withDefaults(defineProps<FormProps>(), {
    formItems: () => [],           // 表单项配置数组
    rules: () => ({}),             // 表单验证规则
    labelWidth: '100px',          // 标签宽度
    size: 'default',              // 组件尺寸
    disabled: false,              // 是否禁用
    showButtons: true,            // 显示操作按钮
    showReset: false,             // 显示重置按钮
    showCancel: false,            // 显示取消按钮
    submitText: '提交',           // 提交按钮文本
    loading: false,               // 加载状态
})

// Emits 定义
const emit = defineEmits<{
    submit: [data: Record<string, any>]  // 提交事件
    reset: []                            // 重置事件
    cancel: []                           // 取消事件
    validate: [success: boolean]         // 验证结果事件
}>()

// 表单实例引用
const formRef = ref<FormInstance>()

// 创建内部的响应式 formData
const formData = reactive<Record<string, any>>({ ...props.formData })

// 监听 props.formData 的变化，同步到内部 formData
watch(() => props.formData, (newVal) => {
    Object.assign(formData, newVal)
}, { deep: true })

/**
 * 合并验证规则
 * 将 formItems 中的 rules 和 props.rules 合并
 */
const computedRules = computed(() => {
    const rules: FormRules = {}

    props.formItems.forEach(item => {
        if (item.rules && item.prop) {
            rules[item.prop] = item.rules
        }
    })

    return { ...props.rules, ...rules }
})

/**
 * 根据类型获取对应的组件实例
 * @param type - 组件类型字符串
 * @returns 对应的组件实例，如果未找到则返回 ElInput
 */
const getComponent = (type: string): Component => {
    const component = componentMap[type]
    if (!component) {
        console.warn(`未找到类型 ${type} 对应的组件，请在 componentMap 中添加映射`)
        return ElInput
    }
    return component
}

/**
 * 判断该类型是否需要渲染选项
 * @param type - 组件类型
 * @returns 是否需要选项
 */
const needOptions = (type: string): boolean => {
    return ['select', 'radio-group', 'checkbox-group'].includes(type)
}

/**
 * 获取选项组件实例
 * @param optionType - 选项类型
 * @returns 选项组件实例
 */
const getOptionComponent = (optionType?: string): Component => {
    if (!optionType) return ElOption
    return optionComponentMap[optionType] || ElOption
}

/**
 * 合并组件属性，处理特殊类型的 type 属性
 * @param item - 表单项配置
 * @returns 合并后的属性对象
 */
const mergeProps = (item: FormItem): Record<string, any> => {
    const props = { ...item.props }

    // 为需要 type 属性的组件添加 type
    if (item.type === 'textarea') {
        props.type = 'textarea'
    } else if (item.type === 'password') {
        props.type = 'password'
    } else if (item.type === 'date') {
        props.type = 'date'
    } else if (item.type === 'datetime') {
        props.type = 'datetime'
    }

    return props
}

/**
 * 提交表单
 * 先验证表单，验证通过后触发 submit 事件
 */
const handleSubmit = async () => {
    // if (!formRef.value) return

    // try {
    //     await formRef.value.validate()
    //     emit('submit', props.formData)
    //     emit('validate', true)
    // } catch (error) {
    //     emit('validate', false)
    //     console.error('表单验证失败:', error)
    // }
}

/**
 * 重置表单
 * 清空所有字段并触发 reset 事件
 */
const handleReset = () => {
    formRef.value?.resetFields()
    emit('reset')
}

/**
 * 取消操作
 * 触发 cancel 事件
 */
const handleCancel = () => {
    emit('cancel')
}

// 暴露组件方法供父组件调用
defineExpose({
    formRef,  // 表单实例引用
    
    /**
     * 手动验证表单
     * @param callback - 验证结果回调函数
     */
    validate: (callback?: (isValid: boolean) => void) => {
        if (!formRef.value) return Promise.resolve(false)
        return formRef.value.validate().then(() => {
            callback?.(true)
            return true
        }).catch(() => {
            callback?.(false)
            return false
        })
    },
    
    /**
     * 重置表单字段
     */
    resetFields: () => {
        formRef.value?.resetFields()
    },
    
    /**
     * 清除表单验证结果
     */
    clearValidate: () => {
        formRef.value?.clearValidate()
    },
    
    /**
     * 设置单个字段值
     * @param field - 字段名
     * @param value - 字段值
     */
    setFieldValue: (field: string, value: any) => {
        formData[field] = value
    },
    
    /**
     * 批量设置字段值
     * @param values - 字段值对象
     */
    setFieldsValue: (values: Record<string, any>) => {
        Object.assign(formData, values)
    },
})
</script>