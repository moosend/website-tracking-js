import commonjs from 'rollup-plugin-commonjs';
import filesize from "rollup-plugin-filesize";
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';

function getConfig(dest, format, env, ugly) {
    const global_defs = {
        EXTEND_JS_FONTS: false
    };
    const API_URL = env === 'staging' ? 'http://t.stat-track-staging.com' : 'http://t.stat-track.com';
    const config = {
        input: './src/index.ts',
        output: {
            file: dest,
            format,
            name: 'mootrack',
            globals: {
                window: 'window'
            },
            indent: false,
            interop: false,
            strict: false
        },
        plugins: [
            typescript(),
            replace({
                'process.env.API_URL': JSON.stringify(API_URL),
                'process.env.NODE_ENV': JSON.stringify(env)
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
                    'U.getV18=function(i,o)': 'false&&function(i,o)',
                    'U.getPromise=': 'false&&',
                    'throw new Error("\'new Fingerprint()\' is deprecated, see https://github.com/Valve/fingerprintjs2#upgrade-guide-from-182-to-200")': 'return false',
                    't.fonts.extendedJsFonts': global_defs.EXTEND_JS_FONTS
                }
            }),
            builtins(),
            resolve({
                jsnext: true,
                main: true,
                browser: true
            }),
            commonjs({
                ignoreGlobal: true
            }),
            filesize()
        ]
    };

    return config;
};

const config = [
    getConfig("dist/moosend-tracking.js", "cjs", "production", false),
    getConfig("dist/moosend-tracking.umd.js", "umd", "production", false),
    getConfig("dist/moosend-tracking.min.js", "iife", "production", true),
    getConfig("dist/moosend-tracking-staging.min.js", "iife", "staging", true),
    getConfig("dist/moosend-tracking.module.js", "es", "production", false)
];

export default config;
