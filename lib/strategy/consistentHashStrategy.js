"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var md5_1 = require("../utils/md5");
var ConsistentHashStrategy = /** @class */ (function () {
    function ConsistentHashStrategy(elements, virtualNodeCount) {
        if (elements === void 0) { elements = []; }
        this.elements = elements;
        this.sortedKeys = [];
        this.nodeMaps = new Map();
        this.virtualNodeCount = virtualNodeCount;
        this.resetNodes();
    }
    ConsistentHashStrategy.prototype.toHash = function (content) {
        return md5_1.md5(content);
    };
    /* tslint:disable  no-bitwise */
    ConsistentHashStrategy.prototype.digiest = function (hash, index) {
        var f = ((hash[3 + index * 4] & 0xFF) << 24) |
            ((hash[2 + index * 4] & 0xFF) << 16) |
            ((hash[1 + index * 4] & 0xFF) << 8) |
            (hash[index * 4] & 0xFF);
        return f & 0xFFFFFFFF;
    };
    /* tslint:enable  no-bitwise */
    // build consistent hash circle
    ConsistentHashStrategy.prototype.resetNodes = function () {
        var len = this.elements.length;
        for (var i = 0; i < len; i++) {
            var element = this.elements[i];
            var hash = this.toHash("" + element.ip + element.port);
            for (var index = 0; index < this.virtualNodeCount; index++) {
                var nodeDigest = this.digiest(hash, index);
                this.nodeMaps.set(nodeDigest, element);
            }
        }
        this.sortedKeys = Array.from(this.nodeMaps.keys());
        this.sortedKeys.sort(function (a, b) { return a - b; });
    };
    /**
     * select one key by content
     * @param content
     */
    ConsistentHashStrategy.prototype.select = function (content) {
        var hitKey = 0;
        var digiest = 0;
        var len = this.sortedKeys.length;
        if (typeof content === "string") {
            var hash = this.toHash(content);
            digiest = this.digiest(hash, 0);
        }
        else if (typeof content === "number") {
            digiest = content;
        }
        else {
            digiest = 0;
        }
        // signale.debug(digiest);
        if (this.sortedKeys[len - 1] >= digiest) {
            for (var i = len - 1; i >= 0; i--) {
                if (this.sortedKeys[i] < digiest) {
                    hitKey = this.sortedKeys[i];
                    break;
                }
            }
        }
        // return hit key
        return this.nodeMaps.get(hitKey) || this.elements[0];
    };
    return ConsistentHashStrategy;
}());
exports.ConsistentHashStrategy = ConsistentHashStrategy;
