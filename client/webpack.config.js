const path = require('path');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  // entry: './src/index.js',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  watch: process.env.REACT_APP_NODE_ENV != 'production',
  plugins: [
    new WebpackObfuscator({
      rotateStringArray: true
    }, ['excluded_bundle_name.js'])
  ],
  mode: 'production',
};
