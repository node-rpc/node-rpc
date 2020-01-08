import MD5 from "../utils/md5";
import { IStrategy } from "./iStrategy";

export default class ConsistentHashStrategy<T> implements IStrategy<T> {
    private elements: T[];
    private md5Util: MD5;

    constructor() {
        this.elements = [];
        this.md5Util = new MD5();
    }

    public select(): T {
        return this.elements[0];
    }
}
