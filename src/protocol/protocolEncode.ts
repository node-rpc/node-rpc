import Context from "../server/context";
import { NextFNType } from "../server/middleware";

export default interface IProtocolEncode {
    use(ctx: Context, next: NextFNType): Promise<any>;
    encode(ctx: Context): void;
}
