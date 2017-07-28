export default class TrackerAgent implements ITrackerAgent {
    private url;
    constructor(trackerUrl?: string);
    sendTrack(payload: ITrackPayload): void;
    sendIdentify(payload: ITrackIdentifyPayload): void;
    sendPing(payload: ITrackPingPayload): void;
    private _postData(url, data);
}
