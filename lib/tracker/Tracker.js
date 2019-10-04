"use strict";
exports.__esModule = true;
var uuidV4 = require("uuid/v4");
var isEmpty = require("lodash/isEmpty");
var isPlainObject = require("lodash/isPlainObject");
var assign = require("lodash/assign");
var isArray = require("lodash/isArray");
var Utilities = require("../common/utils");
var utils_1 = require("../common/utils");
var TrackerActions;
(function (TrackerActions) {
    TrackerActions["ADDED_TO_ORDER"] = "ADDED_TO_ORDER";
    TrackerActions["IDENTIFY"] = "IDENTIFY";
    TrackerActions["ORDER_COMPLETED"] = "ORDER_COMPLETED";
    TrackerActions["PAGE_VIEWED"] = "PAGE_VIEWED";
    TrackerActions["EXIT_INTENT"] = "EXIT_INTENT";
    TrackerActions["PING"] = "PING";
})(TrackerActions = exports.TrackerActions || (exports.TrackerActions = {}));
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
        if (!(email && Utilities.validateEmail(email))) {
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
            actionType: TrackerActions.IDENTIFY,
            sessionId: sessionId,
            siteId: siteId
        };
        if (name && Utilities.isString(name)) {
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
        if (!(action && Utilities.isString(action))) {
            return;
        }
        if (isArray(props)) {
            if (props.length && props[0].hasOwnProperty("product")) {
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
            actionType: TrackerActions.PAGE_VIEWED,
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
    Tracker.prototype.trackExitIntent = function (secondsOnPage, url) {
        if (!this._isInitialized()) {
            return;
        }
        var payload = {
            ContactId: this.storage.getUserId(),
            SecondsOnPage: secondsOnPage,
            Url: url || this.storage.getCurrentPageUrl(),
            actionType: TrackerActions.EXIT_INTENT,
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
            actionType: TrackerActions.PING,
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
            var addToOrderPayload = {
                itemCode: itemCode.itemCode,
                itemPrice: itemCode.itemPrice,
                itemQuantity: itemCode.itemQuantity,
                itemTotalPrice: itemCode.itemTotalPrice,
                itemUrl: itemCode.itemUrl
            };
            if (itemCode.itemName) {
                addToOrderPayload = assign(addToOrderPayload, {
                    itemName: itemCode.itemName
                });
            }
            if (itemCode.itemImage) {
                addToOrderPayload = assign(addToOrderPayload, {
                    itemImage: itemCode.itemImage
                });
            }
            if (!isEmpty(itemPrice)) {
                addToOrderPayload = assign(addToOrderPayload, itemPrice);
            }
            payload = this.getPayload(TrackerActions.ADDED_TO_ORDER, [
                { product: addToOrderPayload },
            ]);
            this.agent.sendTrack(payload);
            return;
        }
        if (!itemCode) {
            throw new Error("itemCode cannot be empty");
        }
        if (!Utilities.isNumber(itemPrice) || !itemPrice) {
            itemPrice = 0;
            console.warn("itemPrice is missing, defaults to 0");
        }
        if (!itemUrl || !Utilities.isUrl(itemUrl)) {
            itemUrl = this.storage.getCurrentPageUrl();
            console.warn("itemUrl is missing or invalid, defaults to current url");
        }
        if (!Utilities.isNumber(itemQuantity) || !itemQuantity) {
            itemQuantity = 1;
            console.warn("itemQuantity is missing, defaults to 1");
        }
        if (!Utilities.isNumber(itemTotalPrice) || !itemTotalPrice) {
            itemTotalPrice = 0;
            console.warn("itemTotalPrice is missing, defaults to 0");
        }
        if (itemImage !== undefined && !Utilities.isUrl(itemImage)) {
            throw new Error("itemImage should be a valid url");
        }
        if (props !== undefined && !isPlainObject(props)) {
            throw new Error("props should be a plain object eg : {props: value}");
        }
        var addedToOrderPayload = {
            itemCode: itemCode,
            itemPrice: itemPrice,
            itemQuantity: itemQuantity,
            itemTotalPrice: itemTotalPrice,
            itemUrl: itemUrl
        };
        if (itemName) {
            addedToOrderPayload = assign(addedToOrderPayload, { itemName: itemName });
        }
        if (itemImage) {
            addedToOrderPayload = assign(addedToOrderPayload, { itemImage: itemImage });
        }
        if (!isEmpty(props)) {
            addedToOrderPayload = assign(addedToOrderPayload, props);
        }
        payload = this.getPayload(TrackerActions.ADDED_TO_ORDER, [
            { product: addedToOrderPayload },
        ]);
        this.agent.sendTrack(payload);
    };
    Tracker.prototype.trackOrderCompleted = function (products, totalPrice) {
        var _this = this;
        if (!isArray(products)) {
            throw new Error("products type should be an array");
        }
        products.map(function (product) {
            return (product = _this.formatProductPayload(product));
        });
        var payload = this.getPayload(TrackerActions.ORDER_COMPLETED, [{ products: products, totalPrice: totalPrice }]);
        this.agent.sendTrack(payload);
    };
    Tracker.prototype.setCookieNames = function (cookieNames) {
        this.storage.setCookieNames(cookieNames);
    };
    Tracker.prototype.init = function (siteId, exitIntentEventFlag) {
        var _this = this;
        if (!siteId) {
            throw new Error("siteId cannot be undefined or empty");
        }
        if (!Utilities.isValidUUID(siteId)) {
            throw new Error("siteId should be a valid uuid");
        }
        if (exitIntentEventFlag != null && typeof exitIntentEventFlag !== "boolean") {
            throw new Error("exitIntentEventFlag should be a boolean");
        }
        else {
            this.storage.setExitIntentFlag(exitIntentEventFlag);
        }
        this.siteId = siteId;
        var email = utils_1.getParameterByName("email");
        var userId = this.storage.getUserId();
        var sessionId = this.storage.getSessionId();
        this.browser.fingerPrint(function (browserFingerprint) {
            return _this.ping(browserFingerprint);
        });
        if (!userId) {
            var generatedUserId = uuidV4();
            generatedUserId = generatedUserId.replace(/-/g, "");
            this.storage.setUserId(generatedUserId, { expires: 3650 });
        }
        if (!sessionId) {
            var generatedSessionId = uuidV4();
            generatedSessionId = generatedSessionId.replace(/-/g, "");
            this.storage.setSessionId(generatedSessionId, { expires: 1 });
        }
        if (email) {
            this.identify(email);
        }
        if (exitIntentEventFlag == null) {
            this.storage.setExitIntentFlag(true);
            return;
        }
    };
    Tracker.prototype.getPayload = function (action, props) {
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
        if (!Utilities.isNumber(product.itemPrice) || !product.itemPrice) {
            product.itemPrice = 0;
            console.warn("itemPrice is missing, defaults to 0");
        }
        if (!product.itemUrl || !Utilities.isUrl(product.itemUrl)) {
            product.itemUrl = this.storage.getCurrentPageUrl();
            console.warn("itemUrl is missing or invalid, defaults to current url");
        }
        if (!Utilities.isNumber(product.itemQuantity) || !product.itemQuantity) {
            product.itemQuantity = 1;
            console.warn("itemQuantity is missing, defaults to 1");
        }
        if (!Utilities.isNumber(product.itemTotalPrice) || !product.itemTotalPrice) {
            product.itemTotalPrice = 0;
            console.warn("itemTotalPrice is missing, defaults to 0");
        }
        if (product.itemName !== undefined && !Utilities.isString(product.itemName)) {
            throw new Error("itemName type should be a string : " + productJson);
        }
        if (product.itemImage !== undefined && !Utilities.isUrl(product.itemImage)) {
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
