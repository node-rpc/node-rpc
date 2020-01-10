import { Client, IServerConfig } from "./client";

export class ComplexClient extends Client {
    constructor() {
        const config: IServerConfig = {
            duration: 1000,
            ip: "127.0.0.1",
            port: 8000,
        };
        super(config);
    }
}
