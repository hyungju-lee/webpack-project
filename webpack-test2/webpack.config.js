var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    context: __dirname,
    entry: './example.js',
    output: {
        path: path.join(__dirname, 'dist/'),
        publicPath: '',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
            { test: /\.png$/, loader: 'file-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'template.html'
        }),
        new MiniCssExtractPlugin({ filename: 'styles.css' })
    ]
};