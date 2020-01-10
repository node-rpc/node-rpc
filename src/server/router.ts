import EventEmitter from "events";
import { Context, IReceiveDataType } from "./context";
import { MF, NextFNType } from "./middleware";

type Listener = (ctx: Context) => void;

export class Router {
    public route: MF;
    private event: EventEmitter;

    constructor() {
        this.event = new EventEmitter();
        this.route = this.use.bind(this);
    }

    /**
     * middleware
     * @param ctx
     * @param next
     */
    public async use(ctx: Context, next: NextFNType) {
        const receive: IReceiveDataType = ctx.receive;
        if (receive && receive.identifier) {
            this.emit(receive.identifier, ctx);
        }

        if (next) {
            await next();
        }

    }

    public setRoute(route: MF) {
        this.route = route.bind(this);
    }

    public on(eventName: string, listener: Listener) {
        this.event.on(eventName, listener);
    }

    private emit(eventName: string, ctx: Context) {
        this.event.emit(eventName, ctx);
    }
}
