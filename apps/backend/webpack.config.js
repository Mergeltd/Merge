const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main',
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: ['@merge/types', '@merge/database'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@merge/types': path.resolve(__dirname, '../../packages/types/index.ts'),
    },
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  plugins: [
    new webpack.IgnorePlugin({
      checkResource(resource) {
        // Ignore packages that should be external
        return false;
      },
    }),
  ],
};
