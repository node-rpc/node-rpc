import { Context } from "./context";
import { MF, NextFNType } from "./middleware";
declare type Listener = (ctx: Context) => void;
export declare class Router {
    route: MF;
    private events;
    constructor();
    /**
     * middleware
     * @param ctx
     * @param next
     */
    use(ctx: Context, next: NextFNType): Promise<void>;
    setRoute(route: MF): void;
    on(eventName: string, listener: Listener): void;
    private emit;
}
export {};
