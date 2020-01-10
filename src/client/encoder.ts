import { Buffer } from "buffer";
import hessian from "hessian.js";

import { IChanelDataType } from "./type";

export interface IEncoder {
    encode(dataWillBeEncode: IChanelDataType): Buffer;
}

export class Encoder implements IEncoder {
    public encode(dataWillBeEncode: IChanelDataType): Buffer {
        return hessian.encode(dataWillBeEncode, "2.0");
    }
}
