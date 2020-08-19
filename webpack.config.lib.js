const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');
const path = require('path');

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __DEV__: false,
    'process.env.API_URL' : JSON.stringify('https://t.stat-track.com'),
    'process.env.FORMS_API': JSON.stringify('https://forms.m-pages.com/api/forms/'),
    'process.env.FORM_API': JSON.stringify('https://form.m-pages.com/api/form/')
};

module.exports = {

    // Currently we need to add '.ts' to resolve.extensions array.
    resolve: {
        extensions: ['.ts', '.webpack.js', '.web.js', '.js']
    },

    entry: './src/main.ts',

    output: {
        library: 'mootracker',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/dist/",
        filename: 'main.js'
    },

    // Add loader for .ts files.
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader?module=true'
            },
            // { test: /\.ts$/, loader: "webpack-strip?strip[]=console.log" }
        ]
    },

    plugins: [
        new WebpackMd5Hash(),
        // new webpack.DefinePlugin(GLOBALS),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            comments: false
        })
    ]
};