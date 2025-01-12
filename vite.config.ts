import { URL, fileURLToPath } from 'node:url';
import React from '@vitejs/plugin-react-refresh'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { getComponentImports } from './src/utils/importComponents'
import VitePluginRestart from 'vite-plugin-restart-2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    React(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
    /* WatchDirectoryPlugin({
      directoryToWatch: ['./src/components', './src/hooks', './src/composables'], // Watch only the components directory
      restartServerOn: ['add', 'unlink'],
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
    }), */
    VitePluginRestart({
      restart: ['./src/components/**/*.*', './src/hooks/**/*.*', './src/composables/**/*.*'], // Watch only the components directory
      eventsToWatch: ['add', 'unlink'],
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
      dirs: ['src/layouts', 'src/views', 'src/composables', 'src/hooks'],
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
