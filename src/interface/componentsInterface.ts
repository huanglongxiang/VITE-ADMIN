import type { FormRules } from 'element-plus'

/**
 * 表单项配置接口
 * 用于动态表单生成器的单个表单项配置
 */
export interface FormItem {
  /** 表单项类型：input, textarea, select, radio, checkbox, date, datetime, upload 等 */
  type: string
  
  /** 表单字段名，对应 formData 中的键名 */
  prop: string
  
  /** 表单项标签文本 */
  label: string
  
  /** 占位提示文本 */
  placeholder?: string
  
  /** 表单字段的值 */
  value?: any
  
  /** 表单验证规则 */
  rules?: any[]
  
  /** 选项列表，适用于 select, radio, checkbox 等有选项的组件 */
  options?: Array<{
    /** 选项显示文本 */
    label: string
    
    /** 选项值 */
    value: any
    
    /** 是否禁用该选项 */
    disabled?: boolean
    
    /** 其他属性配置 */
    props?: Record<string, any>
  }>
  
  /** 选项类型：button 或 default，用于 el-radio-group 和 el-checkbox-group */
  optionType?: string
  
  /** 传递给子组件的属性配置 */
  props?: Record<string, any>
  
  /** el-form-item 的属性配置 */
  formItemProps?: Record<string, any>
  
  /** 标签位置：left（左）、right（右）、top（上） */
  labelPosition?: 'left' | 'right' | 'top'
  
  /** 标签宽度 */
  labelWidth?: string | number
  
  /** 是否隐藏该表单项 */
  hidden?: boolean
  
  /** 是否禁用该表单项 */
  disabled?: boolean
  
  /** 是否只读该表单项 */
  readonly?: boolean
}

/**
 * 动态表单组件 Props 接口
 * 用于接收父组件传递的配置参数
 */
export interface Props {
  /** 表单数据对象，包含所有表单字段的值 */
  formData: Record<string, any>
  
  /** 表单项配置数组，定义表单的结构和样式 */
  formItems?: FormItem[]
  
  /** 表单验证规则 */
  rules?: FormRules
  
  /** 所有表单项的标签宽度 */
  labelWidth?: string
  
  /** 表单组件尺寸：large、default、small */
  size?: 'large' | 'default' | 'small'
  
  /** 是否禁用整个表单 */
  disabled?: boolean
  
  /** 是否显示操作按钮区域 */
  showButtons?: boolean
  
  /** 是否显示重置按钮 */
  showReset?: boolean
  
  /** 是否显示取消按钮 */
  showCancel?: boolean
  
  /** 提交按钮的文本 */
  submitText?: string
  
  /** 加载状态，通常用于提交时的 loading 效果 */
  loading?: boolean
}