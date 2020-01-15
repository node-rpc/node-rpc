export interface ISelectElement {
    ip: string;
    port: number;
}
export interface IStrategy<T> {
    select(content?: string | number): T;
}
