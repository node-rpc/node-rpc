"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
function md5(content) {
    var md5Hash = crypto_1.default.createHash("md5");
    return md5Hash.update(content).digest();
}
exports.md5 = md5;
