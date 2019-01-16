/**
 * Check whether string is valid with or without dashes
 * @param {string} string
 * @returns {boolean}
 */
export const isValidUUID = (uuidString: string): boolean => {
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

export function toStr(value: any) {
    return Object.prototype.toString.call(value);
}

/**
 * Check whether value is of type String
 * @param {any} value
 * @returns {boolean}
 */
export function isString(value: any): boolean {
    return toStr(value) === "[object String]";
}

/**
 * Check whether value is of type String
 * @param {any} value
 * @returns {boolean}
 */
export function isNumber(value: any): boolean {
    return toStr(value) === "[object Number]" || !isNaN(parseFloat(value));
}

/**
 * Check whether value is of type Object
 * @param {any} value
 * @returns {boolean}
 */
export function isObject(value: any): boolean {
    return toStr(value) === "[object Object]";
}

/**
 * Check whether value is a valid URL
 * @param {any} string
 * @returns {boolean}
 */
export function isUrl(url: string): boolean {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
}