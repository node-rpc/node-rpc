import { Context } from "../server/context";
import { NextFNType } from "../server/middleware";
export interface IProtocolDecode {
    use(ctx: Context, next: NextFNType): Promise<any>;
    decode(ctx: Context): void;
}
