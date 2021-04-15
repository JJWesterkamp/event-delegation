const { resolve } = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack')

module.exports = {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
            include: /\.min\.js$/
        })]
    },
    entry: {
        'event-delegation': './src/index.ts',
        'event-delegation.min': './src/index.ts',
    },
    output: {
        path: resolve(__dirname, 'umd'),
        filename: '[name].js',
        library: {
            name: 'EventDelegation',
            type: 'umd',
            export: 'default',
        },
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    plugins: [
        new webpack.BannerPlugin([
            `@jjwesterkamp/event-delegation`,
            `https://jjwesterkamp.github.io/event-delegation`,
            `(c) 2018-${new Date().getFullYear()} Jeffrey Westerkamp`,
            `This software may be freely distributed under the MIT license.`,
        ].join('\n')),
    ]
};
