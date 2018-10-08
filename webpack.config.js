var webpack = require('webpack');
const { resolve } = require('path');

module.exports = {
    entry: {
        "package-name": "./src/index.ts",
        "package-name.min": "./src/index.ts",
    },
    output: {
        path: resolve(__dirname, 'umd'),
        filename: '[name].js',
        library: 'PackageName',
        libraryTarget: 'umd',
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            sourceMap: true,
        })
    ],

    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ["awesome-typescript-loader"],
                exclude: /node_modules/,
            }
        ],
    }
};