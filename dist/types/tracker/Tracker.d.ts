import { ActionType, IBrowser, IBrowserComponents, ICookieProperties, IdentifyAPI, IProduct, ITrackerAgent, ITrackerStorage, ITrackIdentifyPayload, ITrackPageViewPayload, ITrackPayload, PayloadAPI, PingAPI, TrackingAPI } from "../types";
export default class TrackerMethods implements IdentifyAPI, TrackingAPI, PingAPI, PayloadAPI {
    private siteId;
    private agent;
    private storage;
    private browser;
    constructor(agent: ITrackerAgent, storage: ITrackerStorage, browser: IBrowser);
    identify(email: string, name?: string, props?: any | any[]): void;
    track(action: ActionType, props?: [{
        product: IProduct;
    }] | any[]): void;
    trackPageView(url?: string): void;
    trackExitIntent(secondsOnPage?: number, url?: string): void;
    ping(browserComponents: IBrowserComponents): void;
    trackAddToOrder(itemCode: string | IProduct, itemPrice?: number | any, itemUrl?: string, itemQuantity?: number, itemTotalPrice?: number, itemName?: string, itemImage?: string, props?: object): void;
    trackOrderCompleted(products: IProduct[], totalPrice?: number): void;
    setCookieNames(cookieNames: ICookieProperties): void;
    init(siteId: string, exitIntentEventFlag: boolean): void;
    getPayload(action: ActionType | any, props?: any[]): ITrackPayload | ITrackPageViewPayload | ITrackIdentifyPayload;
    formatProductPayload(product: IProduct): IProduct;
    private _isInitialized;
}
