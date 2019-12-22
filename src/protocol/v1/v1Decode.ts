import Context from "../../server/context";
import { NextFNType } from "../../server/middleware";
import ProtocolDecode from "../protocolDecode";

export default class V1Decode implements ProtocolDecode {

    constructor() {
        this.use = this.use.bind(this);
    }

    public async use(ctx: Context, next: NextFNType) {
        this.decode(ctx);
        if (next) {
            await next();
        }
    }

    public decode(ctx: Context): void {
        ctx.receive = {
            identifier: "dowork",
        };
    }
}
