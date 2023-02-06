const uuidV4 = require("uuid/v4");
const isEmpty = require("lodash/isEmpty");
const isPlainObject = require("lodash/isPlainObject");
const assign = require("lodash/assign");
const isArray = require("lodash/isArray");

import * as Utilities from "../common/utils";
import { getParameterByName } from "../common/utils";

// Subscription Forms Modules
import APIRequest from "../subscription-forms/APIRequest";
const cookie = require("js-cookie");

export enum TrackerActions {
    ADDED_TO_ORDER = "ADDED_TO_ORDER", // || Basically Add to Cart
    IDENTIFY = "IDENTIFY",
    ORDER_COMPLETED = "ORDER_COMPLETED",
    PAGE_VIEWED = "PAGE_VIEWED",
    EXIT_INTENT = "EXIT_INTENT",
}

export default class Tracker implements IdentifyAPI, TrackingAPI, PayloadAPI {
    private siteId: string;
    private agent: ITrackerAgent;
    private storage: ITrackerStorage;

    private formRequest: any;

    constructor(agent: ITrackerAgent, storage: ITrackerStorage) {
        this.agent = agent;
        this.storage = storage;

        this.formRequest = new APIRequest();
    }

    public identify(email: string, name?: string, props?: any | any[]): void {
        if (!this._isInitialized()) {
            return;
        }

        let payload: ITrackIdentifyPayload;

        // IF email is falsy or is not string THEN abort
        if (!(email && Utilities.validateEmail(email))) {
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
        if (name && Utilities.isString(name)) {
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

    public track(
        action: ActionType,
        props?: [{ product: IProduct }] | any[],
    ): void {
        if (!this._isInitialized()) {
            return;
        }

        // IF action is falsy or not a string THEN abort
        if (!(action && Utilities.isString(action))) {
            return;
        }

        if (isArray(props)) {
            if (props.length && props[0].hasOwnProperty("product")) {
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

    public trackExitIntent(secondsOnPage?: number, url?: string): void {
        if (!this._isInitialized()) {
            return;
        }

        const payload: ITrackExitIntentPayload = {
            ContactId: this.storage.getUserId(),
            SecondsOnPage: secondsOnPage,
            Url: url || this.storage.getCurrentPageUrl(),
            actionType: TrackerActions.EXIT_INTENT,
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

    public trackAddToOrder(
        itemCode: string | IProduct,
        itemPrice?: number | object,
        itemUrl?: string,
        itemQuantity?: number,
        itemTotalPrice?: number,
        itemName?: string,
        itemImage?: string,
        props?: object,
    ): void {
        let payload: ITrackPayload;
        if (typeof itemCode === "object") {
            itemCode = this.formatProductPayload(itemCode);

            if (itemPrice !== undefined && !isPlainObject(itemPrice)) {
                throw new Error(
                    "props should be a plain object eg : {props: value}",
                );
            }

            let addToOrderPayload = {
                itemCode: itemCode.itemCode,
                itemPrice: itemCode.itemPrice,
                itemQuantity: itemCode.itemQuantity,
                itemTotalPrice: itemCode.itemTotalPrice,
                itemUrl: itemCode.itemUrl,
            };

            if (itemCode.itemName) {
                addToOrderPayload = assign(addToOrderPayload, {
                    itemName: itemCode.itemName,
                });
            }

            if (itemCode.itemImage) {
                addToOrderPayload = assign(addToOrderPayload, {
                    itemImage: itemCode.itemImage,
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
            console.warn(
                "itemUrl is missing or invalid, defaults to current url",
            );
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
            throw new Error(
                "props should be a plain object eg : {props: value}",
            );
        }

        let addedToOrderPayload = {
            itemCode,
            itemPrice,
            itemQuantity,
            itemTotalPrice,
            itemUrl,
        };

        if (itemName) {
            addedToOrderPayload = assign(addedToOrderPayload, { itemName });
        }

        if (itemImage) {
            addedToOrderPayload = assign(addedToOrderPayload, { itemImage });
        }

        if (!isEmpty(props)) {
            addedToOrderPayload = assign(addedToOrderPayload, props);
        }

        payload = this.getPayload(TrackerActions.ADDED_TO_ORDER, [
            { product: addedToOrderPayload },
        ]);

        this.agent.sendTrack(payload);
    }

    public trackOrderCompleted(
        products: IProduct[],
        totalPrice?: number,
    ): void {
        if (!isArray(products)) {
            throw new Error("products type should be an array");
        }

        products.map(
            (product: IProduct) =>
                (product = this.formatProductPayload(product)),
        );

        const payload: ITrackPayload = this.getPayload(
            TrackerActions.ORDER_COMPLETED,
            [{ products, totalPrice }],
        );

        this.agent.sendTrack(payload);
    }

    public setCookieNames(cookieNames: ICookieProperties): void {
        this.storage.setCookieNames(cookieNames);
    }

    public init(
        siteId: string,
        exitIntentEventFlag: boolean,
        staging?: boolean,
    ): void {
        if (!siteId) {
            throw new Error("siteId cannot be undefined or empty");
        }

        if (!Utilities.isValidUUID(siteId)) {
            throw new Error("siteId should be a valid uuid");
        }

        if (
            exitIntentEventFlag != null &&
            typeof exitIntentEventFlag !== "boolean"
        ) {
            throw new Error("exitIntentEventFlag should be a boolean");
        } else {
            this.storage.setExitIntentFlag(exitIntentEventFlag);
        }

        this.siteId = siteId;

        const email = getParameterByName("email");
        const userId = this.storage.getUserId();
        const sessionId = this.storage.getSessionId();

        if (!userId) {
            let generatedUserId = uuidV4();
            generatedUserId = generatedUserId.replace(/-/g, "");

            this.storage.setUserId(generatedUserId, { expires: 3650 });
        }

        if (!sessionId) {
            let generatedSessionId = uuidV4();
            generatedSessionId = generatedSessionId.replace(/-/g, "");

            this.storage.setSessionId(generatedSessionId, { expires: 1 });
        }

        if (email) {
            this.identify(email);
        }

        // Initiate and call subforms
        let currentUrlPath =
            `${window.location.pathname}${window.location.hash}`.split("?")[0];
        let userEmail = email ? email : this.storage.getEmail();
        let cookiesToSend = this.formRequest.getAllCookies();

        let formsUrl = staging
            ? "https://forms.moooo.co/api/forms/"
            : process.env.FORMS_API;

        process &&
            process.env &&
            process.env.FORMS_API &&
            this.formRequest.makeRequest(
                process.env.FORMS_API + this.siteId,
                this.formRequest.preparePayload(
                    this.siteId,
                    userId,
                    userEmail,
                    cookiesToSend,
                    currentUrlPath,
                ),
                this.formRequest.renderForms,
            );

        if (exitIntentEventFlag == null) {
            this.storage.setExitIntentFlag(true);
            return;
        }
    }

    public loadForm(entityId: string, staging?: boolean): void {
        // Initiate and call subforms
        let currentUrlPath =
            `${window.location.pathname}${window.location.hash}`.split("?")[0];

        const email = getParameterByName("email");
        let userEmail = email ? email : this.storage.getEmail();

        let cookiesToSend = this.formRequest.getAllCookies();

        let formsUrl = staging
            ? "https://forms.moooo.co/api/form/"
            : process.env.FORM_API;

        process &&
            process.env &&
            process.env.FORM_API &&
            this.formRequest.makeRequest(
                process.env.FORM_API + entityId,
                this.formRequest.preparePayloadForSingle(
                    entityId,
                    "",
                    userEmail,
                    cookiesToSend,
                    currentUrlPath,
                ),
                this.formRequest.renderForms,
            );
    }

    public getPayload(
        action: ActionType | any,
        props?: any[],
    ): ITrackPayload | ITrackPageViewPayload | ITrackIdentifyPayload {
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

        if (!Utilities.isNumber(product.itemPrice) || !product.itemPrice) {
            product.itemPrice = 0;
            console.warn("itemPrice is missing, defaults to 0");
        }

        if (!product.itemUrl || !Utilities.isUrl(product.itemUrl)) {
            product.itemUrl = this.storage.getCurrentPageUrl();
            console.warn(
                "itemUrl is missing or invalid, defaults to current url",
            );
        }

        if (
            !Utilities.isNumber(product.itemQuantity) ||
            !product.itemQuantity
        ) {
            product.itemQuantity = 1;
            console.warn("itemQuantity is missing, defaults to 1");
        }

        if (
            !Utilities.isNumber(product.itemTotalPrice) ||
            !product.itemTotalPrice
        ) {
            product.itemTotalPrice = 0;
            console.warn("itemTotalPrice is missing, defaults to 0");
        }

        if (
            product.itemName !== undefined &&
            !Utilities.isString(product.itemName)
        ) {
            throw new Error(
                "itemName type should be a string : " + productJson,
            );
        }

        if (
            product.itemImage !== undefined &&
            !Utilities.isUrl(product.itemImage)
        ) {
            throw new Error("itemImage should be a valid URL : " + productJson);
        }

        return product;
    }

    private _isInitialized(): boolean {
        if (!this.siteId) {
            console.warn(
                "moo: You need initialize Tracker before it can be used",
            );
            return false;
        }

        return true;
    }
}
