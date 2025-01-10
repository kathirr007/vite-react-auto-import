import path from 'node:path';
import fg from 'fast-glob';
import { minimatch } from 'minimatch';

function pascalCaseWithCapitals(str) {
    return str
      .split('/')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
  
  function removeExtension(str) {
    return path.basename(str, path.extname(str));
  }
  
  export function getComponentImports() {
    const directories = [
      {
        pattern: './src/components/**/*.{tsx,jsx}',
        omit: './src/components'
      },
      {
        pattern: './src/layouts/*.{tsx,jsx}',
        omit: './src/'
      }
    ];
  
    const entries = fg.sync(
      directories.map(x => x.pattern),
      {
        dot: true,
        objectMode: true
      }
    );
  
    return entries.map((entry) => {
      const dirOptions = directories.find(dir => minimatch(entry.path, dir.pattern));
  
      const componentName = entry.path
        .replace(new RegExp(dirOptions?.omit, 'gi'), '')
        .split('/')
        .filter(Boolean)
        .map(pascalCaseWithCapitals)
        .join('');
  
      const fromPath = entry.path
        .replace(/\.\/src/gi, '@');
  
      return {
        [fromPath]: [
          [removeExtension(entry.name), removeExtension(componentName)]
        ]
      };
    });
  }