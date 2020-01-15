"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var hessian_js_1 = __importDefault(require("hessian.js"));
var Decoder = /** @class */ (function () {
    function Decoder() {
    }
    Decoder.prototype.decode = function (message) {
        if (typeof message === "string") {
            return message;
        }
        else {
            return hessian_js_1.default.decode(message, "2.0");
        }
    };
    return Decoder;
}());
exports.Decoder = Decoder;
