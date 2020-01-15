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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __importDefault(require("events"));
var net_1 = __importDefault(require("net"));
var context_1 = require("./context");
var middleware_1 = require("./middleware");
var Server = /** @class */ (function (_super) {
    __extends(Server, _super);
    function Server(config) {
        var _this = _super.call(this) || this;
        _this.port = config.port;
        _this.server = null;
        _this.host = config.host || "127.0.0.1";
        _this.middleware = new middleware_1.Middleware();
        _this.ctxList = [];
        return _this;
    }
    Server.prototype.start = function () {
        var _this = this;
        this.server = net_1.default.createServer();
        this.server.listen(this.port, this.host);
        // listen
        this.server.on("connection", function (socket) { return _this.connect(socket); });
        this.server.on("error", function (err) { return _this.handleError(err); });
        // emit start event
        this.emit("start", { host: this.host, port: this.port });
    };
    Server.prototype.connect = function (socket) {
        var ctx = new context_1.Context(socket);
        this.ctxList.push(ctx);
        this.listen(ctx);
    };
    /**
     * register middleware
     * @param mf
     */
    Server.prototype.use = function (mf) {
        this.middleware.use(mf);
    };
    /**
     * destroy server
     */
    Server.prototype.stop = function () {
        var _a;
        this.ctxList.forEach(function (ctx) {
            ctx.socket.destroy();
        });
        this.ctxList = [];
        (_a = this.server) === null || _a === void 0 ? void 0 : _a.close();
    };
    Server.prototype.handleError = function (err) {
        this.emit("error", err);
    };
    Server.prototype.listen = function (ctx) {
        var _this = this;
        ctx.socket.on("data", function (data) {
            ctx.dataWillBeDecode = data;
            _this.middleware.run(ctx);
        });
    };
    return Server;
}(events_1.default));
exports.Server = Server;
