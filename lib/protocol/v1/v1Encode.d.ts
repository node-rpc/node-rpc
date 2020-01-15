import { Context } from "../../server/context";
import { NextFNType } from "../../server/middleware";
import { IProtocolEncode } from "../protocolEncode";
export declare class V1Encode implements IProtocolEncode {
    constructor();
    use(ctx: Context, next: NextFNType): Promise<void>;
    encode(ctx: Context): void;
}
