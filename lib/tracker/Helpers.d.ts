declare const helpers: {
    tostr: (value: any) => any;
    isString: (value: any) => boolean;
    isNumber: (value: any) => boolean;
    isObject: (value: any) => boolean;
    isUrl: (url: string) => boolean;
    isValidUUID: (uuidString: string) => boolean;
    getParameterByName: (name: string) => string;
    validateEmail: (email: string) => boolean;
};
export default helpers;
