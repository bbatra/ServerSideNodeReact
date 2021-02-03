const express = require('express');

const webpack = require('webpack');
const app = express();

if (process.env.NODE_ENV === 'loc') {
    const webpackConfig = require('../../../webpack.config.loc.js').default;
    const webpackObj = {
        devMiddleware: require('webpack-dev-middleware'),
        config: webpackConfig,
        hotMiddleware: require('webpack-hot-middleware')
    };
    // TODO maybe call compiler.close(callback)
    // https://webpack.js.org/migrate/5/#cleanup-the-build-code
    const compiler = webpack(webpackObj.config);

    app.use(webpackObj.devMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));

    app.use(webpackObj.hotMiddleware(compiler));
}


module.exports = app;


