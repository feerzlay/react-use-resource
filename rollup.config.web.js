import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

import serve from 'rollup-plugin-serve';
import systemjs from 'rollup-plugin-systemjs-loader';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'web/index.tsx',
  preserveEntrySignatures: false,
  output: [
    {
      dir: 'lib-web',
      format: 'system'
    }
  ],
  plugins: [
    cleaner({
      targets: ['./lib-web/']
    }),
    copy({
      targets: [{ src: 'web/index.html', dest: 'lib-web' }]
    }),
    resolve(),
    typescript({ tsconfig: './tsconfig.web.json' }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    systemjs({
      include: [require.resolve('systemjs/dist/s.js')]
    }),
    ...(isProduction ? [terser({ format: { comments: false } })] : []),
    ...(!isProduction
      ? [serve({ contentBase: 'lib-web', port: 8080, historyApiFallback: true })]
      : [])
  ]
};
