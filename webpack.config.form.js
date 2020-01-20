const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');
const path = require('path');

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __DEV__: false,
    'process.env.FORM_URL': JSON.stringify('https://forms.moooo.co/api/forms/'),
    //'form.type': JSON.stringify(env.formtype)
};



module.exports = env => {

    GLOBALS['process.env.formtype'] = JSON.stringify(env.formtype);

    return {
        // Currently we need to add '.ts' to resolve.extensions array.
        resolve: {
            extensions: ['.ts', '.webpack.js', '.web.js', '.js']
        },

        entry: './src/subscription-forms/single.ts',

        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: "/dist/",
            filename: `moosend-${(env.formtype).toLowerCase()}.min.js`
        },

        // Add loader for .ts files.
        module: {
            rules: [{
                    test: /\.ts$/,
                    loader: 'awesome-typescript-loader?module=true'
                },
                
            ]
        },

        plugins: [
            new WebpackMd5Hash(),
            new webpack.DefinePlugin(GLOBALS),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                comments: false
            })
        ]
    }
};