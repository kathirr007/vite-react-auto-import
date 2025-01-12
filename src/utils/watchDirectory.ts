import chokidar, { type FSWatcher } from 'chokidar';
import { ResolvedConfig, type ViteDevServer } from 'vite';

export interface WatchDirectoryPluginOptions {
  directoryToWatch?: string | string[];
  restartServerOn?: string[];
  debounceDelay?: number;
  extensions?: string[];
}

export function WatchDirectoryPlugin(options:WatchDirectoryPluginOptions = {}) {
    const {
      directoryToWatch = ['./src'], // Default directory to watch
      restartServerOn = ['add', 'unlink'], // Events to trigger server restart
      debounceDelay = 100, // Debounce delay in milliseconds
    } = options;
  
    let watcher: FSWatcher;
    let viteServer: ViteDevServer;
  
    return {
      name: 'vite-watch-directory-plugin',
      apply: 'serve',
      configResolved(config: ResolvedConfig) {
        watcher = chokidar.watch(directoryToWatch, {
          ignoreInitial: true, // Ignore initial emit events
          persistent: true,
          ignored: (path) => {
            // Ignore files/folders that should not trigger a server restart
            // For example, ignore node_modules, .git, etc.
            let isIgnored = path.includes('node_modules') || path.includes('.git');
            return isIgnored;
          },
        });
  
        watcher
          .on('all', (event, path) => {
            let canExecute = restartServerOn.includes(event);
            if(options.extensions?.length) {
              console.log(`File ${path} has been ${event}`);
              canExecute = canExecute && options.extensions.some(ext => path.endsWith(ext));
            }
            if (canExecute) {
              setTimeout(() => {
                viteServer?.restart(); // Use viteServer to restart
              }, debounceDelay);
            }
          })
          .on('error', (error) => {
            console.error(`Error watching directory: ${error}`);
          });
      },
      configureServer(server: ViteDevServer) {
        viteServer = server; 
      },
      closeBundle() {
        watcher.close();
      },
    };
  }