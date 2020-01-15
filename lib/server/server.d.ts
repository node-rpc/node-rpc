/// <reference types="node" />
import EventEmitter from "events";
import net from "net";
import { MF } from "./middleware";
interface IServerConfig {
    port: number;
    host?: string;
}
export declare class Server extends EventEmitter {
    private port;
    private server;
    private host;
    private middleware;
    private ctxList;
    constructor(config: IServerConfig);
    start(): void;
    connect(socket: net.Socket): void;
    /**
     * register middleware
     * @param mf
     */
    use(mf: MF): void;
    /**
     * destroy server
     */
    stop(): void;
    private handleError;
    private listen;
}
export {};
