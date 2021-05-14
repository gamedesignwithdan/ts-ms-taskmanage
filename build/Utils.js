"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var Utils = /** @class */ (function () {
    function Utils() {
    }
    // redundant as typescript compiles to js intelligently same as Object.keys(object)
    Utils.getKeys = function (object) {
        var keyArray = [];
        for (var key in object) {
            keyArray.push(key);
        }
        return keyArray;
    };
    return Utils;
}());
exports.Utils = Utils;
