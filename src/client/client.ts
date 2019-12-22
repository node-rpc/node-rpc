import net from "net";
import Decoder, { IDecoder } from "./decoder";
import Encoder, { IEncoder } from "./encoder";
import { IChanelDataType } from "./type";

export interface IServerConfig {
    ip: string;
    port: number;
}

class Client {
    private config: IServerConfig;
    private encoder: Encoder;
    private decoder: Decoder;
    private socket: net.Socket;
    private queue: IChanelDataType[];
    private ready: boolean;
    private bufferCache: Buffer[];
    private stringCache: string[];

    constructor(serverConfig: IServerConfig) {
        this.config = serverConfig;
        this.encoder = new Encoder();
        this.decoder = new Decoder();
        this.socket = new net.Socket();
        this.bufferCache = [];
        this.stringCache = [];
        this.queue = [];
        this.ready = false;

        this.attach();
    }

    public connnect() {
        this.socket.connect(this.config);
    }

    public useEncoder(encoder: IEncoder): void {
        this.encoder = encoder;
    }

    public useDecoder(decoder: IDecoder) {
        this.decoder = decoder;
    }

    public encode(dataWillBeDecode: IChanelDataType): Buffer {
        return this.encoder.encode(dataWillBeDecode);
    }

    public decode(socket: net.Socket): IChanelDataType {
        return this.decoder.decode(socket);
    }

    public write(dataWillBeSend: IChanelDataType): boolean {
        return this.socket.write(this.encode(dataWillBeSend));
    }

    public push(sendData: IChanelDataType) {
        if (this.ready) {
            this.write(sendData);
        } else {
            this.queue.push(sendData);
        }
    }

    private flush() {
        while (this.queue.length > 0 && this.ready) {
            const channelData: IChanelDataType | undefined = this.queue.shift();
            if (channelData) {
                this.ready = this.write(channelData);
            }
        }
    }

    private attach() {
        this.socket.on("connect", () => {
            this.ready = true;
            this.flush();
        });

        this.socket.on("drain", () => {
            this.ready = true;
            this.flush();
        });

        this.socket.on("data", (data: Buffer | string) => {
            if (typeof data === "string") {
                this.stringCache.push(data);
            } else {
                this.bufferCache.push(data);
            }
        });
    }
}
