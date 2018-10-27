import Fingerprint2 from "fingerprintjs2";
import { IBrowser, IBrowserComponents } from "../types";

export default class Browser implements IBrowser {

    public fingerPrint(done: (browserComponents: IBrowserComponents) => void) {

        let browserComponents: IBrowserComponents;
        const options = {};

        Fingerprint2.get(options, (components: any) => {
            const values = components.map((component) => component.value);
            const browserHash = Fingerprint2.x64hash128(values.join(''), 31);

            browserComponents = {
                browserHash
            };

            components.forEach((component: any) => {

                switch (component.key) {
                    case "language": browserComponents.language = component.value; break;
                    case "colorDepth": browserComponents.colorDepth = component.value; break;
                    case "pixelRatio": browserComponents.pixelRatio = component.value; break;
                    case "screenResolution":
                        browserComponents.screenResolution = {
                            height: component.value[1],
                            width: component.value[0],
                        };
                        break;
                    case "availableScreenResolution":
                        browserComponents.availableResolution = {
                            height: component.value[1],
                            width: component.value[0],
                        };
                        break;
                    case "timezoneOffset": browserComponents.timeZoneOffset = component.value; break;
                    case "sessionStorage": browserComponents.sessionStorage = component.value; break;
                    case "localStorage": browserComponents.localStorage = component.value; break;
                    case "indexedDb": browserComponents.indexedDb = component.value; break;
                    case "openDatabase": browserComponents.openDatabase = component.value; break;
                    case "cpuClass": browserComponents.cpuClass = component.value; break;
                    case "platform": browserComponents.navigatorPlatform = component.value; break;
                    case "plugins": browserComponents.plugins = component.value; break;
                    case "canvas": browserComponents.canvas = component.value; break;
                    case "webgl": browserComponents.webGl = component.value; break;
                    case "adBlock": browserComponents.adBlock = component.value; break;
                    case "hasLiedLanguages": browserComponents.triedToHideLanguage = component.value; break;
                    case "hasLiedResolution": browserComponents.triedToHideResolution = component.value; break;
                    case "hasLiedOs": browserComponents.triedToHideOs = component.value; break;
                    case "hasLiedBrowser": browserComponents.triedToHideBrowser = component.value; break;
                    case "touchSupport": browserComponents.touchSupport = component.value[1]; break;
                    case "fonts": browserComponents.jsFonts = component.value; break;
                }
            });

            done(browserComponents);
        });
    }
}
