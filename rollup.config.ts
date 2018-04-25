import commonjs from 'rollup-plugin-commonjs';
import filesize from "rollup-plugin-filesize";
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;

function getConfig(dest: string, format: string, ugly: boolean) {
    const confg = {
        input: './src/index.ts',
        plugins: [
            typescript({
                tsconfigOverride: {
                    compilerOptions: { module: 'es2015', target: 'es5' }
                }
            }),
            replace({
                delimiters: ["'", "'"],
                include: ['node_modules/uuid-random/index.js'],
                values: {
                'crypto': "'randombytes'"
                }
            }),
            replace({
                'process.env.API_URL': JSON.stringify('https://t.stat-track-staging.com'),
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            resolve(),
            commonjs(),
            globals(),
            builtins(),
            filesize()
        ]
    };
};

const config =  [
    {
        context: 'window',
        input: defaultConfig.input,
        output: [
            {
                exports: 'named',
                extend: true,
                file: './dist/moosend.min.js',
                format: 'iife',
                globals:{
                    window: 'window',
                },
                interop: false,
                legacy: true,
                name: 'window',
                strict: false,
            }
        ],
        plugins: defaultConfig.plugins
    },
    {
        context: 'global',
        external: ['fingerprintjs2'],
        input: defaultConfig.input,
        output: {
            exports: 'named',
            file: './cjs/moosend.min.js',
            format: 'cjs',
            name: 'window',
            strict: false,
        },
        plugins: defaultConfig.plugins
    }
];

if (env === 'production') {
    config[0].plugins.push(uglify({
        compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
        },
        ie8: true
    }));
}

export default config;