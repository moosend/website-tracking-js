export default class Utils {
    public static isValidUUID(uuidString: string): boolean {
        const validUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        return (
            validUUIDRegex.test(uuidString) ||
            validUUIDRegex.test(
                uuidString.replace(
                    /(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/gi,
                    "$1-$2-$3-$4-$5",
                ),
            )
        );
    }
}

export const tostr = (value: any) => {
    return Object.prototype.toString.call(value);
};

export const isString = (value: any): boolean => {
    return Object.prototype.toString.call(value) === "[object String]";
};

export const isNumber = (value: any): boolean => {
    return Object.prototype.toString.call(value) === "[object Number]" || !isNaN(parseFloat(value));
};

export const isObject = (value: any): boolean => {
    return Object.prototype.toString.call(value) === "[object Object]";
};

export const isUrl = (url: string): boolean => {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
};

export const isValidUUID = (uuidString: string) => {
    const validUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    return (
        validUUIDRegex.test(uuidString) ||
        validUUIDRegex.test(
            uuidString.replace(
                /(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/gi,
                "$1-$2-$3-$4-$5",
            ),
        )
    );
};

export const getParameterByName = (name: string) => {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) { return ""; }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
