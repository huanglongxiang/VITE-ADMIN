<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="computedRules"
    :label-width="labelWidth"
    :size="size"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot name="before"></slot>
    
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
      <component
        :is="getComponent(item.type)"
        v-model="formData[item.prop]"
        :placeholder="item.placeholder || `请输入${item.label}`"
        :disabled="item.disabled ?? disabled"
        :readonly="item.readonly"
        v-bind="mergeProps(item)"
      >
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
        
        <slot :name="item.prop" :item="item" :index="index"></slot>
      </component>
    </el-form-item>
    
    <slot name="after"></slot>
    
    <slot name="footer">
      <el-form-item v-if="showButtons">
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ submitText }}
        </el-button>
        <el-button v-if="showReset" @click="handleReset">重置</el-button>
        <el-button v-if="showCancel" @click="handleCancel">取消</el-button>
      </el-form-item>
    </slot>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { Ref, Reactive, Component } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// Element Plus 表单组件
import {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElCheckbox,
  ElCheckboxGroup,
  ElSwitch,
  ElDatePicker,
  ElTimePicker,
  ElSlider,
  ElRate,
  ElColorPicker,
  ElCascader,
  ElTransfer,
} from 'element-plus'

// 组件类型映射表 - 直接映射组件实例
const componentMap: Record<string, Component> = {
  'input': ElInput,
  'textarea': ElInput,
  'password': ElInput,
  'number': ElInputNumber,
  'select': ElSelect,
  'radio': ElRadio,
  'radio-group': ElRadioGroup,
  'checkbox': ElCheckbox,
  'checkbox-group': ElCheckboxGroup,
  'switch': ElSwitch,
  'date': ElDatePicker,
  'time': ElTimePicker,
  'datetime': ElDatePicker,
  'slider': ElSlider,
  'rate': ElRate,
  'color': ElColorPicker,
  'cascader': ElCascader,
  'transfer': ElTransfer,
}

// 选项组件映射表
const optionComponentMap: Record<string, Component> = {
  'select': ElOption,
  'radio-group': ElRadio,
  'checkbox-group': ElCheckbox,
}


// 定义接口
export interface FormItem {
  type: string
  prop: string
  label: string
  placeholder?: string
  value?: any
  rules?: any[]
  options?: Array<{
    label: string
    value: any
    disabled?: boolean
    props?: Record<string, any>
  }>
  optionType?: string
  props?: Record<string, any>
  formItemProps?: Record<string, any>
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string | number
  hidden?: boolean
  disabled?: boolean
  readonly?: boolean
}

interface Props {
  formData: Record<string, any>
  formItems?: FormItem[]
  rules?: FormRules
  labelWidth?: string
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  showButtons?: boolean
  showReset?: boolean
  showCancel?: boolean
  submitText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  formItems: () => [],
  rules: () => ({}),
  labelWidth: '100px',
  size: 'default',
  disabled: false,
  showButtons: true,
  showReset: false,
  showCancel: false,
  submitText: '提交',
  loading: false,
})

const emit = defineEmits<{
  submit: [data: Record<string, any>]
  reset: []
  cancel: []
  validate: [success: boolean]
}>()



const formRef = ref<FormInstance>()


// 创建内部的响应式 formData
const formData = reactive<Record<string, any>>({ ...props.formData })

// 监听 props.formData 的变化，同步到内部
watch(() => props.formData, (newVal) => {
  Object.assign(formData, newVal)
}, { deep: true })


// 合并 rules
const computedRules = computed(() => {
  const rules: FormRules = {}
  
  props.formItems.forEach(item => {
    if (item.rules && item.prop) {
      rules[item.prop] = item.rules
    }
  })
  
  return { ...props.rules, ...rules }
})

// 获取组件实例
const getComponent = (type: string): Component => {
  const component = componentMap[type]
  if (!component) {
    console.warn(`未找到类型 ${type} 对应的组件，请在 componentMap 中添加映射`)
    return ElInput
  }
  return component
}

// 判断是否需要渲染选项
const needOptions = (type: string): boolean => {
  return ['select', 'radio-group', 'checkbox-group'].includes(type)
}

// 获取选项组件实例
const getOptionComponent = (optionType?: string): Component => {
  if (!optionType) return ElOption
  return optionComponentMap[optionType] || ElOption
}

// 合并 props，处理特殊类型
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

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('submit', props.formData)
    emit('validate', true)
  } catch (error) {
    emit('validate', false)
    console.error('表单验证失败:', error)
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
}

// 取消操作
const handleCancel = () => {
  emit('cancel')
}

// 暴露方法
defineExpose({
  formRef,
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
  resetFields: () => {
    formRef.value?.resetFields()
  },
  clearValidate: () => {
    formRef.value?.clearValidate()
  },
  setFieldValue: (field: string, value: any) => {
    formData[field] = value
  },
  setFieldsValue: (values: Record<string, any>) => {
    Object.assign(formData, values)
  },
})
</script>

