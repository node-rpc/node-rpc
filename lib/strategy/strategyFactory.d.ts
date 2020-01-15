import { ISelectElement, IStrategy } from "./iStrategy";
export declare class StrategyFactory<T extends ISelectElement> {
    build(elements: T[], flag?: string): IStrategy<T>;
}
