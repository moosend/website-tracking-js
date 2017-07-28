"use strict";
exports.__esModule = true;
var config_1 = require("../common/config");
var JSON3 = require("json3");
var TrackerAgent = (function () {
    function TrackerAgent(trackerUrl) {
        if (trackerUrl === void 0) { trackerUrl = config_1["default"].apiUrl; }
        this.url = trackerUrl;
    }
    TrackerAgent.prototype.sendTrack = function (payload) {
        this._postData(this.url + "/track", payload);
    };
    TrackerAgent.prototype.sendIdentify = function (payload) {
        this._postData(this.url + "/identify", payload);
    };
    TrackerAgent.prototype.sendPing = function (payload) {
        this._postData(this.url + "/ping", payload);
    };
    TrackerAgent.prototype._postData = function (url, data) {
        post(url, data, function () {
        });
    };
    return TrackerAgent;
}());
exports["default"] = TrackerAgent;
function post(url, data, callBack) {
    var xmlhttp;
    if (window.XDomainRequest) {
        xmlhttp = new XDomainRequest();
        xmlhttp.onload = function () {
            callBack(xmlhttp.responseText);
        };
    }
    else if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callBack(xmlhttp.responseText);
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Accept", "application/json");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON3.stringify(data));
}
