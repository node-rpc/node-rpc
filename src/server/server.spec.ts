import net from "net";
import signale from "signale";
import { Context } from "./context";
import { NextFNType } from "./middleware";
import { Server } from "./server";

const port: number = 8080;

describe("test server", () => {
    let server: Server;
    test("new server", () => {
        server = new Server({
            port,
        });
    });

    test("start server", () => {
        server.start();
    });

    test("add log middleware", () => {
        async function log(ctx: Context, next: NextFNType) {
            signale.debug("log middleware  is runed");
            signale.debug(`socket buffer size ${ctx.socket.bufferSize}`);
            signale.debug(`contex uuid ${ctx.uuid}`);
            if (next) {
                next();
            }
        }
        server.use(log);
    });

    test("socket end middleware", () => {
        async function socketEnd(ctx: Context, next: NextFNType) {
            signale.debug("socket call end");
            ctx.socket.end("end middleware");
            if (next) {
                next();
            }
        }

        server.use(socketEnd);
    });

    test("simulation server request", async () => {
        const socket: net.Socket = net.connect(port, "127.0.0.1");
        socket.on("data", (data) => {
            signale.debug(`receive data: ${data.toString()}`);
        });

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 3000);
        });
    });

    test("close server", async () => {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 4000);
        });

        server.stop();
    }, 5000);
});
