# Node-rpc
A Node base Rpc framework

## About this Repo

It's a lite rpc framework base on Node.js. 

with some features:
* using hessian protocol impleaments encode and decode operation.
* support middileware mechanism which is same as koa.
* can reiceve request base on event's behavior.
* support custome define your own decoder and encoder.
* Load balancing base on Zookeeper

## Usage

### install

```
npm i node-rpc-lite
```

### direct connection mode

#### client

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

client.connect();
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

### Use node-agent-cli start multiple rpc server

[please view example](https://github.com/node-rpc/node-rpc-examples/blob/master/package.json#L12), also could use [node-agent-cli](https://github.com/node-rpc/node-agent).


### Using with Koa and Load balancing base on zookeeper


#### Ready to work

You need to install Zookeeper locally, you can use docker to install the zookeeper image.
reference：
* https://zookeeper.apache.org/doc/current/zookeeperStarted.html
* https://hub.docker.com/_/zookeeper

#### Coding

##### server

```js

import { Context, IServerConfig, NextFNType, Router, Server, V1Decode, V1Encode, Writer,  ZKClient } from "node-rpc-lite";
import signale from "signale";
import uuid from "uuid/v1";
import ZooKeeper from "zookeeper";

const config: IServerConfig = {
    duration: 500,
    ip: "127.0.0.1",
    port: 9001,
};

const namespacePath = "/node-rpc";

const decode: V1Decode = new V1Decode();
const encode: V1Encode = new V1Encode();
const writer: Writer = new Writer();
const zkClient = new ZKClient({
    connect: "127.0.0.1:2181",
    debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
    host_order_deterministic: false,
    timeout: 5000,
});

const log = async (ctx: Context, next: NextFNType) => {
    signale.debug("request is comming");

    if (next) {
        await next();
    }
};

const uid: string = uuid();

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

    signale.debug(`recive data ${JSON.stringify(ctx.receive)}, uuid: ${uid}`);
});

const server: Server = new Server(config);

server.use(decode.use);
server.use(router.route);
server.use(log);
server.use(encode.use);
server.use(writer.use);

const register =  async (conf: any) => {
    const path = `${namespacePath}/${conf.host}-${conf.port}`;
    await zkClient.connect();
    const isExit = await zkClient.exist(path, () => {
        //
    });
    if (!isExit) {
        await zkClient.mkdirp(path, () => {
            //
        });
    }
    signale.debug(`server start ${conf.host}: ${conf.port}, uuid: ${uid}`);
};


server.on("start", register);

server.start();

```

##### client

```js
import Router from "@koa/router";
import Koa from "koa";
import { Client, ISelectElement, IStrategy, StrategyFactory, ZKClient } from "node-rpc-lite";
import signale from "signale";
import ZooKeeper from "zookeeper";

const namespacePath = "/node-rpc";


const zkClient = new ZKClient({
    connect: "127.0.0.1:2181",
    debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
    host_order_deterministic: false,
    timeout: 5000,
});
const app = new Koa();
const router = new Router();

router.get("/rpc/get", async (ctx, next) => {

    const message = {
        data: {
            arr: [],
        },
        identifier: "querywork",
        msg: "success",
        status: 200,
    };

    const list: string[] = zkClient.getNodeMap().get(namespacePath);
    const els: ISelectElement[] = list.map((value: string) => {
        const pairs = value.split("-");
        return {
            ip: pairs[0],
            port: pairs[1] as unknown as number,
        };
    });

    // consistent hash
    const factory: StrategyFactory<ISelectElement> = new StrategyFactory();
    const consistentStrategy: IStrategy<ISelectElement> = factory.build(els, "c");
    const testContent: string = `127.0.0.1_${Math.random()}`;
    const node: ISelectElement = consistentStrategy.select(testContent);

    const client: Client = new Client({
        duration: 500,
        ip: node.ip,
        port: node.port,
    });

    client.connect();
    const work = new Promise((resolve) => {
        client.on("data", (msg) => {
            ctx.response.body = msg;
            resolve();
        });
    });
    client.push(message);

    await work;

});


app
  .use(router.routes())
  .use(router.allowedMethods());

(async () => {
    await zkClient.connect();
    zkClient.listen(namespacePath);
    app.listen(3000, () => {
        signale.debug("app start at port 3000!");
    });
})();


```

#### code example is at [here](https://github.com/node-rpc/node-rpc-examples/blob/master/package.json#L12)
Tip: run above code and visit http://localhost:3000/rpc/get
