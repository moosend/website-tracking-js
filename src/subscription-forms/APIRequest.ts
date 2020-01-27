const JSON3 = require("json3");
import { ISubFormsPost, ISubFormPost, ISubFormsGet, IFormSettingsGet } from './model';
import formTypesMap from '../subscription-forms/FormTypes';
const cookie = require('js-cookie');

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

    preparePayload = (siteId: string, contactId: string, email: string, cookies: any, currentUrlPath: string): ISubFormsPost => {

        return { 
            WebsiteId: siteId,
            RemoteWebContext: {
                ContactId: contactId,
                MemberEmail: email,
                Cookies: cookies,
                CurrentUrlPath: currentUrlPath
            }
         }
    }

    preparePayloadForSingle = (entityId: string, contactId: string, email: string, cookies: any, currentUrlPath: string): ISubFormPost => {

        return { 
            EntityId: entityId,
            RemoteWebContext: {
                ContactId: contactId,
                MemberEmail: email,
                Cookies: cookies,
                CurrentUrlPath: currentUrlPath
            }
         }
    }

    renderForms = (response: string): void => {

        let responseObj: ISubFormsGet = JSON.parse(response);

        for (let key in responseObj) {

            let formId = responseObj[key].Entity.Id;

            if (cookie.get(`msf_shown_${formId}`) === undefined) {
                
                if (this.isToBeAvoided(formId, responseObj[key].Settings)) {
                    
                    continue;
                }

                new formTypesMap[responseObj[key].Entity.Subtype](formId, responseObj[key].Settings, responseObj[key].EntityHtml);
            }
        }
    }

    isToBeAvoided = (formId: string, settings: IFormSettingsGet): boolean => {
        
        return settings.Avoid_Submission_OnOff && settings.Avoid_Submission_OnOff === "true" && cookie.get(`msf_submitted_${formId}`) === "true";
    }

    getAllCookies = () => {

        return cookie.get();
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