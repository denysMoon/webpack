//Пути
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development' ? true : false
const isProd = !isDev

console.log('Is it the dev mode? ', isDev)

const optimization = () =>{
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if(isProd){
        config.minimizer = [
            new TerserPlugin()
        ]
    }

    return config
}

const plugins = () =>{
    const base = [
        new HTMLWebpackPlugin({
            title: 'Webpack',
            template: './src/index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        // new CopyPlugin({
        //     from: path.resolve(__dirname, 'src/favicon.ico'),
        //     to: path.resolve(__dirname, 'dist')
        // }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ]

    if(isProd){
        base.push(new BundleAnalyzerPlugin())
    }

    return base
}

module.exports = {
    // context: path.resolve(__dirname, 'src)
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './src/index.js']
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json'],
    },
    optimization: optimization(),
    devServer: {
        port: 8888,
        hot: isDev
    },
    // devtool: isDev ? 'source-map' : '',
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ isDev ? MiniCssExtractPlugin.loader : 'style-loader',
                'css-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            }
        ]
    }
}