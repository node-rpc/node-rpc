/// <reference types="node" />
import { IChanelDataType } from "./type";
export interface IEncoder {
    encode(dataWillBeEncode: IChanelDataType): Buffer;
}
export declare class Encoder implements IEncoder {
    encode(dataWillBeEncode: IChanelDataType): Buffer;
}
