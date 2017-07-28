const webpack = require('webpack'),
      path = require('path'),
      WebpackMd5Hash = require('webpack-md5-hash');

module.exports = {

    // Currently we need to add '.ts' to resolve.extensions array.
    resolve: {
        extensions: ['.ts', '.webpack.js', '.web.js', '.js']
    },

    entry: './src/main.ts',
    
    output: {
        path: path.resolve(__dirname, 'demo', 'static', 'client-origin'),
        filename: 'track.js'
    },

    // Source maps support (or 'inline-source-map' also works)
    devtool: 'source-map',

    // Add loader for .ts files.
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader?module=true'
            },
            { test: /\.ts$/, loader: "webpack-strip?strip[]=console.log" }
        ]
    },

    plugins: [
        new WebpackMd5Hash(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            comments: false
        })
    ]
};