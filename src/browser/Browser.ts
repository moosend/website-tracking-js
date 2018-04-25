import FingerPrint from "fingerprintjs2";

export default class Browser implements IBrowser {

    public fingerPrint(done: (browserComponents: IBrowserComponents) => void) {

        let browserComponents: IBrowserComponents;

        new FingerPrint().get((browserHash: string, components: any) => {

            browserComponents = {
                browserHash,
            };

            components.forEach((component: any) => {

                switch (component.key) {
                    case "language": browserComponents.language = component.value; break;
                    case "color_depth": browserComponents.colorDepth = component.value; break;
                    case "pixel_ratio": browserComponents.pixelRatio = component.value; break;
                    case "resolution":
                        browserComponents.screenResolution = {
                            height: component.value[1],
                            width: component.value[0],
                        };
                        break;
                    case "available_resolution":
                        browserComponents.screenResolution = {
                            height: component.value[1],
                            width: component.value[0],
                        };
                        break;
                    case "timezone_offset": browserComponents.timeZoneOffset = component.value; break;
                    case "session_storage": browserComponents.sessionStorage = component.value; break;
                    case "local_storage": browserComponents.localStorage = component.value; break;
                    case "indexed_db": browserComponents.indexedDb = component.value; break;
                    case "open_database": browserComponents.openDatabase = component.value; break;
                    case "cpu_class": browserComponents.cpuClass = component.value; break;
                    case "navigator_platform": browserComponents.navigatorPlatform = component.value; break;
                    case "regular_plugins": browserComponents.plugins = component.value; break;
                    case "canvas": browserComponents.canvas = component.value; break;
                    case "webgl": browserComponents.webGl = component.value; break;
                    case "adblock": browserComponents.adBlock = component.value; break;
                    case "has_lied_languages": browserComponents.triedToHideLanguage = component.value; break;
                    case "has_lied_resolution": browserComponents.triedToHideResolution = component.value; break;
                    case "has_lied_os": browserComponents.triedToHideOs = component.value; break;
                    case "has_lied_browser": browserComponents.triedToHideBrowser = component.value; break;
                    case "touch_support": browserComponents.touchSupport = component.value[1]; break;
                    case "js_fonts": browserComponents.jsFonts = component.value; break;
                }
            });

            done(browserComponents);
        });
    }
}
