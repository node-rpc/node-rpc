import { IStrategy } from "./iStrategy";

export default class SimpleHashStrategy<T> implements IStrategy<T> {
    private elements: T[];

    constructor() {
        this.elements = [];
    }

    public select(): T {
        return this.elements[0];
    }
}
