import { Buffer } from "buffer";
import net from "net";
import uuidv1 from "uuid/v1";

export interface IReceiveDataType {
    [key: string]: any;
}

export default class Context {
    public socket: net.Socket;
    public receive: IReceiveDataType;
    public dataWillBeDecode?: IReceiveDataType;
    public dataWillBeSend?: Buffer;
    public uuid: string;

    constructor(socket: net.Socket) {
        this.socket = socket;
        this.receive = {};
        this.uuid = uuidv1();
    }
}
