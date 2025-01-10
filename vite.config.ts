import { URL, fileURLToPath } from 'node:url';
import React from '@vitejs/plugin-react-refresh'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { watchDirectoryPlugin } from './src/utils/watchDirectory'
import { getComponentImports } from './src/utils/importComponents'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    React(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
    watchDirectoryPlugin({
      directoryToWatch: './src/components', // Watch only the components directory
      restartServerOn: ['add', 'unlink'],
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/ // .ts, .tsx, .js, .jsx
      ],
      imports: [
        ...getComponentImports(),
        'react', 
        'react-router-dom', 
        'react-i18next', 
        'ahooks'
      ],
      dts: './src/auto-imports.d.ts',
      dirs: ['src/layouts', 'src/views'],
      eslintrc: {
        enabled: true,
      },
      defaultExportByFilename: true,
      resolvers: [
        IconsResolver({
          componentPrefix: 'Icon',
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
