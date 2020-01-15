/// <reference types="node" />
import { ISelectElement, IStrategy } from "./iStrategy";
export declare class ConsistentHashStrategy<T extends ISelectElement> implements IStrategy<T> {
    private elements;
    private nodeMaps;
    private virtualNodeCount;
    private sortedKeys;
    constructor(elements: T[] | undefined, virtualNodeCount: number);
    toHash(content: string): Buffer;
    digiest(hash: Buffer, index: number): number;
    resetNodes(): void;
    /**
     * select one key by content
     * @param content
     */
    select(content?: string | number): T;
}
