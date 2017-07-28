var express = require('express');
var vhost = require('vhost');

var CLIENT_ORIGIN_HOST_NAME = 'local.client.domain';
var TRACKER_ORIGIN_HOST_NAME = 'local.tracker.domain';

var app = express();
var clientApp = require('./client-origin');
var trackerApp = require('./tracker-origin');

app.use(vhost(CLIENT_ORIGIN_HOST_NAME, clientApp));
app.use(vhost(TRACKER_ORIGIN_HOST_NAME, trackerApp));

var port = process.env.EXPRESS_PORT || 80;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('express app is listening on http://%s:%s', host, port);
  console.log('client-origin can be accessed as "%s"', 'http://' + CLIENT_ORIGIN_HOST_NAME);
  console.log('tracker-origin can be accessed as "%s"', 'http://' +  TRACKER_ORIGIN_HOST_NAME);
  console.log(
    '\nPlease note that you should add these aliases to hosts to run the demo\n' +
    '\t127.0.0.1 local.tracker.domain\n' +
    '\t127.0.0.1 local.client.domain'
  );
  console.log('\nOpen http://' + CLIENT_ORIGIN_HOST_NAME + ' to start the demo');
});

