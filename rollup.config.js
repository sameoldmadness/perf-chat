import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'client/src/index.js',
  format: 'iife',
  plugins: [resolve()],
  dest: 'client/dist/js/index.js',
  treeshake: false,
};
