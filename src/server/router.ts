import { allSettled } from "../utils/allSettled";
import { Context, IReceiveDataType } from "./context";
import { MF, NextFNType } from "./middleware";

type Listener = (ctx: Context) => void;

export class Router {
    public route: MF;
    private events: Map<string, Listener[]>;

    constructor() {
        this.events = new Map();
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
            await this.emit(receive.identifier, ctx);
        }

        if (next) {
            await next();
        }

    }

    public setRoute(route: MF) {
        this.route = route.bind(this);
    }

    public on(eventName: string, listener: Listener) {
        const listeners: Listener[] = this.events.get(eventName) || [];
        listeners.push(listener);
        this.events.set(eventName, listeners);
    }

    private async emit(eventName: string, ctx: Context) {
        const waitWorks: Array<Promise<any>> = [];
        const listeners: Listener[] = this.events.get(eventName) || [];

        if (listeners.length > 0) {
            listeners.forEach((listener) => {
                waitWorks.push(Promise.resolve(listener(ctx)));
            });
        }

        await allSettled(waitWorks);
    }
}
