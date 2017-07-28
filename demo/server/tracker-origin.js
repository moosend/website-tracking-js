var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var TRACKER_ORIGIN_STATIC = '../static/tracker-origin';

var app = express();
var JSONParser = bodyParser.json();

var absoluteStaticPath = path.join(__dirname, TRACKER_ORIGIN_STATIC);
var relativeStaticPath = path.relative(process.cwd(), absoluteStaticPath);

/**
 * Disable Express header, because it is not standard and thus is a subject to CORS
 */
app.disable('x-powered-by');

/**
 * Server track.js - Tracker API
 */
app.use(express.static(relativeStaticPath, { index: false }));

/**
 * Allow Cross site scripting
 */
app.options('/api/track', allowOrigin);
app.options('/api/identify', allowOrigin);

/**
 * Echo POST request to use in demo
 */
app.post('/api/track', JSONParser, echoJSON);
app.post('/api/identify', JSONParser, echoJSON);

module.exports = app;

function echoJSON (req, res) {
  console.log('recieved POST to /api \nBODY:\n', req.body);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(req.body);
  res.end();
}

function allowOrigin (req, res) {
  console.log('recieved OPTIONS \n%j', {
    'Origin': req.headers['Origin'.toLocaleUpperCase()],
    'Access-Control-Request-Method': req.headers['Access-Control-Request-Method'.toLocaleLowerCase()]
  });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Max-Age', 5);
  res.end();
}