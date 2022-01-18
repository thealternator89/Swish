const path = require('path');

module.exports = {
  entry: './src/main.ts',
  mode: 'production',
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
  },
  output: {
    path: path.resolve(__dirname, '..'),
    filename: 'main.js',
  },
  externals: {
    'swish-base': 'commonjs swish-base'
  },
  target: 'electron-main',
};
