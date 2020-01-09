import { IStrategy } from "./iStrategy";

export default class RandomStrategy<T> implements IStrategy<T> {
    private elements: T[];

    constructor(elements: T[] = []) {
        this.elements = elements;
    }

    public select(content?: string | number): T {
        const length: number = this.elements.length;
        const rd: number = Math.floor(Math.random() * length);
        return this.elements[rd];
    }
}
