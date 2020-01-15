import net from "net";
import signale from "signale";
import { V1Decode } from "../protocol/v1/v1Decode";
import { V1Encode } from "../protocol/v1/v1Encode";
import { Context } from "../server/context";
import { Router } from "../server/router";
import { Server as Application } from "../server/server";
import { Writer } from "../server/writer";
import { Client } from "./client";

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
        router.on("dowork", async (ctx: Context) => {
            signale.debug("do work router is runed");
            signale.debug(`recive data ${JSON.stringify(ctx.receive)}`);
            signale.debug("set send data:");

            await new Promise((resolve) => {
                setTimeout(() => {
                    ctx.dataWillBeEncode = {
                        send: "send data 500 minutes",
                    };
                    resolve();
                }, 1000);
            });
        });

        router.on("homework", (ctx: Context) => {
            signale.debug("homework router is runed");
            signale.debug(`recive data ${JSON.stringify(ctx.receive)}`);
            signale.debug("set send data:");

            ctx.dataWillBeEncode = {
                set: "homework",
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
            identifier: "dowork",
            msg: "success",
            status: 200,
        };
        client.push(message);
        signale.debug("write data finished !!");
    });

    test("write message2", () => {
        setTimeout(() => {
            const message = {
                data: {
                    arr: [2, 3, 4],
                },
                identifier: "homework",
                msg: "success",
                status: 300,
            };
            client.push(message);
            signale.debug("write data2 finished !!");
        }, 100);
    });

    test("test recieve data", () => {
        signale.debug("listen data event");
        client.on("data", (msg) => {
            signale.debug("client recieve data:");
            signale.debug(msg);
        });
    });

    test("close client", async () => {
        client.on("closeFinished", () => {
            signale.debug("client closed");
        });

        client.on("closeError", () => {
            signale.debug("client occur error");
        });

        setTimeout(() => {
            client.close();
        }, 2000);
    }, 2000);

    test("close server", async () => {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 10000);
        });

        app.stop();
    }, 10000);

});
