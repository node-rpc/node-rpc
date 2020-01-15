import { Context } from "../../server/context";
import { NextFNType } from "../../server/middleware";
import { IProtocolDecode } from "../protocolDecode";
export declare class V1Decode implements IProtocolDecode {
    constructor();
    use(ctx: Context, next: NextFNType): Promise<void>;
    decode(ctx: Context): Promise<any>;
}
