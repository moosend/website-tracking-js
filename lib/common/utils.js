"use strict";
exports.__esModule = true;
var Utils = (function () {
    function Utils() {
    }
    Utils.isValidUUID = function (uuidString) {
        var validUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return (validUUIDRegex.test(uuidString) ||
            validUUIDRegex.test(uuidString.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/gi, "$1-$2-$3-$4-$5")));
    };
    return Utils;
}());
exports["default"] = Utils;
