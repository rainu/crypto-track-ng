const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  entry: ['./services/course-crawler/src/run.js'],
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, './dist/'),
    publicPath: '../../',
    filename: 'application-course.js'
  },
  resolve: {
    modules: [path.join(__dirname, '../../node_modules')],
    extensions: ['.js'],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-2']
        }
      }
    ]
  }
};
