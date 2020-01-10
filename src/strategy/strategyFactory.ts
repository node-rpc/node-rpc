import { ConsistentHashStrategy } from "./consistentHashStrategy";
import { ISelectElement, IStrategy } from "./iStrategy";
import { RandomStrategy } from "./randomStrategy";

const virtualNodeCount: number = 4;

export class StrategyFactory<T extends ISelectElement > {
    public build(elements: T[], flag?: string): IStrategy<T> {

        const identifier: string | undefined = flag?.toLowerCase();

        if (identifier === "c") {
            return new ConsistentHashStrategy<T>(elements, virtualNodeCount);
        }
        return new RandomStrategy<T>(elements);
    }
}
