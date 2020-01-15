import { Context } from "./context";
export declare type NextFNType = () => Promise<any>;
export declare type MF = (ctx: Context, next: NextFNType) => void;
export declare class Middleware {
    private middlewares;
    constructor();
    /**
     * register middleware
     * @param middleware
     */
    use(middleware: MF): void;
    run(ctx: Context, next?: MF): void;
}
