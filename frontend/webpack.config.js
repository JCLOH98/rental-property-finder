const path = require('path');
const dotenv = require('dotenv');
const { DefinePlugin } = require('webpack');

// Load environment variables from the .env file
dotenv.config();

module.exports = {
  entry: './index.js', // Your entry point file
  output: {
    filename: 'bundle.js',
    path: __dirname, //path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
  devServer: {
    static: './dist',
  },
};
