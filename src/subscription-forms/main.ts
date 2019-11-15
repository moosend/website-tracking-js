const APIObject = require('./api-mock.json');
import formTypesMap from './FormTypes';


export default class SubFormsInitiator {

  subType: number;
  htmlToAppend: string;
  settings: Array < object > ;
  entityId: number;

  constructor(entityId: number, subtype: number, settings: Array < object > , blueprintHTML: string) {

    this.subType = subtype;
    this.htmlToAppend = blueprintHTML;
    this.settings = settings;
    this.entityId = entityId;

    new formTypesMap[this.subType](this.entityId, this.settings, this.htmlToAppend);

    // Get settings from URL queries. This is a temporary solution for preview
    const queryParams = this.getAllUrlParams(window.location.href);

    if (window.location.hostname === 'ecommerce.services.moostaging.com') {
      this.initiateFromQueryParams(queryParams);
    }

  }

  getAllUrlParams(url: string) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];

      // split our query string into its component parts
      var arr = queryString.split('&');

      for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');

        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

        // (optional) keep case consistent
        paramName = paramName.toLowerCase();
        if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?\]$/)) {

          // create key if it doesn't exist
          var key = paramName.replace(/\[(\d+)?\]/, '');
          if (!obj[key]) obj[key] = [];

          // if it's an indexed array e.g. colors[2]
          if (paramName.match(/\[\d+\]$/)) {
            // get the index value and add the entry at the appropriate position
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
          }
        } else {
          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === 'string') {
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
          }
        }
      }
    }

    return obj;
  }

  initiateFromQueryParams(queryParams: object): void {

    let delay: number;
    let position: string;

    for (let key in queryParams) {
      this.subType = queryParams['form'];
      delay = queryParams['delay'];
      position = queryParams['position'];
    }

    new formTypesMap[this.subType]([position], this.htmlToAppend, delay);
  }
}