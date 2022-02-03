const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { VueLoaderPlugin } = require('vue-loader')
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin()

const isProd = process.argv.includes('--production')
const isAnalyze = process.argv.includes('--analyzer');

module.exports = webpackConfig = {

    //define entry point
    devtool: isProd ? false : 'eval-cheap-module-source-map',

    // send to distribution
    output: {
        path: path.resolve(__dirname, './../dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        extensions: [ '.js', '.vue' ],
        alias: {
            src: path.resolve(__dirname + '/../src'),
            consts: path.resolve(__dirname + '/../consts'),
        },
        fallback: {
            fs: false,
            assert: false,
            crypto: false,
            stream: false,
            util: false,
            http: false,
            https: false,
            net: false,
            path: false,
            tls: false,
            zlib: false,
            buffer: false,
            child_process: false,
            dgram: false,
            uws: false,
            os: false,
        }
    },
    module: {
        rules: [{
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [ {
                    loader: 'file-loader',
                    options: {
                        name: 'assets/[contenthash].[ext]',
                        publicPath: '/',
                    },
                }],
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: process.argv.includes('--production'),
                    preserveWhitespace: false,
                }
            }, {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(gitRevisionPlugin.version()),
            COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
            BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
            LASTCOMMITDATETIME: JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),
            BROWSER: 'true',
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
        ... ( isProd ? [
            new TerserPlugin(),
            ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
            new CompressionWebpackPlugin({
                filename: '[path][base].gz',
                algorithm: 'gzip',
                test: new RegExp('\\.(js|css)$'),
                threshold:10240,
                minRatio: 0.8,
            })
        ]
        : [
            new FriendlyErrorsPlugin(),
        ])
    ]
};
