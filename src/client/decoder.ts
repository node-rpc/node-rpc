import hessian from "hessian.js";
import signale from "signale";
import { IChanelDataType } from "./type";

export interface IDecoder {
    decode(message: string | Buffer): IChanelDataType | string;
}

export class Decoder implements IDecoder {
    public decode(message: string | Buffer): IChanelDataType | string {
        if (typeof message === "string") {
            return message;
        } else {
            return hessian.decode(message, "2.0");
        }
    }
}
