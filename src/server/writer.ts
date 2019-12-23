import { NextFNType } from "../server/middleware";
import Context from "./context";

export  default class Writer {

    constructor() {
        this.use  = this.use.bind(this);
    }

    public write(ctx: Context) {
        if (ctx.dataWillBeSend) {
            ctx.socket.write(ctx.dataWillBeSend);
        }
    }

    public async use(ctx: Context, next: NextFNType) {
        this.write(ctx);
        if (next) {
            next();
        }
    }
}
