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
var decoder_1 = require("./decoder");
var encoder_1 = require("./encoder");
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client(serverConfig) {
        var _this = _super.call(this) || this;
        _this.config = serverConfig;
        _this.encoder = new encoder_1.Encoder();
        _this.decoder = new decoder_1.Decoder();
        _this.socket = new net_1.default.Socket();
        _this.queue = [];
        _this.ready = false;
        // thresold message to wait
        _this.duration = serverConfig.duration || 100;
        _this.attach();
        return _this;
    }
    Client.prototype.connnect = function () {
        var _a = this.config, port = _a.port, ip = _a.ip;
        this.socket.connect(port, ip);
    };
    Client.prototype.useEncoder = function (encoder) {
        this.encoder = encoder;
    };
    Client.prototype.useDecoder = function (decoder) {
        this.decoder = decoder;
    };
    Client.prototype.encode = function (dataWillBeDecode) {
        return this.encoder.encode(dataWillBeDecode);
    };
    Client.prototype.decode = function (dataReceived) {
        var decodeReceiveData = this.decoder.decode(dataReceived);
        this.emit("data", decodeReceiveData);
    };
    Client.prototype.write = function (dataWillBeSend) {
        var waitStartingTime = dataWillBeSend.waitStartingTime;
        var now = Date.now();
        if (waitStartingTime && now - waitStartingTime > this.duration) {
            this.emit("throwway", dataWillBeSend);
            return true;
        }
        var writeSuccess = this.socket.write(this.encode(dataWillBeSend));
        this.checkQueueIsNull();
        return writeSuccess;
    };
    Client.prototype.push = function (sendData) {
        if (this.ready && this.queue.length <= 0) {
            this.write(sendData);
        }
        else {
            // count wait time
            sendData.waitStartingTime = Date.now();
            this.queue.push(sendData);
        }
    };
    Client.prototype.finish = function (sendData) {
        if (this.ready && this.queue.length <= 0) {
            this.write(sendData);
        }
        else {
            // count wait time
            sendData.waitStartingTime = Date.now();
            this.queue.push(sendData);
        }
    };
    Client.prototype.close = function () {
        var _this = this;
        this.on("_close", function () {
            try {
                _this.socket.destroy();
                _this.emit("closeFinished");
            }
            catch (e) {
                _this.emit("closeError", e);
            }
        });
    };
    Client.prototype.flush = function () {
        while (this.queue.length > 0 && this.ready) {
            var channelData = this.queue.shift();
            if (channelData) {
                this.ready = this.write(channelData);
            }
        }
    };
    Client.prototype.attach = function () {
        var _this = this;
        this.socket.on("connect", function () {
            _this.ready = true;
            _this.flush();
        });
        this.socket.on("drain", function () {
            _this.ready = true;
            _this.flush();
        });
        this.socket.on("data", function (data) {
            _this.decode(data);
        });
    };
    Client.prototype.checkQueueIsNull = function () {
        if (!this.queue.length) {
            this.emit("_close");
            return true;
        }
        return false;
    };
    return Client;
}(events_1.default));
exports.Client = Client;
