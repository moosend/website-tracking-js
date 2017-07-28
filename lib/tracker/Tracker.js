"use strict";
exports.__esModule = true;
var uuidV4 = require("uuid/v4");
var isEmpty = require("lodash/isEmpty");
var isPlainObject = require("lodash/isPlainObject");
var assign = require("lodash/assign");
var isArray = require("lodash/isArray");
exports.TrackerActions = {
    ADDED_TO_ORDER: "ADDED_TO_ORDER",
    IDENTIFY: "IDENTIFY",
    ORDER_COMPLETED: "ORDER_COMPLETED",
    PAGE_VIEWED: "PAGE_VIEWED",
    PING: "PING"
};
var Tracker = (function () {
    function Tracker(agent, storage, browser) {
        this.agent = agent;
        this.storage = storage;
        this.browser = browser;
    }
    Tracker.prototype.identify = function (email, name, props) {
        if (!this._isInitialized()) {
            return;
        }
        var payload;
        if (!(email && isString(email))) {
            throw new Error("email cannot be undefined or empty");
        }
        if (this.storage.getEmail() === email) {
            return;
        }
        this.storage.setEmail(email);
        var siteId = this.siteId;
        var campaignId = this.storage.getCampaignId();
        var sessionId = this.storage.getSessionId();
        var ContactId = this.storage.getUserId();
        payload = {
            ContactEmailAddress: email,
            ContactId: ContactId,
            actionType: exports.TrackerActions.IDENTIFY,
            sessionId: sessionId,
            siteId: siteId
        };
        if (name && isString(name)) {
            payload.ContactName = name;
        }
        if (campaignId) {
            payload.CampaignId = campaignId;
        }
        if (props && !isEmpty(props)) {
            payload.properties = props;
        }
        this.agent.sendIdentify(payload);
    };
    Tracker.prototype.track = function (action, props) {
        if (!this._isInitialized()) {
            return;
        }
        if (!(action && isString(action))) {
            return;
        }
        if (isArray(props)) {
            if (props[0].hasOwnProperty("product")) {
                var product = props[0].product;
                product = this.formatProductPayload(product);
            }
        }
        var payload = this.getPayload(action, props);
        this.agent.sendTrack(payload);
    };
    Tracker.prototype.trackPageView = function (url) {
        if (!this._isInitialized()) {
            return;
        }
        var payload = {
            ContactId: this.storage.getUserId(),
            Url: url || this.storage.getCurrentPageUrl(),
            actionType: exports.TrackerActions.PAGE_VIEWED,
            sessionId: this.storage.getSessionId(),
            siteId: this.siteId
        };
        var email = this.storage.getEmail();
        var campaignId = this.storage.getCampaignId();
        if (email) {
            payload.ContactEmailAddress = email;
        }
        if (campaignId) {
            payload.CampaignId = campaignId;
        }
        this.agent.sendTrack(payload);
    };
    Tracker.prototype.ping = function (browserComponents) {
        if (!this._isInitialized()) {
            return;
        }
        var payload = {
            BrowserComponents: browserComponents,
            ContactId: this.storage.getUserId(),
            actionType: exports.TrackerActions.PING,
            sessionId: this.storage.getSessionId(),
            siteId: this.siteId
        };
        var email = this.storage.getEmail();
        var campaignId = this.storage.getCampaignId();
        if (email) {
            payload.ContactEmailAddress = email;
        }
        if (campaignId) {
            payload.CampaignId = campaignId;
        }
        this.agent.sendPing(payload);
    };
    Tracker.prototype.trackAddToOrder = function (itemCode, itemPrice, itemUrl, itemQuantity, itemTotalPrice, itemName, itemImage, props) {
        var payload;
        if (typeof itemCode === "object") {
            itemCode = this.formatProductPayload(itemCode);
            if (itemPrice !== undefined && !isPlainObject(itemPrice)) {
                throw new Error("props should be a plain object eg : {props: value}");
            }
            var addToOrderPayload = { itemCode: itemCode.itemCode, itemPrice: itemCode.itemPrice, itemUrl: itemCode.itemUrl, itemQuantity: itemCode.itemQuantity, itemTotalPrice: itemCode.itemTotalPrice };
            if (itemCode.itemName) {
                addToOrderPayload = assign(addToOrderPayload, { itemName: itemCode.itemName });
            }
            if (itemCode.itemImage) {
                addToOrderPayload = assign(addToOrderPayload, { itemImage: itemCode.itemImage });
            }
            if (!isEmpty(itemPrice)) {
                addToOrderPayload = assign(addToOrderPayload, itemPrice);
            }
            payload = this.getPayload(exports.TrackerActions.ADDED_TO_ORDER, [{ product: addToOrderPayload }]);
            this.agent.sendTrack(payload);
            return;
        }
        if (!itemCode) {
            throw new Error("itemCode cannot be empty");
        }
        if (!isNumber(itemPrice) || !itemPrice) {
            itemPrice = 0;
            console.warn("itemPrice is missing, defaults to 0");
        }
        if (!itemUrl || !isUrl(itemUrl)) {
            itemUrl = this.storage.getCurrentPageUrl();
            console.warn("itemUrl is missing or invalid, defaults to current url");
        }
        if (!isNumber(itemQuantity) || !itemQuantity) {
            itemQuantity = 1;
            console.warn("itemQuantity is missing, defaults to 1");
        }
        if (!isNumber(itemTotalPrice) || !itemTotalPrice) {
            itemTotalPrice = 0;
            console.warn("itemTotalPrice is missing, defaults to 0");
        }
        if (itemImage !== undefined && !isUrl(itemImage)) {
            throw new Error("itemImage should be a valid url");
        }
        if (props !== undefined && !isPlainObject(props)) {
            throw new Error("props should be a plain object eg : {props: value}");
        }
        var addedToOrderPayload = { itemCode: itemCode, itemPrice: itemPrice, itemUrl: itemUrl, itemQuantity: itemQuantity, itemTotalPrice: itemTotalPrice };
        if (itemName) {
            addedToOrderPayload = assign(addedToOrderPayload, { itemName: itemName });
        }
        if (itemImage) {
            addedToOrderPayload = assign(addedToOrderPayload, { itemImage: itemImage });
        }
        if (!isEmpty(props)) {
            addedToOrderPayload = assign(addedToOrderPayload, props);
        }
        payload = this.getPayload(exports.TrackerActions.ADDED_TO_ORDER, [{ product: addedToOrderPayload }]);
        this.agent.sendTrack(payload);
    };
    Tracker.prototype.trackOrderCompleted = function (products, totalPrice) {
        var _this = this;
        if (!isArray(products)) {
            throw new Error("products type should be an array");
        }
        products.map(function (product) { return product = _this.formatProductPayload(product); });
        var payload = this.getPayload(exports.TrackerActions.ORDER_COMPLETED, [{ products: products, totalPrice: totalPrice }]);
        this.agent.sendTrack(payload);
    };
    Tracker.prototype.init = function (siteId) {
        var _this = this;
        if (!siteId) {
            throw new Error("siteId cannot be undefined or empty");
        }
        if (!isValidUUID(siteId)) {
            throw new Error("siteId should be a valid uuid");
        }
        this.siteId = siteId;
        var userId = this.storage.getUserId();
        var sessionId = this.storage.getSessionId();
        this.browser.fingerPrint(function (browserFingerprint) { return _this.ping(browserFingerprint); });
        if (!userId) {
            var generatedUserId = uuidV4();
            this.storage.setUserId(generatedUserId);
        }
        if (!sessionId) {
            var generatedSessionId = uuidV4();
            this.storage.setSessionId(generatedSessionId, { expires: 1 });
            return;
        }
    };
    Tracker.prototype.getPayload = function (action, props) {
        if (!exports.TrackerActions[action]) {
            throw new Error("ActionType " + action + " is invalid.");
        }
        var payload = {
            ContactId: this.storage.getUserId(),
            actionType: action,
            sessionId: this.storage.getSessionId(),
            siteId: this.siteId
        };
        var email = this.storage.getEmail();
        var campaignId = this.storage.getCampaignId();
        var url = this.storage.getCurrentPageUrl();
        if (email) {
            payload.ContactEmailAddress = email;
        }
        if (campaignId) {
            payload.CampaignId = campaignId;
        }
        if (props && !isEmpty(props)) {
            payload.properties = props;
        }
        if (url) {
            payload.Url = url;
        }
        return payload;
    };
    Tracker.prototype.formatProductPayload = function (product) {
        var productJson = JSON.stringify(product);
        if (!product.itemCode) {
            throw new Error("itemCode cannot be empty : " + productJson);
        }
        if (!isNumber(product.itemPrice) || !product.itemPrice) {
            product.itemPrice = 0;
            console.warn("itemPrice is missing, defaults to 0");
        }
        if (!product.itemUrl || !isUrl(product.itemUrl)) {
            product.itemUrl = this.storage.getCurrentPageUrl();
            console.warn("itemUrl is missing or invalid, defaults to current url");
        }
        if (!isNumber(product.itemQuantity) || !product.itemQuantity) {
            product.itemQuantity = 1;
            console.warn("itemQuantity is missing, defaults to 1");
        }
        if (!isNumber(product.itemTotalPrice) || !product.itemTotalPrice) {
            product.itemTotalPrice = 0;
            console.warn("itemTotalPrice is missing, defaults to 0");
        }
        if (product.itemName !== undefined && !isString(product.itemName)) {
            throw new Error("itemName type should be a string : " + productJson);
        }
        if (product.itemImage !== undefined && !isUrl(product.itemImage)) {
            throw new Error("itemImage should be a valid URL : " + productJson);
        }
        return product;
    };
    Tracker.prototype._isInitialized = function () {
        if (!this.siteId) {
            console.warn("moo: You need initialize Tracker before it can be used");
            return false;
        }
        return true;
    };
    return Tracker;
}());
exports["default"] = Tracker;
function toStr(value) {
    return Object.prototype.toString.call(value);
}
function isString(value) {
    return toStr(value) === "[object String]";
}
function isNumber(value) {
    return toStr(value) === "[object Number]" || !isNaN(parseFloat(value));
}
function isObject(value) {
    return toStr(value) === "[object Object]";
}
function isUrl(url) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
}
function isValidUUID(uuidString) {
    var validUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return validUUIDRegex.test(uuidString) || validUUIDRegex.test(uuidString.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/gi, "$1-$2-$3-$4-$5"));
}
