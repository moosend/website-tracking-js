declare type ActionType = string;

interface IProduct {
    itemCode?: string;
    itemPrice?: number | string;
    itemUrl?: string;
    itemQuantity?: number | string;
    itemTotalPrice?: number | string;
    itemImage?: string;
    itemName?: string;
    [key: string]: any;
}

interface PingAPI {
    ping(browserComponents: IBrowserComponents): void;
}

interface IdentifyAPI {
    identify(email: string, name?: string, props?: any|any[]): void;
}

interface TrackingAPI {
    setCookieNames(cookieNames: ICookieNames): void;
    init(siteId: string, exitIntentFlag: boolean): void;
    /**
     *  Send action track info
     *  @description Makes a POST to http://requestb.in/15t3ics1
     */
    track(action: ActionType, props?: any|any[]): void;

    /**
     *  Sends current page info
     */

    trackPageView(url?: string): void;

    trackExitIntent(secondsOnPage?: number, url?: string): void;

    trackAddToOrder(itemCode: string, itemPrice: number, itemUrl: string, itemQuantity: number, itemTotal?: number, itemName?: string, itemImage?: string, props?: Object): void;

    trackOrderCompleted(products: Array<Object>, totalPrice?: number): void;
}

interface PayloadAPI {
    formatProductPayload(product: IProduct): IProduct;

    getPayload(action: ActionType, props?: any): ITrackPayload | ITrackPageViewPayload | ITrackIdentifyPayload;
}


interface ITrackPayload {
    ContactEmailAddress?: string;
    CampaignId?: string;
    MemberId?: string;
    ContactId: string;
    siteId: string;
    actionType: string;
    properties?: any;
    Url?: string;
    sessionId: string;
}

interface ITrackPageViewPayload extends ITrackPayload {
    Url: string;
}

interface ITrackExitIntentPayload extends ITrackPayload {
    Url: string;
    SecondsOnPage: number;
}

interface ITrackIdentifyPayload extends ITrackPayload {
    ContactName?: string;
}

interface ITrackPingPayload extends ITrackPayload {
    BrowserComponents: IBrowserComponents;
}

interface ITrackerAgent {
    sendTrack(payload: ITrackPayload): void;

    sendIdentify(payload: ITrackIdentifyPayload): void;

    sendPing?(payload: ITrackPingPayload): void;
}

interface IScreenResolution {
    width: number;
    height: number;
}

interface IBrowserComponents {
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
    adBlock?: boolean;
    triedToHideLanguage?: boolean;
    triedToHideResolution?: boolean;
    triedToHideOs?: boolean;
    triedToHideBrowser?: boolean;
    jsFonts?: string[];
    touchSupport?: boolean;
}

interface IBrowser {
    fingerPrint(done: (browserComponents: IBrowserComponents) => void): void;
}

/**
 * Tracker specific storage API
 */
interface ITrackerStorage {
    setCookieNames(cookieNames: ICookieProperties): void;

    getUserId(): string;
    setUserId(value: string, options?: any): void;

    getCampaignId(): string;
    setCampaignId(value: string): void;

    getMemberId(): string;
    setMemberId(value: string): void;

    getEmail(): string;
    setEmail(value: string): void;

    getSessionId(): string;
    setSessionId(value: string, options?: any): void;

    getExitIntentFlag(): boolean;
    setExitIntentFlag(value: boolean): void;

    getCurrentPageUrl(): string;
}

/**
 * Plain Key/Value storage APi
 */
interface IStorage {
    getItem(key: any): any;
    setItem(key: any, value: any, options?: any): void;
    removeItem(key: string): void;
}

interface ICookieProperties {
    userIdName: string;
    sessionIdName: string;
    emailName: string;
    exitIntentFlagName: string;
    campaignIdName: string;
    memberIdName: string;
}

interface ICookieNames extends ICookieProperties {
    getUserIdName(): string;
    setUserIdName(userIdName: string): void;
    getSessionIdName(): string;
    setSessionIdName(sessionIdName: string): void;
    getExitIntentFlagName(): string;
    setExitIntentFlagName(exitIntentFlagName: string): void;
    getCampaignIdName(): string;
    setCampaignIdName(campaignIdName: string): void;
    getMemberIdName(): string;
    setMemberIdName(memberIdName: string): void;
}

interface Window { XDomainRequest: any; XMLHttpRequest: any;
}

/**
 *  Declare globals
 */
declare var _ENV_: string;
declare var API_URL: string;
declare var window: Window;
declare var XDomainRequest: any;