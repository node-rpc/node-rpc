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
var buffer_1 = require("buffer");
var events_1 = __importDefault(require("events"));
var os_1 = __importDefault(require("os"));
var endianness = os_1.default.endianness();
var supportBigInt = !!buffer_1.Buffer.prototype.writeBigInt64BE;
// tslint:disable-next-line: no-var-requires
var Long = supportBigInt ? BigInt : require("long");
var emit = function (target, e, eventName) {
    if (eventName === void 0) { eventName = "tostreanerror"; }
    target.emit(eventName, e);
};
var BYTE_TYPE_LENGTH = {
    DOUBLE: 8,
    FLOAT: 4,
    INT: 4,
    INT16: 2,
    INT8: 1,
    LONG: 8,
};
var ByteBuffer = /** @class */ (function (_super) {
    __extends(ByteBuffer, _super);
    function ByteBuffer(size) {
        var _this = _super.call(this) || this;
        // tslint:disable-next-line: variable-name
        _this._initialSize = 0;
        // tslint:disable-next-line: variable-name
        _this._offset = 0;
        // tslint:disable-next-line: variable-name
        _this._limit = 0;
        // tslint:disable-next-line: variable-name
        _this._smartIndex = 0;
        _this.initialSize = size;
        _this.limit = _this.initialSize;
        _this.buf = buffer_1.Buffer.alloc(_this.initialSize);
        return _this;
    }
    ByteBuffer.alloc = function (size) {
        return new ByteBuffer(size);
    };
    Object.defineProperty(ByteBuffer.prototype, "offset", {
        get: function () {
            return this._offset;
        },
        set: function (ot) {
            this._offset = ot;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteBuffer.prototype, "limit", {
        get: function () {
            return this._limit;
        },
        set: function (lt) {
            this._limit = lt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteBuffer.prototype, "initialSize", {
        get: function () {
            return this._initialSize;
        },
        set: function (iSize) {
            this._initialSize = iSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteBuffer.prototype, "smartIndex", {
        get: function () {
            return this._smartIndex;
        },
        set: function (index) {
            this._smartIndex = index;
        },
        enumerable: true,
        configurable: true
    });
    /** write string to buffer */
    ByteBuffer.prototype.writeString = function (str, offset, encoding) {
        if (offset === void 0) { offset = 0; }
        if (encoding === void 0) { encoding = "utf8"; }
        try {
            var len = buffer_1.Buffer.byteLength(str, encoding);
            this.checkSize(len);
            this.buf.write(str, offset, len, encoding);
            this.increaseOffset(len);
        }
        catch (e) {
            emit(this, e);
        }
    };
    /** write int8 to buffer */
    ByteBuffer.prototype.writeInt8 = function (i8, offset) {
        if (offset === void 0) { offset = 0; }
        try {
            this.checkSize(BYTE_TYPE_LENGTH.INT8);
            this.buf.writeInt8(i8, offset);
            this.increaseOffset(BYTE_TYPE_LENGTH.INT8);
        }
        catch (e) {
            emit(this, e);
        }
    };
    /** write int16 to buffer */
    ByteBuffer.prototype.writeInt16 = function (i16, offset) {
        if (offset === void 0) { offset = 0; }
        try {
            this.checkSize(BYTE_TYPE_LENGTH.INT16);
            if (endianness === "BE") {
                this.buf.writeInt16BE(i16, offset);
            }
            else {
                this.buf.writeInt16LE(i16, offset);
            }
            this.increaseOffset(BYTE_TYPE_LENGTH.INT16);
        }
        catch (e) {
            emit(this, e);
        }
    };
    /** write int32 to buffer */
    ByteBuffer.prototype.writeInt32 = function (i32, offset) {
        if (offset === void 0) { offset = 0; }
        try {
            this.checkSize(BYTE_TYPE_LENGTH.INT);
            if (endianness === "LE") {
                this.buf.writeInt32LE(i32, offset);
            }
            else {
                this.buf.writeInt32BE(i32, offset);
            }
            this.increaseOffset(BYTE_TYPE_LENGTH.INT);
        }
        catch (e) {
            emit(this, e);
        }
    };
    /** write a float to buffer */
    ByteBuffer.prototype.writeFloat = function (f, offset) {
        if (offset === void 0) { offset = 0; }
        try {
            this.checkSize(BYTE_TYPE_LENGTH.FLOAT);
            if (endianness === "LE") {
                this.buf.writeFloatLE(f, offset);
            }
            else {
                this.buf.writeFloatBE(f, offset);
            }
            this.increaseOffset(BYTE_TYPE_LENGTH.FLOAT);
        }
        catch (e) {
            emit(this, e);
        }
    };
    /** write a double number to buffer */
    ByteBuffer.prototype.writeDouble = function (de, offset) {
        if (offset === void 0) { offset = 0; }
        try {
            this.checkSize(BYTE_TYPE_LENGTH.DOUBLE);
            if (endianness === "LE") {
                this.buf.writeDoubleLE(de, offset);
            }
            else {
                this.buf.writeDoubleBE(de, offset);
            }
            this.increaseOffset(BYTE_TYPE_LENGTH.DOUBLE);
        }
        catch (e) {
            emit(this, e);
        }
    };
    /** write big int to buffer */
    ByteBuffer.prototype.writeLong = function (l, offset) {
        if (offset === void 0) { offset = 0; }
        try {
            this.checkSize(BYTE_TYPE_LENGTH.LONG);
            if (endianness === "LE") {
                if (supportBigInt) {
                    this.buf.writeBigInt64LE(BigInt(l), offset);
                }
                else {
                    var big = new Long(l);
                    this.buf.writeInt32LE(big.low, offset);
                    this.buf.writeInt32BE(big.high, offset + 4);
                }
            }
            else {
                if (supportBigInt) {
                    this.buf.writeBigInt64BE(BigInt(l), offset);
                }
                else {
                    var big = new Long(l);
                    this.buf.writeInt32BE(big.low, offset);
                    this.buf.writeInt32BE(big.high, offset + 4);
                }
            }
            this.increaseOffset(BYTE_TYPE_LENGTH.LONG);
        }
        catch (e) {
            emit(this, e);
        }
    };
    /** === read method ====== */
    /** read int8 from buffer */
    ByteBuffer.prototype.readInt8 = function (offset) {
        if (offset === void 0) { offset = 0; }
        if (this.smartIndex >= BYTE_TYPE_LENGTH.INT8) {
            this.smartIndex -= BYTE_TYPE_LENGTH.INT8;
        }
        return this.buf.readInt8(offset);
    };
    /** read int16 from buffer */
    ByteBuffer.prototype.readInt16 = function (offset) {
        if (offset === void 0) { offset = 0; }
        if (this.smartIndex >= BYTE_TYPE_LENGTH.INT16) {
            this.smartIndex -= BYTE_TYPE_LENGTH.INT16;
        }
        if (endianness === "LE") {
            return this.buf.readInt16LE(offset);
        }
        else {
            return this.buf.readInt16BE(offset);
        }
    };
    /** read int32 from buffer */
    ByteBuffer.prototype.readInt32 = function (offset) {
        if (offset === void 0) { offset = 0; }
        if (this.smartIndex >= BYTE_TYPE_LENGTH.INT) {
            this.smartIndex -= BYTE_TYPE_LENGTH.INT;
        }
        if (endianness === "LE") {
            return this.buf.readInt32LE(offset);
        }
        else {
            return this.buf.readInt32BE(offset);
        }
    };
    /** read long from buffer */
    ByteBuffer.prototype.readLong = function (offset) {
        if (offset === void 0) { offset = 0; }
        if (this.smartIndex >= BYTE_TYPE_LENGTH.LONG) {
            this.smartIndex -= BYTE_TYPE_LENGTH.LONG;
        }
        if (supportBigInt) {
            if (endianness === "LE") {
                return this.buf.readBigInt64LE(offset).toString();
            }
            else {
                return this.buf.readBigInt64BE(offset).toString();
            }
        }
        else {
            var low = void 0;
            var high = void 0;
            if (endianness === "BE") {
                low = this.buf.readInt32BE(offset);
                high = this.buf.readInt32BE(offset + 4);
            }
            else {
                low = this.buf.readInt32LE(offset);
                high = this.buf.readInt32LE(offset + 4);
            }
            return new Long(low, high).toString();
        }
    };
    /** read float from buffer */
    ByteBuffer.prototype.readFloat = function (offset) {
        if (offset === void 0) { offset = 0; }
        if (this.smartIndex >= BYTE_TYPE_LENGTH.FLOAT) {
            this.smartIndex -= BYTE_TYPE_LENGTH.FLOAT;
        }
        if (endianness === "LE") {
            return this.buf.readFloatLE(offset);
        }
        else {
            return this.buf.readFloatBE(offset);
        }
    };
    /** read double from  buffer */
    ByteBuffer.prototype.readDouble = function (offset) {
        if (offset === void 0) { offset = 0; }
        if (this.smartIndex >= BYTE_TYPE_LENGTH.DOUBLE) {
            this.smartIndex -= BYTE_TYPE_LENGTH.DOUBLE;
        }
        if (endianness === "LE") {
            return this.buf.readDoubleLE(offset);
        }
        else {
            return this.buf.readDoubleBE(offset);
        }
    };
    /**
     * read string from buffer
     * @param length
     * @param offset
     */
    ByteBuffer.prototype.readString = function (length, offset, encoding) {
        if (offset === void 0) { offset = 0; }
        if (encoding === void 0) { encoding = "utf8"; }
        if (this.smartIndex >= length) {
            this.smartIndex -= length;
        }
        var start = this.smartIndex;
        var end = start + length;
        return this.buf.slice(start, end).toString(encoding);
    };
    /**
     * check buffer size and auto grow
     * @param needSize
     */
    ByteBuffer.prototype.checkSize = function (needSize) {
        if (needSize <= this.limit - this.offset) {
            return;
        }
        var oldLimit = this.limit;
        var oldBuf = this.buf;
        // tslint:disable-next-line: no-bitwise
        this.limit = oldLimit + (oldLimit >> 1) + needSize;
        this.limit = this.limit;
        this.buf = buffer_1.Buffer.alloc(this.limit);
        this.buf.copy(oldBuf, 0, this.offset);
    };
    /**
     * inscrease offset after writing byte to buffer
     * @param increaseSize
     */
    ByteBuffer.prototype.increaseOffset = function (increaseSize) {
        this.offset += increaseSize;
        this.smartIndex += increaseSize;
    };
    return ByteBuffer;
}(events_1.default));
exports.ByteBuffer = ByteBuffer;
