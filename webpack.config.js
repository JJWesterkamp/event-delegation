const { resolve } = require('path');

module.exports = {
    mode: 'production',
    entry: {
        'event-delegation': './src/index.ts',
        'event-delegation.min': './src/index.ts',
    },
    output: {
        path: resolve(__dirname, 'umd'),
        filename: '[name].js',
        library: 'EventDelegation',
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
