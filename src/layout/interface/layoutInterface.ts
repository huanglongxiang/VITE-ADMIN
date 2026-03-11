/**
 * @file layoutInterface.ts - 布局相关类型定义
 * @description 定义系统布局相关的 TypeScript 接口，包括导航菜单、路由配置和对话框选项
 */

/**
 * @interface NavItemType
 * @description 导航菜单项的数据结构定义
 * 用于构建多级嵌套的侧边栏或顶部导航菜单
 */
export interface NavItemType {
  /** 菜单项的唯一标识符，通常用于路由匹配和菜单高亮 */
  index: string;
  
  /** 菜单项的显示文本 */
  title: string;
  
  /** 
   * 菜单项的图标类名（可选）
   * 通常是 Element Plus 图标组件的名称或自定义图标类名
   */
  icon?: string;
  
  /** 
   * 菜单项类型（可选）
   * 用于区分不同类型的菜单项，如 'menu'（菜单）、'submenu'（子菜单）等
   */
  type?: string;
  
  /** 
   * 子菜单项数组（可选）
   * 当菜单项包含子菜单时，存储子菜单项的列表，支持多级嵌套
   */
  children?: NavItemType[];
  
  /** 
   * 完整的标题层级路径
   * 存储从根菜单到当前菜单的所有标题，用于面包屑导航等场景
   * 例如：["系统管理", "用户管理", "用户列表"]
   */
  titles: string[];
  
  /** 
   * 完整的索引层级路径
   * 存储从根菜单到当前菜单的所有索引值，用于精确定位和路由跳转
   * 例如：["system", "user", "list"]
   */
  indexes: string[];
}

/**
 * @interface RouteConfig
 * @description 路由配置对象的数据结构定义
 * 用于定义 Vue Router 的路由规则，配合懒加载实现代码分割
 */
export interface RouteConfig {
  /** 路由路径，支持动态参数（如 '/user/:id'）和嵌套路由 */
  path: string;
  
  /** 路由名称，用于编程式导航和权限判断 */
  name: string;
  
  /** 
   * 路由元信息对象
   * 存储路由的附加信息，常用于权限控制、菜单生成等
   */
  meta: {
    /** 页面标题，通常显示在浏览器标签页和菜单中 */
    title: string;
    
    /** 页面图标（可选），显示在菜单项旁边 */
    icon?: string;
    titles?: string[],
    indexes?: string[]
  };
  
  /** 
   * 路由组件加载函数
   * 使用动态导入实现组件懒加载，优化首屏性能
   * @returns {Promise<any>} - 返回 Promise 对象，解析后得到组件定义
   */
  component: () => Promise<any>;
}

/**
 * @interface DialogOptions
 * @description 动态对话框的配置选项接口
 * 用于创建程序化对话框时传递参数，支持高度自定义
 * @see useDialog.ts - 对话框管理器实现
 */
export interface DialogOptions {
  /** 
   * 对话框标题（可选）
   * 默认值："提示"
   */
  title?: string;
  
  /** 
   * 对话框是否可见（可选）
   * 默认值：true
   * 控制对话框的显示和隐藏状态
   */
  visible?: boolean;
  
  /** 
   * 是否全屏显示（可选）
   * 默认值：false
   * 设置为 true 时对话框将占满整个视口
   */
  fullscreen?: boolean;

    /** 
   * 对话框宽度（可选）
   * 默认值：undefined
   * 支持 CSS 单位，如 'px', 'vw', '%' 等，或直接传入数字（默认单位为 px）
   */
  width?: string | number;
  
  /** 
   * 对话框高度（可选）
   * 默认值：undefined
   * 支持 CSS 单位，如 'px', 'vh', '%' 等，或直接传入数字（默认单位为 px）
   */
  height?: string | number;
  
  /** 
   * 对话框距离顶部的距离（可选）
   * 默认值："15vh"
   * 支持 CSS 单位，如 'px', 'vh', '%' 等
   */
  top?: string;
  
  /** 
   * 是否显示遮罩层（可选）
   * 默认值：true
   * 设置为 false 时不显示背景遮罩
   */
  modal?: boolean;
  
  /** 
   * 是否锁定背景滚动（可选）
   * 默认值：true
   * 设置为 true 时禁止背景页面滚动
   */
  lockScroll?: boolean;
  
  /** 
   * 点击遮罩层是否关闭对话框（可选）
   * 默认值：true
   * 设置为 false 时点击遮罩不会关闭对话框
   */
  closeOnClickModal?: boolean;
  
  /** 
   * 按 ESC 键是否关闭对话框（可选）
   * 默认值：true
   * 设置为 false 时按 ESC 键不会关闭对话框
   */
  closeOnPressEscape?: boolean;
  
  /** 
   * 关闭前的回调函数（可选）
   * 在对话框关闭前执行，可用于确认操作或阻止关闭
   * @param {any} done - 关闭操作的完成函数
   * @returns {void|boolean|Promise} - 可以返回布尔值或 Promise 来控制关闭流程
   */
  beforeClose?: any;
  
  /** 
   * 对话框内容（可选）
   * 支持两种类型：
   * 1. string - 直接显示字符串内容
   * 2. Vue Component - 渲染 Vue 组件作为内容
   */
  content?: any;
  
  /** 
   * 传递给内容组件的属性（可选）
   * 当 content 为 Vue 组件时，通过此对象传递 props
   * 对象的键值对会映射到组件的 props
   */
  contentProps?: any;
  
  /** 
   * 关闭后的回调函数（可选）
   * 在对话框完全关闭后执行，用于清理工作或后续处理
   * @param {any} instance - 对话框实例，包含 close 和 destroy 方法
   */
  onClose?: (instance: any) => void;
  
  /** 
   * 底部按钮配置数组（可选）
   * 用于自定义对话框底部的操作按钮
   * 默认配置包含"取消"和"确定"两个按钮
   */
  footerBtns?: Array<{
    /** 按钮显示的文本标签 */
    label: string;
    
    /** 
     * 按钮类型（可选）
     * 可选值："" | "default" | "primary" | "text" | "success" | "warning" | "info" | "danger"
     * 默认值："primary"
     * 对应 Element Plus Button 组件的 type 属性
     */
    type?: string;
    
    /** 
     * 按钮点击事件处理函数（可选）
     * 点击按钮时执行，可用于处理业务逻辑
     * @param {any} instance - 对话框实例，可调用 close 等方法
     */
    handler?: (instance: any) => void;
  }>;
  /** 
   * 是否显示底部按钮区域（可选）
   * 默认值：true
   * 设置为 false 时不显示底部按钮区域
   */
  isFloote?: boolean;
}