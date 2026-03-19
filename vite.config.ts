import path from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Inspect from 'vite-plugin-inspect'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'


import { viteMockServe } from 'vite-plugin-mock'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig({
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  optimizeDeps: {
    include: ['@/views/*.vue']
  },
  plugins: [
    vue(),
    UnoCSS(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/images')],
      symbolId: 'icon-[dir]-[name]',
    }),
    viteMockServe({
      // 开发环境启用 Mock
      enable: true,
      // mock 文件目录（相对于项目根目录）
      mockPath: 'src/mock',
      // 是否在控制台输出 Mock 日志
      logger: true,
      watchFiles: true,
    }),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),
      ],
      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['element-plus']
        })
      ],
      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
    Icons({
      autoInstall: true,
    }),
    // 调试
    Inspect({
      enabled: true,       // 是否在开发环境自动开启
      exclude: []          // 要排除的插件
    })
  ],
})
