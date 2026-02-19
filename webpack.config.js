const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (_env, argv) => {
    const isDev = argv.mode !== 'production';

    return {
        devtool: 'eval-cheap-module-source-map',
        mode: isDev ? 'development' : 'production',
        entry: {
            'index.js': './src'
        },
        optimization: {
            minimize: !isDev,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        keep_classnames: true,
                    },
                }),
            ],
        },
        target: 'node',
        node: {
            __dirname: false,
            __filename: false,
        },
        output: {
            filename: '[name]',
            path: path.resolve(__dirname, 'dist'),
            pathinfo: false,
        },
        module: {
            exprContextCritical: false,
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /discord-qt\/node_modules/g,
                    use: [
                        'thread-loader',
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                happyPackMode: true,
                                experimentalWatchApi: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: { publicPath: 'dist' },
                        },
                    ],
                },
                {
                    test: /\.node$/,
                    use: [
                        {
                            loader: 'native-addon-loader',
                            options: { name: '[name].[ext]' },
                        },
                    ],
                }
            ]
        },
        resolve: {
            exportsFields: [],
            extensions: ['.ts', '.js', '.json', '.wasm'],
            mainFields: ['main'],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    { from: 'assets', to: 'assets' }
                ]
            })
        ]
    };
};