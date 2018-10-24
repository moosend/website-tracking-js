import commonjs from 'rollup-plugin-commonjs';
import filesize from "rollup-plugin-filesize";
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';

function getConfig(dest, format, ugly) {
    const global_defs = {
        EXTEND_JS_FONTS: false
    };
    const config = {
        input: './src/index.ts',
        output: {
            file: dest,
            format,
            indent: false,
            interop: false,
            strict: false
        },
        plugins: [
            typescript(),
            replace({
                'process.env.API_URL': JSON.stringify('http://t.stat-track.com'),
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            ugly &&
                uglify(
                    {
                        ie8: true,
                        compress: {
                            global_defs
                        }
                    }
                ),
            replace({
                include: ['node_modules/uuid/**'],
                delimiters: ['', ''],
                values: {
                    'require(\'./lib/rng\')': 'require(\'./lib/rng-browser\')'
                }
            }),
            replace({
                include: ['node_modules/fingerprintjs2/**'],
                delimiters: ['', ''],
                values: {
                    'e.style.textShadow="none",': '', // fix for ie8
                    'e.style.lineBreak="auto",': '', // fix for ie8,
                    '{key:"audio"': 'false&&{key:"audio"',
                    '{key:"fontsFlash"': 'false&&{key:"fontsFlash"',
                    '{key:"enumerateDevices"': 'false&&{key:"enumerateDevices"',
                    '{key:"timezone"': 'false&&{key:"timezone"',
                    '{key:"addBehavior"': 'false&&{key:"addBehavior"',
                    '{key:"deviceMemory"': 'false&&{key:"deviceMemory"',
                    '{key:"timezone"': 'false&&{key:"timezone"',
                    '{key:"doNotTrack"': 'false&&{key:"doNotTrack"',
                    '{key:"webglVendorAndRenderer"': 'false&&{key:"webglVendorAndRenderer"',
                    '{key:"userAgent"': 'false&&{key:"userAgent"',
                    '{key:"deviceMemory"': 'false&&{key:"deviceMemory"',
                    '{key:"hardwareConcurrency"': 'false&&{key:"hardwareConcurrency"',
                    't.fonts.extendedJsFonts': global_defs.EXTEND_JS_FONTS
                }
            }),
            builtins(),
            resolve({
                jsnext: true,
                main: true,
                browser: true
            }),
            commonjs(),
            filesize()
        ]
    };

    return config;
};

const config = [
    getConfig("dist/moosend-tracking.js", "cjs", false),
    getConfig("dist/moosend-tracking.umd.js", "umd", false),
    getConfig("dist/moosend-tracking.min.js", "iife", true),
    getConfig("dist/moosend-tracking.module.js", "es", false)
];

export default config;
