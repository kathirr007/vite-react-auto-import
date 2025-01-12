import path from 'node:path';
import fg from 'fast-glob';
import { minimatch } from 'minimatch';
import { ImportsMap } from 'unplugin-auto-import/types';

export interface DirsToWatch {
  pattern: string;
  omit: string;
}

function pascalCaseWithCapitals(str:string) {
    return str
      .split('/')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
  
  function removeExtension(str:string) {
    return path.basename(str, path.extname(str));
  }
  
  export function getComponentImports(dirs:DirsToWatch[] = [{
    pattern: './src/components/**/*.{tsx,jsx}',
    omit: './src/components'
  }]) {
      
    const entries = fg.sync(
      dirs.map(x => x.pattern),
      {
        dot: true,
        objectMode: true
      }
    );
  
    return entries.map((entry:any) => {
      const dirOptions = dirs.find(dir => minimatch(entry.path, dir.pattern));
  
      const componentName = entry.path
        .replace(new RegExp(dirOptions?.omit as string, 'gi'), '')
        .split('/')
        .filter(Boolean)
        .map(pascalCaseWithCapitals)
        .join('');
  
      const fromPath = entry.path
        .replace(/\.\/src/gi, '@');
  
      return {
        [fromPath as string]: [
          [removeExtension(entry.name), removeExtension(componentName)]
        ]
      };
    }) as ImportsMap[];
  }