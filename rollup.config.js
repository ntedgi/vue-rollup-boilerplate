import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import image from '@rollup/plugin-image'
import postcss from 'rollup-plugin-postcss'
import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import cssnano from 'cssnano'
import filesize from 'rollup-plugin-filesize'

const production = !process.env.ROLLUP_WATCH
const port = 8080

export default {
  input: 'src/main.js',
  output: {
    file: 'public/assets/app.js',
    format: 'iife',
    sourcemap: false,
    name: 'app',
  },
  plugins: [
    alias({
      entries: [{ find: '@', replacement: __dirname + '/src/' }],
    }),
    image(),
    postcss({ extract: true, plugins: production ? [cssnano()] : [] }),
    nodeResolve(),
    commonjs(),
    vue({ css: false }),
    replace({
      'process.env.NODE_ENV': '"production"',
    }),
    esbuild({
      minify: production,
      target: 'es2015',
    }),
    !production &&
      serve({
        open: true,
        contentBase: 'public',
        historyApiFallback: true,
        port,
      }),
    !production && livereload({ watch: 'public' }),
    production && filesize(),
  ],
  watch: {
    clearScreen: true,
  },
}
