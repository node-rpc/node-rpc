/// <reference types="node" />
import EventEmitter from "events";
declare const ZKPromise: any;
declare type ZK = typeof ZKPromise;
declare type cbWatch = (cbParams: any) => void;
export interface IZKSelfConfig {
    connect: string;
    timeout: number;
    debug_level?: number;
    host_order_deterministic?: boolean;
}
export declare class ZKClient extends EventEmitter {
    private zkConfig;
    private client;
    private nodeMap;
    private watchNode;
    private watcher;
    constructor(config: IZKSelfConfig);
    connect(initParams?: {
        [key: string]: any;
    }): Promise<any>;
    /**
     * create node on zookeeper
     * @param path
     * @param flags
     * @param data
     */
    create(path: string, data: string | Buffer, flags: number): Promise<any>;
    /**
     * judge node is exist
     * @param path
     * @param watch
     */
    exist(path: string, watch?: cbWatch): Promise<any>;
    /**
     * publish error
     * @param path
     * @param data
     * @param version
     */
    publish(path: string, data: string | Buffer, version?: number): Promise<any>;
    /**
     * query data from node
     * @param path
     */
    query(path: string): Promise<any>;
    /**
     * delete data from node
     * @param path
     * @param version
     */
    delete(path: string, version?: number): Promise<boolean>;
    /**
     * listen node by path
     * @param path
     */
    listen(path: string): Promise<any>;
    mkdirp(path: string, cb: cbWatch): Promise<any>;
    /**
     * close watch mode
     */
    unListen(): void;
    /** clear node map */
    exit(): void;
    getClient(): ZK;
    close(): Promise<any>;
    getAcl(path: string): Promise<any>;
    getNodeMap(): Map<string, any>;
    /**
     * watch function on node
     * @param client
     * @param func
     * @param type
     * @param state
     * @param path
     */
    private watch;
}
export {};
