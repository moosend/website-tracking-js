import "jsdom-global/register";
import sinon = require("sinon");
import test = require("tape");
import CookieNames from "../src/cookies/CookieNames";
import CookieStorage from "../src/storage/CookieStorage";
import Tracker, { TrackerActions } from "../src/tracker/Tracker";
import mock from "./mock";

test("Tracker Initialisation", (t: test.Test) => {

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    let tBrowser: IBrowser;

    tAgent = mock.createAgent(t);

    tStorage = mock.createStorage(t, {
        getSessionId() {
            t.pass("ITrackerStorage.sessionId was called during initialisation");
            return "";
        },
        getUserId() {
            t.pass("ITrackerStorage.userId was called during initialisation");
            return "";
        },
        setSessionId() {
            t.pass("ITrackerStorage.setUserId was called during initialisation");
        },
        setUserId() {
            t.pass("ITrackerStorage.setUserId was called during initialisation");
        },
        setExitIntentFlag() {
            t.pass("ITrackerStorage.setExitIntentFlag was called during initialisation");
        },
    });

    tBrowser = mock.createBrowser(t, {
        fingerPrint() {
            t.pass("IBrowser.fingerPrint was called during initialisation");
        },
    });

    t.plan(6);

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    tracker.init("f245124e-8f61-4277-a089-8d233bc99491", false);
});

test("Tracker initialization which has siteId without dashes", (t: test.Test) => {

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    let tBrowser: IBrowser;

    tAgent = mock.createAgent(t);

    tStorage = mock.createStorage(t, {
        getUserId() {
            t.pass("ITrackerStorage.userId was called during initialisation");
            return "";
        },
        setUserId() {
            t.pass("ITrackerStorage.setUserId was called during initialisation");
        },
        getSessionId() {
            t.pass("ITrackerStorage.sessionId was called during initialisation");
            return "";
        },
        setSessionId() {
            t.pass("ITrackerStorage.setUserId was called during initialisation");
        },
    });

    tBrowser = mock.createBrowser(t, {
        fingerPrint() {
            t.pass("IBrowser.fingerPrint was called during initialisation");
        },
    });

    t.plan(5);

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    tracker.init("f245124e8f614277a0898d233bc99491", false);

});

test("Tracker initialization should throw error if siteId has invalid UUID", (t: test.Test) => {

    let tAgent: ITrackerAgent;
    // tslint:disable-next-line:prefer-const
    let tStorage: ITrackerStorage;
    // tslint:disable-next-line:prefer-const
    let tBrowser: IBrowser;

    tAgent = mock.createAgent(t);

    t.plan(1);

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.throws(() => tracker.init("123", false), /siteId should be a valid uuid/, "throw siteId should be a valid uuid");

    t.end();

});

test("Tracker Identify API", (t: test.Test) => {

    const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
    const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
    const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
    const ContactEmailAddress = "john.doe@mail.com";
    const sessionId = "f245124e8f614277a0898d233bc99494";

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    tAgent = mock.createAgent(t, {
        sendIdentify: (payload: ITrackIdentifyPayload): void => {

            const expectedPayload = {
                CampaignId: "f245124e-8f61-4277-a089-8d233bc99493",
                ContactEmailAddress: "john.doe@mail.com",
                ContactId: "f245124e-8f61-4277-a089-8d233bc99492",
                actionType: "IDENTIFY",
                sessionId: "f245124e8f614277a0898d233bc99494",
                siteId: "f245124e-8f61-4277-a089-8d233bc99491",
            };

            t.deepEqual(payload, expectedPayload, "ITrackerAgent.sendIdentify was not called with expected payload");
        },
    });

    tStorage = mock.createStorage(t, {
        getCampaignId: () => {
            t.pass("ITrackerStorage.getCampaignId was called");
            return CampaignId;
        },
        getSessionId: () => {
            t.pass("ITrackerStorage.getSessionId was called");
            return sessionId;
        },
        getUserId: () => {
            t.pass("ITrackerStorage.userId was called");
            return ContactId;
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.plan(6);

    tracker.init(siteId, false);
    tracker.identify(ContactEmailAddress);
});

test("Tracker Track getPayload", (t: test.Test) => {
    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    tStorage = mock.createStorage(t, {
        getSessionId() {
            return "f245124e-8f61-4157-a089-8d213bc99494";
        },
        getUserId() {
            return "user-guid";
        },
        getEmail() {
            return "john@mail.gb";
        },
    });

    tAgent = mock.createAgent(t);

    const sendTrack: any = tAgent.sendTrack = sinon.spy();
    const getUserId: any = sinon.spy(tStorage, "getUserId");
    const getEmail: any = sinon.spy(tStorage, "getEmail");

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    const getPayload: any = sinon.spy(tracker, "getPayload");

    tracker.init("f245124e-8f61-4277-a089-8d233bc99491", false);
    tracker.track(TrackerActions.PAGE_VIEWED, [{ status: "completed" }]);

    t.ok(getUserId.calledTwice, "ITrackerStorage.getUserId should be called twice");
    t.ok(getEmail.calledTwice, "ITrackerStorage.getEmail should be called once");
    t.ok(sendTrack.calledOnce, "ITrackerAgent.sendTrack should be called once");
    t.ok(getPayload.calledOnce, "getPayload should be called once");

    t.end();
});

test("Tracker Track with Different ActionType", (t: test.Test) => {
    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    tStorage = mock.createStorage(t, {
        getUserId() {
            return "user-guid";
        },
        getEmail() {
            return "john@mail.gb";
        },
    });

    tAgent = mock.createAgent(t);

    const getUserId: any = sinon.spy(tStorage, "getUserId");
    const getEmail: any = sinon.spy(tStorage, "getEmail");

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    const getPayload: any = sinon.spy(tracker, "getPayload");

    tracker.init("f245124e-8f61-4277-a089-8d233bc99491", false);
    tracker.track("DIFFERENT_ACTION_TYPE", [{ status: "completed" }]);

    t.ok(getUserId.calledTwice, "ITrackerStorage.getUserId should be called twice");
    t.ok(getEmail.calledTwice, "ITrackerStorage.getEmail should be called once");
    t.ok(getPayload.calledOnce, "getPayload should be called once");

    t.end();
});

test("Tracker Track API", (t: test.Test) => {

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    tStorage = mock.createStorage(t, {
        getSessionId() {
            return "f245134e-8f61-4157-a089-8d213bl99494";
        },
        getUserId() {
            return "user-guid";
        },
        getEmail() {
            return "john@mail.gb";
        },
    });

    tAgent = mock.createAgent(t);

    const sendTrack: any = tAgent.sendTrack = sinon.spy();
    const getUserId: any = sinon.spy(tStorage, "getUserId");
    const getEmail: any = sinon.spy(tStorage, "getEmail");

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    tracker.init("f245124e-8f61-4277-a089-8d233bc99491", false);
    tracker.track(TrackerActions.PAGE_VIEWED, [{ status: "completed" }]);

    t.ok(getUserId.calledTwice, "ITrackerStorage.getUserId should be called twice");
    t.ok(getEmail.calledTwice, "ITrackerStorage.getEmail should be called once");
    t.ok(sendTrack.calledOnce, "ITrackerAgent.sendTrack should be called once");

    t.end();
});

test("Tracker Track Product View", (t: test.Test) => {

    const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
    const ContactId = "f245124e8f614277a089-8d233bc99492";
    const CampaignId = "f245124e-8f614277a089-8d233bc99493";
    const sessionId = "f245124e8f614277a0898d233bc99494";
    const url = "https://someurl.com";

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    const itemCode = "101";
    const itemPrice = 12.02;
    const itemUrl = "http://YOUR_SOTRE/product-101";
    const itemQuantity = 1;
    const itemTotalPrice = 14.22; // the price might come up when applying taxes or if quantity is greater than 1
    const itemName = "A very cool product";
    const itemImage = "http://YOUR_SOTRE/product-color-blue.jpg";
    const extraProps = { color: "Red", size: "XXL" };

    tStorage = mock.createStorage(t, {
        getCampaignId: () => {
            t.pass("ITrackerStorage.getCampaignId was called");
            return CampaignId;
        },
        getSessionId: () => {
            t.pass("ITrackerStorage.getSessionId was called");
            return sessionId;
        },
        getUserId: () => {
            t.pass("ITrackerStorage.getUserId was called");
            return ContactId;
        },
    });

    tAgent = mock.createAgent(t, {
        sendTrack: (payload: ITrackPayload): void => {

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

            t.deepEqual(payload, expectedPayload, "ITrackerAgent.sendTrack was not called with expected payload");
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);
    const formatProductPayload = sinon.spy(tracker, "formatProductPayload");

    t.plan(7);

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

    t.equal(formatProductPayload.calledOnce, true, "formatProductPayload should be called");

});

test("Tracker Track Product View with Default Values", (t: test.Test) => {

    const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
    const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
    const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
    const sessionId = "f245124e8f614277a0898d233bc99494";
    const url = "https://someurl.com";

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    const itemCode = "101";
    const itemPrice = 12.02;
    const itemUrl = "http://YOUR_SOTRE/product-101";
    const itemQuantity = 1;
    const itemTotalPrice = 14.22; // the price might come up when applying taxes or if quantity is greater than 1
    const itemName = "A very cool product";
    const itemImage = "http://YOUR_SOTRE/product-color-blue.jpg";
    const extraProps = { color: "Red", size: "XXL" };

    tStorage = mock.createStorage(t, {
        getCampaignId: () => {
            t.pass("ITrackerStorage.getCampaignId was called");
            return CampaignId;
        },
        getSessionId: () => {
            t.pass("ITrackerStorage.getSessionId was called");
            return sessionId;
        },
        getUserId: () => {
            t.pass("ITrackerStorage.getUserId was called");
            return ContactId;
        },
    });

    tAgent = mock.createAgent(t, {
        sendTrack: (payload: ITrackPayload): void => {

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

            t.equal(expectedPayload.properties[0].product.itemPrice, 0, "itemPrice should be 0");
            t.equal(expectedPayload.properties[0].product.itemQuantity, 1, "itemPrice should be 1");
            t.equal(expectedPayload.properties[0].product.itemTotalPrice, 0, "itemPrice should be 0");
            t.deepEqual(payload, expectedPayload, "ITrackerAgent.sendTrack was not called with expected payload");
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);
    const formatProductPayload = sinon.spy(tracker, "formatProductPayload");

    t.plan(10);

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

    t.equal(formatProductPayload.calledOnce, true, "formatProductPayload should be called");

});

test("Tracker trackExitIntent API", (t: test.Test) => {

    const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
    const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
    const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
    const sessionId = "f245124e8f614277a0898d233bc99494";
    const url = "https://someurl.com";
    const secondsOnPage = 30;

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    tStorage = mock.createStorage(t, {
        getCampaignId: () => {
            t.pass("ITrackerStorage.getCampaignId was called");
            return CampaignId;
        },
        getSessionId: () => {
            t.pass("ITrackerStorage.getSessionId was called");
            return sessionId;
        },
        getUserId: () => {
            t.pass("ITrackerStorage.getUserId was called");
            return ContactId;
        },
    });

    tAgent = mock.createAgent(t, {
        sendTrack: (payload: ITrackExitIntentPayload): void => {

            const expectedPayload = {
                CampaignId,
                ContactId,
                SecondsOnPage: secondsOnPage,
                Url: url,
                actionType: TrackerActions.EXIT_INTENT,
                sessionId,
                siteId,
            };

            t.deepEqual(payload, expectedPayload, "ITrackerAgent.sendTrack was not called with expected payload");
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.plan(6);

    tracker.init(siteId, true);
    tracker.trackExitIntent(secondsOnPage, url);
});

test("Tracker trackPageView API", (t: test.Test) => {

    const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
    const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
    const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
    const sessionId = "f245124e8f614277a0898d233bc99494";
    const url = "https://someurl.com";

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    tStorage = mock.createStorage(t, {
        getCampaignId: () => {
            t.pass("ITrackerStorage.getCampaignId was called");
            return CampaignId;
        },
        getSessionId: () => {
            t.pass("ITrackerStorage.getSessionId was called");
            return sessionId;
        },
        getUserId: () => {
            t.pass("ITrackerStorage.getUserId was called");
            return ContactId;
        },
    });

    tAgent = mock.createAgent(t, {
        sendTrack: (payload: ITrackPayload): void => {

            const expectedPayload = {
                CampaignId,
                ContactId,
                Url: url,
                actionType: TrackerActions.PAGE_VIEWED,
                sessionId,
                siteId,
            };

            t.deepEqual(payload, expectedPayload, "ITrackerAgent.sendTrack was not called with expected payload");
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.plan(6);

    tracker.init(siteId, false);
    tracker.trackPageView(url);
});

test("Tracker trackAddToOrder API", (t: test.Test) => {

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

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    tStorage = mock.createStorage(t, {
        getCampaignId: () => {
            t.pass("ITrackerStorage.getCampaignId was called");
            return CampaignId;
        },
        getSessionId: () => {
            t.pass("ITrackerStorage.getSessionId was called");
            return sessionId;
        },
        getUserId: () => {
            t.pass("ITrackerStorage.getUserId was called");
            return ContactId;
        },
    });

    tAgent = mock.createAgent(t, {
        sendTrack: (payload: ITrackPayload): void => {

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

            t.deepEqual(payload, expectedPayload, "ITrackerAgent.sendTrack was not called with expected payload");
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.plan(6);

    tracker.init(siteId, false);
    tracker.trackAddToOrder(itemCode, itemPrice, itemUrl, itemQuantity, itemTotalPrice, itemName, itemImage, extraProps);
});

test("Tracker trackAddToOrder API with 2 parameters (product and extraProps only)", (t: test.Test) => {

    const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
    const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
    const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
    const sessionId = "f245124e8f614277a0898d233bc99494";

    const productInfo: IProduct = {
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

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    tStorage = mock.createStorage(t, {
        getCampaignId: () => {
            t.pass("ITrackerStorage.getCampaignId was called");
            return CampaignId;
        },
        getSessionId: () => {
            t.pass("ITrackerStorage.getSessionId was called");
            return sessionId;
        },
        getUserId: () => {
            t.pass("ITrackerStorage.getUserId was called");
            return ContactId;
        },
    });

    tAgent = mock.createAgent(t, {
        sendTrack: (payload: ITrackPayload): void => {

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

            t.deepEqual(payload, expectedPayload, "ITrackerAgent.sendTrack was not called with expected payload");
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.plan(6);

    tracker.init(siteId, false);
    tracker.trackAddToOrder(productInfo, extraProps);
});

test("trackAddToOrder test default values with 2 parameters (product and extraProps only)", (t: test.Test) => {
    const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
    const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
    const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
    const sessionId = "f245124e8f614277a0898d233bc99494";

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    const product: IProduct = {
        itemCode: "item-101",
        itemName: "A simple product",
        itemUrl: "https://www.google.com",
    };

    tStorage = mock.createStorage(t, {
        getSessionId: () => {
            t.pass("ITrackerStorage.getSessionId was called");
            return sessionId;
        },
        getUserId: () => {
            t.pass("ITrackerStorage.getUserId was called");
            return ContactId;
        },
    });

    tAgent = mock.createAgent(t, {
        sendTrack: (payload: ITrackPayload): void => {
            const testingProduct: IProduct = payload.properties[0].product;

            t.equal(testingProduct.itemPrice, 0, "itemPrice should be 0 by default");
            t.equal(testingProduct.itemQuantity, 1, "itemQuantity should be 1 by default");
            t.equal(testingProduct.itemTotalPrice, 0, "itemTotalPrice should be 1 by default");
            t.end();
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.plan(7);

    tracker.init(siteId, false);
    tracker.trackAddToOrder(product);
});

test("trackAddToOrder test default values", (t: test.Test) => {

    const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
    const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
    const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
    const sessionId = "f245124e8f614277a0898d233bc99494";

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    const product: IProduct = {
        itemCode: "item-101",
        itemName: "A simple product",
        itemUrl: "https://www.google.com",
    };

    tStorage = mock.createStorage(t, {
        getSessionId: () => {
            t.pass("ITrackerStorage.getSessionId was called");
            return sessionId;
        },
        getUserId: () => {
            t.pass("ITrackerStorage.getUserId was called");
            return ContactId;
        },
    });

    tAgent = mock.createAgent(t, {
        sendTrack: (payload: ITrackPayload): void => {
            const testingProduct: IProduct = payload.properties[0].product;

            t.equal(testingProduct.itemPrice, 0, "itemPrice should be 0 by default");
            t.equal(testingProduct.itemQuantity, 1, "itemQuantity should be 1 by default");
            t.equal(testingProduct.itemTotalPrice, 0, "itemTotalPrice should be 1 by default");
            t.end();
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.plan(7);

    tracker.init(siteId, false);
    tracker.trackAddToOrder(product.itemCode, null, product.itemUrl, null, null, product.itemName);

});

test("Tracker trackAddToOrder API invalid invocation", (t: test.Test) => {

    const ContactId = "f245124e-8f61-4277-a189-8d233bc99492";
    const sessionId = "f245174e-8f61-4277-a489-8d213bc99494";

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    tAgent = mock.createAgent(t);
    tStorage = mock.createStorage(t, {
        getSessionId: () => {
            t.pass("ITrackerStorage.getSessionId was called");
            return sessionId;
        },
        getUserId: () => {
            t.pass("ITrackerStorage.getUserId was called");
            return ContactId;
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.plan(8);

    t.throws(() => tracker.trackAddToOrder("", 0, "", 0), /itemCode/, "throw itemCode cannot be empty");

    t.doesNotThrow(() => tracker.trackAddToOrder("Item-123", 0, "", 0), /itemUrl cannot be empty/, "throw itemUrl cannot be empty");

    t.doesNotThrow(() => tracker.trackAddToOrder("Item-123", 0, "non-valid-url", 0), /itemUrl should be a valid url/, "throw itemUrl should be a valid url");

    t.throws(() => tracker.trackAddToOrder("Item-123", 0, "http://product.com", 1, 1, "", "non-valid-image-url"), /itemImage should be a valid url/, "throw itemImage should be a valid url");
});

test("Tracker trackOrderCompleted API", (t: test.Test) => {

    const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
    const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
    const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
    const sessionId = "f245124e8f614277a0898d233bc99494";
    const product: IProduct = {
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
    const products: IProduct[] = [product, product];
    const totalPrice = 123.45;

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    tStorage = mock.createStorage(t, {
        getCampaignId: () => {
            t.pass("ITrackerStorage.getCampaignId was called");
            return CampaignId;
        },
        getSessionId: () => {
            t.pass("ITrackerStorage.getSessionId was called");
            return sessionId;
        },
        getUserId: () => {
            t.pass("ITrackerStorage.getUserId was called");
            return ContactId;
        },
    });

    tAgent = mock.createAgent(t, {
        sendTrack: (payload: ITrackPayload): void => {

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

            t.deepEqual(payload, expectedPayload, "ITrackerAgent.sendTrack was not called with expected payload");
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.plan(6);

    tracker.init(siteId, false);
    tracker.trackOrderCompleted(products, totalPrice);
});

test("Tracker trackOrderCompleted API invalid invocation", (t: test.Test) => {

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);
    // let consoleSpy = sinon.spy(console, 'log');

    tAgent = mock.createAgent(t);
    tStorage = mock.createStorage(t);

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.plan(4);

    t.throws(() => tracker.trackOrderCompleted([{}]), /itemCode/, "throw itemCode cannot be empty");

    t.doesNotThrow(() => tracker.trackOrderCompleted([{
        itemCode: "Product-101",
        itemPrice: 12.24,
        itemUrl: "",
    }]), /itemUrl should be a valid URL/, "throw itemUrl should be a valid URL");

    t.throws(() => tracker.trackOrderCompleted([{
        itemCode: "Product-101",
        itemName: 1 as any,
        itemPrice: 12.24,
        itemQuantity: 1,
        itemTotalPrice: 1,
        itemUrl: "http://image.com",
    }]), /itemName type should be a string/, "throw itemName type should be a string");

    t.throws(() => tracker.trackOrderCompleted([{
        itemCode: "Product-101",
        itemImage: "img.jpg",
        itemName: "Item",
        itemPrice: 12.24,
        itemQuantity: 1,
        itemTotalPrice: 1,
        itemUrl: "http://product.com",
    }]), /itemImage should be a valid URL/, "throw itemImage should be a valid URL");
});

test("Tracker trackOrderCompleted test default values", (t: test.Test) => {

    const siteId = "f245124e-8f61-4277-a089-8d233bc99491";
    const ContactId = "f245124e-8f61-4277-a089-8d233bc99492";
    const CampaignId = "f245124e-8f61-4277-a089-8d233bc99493";
    const sessionId = "f245124e8f614277a0898d233bc99494";

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    const product: IProduct = {
        itemCode: "Product-101",
        itemQuantity: "",
        itemUrl: "http://image.com",
    };

    const products: IProduct[] = [product];

    tStorage = mock.createStorage(t, {

        getUserId() {
            t.pass("ITrackerStorage.getUserId was called");
            return ContactId;
        },

    });

    tAgent = mock.createAgent(t, {
        sendTrack: (payload: ITrackPayload): void => {
            t.equal(payload.properties[0].products[0].itemPrice, 0, "itemPrice should be 0");
            t.equal(payload.properties[0].products[0].itemQuantity, 1, "itemQuantity should be 1");
            t.equal(payload.properties[0].products[0].itemTotalPrice, 0, "itemTotalPrice should be 0");
        },
    });

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    t.plan(5);

    tracker.init(siteId, false);
    tracker.trackOrderCompleted(products, 1);

});

test("Tracker should be initialized with custom userId cookie name", (t: test.Test) => {

    const cookieNames = new CookieNames();
    const siteId = "f245124e-8f61-4277-a089-8d233bc99491";

    let tAgent: ITrackerAgent;
    let tStorage: ITrackerStorage;
    const tBrowser: IBrowser = mock.createBrowser(t);

    const userIdName = "userIdExample";
    const sessionIdName = "sessionIdExample";
    const emailName = "emailNameExample";
    const exitIntentFlagName = "exitIntentFlagExample";
    const campaignIdName = "campaignIdExample";
    const memberIdName = "memberIdExample";

    tStorage = mock.createStorage(t, {
        userIdName,
        setCookieNames(cookieNameProperties: ICookieProperties) {
            t.pass("setCookieNames was called");
            this.setUserIdName(cookieNameProperties.userIdName);
        },
        setUserIdName(name: string) {
            t.pass("setUserIdName was called");
        },
    });

    tAgent = mock.createAgent(t);

    const tracker = new Tracker(tAgent, tStorage, tBrowser);

    tracker.setCookieNames({ userIdName, sessionIdName, emailName, exitIntentFlagName, campaignIdName, memberIdName});
    tracker.init(siteId, false);

    t.plan(2);
    t.end();
});
