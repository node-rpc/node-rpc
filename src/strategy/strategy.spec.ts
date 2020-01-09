import { ISelectElement, IStrategy } from "./iStrategy";
import StrategyFactory from "./strategyFactory";
import signale = require("signale");

describe("test strategy", () => {
    const testElements: ISelectElement[] = [
        {
            ip: "127.0.0.1",
            port: 5000,
        },
        {
            ip: "127.0.0.1",
            port: 6000,
        },
        {
            ip: "127.0.0.1",
            port: 7000,
        },
        {
            ip: "127.0.0.1",
            port: 9000,
        },
        {
            ip: "127.0.0.1",
            port: 9001,
        },
    ];
    const factory: StrategyFactory<ISelectElement> = new StrategyFactory();

    test("consistent hash strategy", () => {
        const consistentStrategy: IStrategy<ISelectElement> = factory.build(testElements, "c");
        const testContent: string = `127.0.0.1_${Math.random()}`;
        const res: ISelectElement = consistentStrategy.select(testContent);
        expect(testElements).toContain(res);
        signale.debug(res);
    });

    test("random select strategy", () => {
        const randomStrategy: IStrategy<ISelectElement> = factory.build(testElements);
        const res: ISelectElement = randomStrategy.select();
        expect(testElements).toContain(res);
        signale.debug(res);
    });
});
