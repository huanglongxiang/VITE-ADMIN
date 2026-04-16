# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
# Vite Admin 项目架构文档

> 基于 Vue 3 + TypeScript + Vite 的现代化管理后台项目架构

## 📁 项目整体结构

```
vite-admin/
├── src/                          # 源代码目录
├── public/                       # 静态资源目录（未显示但应存在）
├── index.html                    # 应用入口HTML
├── vite.config.ts               # Vite配置文件
├── tsconfig.json                # TypeScript配置
└── package.json                 # 项目依赖
```

## 🏗️ 核心架构分层

### 1. **应用入口层**
- `src/main.ts` - 应用初始化入口
- `src/App.vue` - 根组件
- `src/auto-imports.d.ts` - 自动导入类型声明
- `src/components.d.ts` - 组件类型声明

### 2. **路由与状态管理层**
```
router/                           # 路由配置
└── index.ts

stores/                           # Pinia状态管理
├── modules/
│   ├── system.ts                # 系统状态
│   ├── tagView.ts               # 标签视图状态  
│   └── user.ts                  # 用户状态
└── index.ts                     # Store入口
```

### 3. **页面与布局层**
```
views/                            # 页面视图
├── Login/                       # 登录模块
├── System/                      # 系统管理模块
├── Home.vue                     # 首页
├── PdfSystem.vue                # PDF系统页面
├── about.vue                    # 关于页面
└── 404.vue                      # 404页面

layout/                           # 布局系统
├── modules/                     # 布局组件
│   ├── leftNav.vue             # 左侧导航
│   ├── topHeader.vue           # 顶部头部
│   ├── breadcrumb.vue          # 面包屑
│   ├── tagView.vue             # 标签页
│   └── ...                     # 其他布局组件
├── dialog/                      # 布局对话框
│   └── userInfoForm.vue        # 用户信息表单
└── index.vue                    # 主布局文件
```

### 4. **组件与UI层**
```
components/                       # 公共组件库
├── sButton.vue                  # 按钮组件
├── sCard.vue                    # 卡片组件
├── sForm.vue                    # 表单组件
├── sIcon.vue                    # 图标组件
└── sTable.vue                   # 表格组件
```

### 5. **API与数据层**
```
api/                              # API接口层
├── modules/                     # API模块
│   └── user.ts                  # 用户API
├── interface/                   # 接口类型定义
│   ├── userInterface.ts         # 用户接口类型
│   └── indexInterface.ts        # 首页接口类型
├── helper/                      # API辅助工具
│   └── errorStatus.ts           # 错误状态处理
└── index.ts                     # API入口

mock/                             # Mock数据
└── index.ts
```

### 6. **工具与服务层**
```
utils/                            # 工具函数
├── qiankunMain.ts               # 乾坤微前端配置
├── storage.ts                   # 存储工具
├── loading.ts                   # 加载工具
├── skeletonService.ts           # 骨架屏服务
└── tools.ts                     # 通用工具

hooks/                            # 自定义Hooks
├── useDialog.ts                 # 对话框Hook
└── useFullLoading.ts            # 全屏加载Hook

enum/                             # 枚举定义
└── httpEnum.ts                  # HTTP相关枚举

styles/                           # 样式系统
├── index.scss                   # 样式入口
├── style.scss                   # 全局样式
├── dark.scss                    # 暗色主题
└── images-variables.scss        # 图片变量
```

### 7. **微前端架构**
```
servers/                          # 微前端子应用
└── vite-pdf-system/             # PDF系统子应用
    ├── src/
    ├── vite.config.ts
    └── package.json
```

## 🔧 技术栈分析

### 核心技术
- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **CSS方案**: SCSS + UnoCSS

### 架构特性
- **模块化设计** - 清晰的目录分层
- **TypeScript优先** - 完整的类型定义
- **微前端支持** - 乾坤(Quark)集成
- **组件化开发** - 可复用的公共组件
- **主题系统** - 支持暗色主题切换
- **技术栈**: Vue 3 + TypeScript + Vite + Pinia + Vue Router
- **UI 框架**: UnoCSS 原子化 CSS
- **状态管理**: Pinia（模块化设计）
- **微前端**: 集成 qiankun，支持子应用（vite-pdf-system）
- **组件规范**: 采用 [s](file:///Users/huanglongxiang/Documents/code/web/vue/ts/admin/vite-admin/node_modules/.pnpm/@vue+runtime-dom@3.5.28/node_modules/@vue/runtime-dom/dist/runtime-dom.d.ts#L1208-L1208) 前缀的自定义组件（sButton、sCard、sForm 等）
- **代码规范**: 使用 TypeScript 进行类型约束，有完整的接口定义
- **样式方案**: SCSS + UnoCSS
- **自动化**: 支持自动导入（auto-imports）



