import { Buffer } from "buffer";

import { IChanelDataType } from "./type";

export interface IEncoder {
    encode(dataWillBeEncode: IChanelDataType): Buffer;
}

export default class Encoder implements IEncoder {
    public encode(dataWillBeEncode: IChanelDataType): Buffer {
        return Buffer.alloc(128);
    }
}
