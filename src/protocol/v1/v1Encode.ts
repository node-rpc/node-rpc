import { Buffer } from "buffer";
import hessian from "hessian.js";
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
        const dataWillBeEncode: IReceiveDataType | undefined = ctx.dataWillBeEncode;
        if (dataWillBeEncode) {
            ctx.dataWillBeSend = hessian.encode(dataWillBeEncode, "2.0");
        }
    }
}
