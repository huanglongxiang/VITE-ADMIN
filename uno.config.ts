// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  // 快捷类名配置：用于定义常用的样式组合，方便复用
  shortcuts: [
    // 示例：
    // ['btn', 'py-2 px-4 bg-blue-500 text-white rounded'],
    // ['card', 'p-4 shadow-md rounded-lg'],
  ],

  // 主题配置：用于自定义全局变量，如颜色、间距等
  theme: {
    colors: {
      // 示例：
      // primary: '#42b983',
      // secondary: '#ff7e5f',
    }
  },

  // 预设功能配置：启用各种 UnoCSS 预设模块
  presets: [
    presetUno(), // 核心预设，提供类似 Tailwind 的实用类（如 m-2, p-4, flex 等）
    presetAttributify(), // 属性化模式，允许通过 HTML 属性直接写样式（如 text="red"）
    presetIcons(), // 图标支持，可通过类名使用图标（如 i-carbon-logo）
    presetTypography(), // 排版样式预设，适用于文章、博客等内容
    presetWebFonts({
      // Web 字体配置：支持从 Google Fonts 或其他服务加载字体
      fonts: {
        // 示例：
        // sans: 'Inter',
        // mono: 'Fira Code',
      },
    }),
  ],

  // 转换器配置：增强 CSS 编写体验
  blocklist: [
    // 排除所有 el- 开头的类名
    /^el-.+/,
  ],
})