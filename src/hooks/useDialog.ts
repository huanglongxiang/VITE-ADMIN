/**
 * @file useDialog.ts - 动态对话框管理模块
 * @description 提供创建、管理和关闭动态对话框的功能
 * 使用 Element Plus 的 ElDialog 组件，支持程序化创建和管理多个对话框实例
 */

import type { DialogOptions } from "@/interface/layoutInterface";
import { ElButton, ElDialog } from "element-plus";
import { createApp, type ComponentPublicInstance } from "vue";

/**
 * @class DialogManager
 * @classdesc 对话框管理器类
 * 负责创建、跟踪和管理所有动态创建的对话框实例
 * 采用单例模式，确保全局只有一个对话框管理器
 */
class DialogManager {
    /**
     * @property {Array} dialogs - 存储所有活跃对话框实例的数组
     * 每个实例都包含 close() 和 destroy() 方法
     */
    dialogs: Array<{
        close(): void;
        destroy(): void;
    }> = [];

    /**
     * 构造函数 - 初始化对话框管理器
     */
    constructor() {
        this.dialogs = [];
    }

    /**
     * 创建并显示一个动态对话框
     * @param {Object} options - 对话框配置选项
     * @param {string} [options.title="提示"] - 对话框标题
     * @param {boolean} [options.visible=true] - 对话框是否可见
     * @param {boolean} [options.fullscreen=false] - 是否全屏显示
     * @param {string} [options.top="15vh"] - 对话框距离顶部的距离
     * @param {boolean} [options.modal=true] - 是否显示遮罩层
     * @param {boolean} [options.lockScroll=true] - 是否锁定背景滚动
     * @param {boolean} [options.closeOnClickModal=true] - 点击遮罩层是否关闭对话框
     * @param {boolean} [options.closeOnPressEscape=true] - 按 ESC 键是否关闭对话框
     * @param {Function} [options.beforeClose=null] - 关闭前的回调函数
     * @param {Function} [options.onClose=null] - 关闭后的回调函数
     * @param {Array} [options.footerBtns] - 底部按钮配置数组
     * @param {string|Component} [options.content] - 对话框内容，可以是字符串或 Vue 组件
     * @param {Object} [options.contentProps] - 传递给内容组件的属性
     * @returns {ComponentPublicInstance} - 返回对话框组件实例，包含 close 和 destroy 方法
     */
    create(options:DialogOptions = {}) {
        // 合并默认配置和用户传入的配置
        const defaultOptions: DialogOptions = {
            title: "提示",                    // 默认标题
            visible: true,                    // 默认可见
            fullscreen: false,                // 默认非全屏
            top: "15vh",                      // 默认顶部位置
            modal: true,                      // 默认显示遮罩
            lockScroll: true,                 // 默认锁定滚动
            closeOnClickModal: true,          // 默认点击遮罩可关闭
            closeOnPressEscape: true,         // 默认按 ESC 可关闭
            beforeClose: null,                // 无关闭前回调
            width: undefined,                 // 默认无固定宽度
            height: undefined,                // 默认无固定高度
            isFloote: true,
            // 默认底部按钮配置
            footerBtns: [
                {
                    label: "取消",            // 取消按钮文本
                    type: "default",          // 按钮类型为默认样式
                    handler: (instance: { close: () => void }) => {
                        instance.close();     // 点击时关闭对话框
                    },
                },
                {
                    label: "确定",            // 确定按钮文本
                    type: "primary",          // 按钮类型为主要样式
                    handler: (instance: { close: () => void }) => {
                        instance.close();     // 点击时关闭对话框
                    },
                },
            ],
        };

        // 深度合并配置对象
        const dialogOptions = { ...defaultOptions, ...options };

        // 创建一个容器元素用于挂载 Dialog 组件
        const container = document.createElement("div");
        document.body.appendChild(container);

        // 使用 Vue 3 的 createApp 创建独立的 Dialog 组件实例
        const app = createApp({
            /**
             * 组件数据
             */
            data() {
                return {
                    dialogVisible: dialogOptions.visible, // 对话框可见状态
                };
            },
            /**
             * 依赖提供 - 向子组件提供 manager 实例
             */
            provide() {
                return {
                    manager: this.$options.manager, // 提供对话框管理器实例
                };
            },
            /**
             * 依赖注入 - 从父级获取 manager 实例
             */
            inject: ["manager"], // 注入对话框管理器
            /**
             * 渲染函数 - 定义组件的 DOM 结构
             * @returns {VNode} - 返回虚拟 DOM 节点
             */
            render() {
                // 映射底部按钮配置为 ElButton 组件数组
                const footerNodes = (dialogOptions.footerBtns || []).map((btn, index) => {
                    return h(
                        ElButton,
                        {
                            key: index,                          // 列表渲染的唯一标识
                            // 按钮类型，使用类型断言确保符合 Element Plus 的类型要求
                            type: btn.type as "" | "default" | "primary" | "text" | "success" | "warning" | "info" | "danger" || "primary",
                            // 按钮点击事件处理
                            onClick: () => {
                                if (btn.handler) {
                                    btn.handler(this); // 调用用户定义的处理器
                                }
                            },
                        },
                        () => btn.label // 按钮文本
                    );
                });

                /**
                 * 渲染对话框内容
                 * 根据 content 类型动态生成内容节点
                 * @returns {VNode} - 内容虚拟 DOM 节点
                 */
                const renderContent = () => {
                    if (typeof dialogOptions.content === "string") {
                        // 如果内容是字符串，创建简单的 div 元素
                        return h("div", { class: "dialog-content" }, dialogOptions.content);
                    } else if (dialogOptions.content) {
                        // 如果内容是 Vue 组件，渲染该组件
                        const props = {
                            // 提供关闭对话框的回调方法给子组件
                            closeDialog: () => {
                                this.close();
                            },
                        };

                        // 如果有额外的属性配置，合并到 props 中
                        if (dialogOptions.contentProps) {
                            Object.assign(props, dialogOptions.contentProps);
                        }

                        return h(dialogOptions.content, props);
                    } else {
                        // 没有内容时显示默认提示
                        return h("div", { class: "dialog-content" }, "No content provided");
                    }
                };

                // 创建 ElDialog 组件
                return h(
                    ElDialog,
                    {
                        title: dialogOptions.title,              // 对话框标题
                        modelValue: this.dialogVisible,          // 双向绑定的可见状态
                        "onUpdate:modelValue": (val) => {        // 可见状态更新处理器
                            this.dialogVisible = val;
                        },
                        fullscreen: dialogOptions.fullscreen,    // 全屏模式
                        top: dialogOptions.top,                  // 顶部距离
                        width: dialogOptions.width,
                        height: dialogOptions.height,
                        modal: dialogOptions.modal,              // 遮罩层
                        lockScroll: dialogOptions.lockScroll,    // 锁定滚动
                        closeOnClickModal: dialogOptions.closeOnClickModal, // 点击遮罩关闭
                        closeOnPressEscape: dialogOptions.closeOnPressEscape, // ESC 键关闭
                        beforeClose: dialogOptions.beforeClose,  // 关闭前钩子

                        // 关闭事件处理器
                        onClose: () => {
                            this.dialogVisible = false;          // 设置不可见
                            if (dialogOptions.onClose) {
                                dialogOptions.onClose(this);     // 调用用户回调
                            }
                            // 延迟销毁，让关闭动画完成（300ms）
                            setTimeout(() => {
                                this.destroy();
                            }, 300);
                        },
                    },{
                        // 默认插槽 - 对话框主体内容
                        default: renderContent,
                        // footer 插槽 - 对话框底部按钮区域
                        footer: () =>{
                            if (dialogOptions.isFloote === true) {
                                return  h(
                                    "div",
                                    {
                                        class: "dialog-footer",      // 底部容器样式类
                                    },
                                    footerNodes                       // 按钮数组
                                )
                            } else {
                                return false
                            }
                            
                        }
                           
                    }
                );
            },
            /**
             * 组件方法集合
             */
            methods: {
                /**
                 * 关闭对话框
                 * 将可见状态设置为 false，触发关闭动画
                 */
                close() {
                    this.dialogVisible = false;
                },
                /**
                 * 销毁对话框实例
                 * 卸载组件、移除 DOM 元素、从管理器列表中删除
                 */
                destroy() {
                    app.unmount();                    // 卸载 Vue 应用
                    if (container.parentNode) {
                        container.parentNode.removeChild(container); // 从 DOM 中移除容器
                    }

                    // 从管理器的对话框列表中移除当前实例
                    if (this.manager) {
                        const index = this.manager.dialogs.indexOf(this);
                        if (index !== -1) {
                            this.manager.dialogs.splice(index, 1); // 从数组中删除
                        }
                    }
                },
            },
            /**
             * 生命周期钩子 - 组件挂载完成后执行
             */
            mounted() {
                // 将当前实例添加到管理器的对话框列表中
                if (this.manager) {
                    this.manager.dialogs.push(this);
                } else {
                    console.error("Manager is not initialized"); // 错误处理
                }
            },
        }).provide("manager", this); // 向应用全局提供 manager 实例

        // 挂载应用到容器，返回组件实例
        const instance = app.mount(container) as ComponentPublicInstance & {
            manager: DialogManager;    // 附加 manager 属性类型
            close: () => void;         // 附加 close 方法类型
            destroy: () => void;       // 附加 destroy 方法类型
        };
        return instance;
    }

    /**
     * 关闭所有活跃的对话框
     * 遍历对话框数组，依次调用每个对话框的 close 方法
     */
    closeAll() {
        this.dialogs.forEach((dialog) => {
            dialog.close();
        });
    }
}

// 创建单例实例 - 全局唯一的对话框管理器
const dialogManager = new DialogManager();

/**
 * 创建对话框的便捷函数
 * @param {Object} options - 对话框配置选项
 * @returns {ComponentPublicInstance} - 对话框实例
 * @example
 * const dialog = createDialog({
 *   title: "确认操作",
 *   content: "确定要删除吗？",
 *   footerBtns: [...]
 * });
 */
export function createDialog(options: DialogOptions | undefined) {
    return dialogManager.create(options);
}

/**
 * 关闭所有对话框的便捷函数
 * @example
 * closeAllDialogs();
 */
export function closeAllDialogs() {
    dialogManager.closeAll();
}