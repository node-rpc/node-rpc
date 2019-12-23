import net from "net";
import signale from "signale";
import V1Decode from "../protocol/v1/v1Decode";
import V1Encode from "../protocol/v1/v1Encode";
import Context from "../server/context";
import Router from "../server/router";
import Application from "../server/server";
import Writer from "../server/writer";
import Client from "./client";

describe("client unit test", () => {
    const decode: V1Decode = new V1Decode();
    const encode: V1Encode = new V1Encode();
    const router: Router = new Router();
    const port: number = 9000;
    const ip: string = "127.0.0.1";
    const duration: number = 100;
    const writer: Writer = new Writer();
    const app = new Application({
        port,
    });
    const client: Client = new Client({
        duration,
        ip,
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

    // client
    test("connect", () => {
        client.connnect();
        signale.debug("connect success !!");
    });

    test("write message", () => {
        const message = {
            data: {
                arr: [],
            },
            msg: "success",
            status: 200,
        };
        client.push(message);
        signale.debug("write data finished !!");
    });

    test("test recieve data", () => {
        signale.debug("listen data event");
        client.on("data", (msg) => {
            signale.debug(msg);
        });
    });

    test("close server", async () => {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 10000);
        });

        app.stop();
    }, 10000);

});
