import ConsistentHashStrategy from "./consistentHashStrategy";
import { IStrategy } from "./iStrategy";
import RandomStrategy from "./randomStrategy";
import SimpleHashStrategy from "./simpleHashStrategy";


export default class StrategyFactory<T> {
    public build(flag: string): IStrategy<T> {

        const identifier: string = flag.toLowerCase();

        if (identifier === "c") {
            return new ConsistentHashStrategy<T>();
        }

        if (identifier === "s") {
            return new SimpleHashStrategy<T>();
        }

        return new RandomStrategy<T>();
    }
}
