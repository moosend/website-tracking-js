const JSON3 = require("json3");
import { ISubFormsPost, ICookiesPost } from './model';

export default class APIRequest {

    makeRequest = (url: string, data: ISubFormsPost, cb: Function) => {

        let apiRequest: XMLHttpRequest = new XMLHttpRequest();

        if (window.XDomainRequest) {
            apiRequest = new XDomainRequest();
            apiRequest.onload = () => {
                cb(apiRequest.responseText);
            };
        } else if (window.XMLHttpRequest) {
            apiRequest = new XMLHttpRequest();
        } else {
            apiRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }

        apiRequest.onreadystatechange = () => {
            if (apiRequest.readyState === 4 && apiRequest.status === 200) {
                cb(apiRequest.responseText);
            }
        };

        apiRequest.open("POST", url, true);
        apiRequest.setRequestHeader("Accept", "application/json");
        apiRequest.setRequestHeader("Content-Type", "application/json");
        apiRequest.send(JSON3.stringify(data));
    }

    preparePayload = (siteId: string, contactId: string, email: string, currentUrlPath: string): ISubFormsPost => {

        return { 
            WebsiteId: siteId,
            RemoteWebContext: {
                ContactId: contactId,
                MemberEmail: email,
                CurrentUrlPath: currentUrlPath
            }
         }
    }

    mockApiReq = (url: string, cb: Function) => {
        let apiRequest: XMLHttpRequest = new XMLHttpRequest();

        apiRequest.onreadystatechange = () => {
            if (apiRequest.readyState === 4 && apiRequest.status === 200) {
                cb(apiRequest.responseText);
            }
        };

        apiRequest.open("GET", url, true);
        apiRequest.setRequestHeader("Accept", "application/json");
        apiRequest.setRequestHeader("Content-Type", "application/json");
        apiRequest.send();
    }
}