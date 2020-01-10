import EventEmitter from "events";
import net from "net";
import { Context } from "./context";
import { MF, Middleware } from "./middleware";

interface IServerConfig {
    port: number;
    host?: string;
}

export class Server extends EventEmitter {
    private port: number;
    private server: net.Server | null;
    private host: string;
    private middleware: Middleware;
    private ctxList: Context[];

    constructor(config: IServerConfig) {
        super();

        this.port = config.port;
        this.server = null;
        this.host = config.host || "127.0.0.1";
        this.middleware = new Middleware();
        this.ctxList = [];
    }

    public start(): void {
        this.server =  net.createServer();
        this.server.listen(this.port, this.host);

        // listen
        this.server.on("connection", (socket: net.Socket) => this.connect(socket));
        this.server.on("error", (err: Error) => this.handleError(err));
    }

    public connect(socket: net.Socket) {
        const ctx: Context = new Context(socket);
        this.ctxList.push(ctx);
        this.listen(ctx);
    }

    /**
     * register middleware
     * @param mf
     */
    public use(mf: MF) {
        this.middleware.use(mf);
    }

    /**
     * destroy server
     */
    public stop() {
        this.ctxList.forEach((ctx: Context) => {
            ctx.socket.destroy();
        });

        this.ctxList = [];
        this.server?.close();
    }

    private handleError(err: Error) {
        this.emit("error", err);
    }

    private listen(ctx: Context) {
        ctx.socket.on("data", (data: Buffer | string ) => {
            ctx.dataWillBeDecode = data;
            this.middleware.run(ctx);
        });
    }
}
