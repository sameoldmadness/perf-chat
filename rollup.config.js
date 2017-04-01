import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/index.js',
  format: 'iife',
  plugins: [resolve()],
  dest: 'static/js/index.js',
  // treeshake: false,
};