"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __importDefault(require("events"));
var zookeeper_1 = __importDefault(require("zookeeper"));
var ZKPromise = zookeeper_1.default.Promise;
var ZKClient = /** @class */ (function (_super) {
    __extends(ZKClient, _super);
    function ZKClient(config) {
        var _this = _super.call(this) || this;
        _this.zkConfig = config;
        _this.client = new ZKPromise(_this.zkConfig);
        _this.nodeMap = new Map();
        _this.watchNode = false;
        _this.on("onNode", function (_a) {
            var path = _a.path, children = _a.children;
            _this.nodeMap.set(path, children);
        });
        // bind function
        _this.watch = _this.watch.bind(_this);
        _this.listen = _this.listen.bind(_this);
        _this.watcher = _this.watch.bind(_this, _this.client, _this.listen);
        return _this;
    }
    ZKClient.prototype.connect = function (initParams) {
        if (initParams === void 0) { initParams = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var pe, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        pe = new Promise(function (resolve) {
                            _this.client.on("connect", function () {
                                resolve(true);
                            });
                        }).catch(function (e) {
                            throw e;
                        });
                        return [4 /*yield*/, this.client.init(initParams)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, pe];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_1 = _a.sent();
                        this.emit("connectError", e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * create node on zookeeper
     * @param path
     * @param flags
     * @param data
     */
    ZKClient.prototype.create = function (path, data, flags) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.create(path, data, flags)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        this.emit("createError", e_2);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * judge node is exist
     * @param path
     * @param watch
     */
    ZKClient.prototype.exist = function (path, watch) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.exists(path, watch)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_3 = _a.sent();
                        this.emit("existError", e_3);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * publish error
     * @param path
     * @param data
     * @param version
     */
    ZKClient.prototype.publish = function (path, data, version) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.set(path, data, version)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_4 = _a.sent();
                        this.emit("publishError", e_4);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * query data from node
     * @param path
     */
    ZKClient.prototype.query = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.get(path)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_5 = _a.sent();
                        this.emit("queryError", e_5);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * delete data from node
     * @param path
     * @param version
     */
    ZKClient.prototype.delete = function (path, version) {
        return __awaiter(this, void 0, void 0, function () {
            var e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.delete_(path, version)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_6 = _a.sent();
                        this.emit("deleteError", e_6);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * listen node by path
     * @param path
     */
    ZKClient.prototype.listen = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var children;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.watchNode = true;
                        return [4 /*yield*/, this.client.w_get_children(path, this.watcher)];
                    case 1:
                        children = _a.sent();
                        this.emit("onNode", { path: path, children: children });
                        return [2 /*return*/];
                }
            });
        });
    };
    ZKClient.prototype.mkdirp = function (path, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.mkdirp(path, cb)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_7 = _a.sent();
                        this.emit("mkdirError", e_7);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * close watch mode
     */
    ZKClient.prototype.unListen = function () {
        this.watchNode = false;
    };
    /** clear node map */
    ZKClient.prototype.exit = function () {
        this.unListen();
        this.nodeMap.clear();
    };
    ZKClient.prototype.getClient = function () {
        return this.client;
    };
    ZKClient.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.close()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_8 = _a.sent();
                        throw e_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ZKClient.prototype.getAcl = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.get_acl(path)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_9 = _a.sent();
                        this.emit("getAclError", e_9);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ZKClient.prototype.getNodeMap = function () {
        return this.nodeMap;
    };
    /**
     * watch function on node
     * @param client
     * @param func
     * @param type
     * @param state
     * @param path
     */
    ZKClient.prototype.watch = function (client, func, type, state, path) {
        return __awaiter(this, void 0, void 0, function () {
            var errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(type === 4 && this.watchNode)) return [3 /*break*/, 2];
                        return [4 /*yield*/, func(path)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        errorMessage = {
                            path: path,
                            state: state,
                            type: type,
                        };
                        // emit error
                        this.emit("onNodeError", errorMessage);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ZKClient;
}(events_1.default));
exports.ZKClient = ZKClient;
