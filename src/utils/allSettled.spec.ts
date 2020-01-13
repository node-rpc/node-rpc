import signale from "signale";
import { allSettled } from "./allSettled";

describe("test", () => {
    test("", async () => {
        const resolved = Promise.resolve(1);
        const rejected = Promise.reject(2);
        const resolved2 = Promise.resolve(3);
        const resolved3 = Promise.resolve(5);
        const rejected3 = Promise.reject(6);
        const rejected2 = Promise.reject(4);
        const rejected4 = Promise.reject(8);
        const resoved10 = new Promise((resolve) => {
            setTimeout(() => {
                resolve(10);
            }, 5000);
        });
        const resolved4 = Promise.resolve(7);


        await allSettled([resolved, rejected, resolved2, rejected2,
            resolved3, rejected3, resolved4, rejected4, resoved10]).then((res) => {
            signale.debug(res);
            expect(res).toContain(10);
            Promise.resolve();
        }).catch((e) => {
            //
            Promise.reject();
        });
    }, 5000);
});
