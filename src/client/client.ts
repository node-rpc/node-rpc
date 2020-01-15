import EventEmitter from "events";
import net from "net";
import { Decoder, IDecoder } from "./decoder";
import { Encoder, IEncoder } from "./encoder";
import { IChanelDataType } from "./type";

export interface IServerConfig {
    ip: string;
    port: number;
    duration?: number;
}

export class Client extends EventEmitter {
    private config: IServerConfig;
    private encoder: Encoder;
    private decoder: Decoder;
    private socket: net.Socket;
    private queue: IChanelDataType[];
    private ready: boolean;
    private duration: number;
    // private bufferCache: Buffer[];
    // private stringCache: string[];

    constructor(serverConfig: IServerConfig) {
        super();

        this.config = serverConfig;
        this.encoder = new Encoder();
        this.decoder = new Decoder();
        this.socket = new net.Socket();
        this.queue = [];
        this.ready = false;
        // thresold message to wait
        this.duration = serverConfig.duration || 100;

        this.attach();
    }

    public connnect() {
        const { port, ip } = this.config;
        this.socket.connect(port, ip);
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

    public decode(dataReceived: string | Buffer) {
        const decodeReceiveData: string | IChanelDataType = this.decoder.decode(dataReceived);
        this.emit("data", decodeReceiveData);
    }

    public write(dataWillBeSend: IChanelDataType): boolean {
        const waitStartingTime: number | undefined = dataWillBeSend.waitStartingTime;
        const now: number = Date.now();
        if (waitStartingTime && now - waitStartingTime > this.duration) {
            this.emit("throwway", dataWillBeSend);
            return true;
        }
        return this.socket.write(this.encode(dataWillBeSend));
    }

    public push(sendData: IChanelDataType) {
        if (this.ready && this.queue.length <= 0) {
            this.write(sendData);
        } else {
            // count wait time
            sendData.waitStartingTime = Date.now();
            this.queue.push(sendData);
        }
    }

    public finish(sendData: IChanelDataType) {
        if (this.ready && this.queue.length <= 0) {
            this.write(sendData);
        } else {
            // count wait time
            sendData.waitStartingTime = Date.now();
            this.queue.push(sendData);
        }
    }

    public close() {
        this.socket.destroy();
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
            this.decode(data);
        });
    }
}
