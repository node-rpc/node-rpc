/// <reference types="node" />
import { IChanelDataType } from "./type";
export interface IDecoder {
    decode(message: string | Buffer): IChanelDataType | string;
}
export declare class Decoder implements IDecoder {
    decode(message: string | Buffer): IChanelDataType | string;
}
