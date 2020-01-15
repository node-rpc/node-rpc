/// <reference types="node" />
import net from "net";
export interface IReceiveDataType {
    [key: string]: any;
}
export declare class Context {
    socket: net.Socket;
    receive: IReceiveDataType;
    dataWillBeEncode?: IReceiveDataType;
    dataWillBeSend?: Buffer;
    dataWillBeDecode?: Buffer | string;
    uuid: string;
    constructor(socket: net.Socket);
}
