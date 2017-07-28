export declare const TrackerActions: {
    ADDED_TO_ORDER: string;
    IDENTIFY: string;
    ORDER_COMPLETED: string;
    PAGE_VIEWED: string;
    PING: string;
};
export default class Tracker implements IdentifyAPI, TrackingAPI, PingAPI, PayloadAPI {
    private siteId;
    private agent;
    private storage;
    private browser;
    constructor(agent: ITrackerAgent, storage: ITrackerStorage, browser: IBrowser);
    identify(email: string, name?: string, props?: any | any[]): void;
    track(action: ActionType, props?: [{
        product: IProduct;
    }] | any): void;
    trackPageView(url?: string): void;
    ping(browserComponents: IBrowserComponents): void;
    trackAddToOrder(itemCode: string | IProduct, itemPrice?: number | object, itemUrl?: string, itemQuantity?: number, itemTotalPrice?: number, itemName?: string, itemImage?: string, props?: object): void;
    trackOrderCompleted(products: IProduct[], totalPrice?: number): void;
    init(siteId: string): void;
    getPayload(action: ActionType, props?: any): ITrackPayload | ITrackPageViewPayload | ITrackIdentifyPayload;
    formatProductPayload(product: IProduct): IProduct;
    private _isInitialized();
}
