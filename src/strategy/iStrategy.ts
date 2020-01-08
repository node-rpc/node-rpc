export interface ISelectElement {
    ip: string;
    port: number;
}


export interface IStrategy<T> {
    select(): T;
}
