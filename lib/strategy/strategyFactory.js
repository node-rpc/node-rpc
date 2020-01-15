"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var consistentHashStrategy_1 = require("./consistentHashStrategy");
var randomStrategy_1 = require("./randomStrategy");
var virtualNodeCount = 4;
var StrategyFactory = /** @class */ (function () {
    function StrategyFactory() {
    }
    StrategyFactory.prototype.build = function (elements, flag) {
        var _a;
        var identifier = (_a = flag) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (identifier === "c") {
            return new consistentHashStrategy_1.ConsistentHashStrategy(elements, virtualNodeCount);
        }
        return new randomStrategy_1.RandomStrategy(elements);
    };
    return StrategyFactory;
}());
exports.StrategyFactory = StrategyFactory;
