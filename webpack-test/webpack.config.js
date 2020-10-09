const path = require("path"),
    childProcess = require("child_process"),
    webpack = require("webpack"),
    mode = process.env.NODE_ENV || "development",
    devtool = process.env.NODE_ENV === "production" ? "" : "inline-source-map",
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    {CleanWebpackPlugin} = require("clean-webpack-plugin"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    TerserPlugin = require("terser-webpack-plugin"),
    CopyPlugin = require("copy-webpack-plugin"),
    HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin'),
    entry = require('webpack-glob-entry');

let commitVersion = "not yet git repository",
    author = "not yet git repository";

// try {
//     commitVersion = childProcess.execSync("git rev-parse --short HEAD");
//     author = childProcess.execSync("git config user.name");
// } catch (e) {
//     commitVersion = "not yet git repository"
//     author = "not yet git repository"
// }

module.exports = {
    mode,
    entry: entry('./src/app/*.js'),
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "js/apps/[name].js",
    },
    module: {
        rules: [
            {
                test: /\.(s[ac]ss|css)$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.html$/i,
                use: [
                    'html-loader',
                ],
            },
            {
                test: /\.(woff|woff2|eot)$/i,
                loader: "file-loader",
                options: {
                    publicPath: "../font",
                    outputPath: "font",
                    name: "[name].[ext]?[hash]",
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            publicPath: "../img",
                            outputPath: "img",
                            name: "[name].[ext]?[hash]",
                            limit: 20000, // 20kb
                        },
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-gifsicle')({
                                    interlaced: false
                                }),
                                require('imagemin-mozjpeg')({
                                    progressive: true,
                                    arithmetic: false
                                }),
                                require('imagemin-pngquant')({
                                    floyd: 0.5,
                                    speed: 2
                                }),
                                require('imagemin-svgo')({
                                    plugins: [
                                        { removeTitle: true },
                                        { convertPathData: false }
                                    ]
                                })
                            ]
                        }
                    }
                ],
            },
            {
                test: /\.js$/i,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin({
            banner: `
                Build Date: ${new Date().toLocaleString()}
                Commit Version: ${commitVersion}
                Author: ${author}
            `,
        }),
        new HtmlWebpackTagsPlugin({
            tags: [
                "js/libs/jquery.min.js"
            ],
            append: false
        }),
        new HtmlWebpackPlugin({
            template: "./src/views/01_main.html",
            filename: "views/01_main.html",
            templateParameters: {
                env: process.env.NODE_ENV === "production" ? "" : "(개발용)",
            },
            minify:
                process.env.NODE_ENV === "production"
                    ? {
                        collapseWhitespace: true,
                        removeComments: true,
                    }
                    : false,
            excludeChunks: ["app"], // entry에서 해당 리스트를 제외한 나머지
        }),
        new HtmlWebpackPlugin({
            template: "./src/views/02_main.html",
            filename: "views/02_main.html",
            templateParameters: {
                env: process.env.NODE_ENV === "production" ? "" : "(개발용)",
            },
            minify:
                process.env.NODE_ENV === "production"
                    ? {
                        collapseWhitespace: true,
                        removeComments: true,
                    }
                    : false,
            chunks: ["app"], // entry에서 해당 리스트만 포함
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "./node_modules/jquery/dist/jquery.min.js",
                    to: "js/libs/jquery.min.js",
                }
            ]
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        stats: "errors-only",
        overlay: true,
        hot: true,
        open: true,
        port: 8080,
    },
    externals: {
        jquery: "jquery"
    },
    optimization: {
        minimizer: mode === "production" ? [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    }
                }
            }),
        ] : [],
    },
    devtool,
}