import { Buffer } from "buffer";
import hessian from "hessian.js";
import { Context } from "../../server/context";
import { NextFNType } from "../../server/middleware";
import { IProtocolDecode } from "../protocolDecode";

export class V1Decode implements IProtocolDecode {

    constructor() {
        this.use = this.use.bind(this);
    }

    public async use(ctx: Context, next: NextFNType) {
        await this.decode(ctx);
        if (next) {
            await next();
        }
    }

    public async decode(ctx: Context): Promise<any> {
        const dataWillBeDecode: Buffer | string | undefined = ctx.dataWillBeDecode;
        if (Buffer.isBuffer(dataWillBeDecode)) {
            ctx.receive = hessian.decode(dataWillBeDecode, "2.0");
        } else if (typeof dataWillBeDecode === "string") {
            ctx.receive = {
                data: dataWillBeDecode,
                identifier: dataWillBeDecode,
            };
        }
    }
}
