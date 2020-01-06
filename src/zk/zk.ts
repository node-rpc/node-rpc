import EventEmitter from "events";
import ZooKeeper from "zookeeper";
import signale from "signale";


const ZKPromise = ZooKeeper.Promise;
type ZK = typeof ZKPromise;
type BindWatchFunction = (path: string) => void;
type watcherFn = (type: number, state: number, path: string) => void;
type cbWatch = (cbParams: any) => void;

export interface IZKSelfConfig {
    connect: string;
    timeout: number;
    debug_level?: number;
    host_order_deterministic?: boolean;
}

export default class ZKClient extends EventEmitter {

    private zkConfig: IZKSelfConfig;
    private client: ZK;
    private nodeMap: Map<string, any>;
    private watchNode: boolean;
    private watcher: watcherFn;

    constructor(config: IZKSelfConfig) {
        super();

        this.zkConfig = config;
        this.client = new ZKPromise(this.zkConfig);
        this.nodeMap = new Map<string, any>();
        this.watchNode = false;

        this.on("onNode", (path: string, children: any) => {
            this.nodeMap.set(path, children);
        });

        // bind function
        this.watch = this.watch.bind(this);
        this.listen = this.listen.bind(this);
        this.watcher = this.watch.bind(this, this.client, this.listen);
    }

    public async connect(initParams: { [key: string]: any } = {}): Promise<any> {
        try {
            const pe = new Promise((resolve) => {
                this.client.on("connect", () => {
                    resolve(true);
                });
            }).catch((e) => {
                throw e;
            });
            await this.client.init(initParams);
            return await pe;
        } catch (e) {
            this.emit("connectError", e);
        }
    }

    /**
     * create node on zookeeper
     * @param path
     * @param flags
     * @param data
     */
    public async create(path: string, data: string | Buffer, flags: number, ) {
        try {
            return await this.client.create(path, flags, data);
        } catch (e) {
            this.emit("createError", e);
            return false;
        }
    }

    /**
     * judge node is exist
     * @param path
     * @param watch
     */
    public async exist(path: string, watch?: cbWatch) {
        try {
            return await this.client.exists(path, watch);
        } catch (e) {
            this.emit("existError", e);
            return false;
        }
    }

    /**
     * publish error
     * @param path
     * @param data
     * @param version
     */
    public async publish(path: string, data: string | Buffer, version?: number): Promise<any> {
        try {
            await this.client.set(path, data, version);
            return true;
        } catch (e) {
            this.emit("publishError", e);
            return false;
        }
    }

    /**
     * query data from node
     * @param path
     */
    public async query(path: string): Promise<any> {
        try {
            return await this.client.get(path);
        } catch (e) {
            this.emit("queryError", e);
            return false;
        }
    }

    /**
     * delete data from node
     * @param path
     * @param version
     */
    public async delete(path: string, version?: number) {
        try {
            await this.client.delete_(path, version);
            return true;
        } catch (e) {
            this.emit("deleteError", e);
            return false;
        }
    }

    /**
     * listen node by path
     * @param path
     */
    public async listen(path: string): Promise<any> {
        this.watchNode = true;
        const children: any = await this.client.w_get_children(path, () => {
            signale.debug("---run callback---");
        });
        this.emit("onNode", children);
    }

    /**
     * close watch mode
     */
    public unListen(): void {
        this.watchNode = false;
    }

    /** clear node map */
    public exit(): void {
        this.unListen();
        this.nodeMap.clear();
    }

    public getClient(): ZK {
        return this.client;
    }

    public async close() {
        try {
            return await this.client.close();
        } catch (e) {
            throw e;
        }
    }

    public async getAcl(path: string) {
        try {
            return await this.client.get_acl(path);
        } catch (e) {
            this.emit("getAclError", e);
            return false;
        }
    }

    /**
     * watch function on node
     * @param client
     * @param func
     * @param type
     * @param state
     * @param path
     */
    private async watch(client: ZK, func: BindWatchFunction, type: number, state: number, path: string): Promise<any> {
        if (type === 4 && this.watchNode) {
            await func(path);
        } else {
            const errorMessage = {
                path,
                state,
                type,
            };
            // emit error
            this.emit("onNodeError", errorMessage);
        }
    }

}
