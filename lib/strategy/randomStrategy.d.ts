import { IStrategy } from "./iStrategy";
export declare class RandomStrategy<T> implements IStrategy<T> {
    private elements;
    constructor(elements?: T[]);
    select(content?: string | number): T;
}
