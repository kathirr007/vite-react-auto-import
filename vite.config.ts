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
      restart: ['./src/components/**/*.*'], // File globs to watch
      eventsToWatch: ['add', 'unlink'],
    }),
    VitePluginRestart({
      restart: ['./src/hooks/**/*.*'], // File globs to watch
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
      defaultExportByFilename: true,
      resolvers: [
        IconsResolver({
          componentPrefix: 'Icon',
        }),
      ],
      dumpUnimportItems: true
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
