import { NextFNType } from "../server/middleware";
import { Context } from "./context";
export declare class Writer {
    constructor();
    write(ctx: Context): void;
    use(ctx: Context, next: NextFNType): Promise<void>;
}
