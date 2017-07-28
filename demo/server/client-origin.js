var express = require('express');
var path = require('path');

var CLIENT_ORIGIN_STATIC = '../static/client-origin';

var app = express();

var absoluteStaticPath = path.join(__dirname, CLIENT_ORIGIN_STATIC);
var relativeStaticPath = path.relative(process.cwd(), absoluteStaticPath);

app.use(express.static(relativeStaticPath, { index: ['index.html'] }));

module.exports = app;