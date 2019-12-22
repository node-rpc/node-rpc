import net from "net";

import { IChanelDataType } from "./type";

export interface IDecoder {
    decode(socket: net.Socket): IChanelDataType;
}

export default class Decoder implements IDecoder {
    public decode(socket: net.Socket): IChanelDataType {
        return {};
    }
}
