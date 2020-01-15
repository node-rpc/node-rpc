"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RandomStrategy = /** @class */ (function () {
    function RandomStrategy(elements) {
        if (elements === void 0) { elements = []; }
        this.elements = elements;
    }
    RandomStrategy.prototype.select = function (content) {
        var length = this.elements.length;
        var rd = Math.floor(Math.random() * length);
        return this.elements[rd];
    };
    return RandomStrategy;
}());
exports.RandomStrategy = RandomStrategy;
