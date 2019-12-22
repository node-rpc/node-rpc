import { Buffer } from "buffer";
import Context, { IReceiveDataType } from "../../server/context";
import { NextFNType } from "../../server/middleware";
import ProtocolEncode from "../protocolEncode";

export default class V1Encode implements ProtocolEncode {

    constructor() {
        this.use = this.use.bind(this);
    }

    public async use(ctx: Context, next: NextFNType) {
        this.encode(ctx);
        if (next) {
           await next();
        }
    }

    public encode(ctx: Context): void {
        const dataWillBeDecode: IReceiveDataType | undefined = ctx.dataWillBeDecode;
        if (dataWillBeDecode) {
            ctx.dataWillBeSend = Buffer.alloc(10);
        }
    }
}
