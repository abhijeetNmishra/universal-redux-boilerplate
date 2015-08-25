/* eslint camelcase:0 */
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import writeStats from './utils/write-stats';
import postcssPlugins from './postcss.plugins';

const JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;

export default {
  devtool: 'source-map',
  entry: {
    app: './app/index.js'
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: '/assets/'
  },
  module: {
    preLoaders: [
      {test: JS_REGEX, exclude: /node_modules/, loader: 'eslint'}
    ],
    loaders: [
      {test: /\.json$/, exclude: /node_modules/, loader: 'json'},
      {test: JS_REGEX, exclude: /node_modules/, loader: 'babel'},
      {test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'file?name=[sha512:hash:base64:7].[ext]'},
      {test: /\.(jpe?g|png|gif)$/, loader: 'file?name=[sha512:hash:base64:7].[ext]!image?optimizationLevel=7&progressive&interlaced'},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss')}
    ]
  },
  postcss: postcssPlugins,
  plugins: [

    new ExtractTextPlugin('[name]-[hash].css'),

    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: true
      },
      output: {
        comments: false
      }
    }),

    // write webpack stats
    function() { this.plugin('done', writeStats); }
  ],
  resolve: {
    extensions: ['', '.js', '.json', '.jsx', '.es6', '.babel'],
    modulesDirectories: ['node_modules', 'app']
  }
};
