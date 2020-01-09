import md5 from "../utils/md5";
import { ISelectElement, IStrategy } from "./iStrategy";
import signale = require("signale");

export default class ConsistentHashStrategy<T extends ISelectElement> implements IStrategy<T> {
    private elements: T[];
    private nodeMaps: Map<number, T>;
    private virtualNodeCount: number;
    private sortedKeys: number[];

    constructor(elements: T[] = [], virtualNodeCount: number) {
        this.elements = elements;
        this.sortedKeys = [];
        this.nodeMaps = new Map();
        this.virtualNodeCount = virtualNodeCount;

        this.resetNodes();
    }

    public toHash(content: string): Buffer {
        return md5(content);
    }

    /* tslint:disable  no-bitwise */
    public digiest(hash: Buffer, index: number): number {
        const f = ((hash[3 + index * 4] & 0xFF) << 24) |
            ((hash[2 + index * 4] & 0xFF) << 16) |
            ((hash[1 + index * 4] & 0xFF) << 8) |
            (hash[index * 4] & 0xFF);
        return f & 0xFFFFFFFF;
    }
    /* tslint:enable  no-bitwise */

    // build consistent hash circle
    public resetNodes(): void {
        const len: number = this.elements.length;
        for (let i = 0; i < len; i++) {
            const element: T = this.elements[i];
            const hash: Buffer = this.toHash(`${element.ip}${element.port}`);
            for (let index = 0; index < this.virtualNodeCount; index++) {
                const nodeDigest: number = this.digiest(hash, index);
                this.nodeMaps.set(nodeDigest, element);
            }
        }

        this.sortedKeys = Array.from(this.nodeMaps.keys());
        this.sortedKeys.sort((a, b) => a - b );
    }

    /**
     * select one key by content
     * @param content
     */
    public select(content?: string | number): T {
        let hitKey: number = 0;
        let digiest: number = 0;
        const len: number = this.sortedKeys.length;

        if (typeof content === "string") {
            const hash: Buffer = this.toHash(content);
            digiest = this.digiest(hash, 0);
        } else if (typeof content === "number") {
            digiest = content;
        } else {
            digiest = 0;
        }

        // signale.debug(digiest);

        if (this.sortedKeys[len - 1] >= digiest) {
            for (let i = len - 1; i >= 0; i--) {
                if (this.sortedKeys[i] < digiest) {
                    hitKey = this.sortedKeys[i];
                    break;
                }
            }
        }
        // return hit key
        return this.nodeMaps.get(hitKey) || this.elements[0];
    }
}
