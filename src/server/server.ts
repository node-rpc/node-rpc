import EventEmitter from "events";
import net from "net";

interface IServerConfig {
    port: number;
    ip?: string;
}

export default class Server extends EventEmitter {
    private port: number;
    private server: net.Server | null;
    private ip: string;

    constructor(config: IServerConfig) {
        super();

        this.port = config.port;
        this.server = null;
        this.ip = config.ip || "127.0.0.1";
    }

    public start(): void {
        this.server =  net.createServer();
        this.server.listen(this.port, this.ip);

        // listen
        this.server.on("connection", (socket: net.Socket) => this.connect(socket));
        this.server.on("error", (err: Error) => this.handleError(err));
    }

    public connect(socket: net.Socket) {
        console.log(`connnection: ${JSON.stringify(process.env)}`);
    }

    public handleError(err: Error) {
        console.log(err);
    }

}
