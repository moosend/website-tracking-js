export default class APIRequest {

    makeRequest = (url: string, cb: Function) => {

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

        apiRequest.open("GET", url, true);
        apiRequest.setRequestHeader("Accept", "application/json");
        apiRequest.setRequestHeader("Content-Type", "application/json");
        apiRequest.send();
    }
}