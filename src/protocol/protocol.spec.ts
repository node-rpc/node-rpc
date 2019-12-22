import net from "net";
import signale from "signale";
import Context from "../server/context";
import Router from "../server/router";
import Application from "../server/server";
import Writer from "../server/writer";
import V1Decode from "./v1/v1Decode";
import V1Encode from "./v1/v1Encode";

describe("test router and protocol", () => {
    const decode: V1Decode = new V1Decode();
    const encode: V1Encode = new V1Encode();
    const router: Router = new Router();
    const port: number = 9000;
    const writer: Writer = new Writer();
    const app = new Application({
        port,
    });

    test("start server", async () => {
        app.start();
    });

    test("use encode", async () => {
        app.use(decode.use);
    });

    test("set router", async () => {
        router.on("dowork", (ctx: Context) => {
            signale.debug("do work router is runed");
            signale.debug(`recive data ${JSON.stringify(ctx.receive)}`);
            signale.debug("set send data:");

            ctx.dataWillBeDecode = {
                send: "send data",
            };
        });
    });

    test("use router", () => {
        app.use(router.route);
    });

    test("use decode", async () => {
        app.use(encode.use);
    });

    test("use writer", async () => {
        app.use(writer.use);
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

        app.stop();
    }, 5000);

});

