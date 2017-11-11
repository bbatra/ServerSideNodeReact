const express = require('express');
const webpack = require('webpack');
const app = express();

const webpackLocConfig = require('../../../webpack.config.loc').default;
const webpackObj = {
    devMiddleware: require('webpack-dev-middleware'),
    config: webpackLocConfig,
    hotMiddleware: require('webpack-hot-middleware')
};

const compiler = webpack(webpackObj.config);

app.use(webpackObj.devMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackLocConfig.output.publicPath
}));

app.use(webpackObj.hotMiddleware(compiler));


module.exports = app;
