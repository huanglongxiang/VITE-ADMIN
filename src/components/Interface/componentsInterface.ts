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
export interface FormProps {
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


/** 表格列配置接口，用于定义 sTable 组件的列属性 */
export interface ColumnProps {
    /** el-table-column 组件的属性配置对象 */
    props: {
        /** 列对应的字段名，用于从 tableData 中获取数据 */
        prop: string;
        /** 列显示的标题文本 */
        label?: string;
        /** 列的宽度，可以是像素值（如 '200'）或百分比（如 '50%'） */
        width?: string | number;
        /** 列的最小宽度，可以是像素值或百分比 */
        minWidth?: string | number;
        /** 列是否固定，可选值：true（固定左侧）、'left'（固定左侧）、'right'（固定右侧） */
        fixed?: boolean | 'left' | 'right';
        /** 排序功能配置，可选值：false（不排序）、true（默认排序）、'custom'（远程排序）、'default'（默认排序） */
        sortable?: boolean | 'custom' | 'default';
        /** 列内容的水平对齐方式，可选值：'left'（左对齐）、'center'（居中对齐）、'right'（右对齐） */
        align?: 'left' | 'center' | 'right';
        /** 列头部的水平对齐方式，可选值：'left'（左对齐）、'center'（居中对齐）、'right'（右对齐） */
        headerAlign?: 'left' | 'center' | 'right';
        /** 当内容过长时是否显示省略号提示，为 true 时内容溢出显示省略号并悬浮提示完整内容 */
        showOverflowTooltip?: boolean;
        /** 允许添加其他 el-table-column 支持的属性 */
        [key: string]: any;
    };
    /** 自定义插槽名称，如果不设置则使用 props.prop 作为插槽名 */
    slotName?: string;
}

/** sTable 表格组件的 Props 接口，定义组件的所有可配置属性 */
export interface TableProps {
    /** 表格列配置数组，包含每一列的定义和属性 */
    columns?: ColumnProps[];
    /** 表格展示的数据数组，每个元素代表一行数据 */
    tableData?: any[];
    /** 当前页码，用于控制分页显示第几页 */
    currentPage?: number;
    /** 每页显示的数据条数，控制一页展示多少行 */
    pageSize?: number;
    /** 每页显示条数的可选列表，用于用户切换不同的页面大小 */
    pageSizes?: number[];
    /** 数据总条数，用于计算总页数和显示总记录数 */
    total?: number;
    /** 是否显示头部工具栏，为 true 时显示添加、删除等操作按钮区域 */
    isShowHeader?: boolean;
    /** 是否显示底部翻页器，为 true 时显示分页组件 */
    isShowFooter?: boolean;
    /** 组件尺寸，可选值：'small'（小）、'default'（默认）、'large'（大） */
    size?: 'small' | 'default' | 'large';
    /** 是否禁用分页组件，为 true 时分页器不可用 */
    disabled?: boolean;
    /** 分页按钮是否有背景色，为 true 时页码按钮有底色 */
    background?: boolean;
    isOptionaCal?:boolean;
    isSelection?:boolean;
    defaultSelections?:any[];
    calculateMaxHeight?: calculateClass; // 自定义计算
}

type calculateClass ={
  containerClass: string
  excludeClasses: string[]
}

export interface ButtonProps {
   disabled?: boolean
    cooldown?: number
}
