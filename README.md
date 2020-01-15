# Node-rpc
A Node base Rpc framework

## About this Repo

It's a lite rpc framework base on Node.js. 

with some features:
* using hessian protocol impleaments encode and decode operation.
* support middileware mechanism which is same as koa.
* can recieve request base on event's behavior.
* support custome define your own decoder and encoder.

## Usage

### install

```
npm i node-rpc-lite
```

### direct connection mode

#### client usage

``` js
import { Client } from "node-rpc-lite";
import signale from "signale";

const port: number = 9000;
const ip: string = "127.0.0.1";
const duration: number = 100;

const client: Client = new Client({
    duration,
    ip,
    port,
});

client.connnect();
signale.debug("connect success !!");

const message = {
    data: {
        arr: [],
    },
    identifier: "querywork",
    msg: "success",
    status: 200,
};

client.on("data", (msg) => {
    signale.debug("client recieve data:");
    signale.debug(msg);

    client.close();
});


client.push(message);


```

#### Server

```js
import { Context, IServerConfig, NextFNType, Router, Server, V1Decode, V1Encode, Writer } from "node-rpc-lite";
import signale from "signale";

const config: IServerConfig = {
    duration: 500,
    ip: "127.0.0.1",
    port: 9000,
};

const decode: V1Decode = new V1Decode();
const encode: V1Encode = new V1Encode();
const writer: Writer = new Writer();

const log = async (ctx: Context, next: NextFNType) => {
    signale.debug("request is comming");

    if (next) {
        await next();
    }
};

// 路由
const router: Router = new Router();
router.on("querywork", async (ctx: Context) => {

    await new Promise((resolve) => {
        setTimeout(() => {
            ctx.dataWillBeEncode = {
                send: "send data after waiting 1000 ms",
            };
            resolve();
        }, 1000);
    });

    signale.debug(`recive data ${JSON.stringify(ctx.receive)}`);
});

const server: Server = new Server(config);

server.use(decode.use);
server.use(router.route);
server.use(log);
server.use(encode.use);
server.use(writer.use);

server.on("start", (conf) => {
    signale.debug(`server start ${conf.host}: ${conf.port}`);
});

server.start();

```




