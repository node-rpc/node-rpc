"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var v1_1 = __importDefault(require("uuid/v1"));
var Context = /** @class */ (function () {
    function Context(socket) {
        this.socket = socket;
        this.receive = {};
        this.uuid = v1_1.default();
    }
    return Context;
}());
exports.Context = Context;
