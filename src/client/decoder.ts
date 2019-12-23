import { IChanelDataType } from "./type";

export interface IDecoder {
    decode(message: string | Buffer): IChanelDataType | string;
}

export default class Decoder implements IDecoder {
    public decode(message: string | Buffer): IChanelDataType | string {
        if (typeof message === "string") {
            return message;
        } else {
            return { recieve : "mock!!" };
        }
    }
}
