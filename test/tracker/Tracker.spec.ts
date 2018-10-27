import Browser from '../../src/browser';
import Tracker from "../../src/tracker/Tracker";
import TrackerActions from "../../src/tracker/TrackerActions";
import TrackerAgent from '../../src/tracker/TrackerAgent';
import TrackerStorage from '../../src/tracker/TrackerStorage';
jest.mock('../../src/tracker/TrackerAgent');
jest.mock('../../src/tracker/TrackerStorage');
jest.mock('../../src/browser/Browser');

describe('Tracker', () => {
    let tAgent: any;
    let tStorage: any;
    let tBrowser: any;

    beforeEach(() => {
        tAgent = new TrackerAgent();
        tStorage = new TrackerStorage({} as any);
        tBrowser = new Browser();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    test("Tracker Initialisation", () => {
        expect.assertions(6);
        
        const tracker = new Tracker(tAgent, tStorage, tBrowser);
        tracker.init("f245124e-8f61-4277-a089-8d233bc99491", false);

        expect(tStorage.getSessionId).toHaveBeenCalledTimes(1);
        expect(tStorage.getUserId).toHaveBeenCalledTimes(1);
        expect(tStorage.setSessionId).toHaveBeenCalledTimes(1);
        expect(tStorage.setUserId).toHaveBeenCalledTimes(1);
        expect(tStorage.setExitIntentFlag).toHaveBeenCalledTimes(1);
        expect(tBrowser.fingerPrint).toHaveBeenCalledTimes(1);
    });

    test("Tracker initialization which has siteId without dashes", () => {
        expect.assertions(6);

        const tracker = new Tracker(tAgent, tStorage, tBrowser);
        tracker.init("f245124e8f614277a0898d233bc99491", false);

        expect(tStorage.getSessionId).toHaveBeenCalledTimes(1);
        expect(tStorage.getUserId).toHaveBeenCalledTimes(1);
        expect(tStorage.setSessionId).toHaveBeenCalledTimes(1);
        expect(tStorage.setUserId).toHaveBeenCalledTimes(1);
        expect(tStorage.setExitIntentFlag).toHaveBeenCalledTimes(1);
        expect(tBrowser.fingerPrint).toHaveBeenCalledTimes(1);
    });

    test("Tracker initialization should throw error if siteId has invalid UUID", () => {
        expect.assertions(1);

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        expect(() => {
            tracker.init('123', false);
        }).toThrowError(/siteId should be a valid uuid/);
    });

    test("Tracker Identify API", () => {
        expect.assertions(5);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
        const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
        const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
        const ContactEmailAddress = "john.doe@mail.com";
        const sessionId = "f245124e8f614277a0898d233bc99494";

        (tStorage.getCampaignId as any).mockReturnValue(CampaignId);
        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init(siteId, false);
        tracker.identify(ContactEmailAddress);

        expect(tStorage.getCampaignId).toHaveBeenCalledTimes(1);
        expect(tStorage.getSessionId).toHaveBeenCalledTimes(2);
        expect(tStorage.getUserId).toHaveBeenCalledTimes(2);
        expect(tAgent.sendIdentify).toHaveBeenCalledTimes(1);
        expect(tAgent.sendIdentify).toHaveBeenCalledWith({
            CampaignId,
            ContactEmailAddress,
            ContactId,
            actionType: TrackerActions.IDENTIFY,
            sessionId,
            siteId
        });
    });

    test("Tracker Track getPayload", () => {
        expect.assertions(5);

        jest.spyOn(Tracker.prototype, 'getPayload');
        
        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init("f245124e-8f61-4277-a089-8d233bc99491", false);
        tracker.track(TrackerActions.PAGE_VIEWED, [{ status: "completed" }]);

        expect(tStorage.getUserId).toHaveBeenCalledTimes(2);
        expect(tStorage.getEmail).toHaveBeenCalledTimes(1);
        
        expect(tAgent.sendTrack).toHaveBeenCalledTimes(1);
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expect.objectContaining({
            properties: expect.arrayContaining([
                {
                    status: 'completed'
                }
            ])
        }));
        
        expect(tracker.getPayload).toHaveBeenCalledTimes(1);
    });

    test("Tracker Track with Different ActionType", () => {
        expect.assertions(3);

        jest.spyOn(Tracker.prototype, 'getPayload');
        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init("f245124e-8f61-4277-a089-8d233bc99491", false);
        tracker.track("DIFFERENT_ACTION_TYPE", [{ status: "completed" }]);

        expect(tStorage.getUserId).toHaveBeenCalledTimes(2);
        expect(tStorage.getEmail).toHaveBeenCalledTimes(1);
        expect(tracker.getPayload).toHaveBeenCalledTimes(1);
    });

    test("Tracker Track API", () => {
        expect.assertions(3);
        
        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init("f245124e-8f61-4277-a089-8d233bc99491", false);
        tracker.track(TrackerActions.PAGE_VIEWED, [{ status: "completed" }]);

        expect(tStorage.getUserId).toHaveBeenCalledTimes(2);
        expect(tStorage.getEmail).toHaveBeenCalledTimes(1);
        expect(tAgent.sendTrack).toHaveBeenCalledTimes(1);
    });

    test("Tracker Track Product View", () => {
        expect.assertions(2);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
        const ContactId = "f245124e8f614277a089-8d233bc99492";
        const CampaignId = "f245124e-8f614277a089-8d233bc99493";
        const sessionId = "f245124e8f614277a0898d233bc99494";

        const itemCode = "101";
        const itemPrice = 12.02;
        const itemUrl = "http://YOUR_SOTRE/product-101";
        const itemQuantity = 1;
        const itemTotalPrice = 14.22; // the price might come up when applying taxes or if quantity is greater than 1
        const itemName = "A very cool product";
        const itemImage = "http://YOUR_SOTRE/product-color-blue.jpg";
        const extraProps = { color: "Red", size: "XXL" };

        (tStorage.getCampaignId as any).mockReturnValue(CampaignId);
        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        jest.spyOn(Tracker.prototype, 'formatProductPayload');
        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init(siteId, false);
        tracker.track(TrackerActions.PAGE_VIEWED, [
            {
                product: {
                    color: extraProps.color,
                    itemCode,
                    itemImage,
                    itemName,
                    itemPrice,
                    itemQuantity,
                    itemTotalPrice,
                    itemUrl,
                    size: extraProps.size,
                },
            },
        ]);

        const expectedPayload = {
            CampaignId,
            ContactId,

            actionType: TrackerActions.PAGE_VIEWED,
            properties: [{
                product: {
                    color: extraProps.color,
                    itemCode,
                    itemImage,
                    itemName,
                    itemPrice,
                    itemQuantity,
                    itemTotalPrice,
                    itemUrl,
                    size: extraProps.size,
                },
            }],
            sessionId,
            siteId,
        };
        
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expectedPayload);
        expect(tracker.formatProductPayload).toHaveBeenCalledTimes(1);
    });

    test("Tracker Track Product View with Default Values", () => {
        expect.assertions(3);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
        const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
        const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
        const sessionId = "f245124e8f614277a0898d233bc99494";

        const itemCode = "101";
        const itemUrl = "http://YOUR_SOTRE/product-101";
        const itemName = "A very cool product";
        const itemImage = "http://YOUR_SOTRE/product-color-blue.jpg";
        const extraProps = { color: "Red", size: "XXL" };

        (tStorage.getCampaignId as any).mockReturnValue(CampaignId);
        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        jest.spyOn(Tracker.prototype, 'formatProductPayload');
        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init(siteId, false);
        tracker.track(TrackerActions.PAGE_VIEWED, [
            {
                product: {
                    color: extraProps.color,
                    itemCode,
                    itemImage,
                    itemName,
                    itemUrl,
                    size: extraProps.size,
                },
            },
        ]);

        const expectedPayload = {
            CampaignId,
            ContactId,

            actionType: TrackerActions.PAGE_VIEWED,
            properties: [{
                product: {
                    color: extraProps.color,
                    itemCode,
                    itemImage,
                    itemName,
                    itemPrice: 0,
                    itemQuantity: 1,
                    itemTotalPrice: 0,
                    itemUrl,
                    size: extraProps.size,
                },
            }],
            sessionId,
            siteId,
        };

        expect(tracker.formatProductPayload).toHaveBeenCalledTimes(1);
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expectedPayload);
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expect.objectContaining({
            properties: expect.arrayContaining([
                expect.objectContaining({
                    product: expect.objectContaining({
                        itemPrice: 0,
                        itemQuantity: 1,
                        itemTotalPrice: 0
                    })
                })
            ])
        }));
    });

    test("Tracker trackExitIntent API", () => {
        expect.assertions(2);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
        const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
        const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
        const sessionId = "f245124e8f614277a0898d233bc99494";
        const url = "https://someurl.com";
        const secondsOnPage = 30;
        
        (tStorage.getCampaignId as any).mockReturnValue(CampaignId);
        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init(siteId, true);
        tracker.trackExitIntent(secondsOnPage, url);

        const expectedPayload = {
            CampaignId,
            ContactId,
            SecondsOnPage: secondsOnPage,
            Url: url,
            actionType: TrackerActions.EXIT_INTENT,
            sessionId,
            siteId
        };

        expect(tAgent.sendTrack).toHaveBeenCalledTimes(1);
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expectedPayload);
    });

    test("Tracker trackPageView API", () => {
        expect.assertions(2);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
        const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
        const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
        const sessionId = "f245124e8f614277a0898d233bc99494";
        const url = "https://someurl.com";

        (tStorage.getCampaignId as any).mockReturnValue(CampaignId);
        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init(siteId, false);
        tracker.trackPageView(url);

        const expectedPayload = {
            CampaignId,
            ContactId,
            Url: url,
            actionType: TrackerActions.PAGE_VIEWED,
            sessionId,
            siteId,
        };

        expect(tAgent.sendTrack).toHaveBeenCalledTimes(1);
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expectedPayload);
    });

    test("Tracker trackAddToOrder API", () => {
        expect.assertions(2);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
        const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
        const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
        const sessionId = "f245124e8f614277a0898d233bc99494";

        const itemCode = "Product-101";
        const itemPrice = 12.02;
        const itemUrl = "http://YOUR_SOTRE/product-101";
        const itemQuantity = 1;
        const itemTotalPrice = 14.22; // the price might come up when applying taxes or if quantity is greater than 1
        const itemName = "A very cool product";
        const itemImage = "http://YOUR_SOTRE/product-color-blue.jpg";
        const extraProps = { color: "Red", size: "XXL" };

        (tStorage.getCampaignId as any).mockReturnValue(CampaignId);
        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init(siteId, false);
        tracker.trackAddToOrder(itemCode, itemPrice, itemUrl, itemQuantity, itemTotalPrice, itemName, itemImage, extraProps);

        const expectedPayload = {
            CampaignId,
            ContactId,
            actionType: "ADDED_TO_ORDER",
            properties: [{
                product: {
                    color: extraProps.color,
                    itemCode,
                    itemImage,
                    itemName,
                    itemPrice,
                    itemQuantity,
                    itemTotalPrice,
                    itemUrl,
                    size: extraProps.size,
                },
            }],
            sessionId,
            siteId,
        };

        expect(tAgent.sendTrack).toHaveBeenCalledTimes(1);
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expectedPayload);
    });

    test("Tracker trackAddToOrder API with 2 parameters (product and extraProps only)", () => {
        expect.assertions(2);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
        const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
        const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
        const sessionId = "f245124e8f614277a0898d233bc99494";

        const productInfo = {
            extraProps: { color: "Red", size: "XXL" },
            itemCode: "Product-101",
            itemImage: "http://YOUR_SOTRE/product-color-blue.jpg",
            itemName: "A very cool product",
            itemPrice: 12.02,
            itemQuantity: 1,
            itemTotalPrice: 14.22,
            itemUrl: "http://YOUR_SOTRE/product-101",
        };

        const itemCode = "Product-101";
        const itemPrice = 12.02;
        const itemUrl = "http://YOUR_SOTRE/product-101";
        const itemQuantity = 1;
        const itemTotalPrice = 14.22; // the price might come up when applying taxes or if quantity is greater than 1
        const itemName = "A very cool product";
        const itemImage = "http://YOUR_SOTRE/product-color-blue.jpg";
        const extraProps = { color: "Red", size: "XXL" };

        (tStorage.getCampaignId as any).mockReturnValue(CampaignId);
        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init(siteId, false);
        tracker.trackAddToOrder(productInfo, extraProps);

        const expectedPayload = {
            CampaignId,
            ContactId,
            actionType: "ADDED_TO_ORDER",
            properties: [{
                product: {
                    color: extraProps.color,
                    itemCode,
                    itemImage,
                    itemName,
                    itemPrice,
                    itemQuantity,
                    itemTotalPrice,
                    itemUrl,
                    size: extraProps.size,
                },
            }],
            sessionId,
            siteId,
        };

        expect(tAgent.sendTrack).toHaveBeenCalledTimes(1);
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expectedPayload);
    });

    test("trackAddToOrder test default values with 2 parameters (product and extraProps only)", () => {
        expect.assertions(2);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
        const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
        const sessionId = "f245124e8f614277a0898d233bc99494";

        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        const product = {
            itemCode: "item-101",
            itemName: "A simple product",
            itemUrl: "https://www.google.com",
        };

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init(siteId, false);
        tracker.trackAddToOrder(product);

        expect(tAgent.sendTrack).toHaveBeenCalledTimes(1);
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expect.objectContaining({
            properties: expect.arrayContaining([
                {
                    product: expect.objectContaining({
                        itemPrice: 0,
                        itemQuantity: 1,
                        itemTotalPrice: 0
                    })
                }
            ])
        }));
    });

    test("trackAddToOrder test default values", () => {
        expect.assertions(2);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
        const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
        const sessionId = "f245124e8f614277a0898d233bc99494";

        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        const product = {
            itemCode: "item-101",
            itemName: "A simple product",
            itemUrl: "https://www.google.com",
        };

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init(siteId, false);
        tracker.trackAddToOrder(product.itemCode, null, product.itemUrl, null, null, product.itemName);

        expect(tAgent.sendTrack).toHaveBeenCalledTimes(1);
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expect.objectContaining({
            properties: expect.arrayContaining([
                {
                    product: expect.objectContaining({
                        itemPrice: 0,
                        itemQuantity: 1,
                        itemTotalPrice: 0
                    })
                }
            ])
        }));
    });

    test("Tracker trackAddToOrder API invalid invocation", () => {
        expect.assertions(4);

        const ContactId = "f245124e-8f61-4277-a189-8d233bc99492";
        const sessionId = "f245174e-8f61-4277-a489-8d213bc99494";

        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        expect(() => {
            tracker.trackAddToOrder("", 0, "", 0);
        }).toThrowError(/itemCode cannot be empty/);

        expect(() => {
            tracker.trackAddToOrder("Item-123", 0, "", 0);
        }).not.toThrowError(/itemUrl cannot be empty/);

        expect(() => {
            tracker.trackAddToOrder("Item-123", 0, "non-valid-url", 0);
        }).not.toThrowError(/itemUrl cannot be empty/);

        expect(() => {
            tracker.trackAddToOrder("Item-123", 0, "http://product.com", 1, 1, "", "non-valid-image-url");
        }).toThrowError(/itemImage should be a valid url/);
    });

    test("Tracker trackOrderCompleted API", () => {
        expect.assertions(2);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
        const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
        const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
        const sessionId = "f245124e8f614277a0898d233bc99494";
        const product = {
            color: "Red",
            itemCode: "Product-101",
            itemImage: "http://YOUR_SOTRE/product-color-blue.jpg",
            itemName: "A very cool product",
            itemPrice: 12.02,
            itemQuantity: 1,
            itemTotalPrice: 14.22, // the price might come up when applying taxes or if quantity is greater than 1
            itemUrl: "http://YOUR_SOTRE/product-101",
            size: "XXL",
        };
        const products = [product, product];
        const totalPrice = 123.45;

        (tStorage.getCampaignId as any).mockReturnValue(CampaignId);
        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init(siteId, false);
        tracker.trackOrderCompleted(products, totalPrice);

        const expectedPayload = {
            CampaignId,
            ContactId,
            actionType: "ORDER_COMPLETED",
            properties: [{
                products,
                totalPrice,
            }],
            sessionId,
            siteId,
        };

        expect(tAgent.sendTrack).toHaveBeenCalledTimes(1);
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expectedPayload);
    });

    test("Tracker trackOrderCompleted API invalid invocation", () => {
        expect.assertions(4);

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        expect(() => {
            tracker.trackOrderCompleted([{}]);
        }).toThrowError(/itemCode/);

        expect(() => {
            tracker.trackOrderCompleted([{
                itemCode: "Product-101",
                itemPrice: 12.24,
                itemUrl: "",
            }]);
        }).not.toThrowError(/itemUrl should be a valid URL/)

        expect(() => {
            tracker.trackOrderCompleted([{
                itemCode: "Product-101",
                itemName: 1 as any,
                itemPrice: 12.24,
                itemQuantity: 1,
                itemTotalPrice: 1,
                itemUrl: "http://image.com",
            }]);
        }).toThrowError(/itemName type should be a string/);

        expect(() => {
            tracker.trackOrderCompleted([{
                itemCode: "Product-101",
                itemImage: "img.jpg",
                itemName: "Item",
                itemPrice: 12.24,
                itemQuantity: 1,
                itemTotalPrice: 1,
                itemUrl: "http://product.com",
            }])
        }).toThrowError(/itemImage should be a valid URL/);
    });

    test("Tracker trackOrderCompleted test default values", () => {
        expect.assertions(2);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
        const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
        const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
        const sessionId = "f245124e8f614277a0898d233bc99494";

        (tStorage.getCampaignId as any).mockReturnValue(CampaignId);
        (tStorage.getSessionId as any).mockReturnValue(sessionId);
        (tStorage.getUserId as any).mockReturnValue(ContactId);

        const product = {
            itemCode: "Product-101",
            itemQuantity: "",
            itemUrl: "http://image.com",
        };

        const products = [product];

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.init(siteId, false);
        tracker.trackOrderCompleted(products, 1);

        expect(tAgent.sendTrack).toHaveBeenCalledTimes(1);
        expect(tAgent.sendTrack).toHaveBeenCalledWith(expect.objectContaining({
            properties: expect.arrayContaining([
                expect.objectContaining({
                    products: expect.arrayContaining([
                        expect.objectContaining({
                            itemPrice: 0,
                            itemQuantity: 1,
                            itemTotalPrice: 0
                        })
                    ])
                })
            ])
        }));

    });

    test("Tracker should be initialized with custom userId cookie name", () => {
        expect.assertions(1);

        const siteId = "f245124e-8f61-4277-a089-8d233bc99491";

        const userIdName = "userIdExample";
        const sessionIdName = "sessionIdExample";
        const emailName = "emailNameExample";
        const exitIntentFlagName = "exitIntentFlag";

        const tracker = new Tracker(tAgent, tStorage, tBrowser);

        tracker.setCookieNames({ userIdName, sessionIdName, emailName, exitIntentFlagName });
        tracker.init(siteId, false);

        expect(tStorage.setCookieNames).toHaveBeenCalledTimes(1);
    });

});
