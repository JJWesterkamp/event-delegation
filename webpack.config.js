const { resolve } = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
            type: 'var',
            export: 'default',
        },
        libraryTarget: 'umd',
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
    }
};
