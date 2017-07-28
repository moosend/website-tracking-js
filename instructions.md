/*
 This is designed to run in browser. Running it on other environments can cause side effects.
 Browser execute script tags in order. Having this in mind some stuff here should be in order.
 The javascript that interacts with 'window._moo' should be called after including the script tag with reference
 at the library CDN.
 _moo has to be initialized before trying to call any events. It should be initialized only once by calling its 'init()' method
 */

//load TrackerJS
(function(a,c,e,f,b){a.MooTrackerObject=b;a[b]=a[b]||function(){a[b].q?a[b].q.push(arguments):a[b].q=[arguments]};var g=1*new Date,d=c.createElement(e);d.async=!0;d.src=f+"?ts="+g;c=c.getElementsByTagName(e)[0];c.parentNode.insertBefore(d,c)})(window,document,"script","//cdn.stat-track.com/statics/moosend-tracking.min.js","mootrack");

//tracker has to be initialized otherwise it will generate warnings and wont send tracking events
mootrack('init', '97C425C7-928B-4856-BC02-C72074C8586C');

//send page view events, typically runs on every page load / ready event
mootrack('trackPageView');

//send identify events
mootrack('identify', 'john.doe@mail.com'); //identify with e-mail only
mootrack('identify', 'john.doe@mail.com', 'John Doe'); //identify with e-mail and name
mootrack('identify', 'john.doe@mail.com', 'John Doe', {'Location': 'Zimbabwe'}); //identify with e-mail, name and extra properties

//send added to order events
var itemCode = 'Product-101';
var itemPrice = 12.02;
var itemUrl = 'http://YOUR_SOTRE/product-101';
var itemQuantity = 1;
var itemTotalPrice = 14.22; //the price might come up when applying taxes or if quantity is greater than 1
var itemName = 'A very cool product';
var itemImage = 'http://YOUR_SOTRE/product-color-blue.jpg'
var extraProps = {'color': 'Red', 'size': 'XXL'}; //you can store product extra props. can be used to pass the product selected variations for this sale

//mandatory arguments
mootrack('trackAddToOrder', itemCode, itemPrice, itemUrl ,itemQuantity);

//all available arguments
mootrack('trackAddToOrder', itemCode, itemPrice, itemUrl ,itemQuantity, itemTotalPrice, itemName, itemImage, extraProps);

//send order completed events

var product = {
    itemCode: 'Product-101',
    itemPrice: 12.02,
    itemUrl: 'http://YOUR_SOTRE/product-101',
    itemQuantity: 1,
    itemTotalPrice: 14.22,//the price might come up when applying taxes or if quantity is greater than 1
    itemName: 'A very cool product',
    itemImage: 'http://YOUR_SOTRE/product-color-blue.jpg',
    color: 'Red',
    size: 'XXL'
};

//Products should be an array with an object like product. Properties itemCode, itemPrice, itemUrl ,itemQuantity are mandatory
var products = [product, product];

mootrack('trackOrderCompleted', products);

//tracking custo mevents
mootrack('PROBLEM_SOLVED', {agent: 'John Doe'});