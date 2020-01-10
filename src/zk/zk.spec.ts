import signale from "signale";
import ZooKeeper from "zookeeper";
import { ZKClient } from "./zk";

const constants = ZooKeeper.constants;
const path: string = "/hello";
const path1 = `${path}/child1`;
const path2 = `${path}/child2`;
const saveData: string = "hello, start";

describe("test zk client", () => {
    const zk = new ZKClient({
        connect: "127.0.0.1:2181",
        debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
        host_order_deterministic: false,
        timeout: 5000,
    });


    test("test client", async () => {
        const succ: boolean = await zk.connect();
        expect(succ).toBe(true);
    });

    test("mkdir", async () => {
        const res = await zk.mkdirp(path, (e) => {
            if (e) {
                signale.debug(e);
            }
        });
    });

    test("publish method", async () => {
        const stat: any = await zk.exist(path);
        const res: boolean = await zk.publish(path, saveData, stat.version);
        expect(res).toBe(true);
    });

    test("query", async () => {
        const data: any = await zk.query(path);
        const res: string = data[1].toString();
        expect(res).toBe(saveData);
    });

    test("delete method", async () => {
        const stat: any = await zk.exist(path);
        await zk.delete(path, stat.version);
    });

    test("exist and create", async () => {
        zk.on("createError", (e) => {
            signale.debug(e);
        });
        const res = await zk.create(path, saveData,  constants.ZOO_EPHEMERAL);
        signale.debug(res);
    });

    test("query", async () => {
        const data: any = await zk.query(path);
        const res: string = data[1].toString();
        expect(res).toBe(saveData);
    });

    // redo
    test("delete method", async () => {
        const stat: any = await zk.exist(path);
        await zk.delete(path, stat.version);
    });

    test(`mkdir ${path}`, async () => {
        const res = await zk.mkdirp(path, (e) => {
            if (e) {
                signale.debug(e);
            }
        });
    });

    test("listen", async () => {
        await zk.listen(path);
    });

    test(`mkdir ${path1}`, async () => {
        const res = await zk.mkdirp(path1, (e) => {
            if (e) {
                signale.debug(e);
            }
        });
    });

    test(`mkdir ${path2}`, async () => {
        const res = await zk.mkdirp(path2, (e) => {
            if (e) {
                signale.debug(e);
            }
        });
    });

    test("node map", () => {
        signale.debug(zk.getNodeMap());
    });

    test("test close", async () => {
        await new Promise((resolve) => {
            setTimeout(() => {
                Promise.resolve(zk.close()).then((res) => {
                    resolve(res);
                });
            }, 5000);
        });
    }, 6000);
});
