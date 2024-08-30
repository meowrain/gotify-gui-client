import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import electron from 'vite-electron-plugin'
import renderer from 'vite-plugin-electron-renderer'
import { ImportMetaEnv } from './env'
// https://vitejs.dev/config/
export default defineConfig(({command,mode}) => {
  const env:Record<keyof ImportMetaEnv,string> = loadEnv(mode,process.cwd())
  return {
    plugins: [
      vue(),
      vueJsx(),
      electron({
        include: ['electron'],
        main: {
          entry: 'electron/index.ts' // 此处指向electron主进程文件
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`
          input: 'electron/preload.ts'
        }
      }),
      // 渲染进程可使用node.js API
      renderer({})
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    base: './',
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_API_HTTPS_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/stream': {
          target: env.VITE_API_WEBSOCKET_PROXY,
          ws: true,
          changeOrigin: true
        }
      }
    }
  }
})
