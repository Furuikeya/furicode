import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache'
});

export const fetchPlugin = (inputValue: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
            loader: 'jsx',
            contents: inputValue,
          };
      })

    build.onLoad({ filter: /.*/ }, async (args: any) => {
      const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
      if (cachedResult) return cachedResult;
    })

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        
        const fileContents = `
          const style = document.createElement('style');
          style.innerText = \`${data}\`;
          document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: fileContents,
          resolveDir: new URL(
            './', request.responseURL + '/'
            ).pathname
        }
        await fileCache.setItem(args.path, result);

        return result
      })

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL(
            './', request.responseURL + '/'
            ).pathname
          }
        await fileCache.setItem(args.path, result);

        return result
      });
    }
  }
}