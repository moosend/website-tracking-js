const path = require('path');
const webpack = require('webpack');

const definePlugin = new webpack.DefinePlugin({
    _ENV_: JSON.stringify(process.env.NODE_ENV),
    'process.env.API_URL': JSON.stringify('https://t.stat-track-staging.com'),
    //'process.env.API_URL' : JSON.stringify('http://trackerjs.getsandbox.com'),
    'process.env.FORMS_API': JSON.stringify('https://forms.moooo.co/api/forms/')
});

module.exports = {

    // Currently we need to add '.ts' to resolve.extensions array.
    resolve: {
        extensions: ['.ts', '.webpack.js', '.web.js', '.js']
    },

    entry: './src/main.ts',

    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: "/dist/",
        filename: 'moosend-tracking.js'
    },

    // Add loader for .ts files.
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader?module=true',
                exclude: /node_modules/
            }
        ]
    },

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
    performance: {
        hints: false,
    },

    plugins: [
        definePlugin,
        new webpack.NoEmitOnErrorsPlugin()
    ]
};