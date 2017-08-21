const uuidV4 = require("uuid/v4");
const isEmpty = require("lodash/isEmpty");
const isPlainObject = require("lodash/isPlainObject");
const assign = require("lodash/assign");
const isArray = require("lodash/isArray");

export const TrackerActions = {
    ADDED_TO_ORDER: "ADDED_TO_ORDER", // || Basically Add to Cart
    IDENTIFY: "IDENTIFY",
    ORDER_COMPLETED: "ORDER_COMPLETED",
    PAGE_VIEWED: "PAGE_VIEWED",
    PING: "PING",
};

export default class Tracker implements IdentifyAPI, TrackingAPI, PingAPI, PayloadAPI {

    private siteId: string;
    private agent: ITrackerAgent;
    private storage: ITrackerStorage;
    private browser: IBrowser;

    constructor(agent: ITrackerAgent, storage: ITrackerStorage, browser: IBrowser) {
        this.agent = agent;
        this.storage = storage;
        this.browser = browser;
    }

    public identify(email: string, name?: string, props?: any|any[]): void {

        if (!this._isInitialized()) {
            return;
        }

        let payload: ITrackIdentifyPayload;

        // IF email is falsy or is not string THEN abort
        if (!(email && isString(email))) {
            throw new Error("email cannot be undefined or empty");
        }

        // IF email is already in storage and has the same value THEN abort
        if (this.storage.getEmail() === email) {
            return;
        }

        this.storage.setEmail(email);

        const siteId = this.siteId;
        const campaignId = this.storage.getCampaignId();
        const sessionId = this.storage.getSessionId();
        const ContactId = this.storage.getUserId();

        payload = {
            ContactEmailAddress: email,
            ContactId,
            actionType: TrackerActions.IDENTIFY,
            sessionId,
            siteId,
        };

        // IF name is string THEN add it to payload
        if (name && isString(name)) {
            payload.ContactName = name;
        }

        if (campaignId) {
            payload.CampaignId = campaignId;
        }

        if (props && !isEmpty(props)) {
            payload.properties = props;
        }

        /**
         * the JSON is enhanced from the library with the id captured for the user and the number of sessions.
         */
        this.agent.sendIdentify(payload);
    }

    public track(action: ActionType, props?: [{ product: IProduct }] | any): void {

        if (!this._isInitialized()) {
            return;
        }

        // IF action is falsy or not a string THEN abort
        if (!(action && isString(action))) {
            return;
        }

        if (isArray(props)) {
            if (props[0].hasOwnProperty("product")) {
                let { product } = props[0];
                product = this.formatProductPayload(product);
            }
        }

        const payload: ITrackPayload = this.getPayload(action, props);

        this.agent.sendTrack(payload);
    }

    public trackPageView(url?: string): void {

        if (!this._isInitialized()) {
            return;
        }

        const payload: ITrackPageViewPayload = {
            ContactId: this.storage.getUserId(),
            Url: url || this.storage.getCurrentPageUrl(),
            actionType: TrackerActions.PAGE_VIEWED,
            sessionId: this.storage.getSessionId(),
            siteId: this.siteId,
        };

        const email = this.storage.getEmail();
        const campaignId = this.storage.getCampaignId();

        if (email) {
            payload.ContactEmailAddress = email;
        }

        if (campaignId) {
            payload.CampaignId = campaignId;
        }

        this.agent.sendTrack(payload);
    }

    public ping(browserComponents: IBrowserComponents): void {

        if (!this._isInitialized()) {
            return;
        }

        const payload: ITrackPingPayload = {
            BrowserComponents: browserComponents,
            ContactId: this.storage.getUserId(),
            actionType: TrackerActions.PING,
            sessionId: this.storage.getSessionId(),
            siteId: this.siteId,
        };

        const email = this.storage.getEmail();
        const campaignId = this.storage.getCampaignId();

        if (email) {
            payload.ContactEmailAddress = email;
        }

        if (campaignId) {
            payload.CampaignId = campaignId;
        }

        this.agent.sendPing(payload);
    }

    public trackAddToOrder(itemCode: string | IProduct, itemPrice?: number | object, itemUrl?: string, itemQuantity?: number, itemTotalPrice?: number, itemName?: string, itemImage?: string, props?: object): void {
        let payload: ITrackPayload;
        if (typeof itemCode === "object") {

            itemCode = this.formatProductPayload(itemCode);

            if (itemPrice !== undefined && !isPlainObject(itemPrice)) {
                throw new Error("props should be a plain object eg : {props: value}");
            }

            let addToOrderPayload = { itemCode: itemCode.itemCode, itemPrice: itemCode.itemPrice, itemUrl: itemCode.itemUrl, itemQuantity: itemCode.itemQuantity, itemTotalPrice: itemCode.itemTotalPrice };

            if (itemCode.itemName) {

                addToOrderPayload = assign(addToOrderPayload, { itemName: itemCode.itemName });
            }

            if (itemCode.itemImage) {

                addToOrderPayload = assign(addToOrderPayload, { itemImage: itemCode.itemImage });
            }

            if (!isEmpty(itemPrice)) {

                addToOrderPayload = assign(addToOrderPayload, itemPrice);
            }

            payload = this.getPayload(TrackerActions.ADDED_TO_ORDER, [{ product: addToOrderPayload }]);

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

        let addedToOrderPayload = { itemCode, itemPrice, itemUrl, itemQuantity, itemTotalPrice };

        if (itemName) {

            addedToOrderPayload = assign(addedToOrderPayload, { itemName });
        }

        if (itemImage) {

            addedToOrderPayload = assign(addedToOrderPayload, { itemImage });
        }

        if (!isEmpty(props)) {

            addedToOrderPayload = assign(addedToOrderPayload, props);
        }

        payload = this.getPayload(TrackerActions.ADDED_TO_ORDER, [{ product: addedToOrderPayload }]);

        this.agent.sendTrack(payload);
    }

    public trackOrderCompleted(products: IProduct[], totalPrice?: number): void {

        if (!isArray(products)) {
            throw new Error("products type should be an array");
        }

        products.map((product: IProduct) => product = this.formatProductPayload(product));

        const payload: ITrackPayload = this.getPayload(TrackerActions.ORDER_COMPLETED, [{ products, totalPrice }]);

        this.agent.sendTrack(payload);
    }

    public init(siteId: string) {

        if (!siteId) {
            throw new Error("siteId cannot be undefined or empty");
        }

        if (!isValidUUID(siteId)) {
            throw new Error("siteId should be a valid uuid");
        }

        this.siteId = siteId;

        const userId = this.storage.getUserId();
        const sessionId = this.storage.getSessionId();

        this.browser.fingerPrint((browserFingerprint: IBrowserComponents) => this.ping(browserFingerprint));

        if (!userId) {
            let generatedUserId = uuidV4();
            generatedUserId = generatedUserId.replace(/-/g, "");

            this.storage.setUserId(generatedUserId, { expires: 3650 });
        }
        if (!sessionId) {
            let generatedSessionId = uuidV4();
            generatedSessionId = generatedSessionId.replace(/-/g, "");

            this.storage.setSessionId(generatedSessionId, { expires: 1 });
            return;
        }
    }

    public getPayload(action: ActionType, props?: any): ITrackPayload | ITrackPageViewPayload | ITrackIdentifyPayload {
        if (!TrackerActions[action]) {
            throw new Error(`ActionType ${action} is invalid. Supported ActionTypes are PING, IDENTIFY, PAGE_VIEWED, ADDED_TO_ORDER, ORDER_COMPLETED`);
        }

        const payload: ITrackPayload = {
            ContactId: this.storage.getUserId(),
            actionType: action,
            sessionId: this.storage.getSessionId(),
            siteId: this.siteId,
        };

        const email = this.storage.getEmail();
        const campaignId = this.storage.getCampaignId();
        const url = this.storage.getCurrentPageUrl();

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
    }

    public formatProductPayload(product: IProduct): IProduct {
        const productJson = JSON.stringify(product);

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
    }

    private _isInitialized() {

        if (!this.siteId) {
            console.warn("moo: You need initialize Tracker before it can be used");
            return false;
        }

        return true;
    }
}

/**
 * HELPERS
 */
function toStr(value: any) {
    return Object.prototype.toString.call(value);
}

/**
 * Check whether value is of type String
 * @param {any} value
 * @returns {boolean}
 */
function isString(value: any): boolean {
    return toStr(value) === "[object String]";
}

/**
 * Check whether value is of type String
 * @param {any} value
 * @returns {boolean}
 */
function isNumber(value: any): boolean {
    return toStr(value) === "[object Number]" || !isNaN(parseFloat(value));
}

/**
 * Check whether value is of type Object
 * @param {any} value
 * @returns {boolean}
 */
function isObject(value: any): boolean {
    return toStr(value) === "[object Object]";
}

/**
 * Check whether value is a valid URL
 * @param {any} string
 * @returns {boolean}
 */
function isUrl(url: string): boolean {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
}

// function allPropsAreScalar(obj: any): boolean {
//     let keys = Object.keys(obj);

//     for (let i = 0; i < keys.length; i++) {
//         const val = obj[keys[i]];
//         const isAllowedScalar = isNumber(val) || isString(val);

//         if (!isAllowedScalar) {
//             return false;
//         }
//     }

//     return true;
// }

/**
 * Check whether string is valid with or without dashes
 * @param {string} string
 * @returns {boolean}
 */
function isValidUUID(uuidString: string) {

    const validUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return validUUIDRegex.test(uuidString) || validUUIDRegex.test(uuidString.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/gi, "$1-$2-$3-$4-$5"));

}
