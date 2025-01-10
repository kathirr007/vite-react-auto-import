import chokidar from 'chokidar';

export function watchDirectoryPlugin(options = {}) {
    const {
      directoryToWatch = './src', // Default directory to watch
      restartServerOn = ['add', 'unlink'], // Events to trigger server restart
      debounceDelay = 100, // Debounce delay in milliseconds
    } = options;
  
    let watcher;
    let viteServer;
  
    return {
      name: 'vite-watch-directory-plugin',
      configResolved(config) {
        watcher = chokidar.watch(directoryToWatch, {
          ignoreInitial: true, // Ignore initial emit events
          persistent: true,
          ignore: (path) => {
            // Ignore files/folders that should not trigger a server restart
            // For example, ignore node_modules, .git, etc.
            return path.includes('node_modules') || path.includes('.git');
          },
        });
  
        watcher
          .on('all', (event, path) => {
            if (restartServerOn.includes(event)) {
              setTimeout(() => {
                viteServer?.restart(); // Use viteServer to restart
              }, debounceDelay);
            }
          })
          .on('error', (error) => {
            console.error(`Error watching directory: ${error}`);
          });
      },
      configureServer(server) {
        viteServer = server; 
        // return server;
      },
      closeBundle() {
        watcher.close();
      },
    };
  }