const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { resolve } = require('path');

module.exports = {
    mode: "production",
    entry: {
        "event-delegation": "./src/index.umd.ts",
        "event-delegation.min": "./src/index.umd.ts",
    },
    output: {
        path: resolve(__dirname, 'umd'),
        filename: '[name].js',
        library: 'EventDelegation',
        libraryTarget: 'umd',
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                test: /\.min\.js$/,
                sourceMap: true,
            }),
        ],
    },

    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ["ts-loader"],
                exclude: /node_modules/,
            }
        ],
    }
};
