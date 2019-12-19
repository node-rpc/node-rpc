import EventEmitter from "events";
import Contex, { IReceiveDataType } from "./context";
import { MF, NextFNType } from "./middleware";

type Listener = (ctx: Contex) => void;

export default class Router {
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
    public async use(ctx: Contex, next: NextFNType) {
        const receive: IReceiveDataType = ctx.receive;
        if (receive && receive.identifer) {
            this.emit(receive.identifer, ctx);
        }

        await next();
    }

    public setRoute(route: MF) {
        this.route = route.bind(this);
    }

    public on(eventName: string, listener: Listener) {
        this.event.on(eventName, listener);
    }

    private emit(eventName: string, ctx: Contex) {
        this.event.emit(eventName, ctx);
    }
}
