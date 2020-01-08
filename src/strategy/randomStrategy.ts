import { IStrategy } from "./iStrategy";

export default class RandomStrategy<T> implements IStrategy<T> {
    private elements: T[];

    constructor() {
        this.elements = [];
    }

    public select(): T {
        const length: number = this.elements.length;
        const rd: number = Math.floor(Math.random() * length);
        return this.elements[rd];
    }
}
