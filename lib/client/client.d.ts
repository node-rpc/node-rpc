/// <reference types="node" />
import EventEmitter from "events";
import { IDecoder } from "./decoder";
import { IEncoder } from "./encoder";
import { IChanelDataType } from "./type";
export interface IServerConfig {
    ip: string;
    port: number;
    duration?: number;
}
export declare class Client extends EventEmitter {
    private config;
    private encoder;
    private decoder;
    private socket;
    private queue;
    private ready;
    private duration;
    constructor(serverConfig: IServerConfig);
    connnect(): void;
    useEncoder(encoder: IEncoder): void;
    useDecoder(decoder: IDecoder): void;
    encode(dataWillBeDecode: IChanelDataType): Buffer;
    decode(dataReceived: string | Buffer): void;
    write(dataWillBeSend: IChanelDataType): boolean;
    push(sendData: IChanelDataType): void;
    private flush;
    private attach;
}
