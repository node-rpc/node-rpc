import signale from "signale";
import ZooKeeper from "zookeeper";
import ZKClient from "./zk";

const constants = ZooKeeper.constants;
const path: string = "/hello";
const saveData: string = "hello, start";


describe("test zk client", () => {
    const zk = new ZKClient({
        connect: "127.0.0.1:2181",
        debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
        host_order_deterministic: false,
        timeout: 500,
    });


    test("test client", async () => {
        const succ: boolean = await zk.connect();
        expect(succ).toBe(true);
    });

    test("exist and create", async () => {
        const isExist: boolean = await zk.exist(path);
        if (!isExist) {
            signale.debug(`node ${path} is not exist!, will create ${path}`);
            zk.create(path, "",  constants.ZOO_EPHEMERAL);
        }
    });

    test("publish method", async () => {
        zk.on("publishError", (e) => {
            signale.error(e);
        });
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

    // redo
    test("exist and create", async () => {
        const isExist: boolean = await zk.exist(path);
        if (!isExist) {
            signale.debug(`node ${path} is not exist!, will create ${path}`);
            zk.create(path, "",  constants.ZOO_EPHEMERAL);
        }
    });

    test("publish method", async () => {
        zk.on("publishError", (e) => {
            signale.error(e);
        });
        const stat: any = await zk.exist(path);
        const res: boolean = await zk.publish(path, saveData, stat.version);
        expect(res).toBe(true);
    });

    test("listen", async () => {
        await zk.listen(path);
    });

    // test("publish method", async () => {
    //     zk.on("publishError", (e) => {
    //         signale.error(e);
    //     });
    //     const stat: any = await zk.exist(path);
    //     const res: boolean = await zk.publish(path, saveData, stat.version);
    //     expect(res).toBe(true);
    // });

    // test("get Acl", async () => {
    //     const res =  await zk.getAcl(path);
    //     signale.debug(res);
    // });

    test("query", async () => {
        const data: any = await zk.query(path);
        expect(`node ${path} is not exist!`);
    });

    test("test close", async () => {
        await new Promise((resolve) => {
            Promise.resolve(zk.close()).then((res) => {
                setTimeout(() => {
                    resolve(res);
                }, 5000);
            });
        });
    }, 6000);
});
