"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var hessian_js_1 = __importDefault(require("hessian.js"));
var Encoder = /** @class */ (function () {
    function Encoder() {
    }
    Encoder.prototype.encode = function (dataWillBeEncode) {
        return hessian_js_1.default.encode(dataWillBeEncode, "2.0");
    };
    return Encoder;
}());
exports.Encoder = Encoder;
