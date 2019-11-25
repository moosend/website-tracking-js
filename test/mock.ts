/// <reference path="../local.d.ts" />

import tape = require("tape");
require('jsdom-global')();

(global as any).DOMParser = (window as any).DOMParser;

interface IMockAPI {
  createStorage(t: tape.Test, props?: any): ITrackerStorage;
  createAgent(t: tape.Test, overrides?: any): ITrackerAgent;
  createBrowser(t: tape.Test, overrides?: any): IBrowser;
}

export default {
  createStorage(t: tape.Test, overrides: any = {}): ITrackerStorage {
    const mock: ITrackerStorage = [
      "storage",

      "setCookieNames",

      "getUserId",
      "setUserId",

      "getEmail",
      "setEmail",

      "getCampaignId",
      "setCampaignId",

      "getSessionId",
      "setSessionId",

      "getExitIntentFlag",
      "setExitIntentFlag",

      "getCurrentPageUrl",

      "setUserIdName",
    ].reduce((acc: any, next: string) => {
        const override = overrides[next];
        acc[next] = override instanceof Function ? override : _noop;
        return acc;
      }, {});

    return mock;
  },

  createAgent(t: tape.Test, overrides: any = {}): ITrackerAgent {
    return {
      sendIdentify: (overrides.sendIdentify instanceof Function && overrides.sendIdentify) || _noop,
      sendTrack:    (overrides.sendTrack instanceof Function && overrides.sendTrack) || _noop,
    };
  },

  createBrowser(t: tape.Test, overrides: any = {}): IBrowser {
    const mock: IBrowser = [
      "fingerPrint",
    ].reduce((acc: any, next: string) => {
      const override = overrides[next];
      acc[next] = override instanceof Function ? override : _noop;
      return acc;
    }, {});

    return mock;
  },
};

/**
 * HELPERS
 */
// tslint:disable-next-line:no-empty
function _noop(p: any): void {}

  //(global as any).DOMParser = ({ new() {}, prototype: { parseFromString() {} } });
