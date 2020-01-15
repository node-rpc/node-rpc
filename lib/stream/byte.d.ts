/// <reference types="node" />
import EventEmitter from "events";
export declare class ByteBuffer extends EventEmitter {
    static alloc(size: number): ByteBuffer;
    private _initialSize;
    private _offset;
    private _limit;
    private _smartIndex;
    private buf;
    constructor(size: number);
    set offset(ot: number);
    get offset(): number;
    get limit(): number;
    set limit(lt: number);
    get initialSize(): number;
    set initialSize(iSize: number);
    get smartIndex(): number;
    set smartIndex(index: number);
    /** write string to buffer */
    writeString(str: string, offset?: number, encoding?: BufferEncoding): void;
    /** write int8 to buffer */
    writeInt8(i8: number, offset?: number): void;
    /** write int16 to buffer */
    writeInt16(i16: number, offset?: number): void;
    /** write int32 to buffer */
    writeInt32(i32: number, offset?: number): void;
    /** write a float to buffer */
    writeFloat(f: number, offset?: number): void;
    /** write a double number to buffer */
    writeDouble(de: number, offset?: number): void;
    /** write big int to buffer */
    writeLong(l: string, offset?: number): void;
    /** === read method ====== */
    /** read int8 from buffer */
    readInt8(offset?: number): number;
    /** read int16 from buffer */
    readInt16(offset?: number): number;
    /** read int32 from buffer */
    readInt32(offset?: number): number;
    /** read long from buffer */
    readLong(offset?: number): string;
    /** read float from buffer */
    readFloat(offset?: number): number;
    /** read double from  buffer */
    readDouble(offset?: number): number;
    /**
     * read string from buffer
     * @param length
     * @param offset
     */
    readString(length: number, offset?: number, encoding?: string): string;
    /**
     * check buffer size and auto grow
     * @param needSize
     */
    private checkSize;
    /**
     * inscrease offset after writing byte to buffer
     * @param increaseSize
     */
    private increaseOffset;
}
