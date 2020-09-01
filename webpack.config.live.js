import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
var CompressionPlugin = require("compression-webpack-plugin");

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('live')
};

export default {
    debug: true,
    devtool: 'source-map',
    noInfo: false, // to display a list of files that webpack will be bundling in the console
    entry: {
     web: [ './src/frontend/client'], // react app entry point
    },
    target: 'web',
    output: {
      path: __dirname + '/src/static/scripts',
      publicPath: '/static/scripts/',
      filename: '[name]-bundle.js'
    },
    plugins: [
        new ExtractTextPlugin('bundle.js'),
        new webpack.LoaderOptionsPlugin({
          debug: true
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.UglifyJsPlugin({
          mangle: true,
          compress: {
            warnings: false, // Suppress uglification warnings
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true
          },
          output: {
            comments: false,
          },
          exclude: [/\.min\.js$/gi] // skip pre-minified libs
        }),
        new CompressionPlugin({
          asset: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.(js|jsx)$|\.css$|\.html$/
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: path.join(__dirname, 'src/frontend'),
      loaders: ['babel-loader']
    }, {
      test: /(\.css)$/,
      loader: ExtractTextPlugin.extract('css?sourceMap')
    },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }],

    noParse: [
      /src\/static\/scripts\/xregexp-all.min.js/
    ]
  }
};
