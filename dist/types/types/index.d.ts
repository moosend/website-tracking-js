export declare type ActionType = string;
export interface IProduct {
    itemCode?: string;
    itemPrice?: number | string;
    itemUrl?: string;
    itemQuantity?: number | string;
    itemTotalPrice?: number | string;
    itemImage?: string;
    itemName?: string;
    [key: string]: any;
}
export interface PingAPI {
    ping(browserComponents: IBrowserComponents): void;
}
export interface IdentifyAPI {
    identify(email: string, name?: string, props?: any | any[]): void;
}
export interface TrackingAPI {
    setCookieNames(cookieNames: ICookieNames): void;
    init(siteId: string, exitIntentFlag: boolean): void;
    track(action: ActionType, props?: any | any[]): void;
    trackPageView(url?: string): void;
    trackExitIntent(secondsOnPage?: number, url?: string): void;
    trackAddToOrder(itemCode: string, itemPrice: number, itemUrl: string, itemQuantity: number, itemTotal?: number, itemName?: string, itemImage?: string, props?: object): void;
    trackOrderCompleted(products: object[], totalPrice?: number): void;
}
export interface PayloadAPI {
    formatProductPayload(product: IProduct): IProduct;
    getPayload(action: ActionType, props?: any): ITrackPayload | ITrackPageViewPayload | ITrackIdentifyPayload;
}
export interface ITrackPayload {
    ContactEmailAddress?: string;
    CampaignId?: string;
    ContactId: string;
    siteId: string;
    actionType: string;
    properties?: any;
    Url?: string;
    sessionId: string;
}
export interface ITrackPageViewPayload extends ITrackPayload {
    Url: string;
}
export interface ITrackExitIntentPayload extends ITrackPayload {
    Url: string;
    SecondsOnPage: number;
}
export interface ITrackIdentifyPayload extends ITrackPayload {
    ContactName?: string;
}
export interface ITrackPingPayload extends ITrackPayload {
    BrowserComponents: IBrowserComponents;
}
export interface ITrackerAgent {
    sendTrack(payload: ITrackPayload): void;
    sendIdentify(payload: ITrackIdentifyPayload): void;
    sendPing?(payload: ITrackPingPayload): void;
}
export interface IScreenResolution {
    width: number;
    height: number;
}
export interface IBrowserComponents {
    browserHash: string;
    pixelRatio?: number;
    language?: string;
    colorDepth?: number;
    screenResolution?: IScreenResolution;
    availableResolution?: IScreenResolution;
    timeZoneOffset?: number;
    sessionStorage?: number;
    localStorage?: number;
    indexedDb?: number;
    openDatabase?: number;
    cpuClass?: string;
    navigatorPlatform?: string;
    plugins?: string[];
    canvas?: string;
    webGl?: string;
    adBlock?: boolean;
    triedToHideLanguage?: boolean;
    triedToHideResolution?: boolean;
    triedToHideOs?: boolean;
    triedToHideBrowser?: boolean;
    jsFonts?: string[];
    touchSupport?: boolean;
}
export interface IBrowser {
    fingerPrint(done: (browserComponents: IBrowserComponents) => void): void;
}
export interface ITrackerStorage {
    setCookieNames(cookieNames: ICookieProperties): void;
    getUserId(): string;
    setUserId(value: string, options?: any): void;
    getCampaignId(): string;
    setCampaignId(value: string): void;
    getEmail(): string;
    setEmail(value: string): void;
    getSessionId(): string;
    setSessionId(value: string, options?: any): void;
    getExitIntentFlag(): boolean;
    setExitIntentFlag(value: boolean): void;
    getCurrentPageUrl(): string;
}
export interface IStorage {
    getItem(key: any): any;
    setItem(key: any, value: any, options?: any): void;
    removeItem(key: string): void;
}
export interface ICookieProperties {
    userIdName: string;
    sessionIdName: string;
    emailName: string;
    exitIntentFlagName: string;
}
export interface ICookieNames extends ICookieProperties {
    getUserIdName(): string;
    setUserIdName(userIdName: string): void;
    getSessionIdName(): string;
    setSessionIdName(sessionIdName: string): void;
    getExitIntentFlagName(): string;
    setExitIntentFlagName(exitIntentFlagName: string): void;
}
