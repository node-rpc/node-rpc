import { Buffer } from "buffer";
import EventEmitter from "events";
import os from "os";

const endianness = os.endianness();
const supportBigInt = !!Buffer.prototype.writeBigInt64BE;
// tslint:disable-next-line: no-var-requires
const Long = supportBigInt ? BigInt : require("long");

const emit = (target: EventEmitter, e: Error, eventName = "tostreanerror") => {
    target.emit(eventName, e);
};

const BYTE_TYPE_LENGTH = {
    DOUBLE: 8,
    FLOAT: 4,
    INT: 4,
    INT16: 2,
    INT8: 1,
    LONG: 8,
};

export class ByteBuffer extends EventEmitter {

    public static alloc(size: number) {
        return new ByteBuffer(size);
    }

    // tslint:disable-next-line: variable-name
    private _initialSize: number = 0;
    // tslint:disable-next-line: variable-name
    private _offset: number = 0;
    // tslint:disable-next-line: variable-name
    private _limit: number = 0;
    // tslint:disable-next-line: variable-name
    private _smartIndex: number = 0;

    private buf: Buffer;

    constructor(size: number) {
        super();

        this.initialSize = size;
        this.limit = this.initialSize;
        this.buf = Buffer.alloc(this.initialSize);
    }

    set offset(ot: number) {
        this._offset = ot;
    }

    get offset(): number {
        return this._offset;
    }

    get limit(): number {
        return this._limit;
    }

    set limit(lt: number) {
        this._limit = lt;
    }

    get initialSize(): number {
        return this._initialSize;
    }

    set initialSize(iSize: number) {
        this._initialSize = iSize;
    }

    get smartIndex(): number {
        return this._smartIndex;
    }

    set smartIndex(index: number) {
        this._smartIndex = index;
    }

    /** write string to buffer */
    public writeString(str: string, offset: number = 0, encoding: BufferEncoding = "utf8" ) {
        try {
            const len = Buffer.byteLength(str, encoding);
            this.checkSize(len);
            this.buf.write(str, offset, len, encoding);
            this.increaseOffset(len);
        } catch (e) {
            emit(this, e);
        }
    }

    /** write int8 to buffer */
    public writeInt8(i8: number, offset: number = 0) {
        try {
            this.checkSize(BYTE_TYPE_LENGTH.INT8);
            this.buf.writeInt8(i8, offset);
            this.increaseOffset(BYTE_TYPE_LENGTH.INT8);
        } catch (e) {
            emit(this, e);
        }
    }

    /** write int16 to buffer */
    public writeInt16(i16: number, offset: number = 0) {
        try {
            this.checkSize(BYTE_TYPE_LENGTH.INT16);
            if (endianness === "BE") {
                this.buf.writeInt16BE(i16, offset);
            } else {
                this.buf.writeInt16LE(i16, offset);
            }
            this.increaseOffset(BYTE_TYPE_LENGTH.INT16);
        } catch (e) {
            emit(this, e);
        }
    }

    /** write int32 to buffer */
    public writeInt32(i32: number, offset: number = 0) {
        try {
            this.checkSize(BYTE_TYPE_LENGTH.INT);
            if (endianness === "LE") {
                this.buf.writeInt32LE(i32, offset);
            } else {
                this.buf.writeInt32BE(i32, offset);
            }
            this.increaseOffset(BYTE_TYPE_LENGTH.INT);
        } catch (e) {
            emit(this, e);
        }
    }

    /** write a float to buffer */
    public writeFloat(f: number, offset: number = 0): void {
        try {
            this.checkSize(BYTE_TYPE_LENGTH.FLOAT);
            if (endianness === "LE") {
                this.buf.writeFloatLE(f, offset);
            } else {
                this.buf.writeFloatBE(f, offset);
            }
            this.increaseOffset(BYTE_TYPE_LENGTH.FLOAT);
        } catch (e) {
            emit(this, e);
        }
    }

    /** write a double number to buffer */
    public writeDouble(de: number, offset: number = 0) {
        try {
            this.checkSize(BYTE_TYPE_LENGTH.DOUBLE);
            if (endianness === "LE") {
                this.buf.writeDoubleLE(de, offset);
            } else {
                this.buf.writeDoubleBE(de, offset);
            }
            this.increaseOffset(BYTE_TYPE_LENGTH.DOUBLE);
        } catch (e) {
            emit(this, e);
        }
    }

    /** write big int to buffer */
    public writeLong(l: string, offset: number = 0) {
        try {
            this.checkSize(BYTE_TYPE_LENGTH.LONG);
            if (endianness === "LE") {
                if (supportBigInt) {
                    this.buf.writeBigInt64LE(BigInt(l), offset);
                } else {
                    const big = new Long(l);
                    this.buf.writeInt32LE(big.low, offset);
                    this.buf.writeInt32BE(big.high, offset + 4);
                }
            } else {
                if (supportBigInt) {
                    this.buf.writeBigInt64BE(BigInt(l), offset);
                } else {
                    const big = new Long(l);
                    this.buf.writeInt32BE(big.low, offset);
                    this.buf.writeInt32BE(big.high, offset + 4);
                }
            }
            this.increaseOffset(BYTE_TYPE_LENGTH.LONG);
        } catch (e) {
            emit(this, e);
        }
    }

    /** === read method ====== */

    /** read int8 from buffer */
    public readInt8(offset: number = 0): number {
        if (this.smartIndex >= BYTE_TYPE_LENGTH.INT8) {
            this.smartIndex -= BYTE_TYPE_LENGTH.INT8;
        }
        return this.buf.readInt8(offset);
    }

    /** read int16 from buffer */
    public readInt16(offset: number = 0): number {
        if (this.smartIndex >= BYTE_TYPE_LENGTH.INT16) {
            this.smartIndex -= BYTE_TYPE_LENGTH.INT16;
        }
        if (endianness === "LE") {
            return this.buf.readInt16LE(offset);
        } else {
            return this.buf.readInt16BE(offset);
        }
    }

    /** read int32 from buffer */
    public readInt32(offset: number = 0): number {
        if (this.smartIndex >= BYTE_TYPE_LENGTH.INT) {
            this.smartIndex -= BYTE_TYPE_LENGTH.INT;
        }
        if (endianness === "LE") {
            return this.buf.readInt32LE(offset);
        } else {
            return this.buf.readInt32BE(offset);
        }
    }

    /** read long from buffer */
    public readLong(offset = 0): string {
        if (this.smartIndex >= BYTE_TYPE_LENGTH.LONG) {
            this.smartIndex -= BYTE_TYPE_LENGTH.LONG;
        }
        if (supportBigInt) {
            if (endianness === "LE") {
                return this.buf.readBigInt64LE(offset).toString();
            } else {
                return this.buf.readBigInt64BE(offset).toString();
            }
        } else {
            let low: number;
            let high: number;

            if (endianness === "BE") {
                low = this.buf.readInt32BE(offset);
                high = this.buf.readInt32BE(offset + 4);
            } else {
                low = this.buf.readInt32LE(offset);
                high = this.buf.readInt32LE(offset + 4);
            }
            return new Long(low, high).toString();
        }
    }

    /** read float from buffer */
    public readFloat(offset: number = 0): number {
        if (this.smartIndex >= BYTE_TYPE_LENGTH.FLOAT) {
            this.smartIndex -= BYTE_TYPE_LENGTH.FLOAT;
        }
        if (endianness === "LE") {
            return this.buf.readFloatLE(offset);
        } else {
            return this.buf.readFloatBE(offset);
        }
    }

    /** read double from  buffer */
    public readDouble(offset: number = 0): number {
        if (this.smartIndex >= BYTE_TYPE_LENGTH.DOUBLE) {
            this.smartIndex -= BYTE_TYPE_LENGTH.DOUBLE;
        }
        if (endianness === "LE") {
            return this.buf.readDoubleLE(offset);
        } else {
            return this.buf.readDoubleBE(offset);
        }
    }

    /**
     * read string from buffer
     * @param length
     * @param offset
     */
    public readString(length: number, offset: number = 0, encoding: string = "utf8"): string {
        if (this.smartIndex >= length) {
            this.smartIndex -= length;
        }
        const start = this.smartIndex;
        const end = start + length;
        return this.buf.slice(start, end).toString(encoding);
    }

    /**
     * check buffer size and auto grow
     * @param needSize
     */
    private checkSize(needSize: number) {
        if (needSize <= this.limit - this.offset) {
            return;
        }

        const oldLimit = this.limit;
        const oldBuf = this.buf;
        // tslint:disable-next-line: no-bitwise
        this.limit = oldLimit + (oldLimit >> 1) + needSize;
        this.limit = this.limit;

        this.buf = Buffer.alloc(this.limit);
        this.buf.copy(oldBuf, 0, this.offset);

    }

    /**
     * inscrease offset after writing byte to buffer
     * @param increaseSize
     */
    private increaseOffset(increaseSize: number): void {
        this.offset += increaseSize;
        this.smartIndex += increaseSize;
    }
}
