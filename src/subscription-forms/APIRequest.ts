export default class APIRequest {

    sum: number;

    getApiObject = (objFromApi: object) => {
        return new Promise((resolve, reject) => {

            resolve(objFromApi);
        });
    }

    fetchRequest = (url: string) => {

        let apiRequest = new XMLHttpRequest();
        apiRequest.open("GET", url);
        apiRequest.setRequestHeader("Accept", "application/json");
        apiRequest.setRequestHeader("Content-Type", "application/json");
        apiRequest.send();

        return apiRequest;
    }
}