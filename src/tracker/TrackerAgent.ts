import JSON3 from "json3";
import config from "../common/config";

export default class TrackerAgent implements ITrackerAgent {
    private url: string;

    constructor(trackerUrl: string = config.apiUrl) {
        this.url = trackerUrl;
    }

    public sendTrack(payload: ITrackPayload): void {
        this._postData(this.url + "/track", payload);
    }

    public sendIdentify(payload: ITrackIdentifyPayload): void {
        this._postData(this.url + "/identify", payload);
    }

    public sendPing(payload: ITrackPingPayload): void {
        this._postData(this.url + "/ping", payload);
    }

    private _postData(url: string, data: any): void {

        // tslint:disable-next-line:no-empty
        post(url, data, () => {

        });
    }
}

function post(url: any, data: any, callBack: any) {

    let xmlhttp: any;

    // if (window.XDomainRequest) {
    // xmlhttp.open("POST", url, true);
    // xmlhttp.setRequestHeader("Accept", "application/json");
    // xmlhttp.setRequestHeader("Content-Type", "application/json");
    // xmlhttp = new XDomainRequest();
    // xmlhttp.onload = () => {
    //     callBack(xmlhttp.responseText);
    // };
    // } else if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
    // } else {
    //     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    // }

    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callBack(xmlhttp.responseText);
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Accept", "application/json");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    setTimeout(() => {
        xmlhttp.send(JSON3.stringify(data)); // used JSON3 instead of browser JSON because of IE8 support
    }, 0);
}
