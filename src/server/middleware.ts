import Context from "./context";

export type NextFNType = () => Promise<any>;

// middleware function type
export type MF = (ctx: Context, next: NextFNType) => void;

export default class Middleware {
    private middlewares: MF[];
    constructor() {
        this.middlewares = [];
    }

    /**
     * register middleware
     * @param middleware
     */
    public use(middleware: MF) {
        this.middlewares.push(middleware);
    }

    public run(ctx: Context, next?: MF) {
        let flag: number = -1;
        const dispatch = (index: number): Promise<any> => {
            if (flag >= index) {
                throw new Error("multile call next function");
            }
            flag = index;
            let fn: MF | undefined = this.middlewares[index];
            if (index === this.middlewares.length) {
                fn = next;
            }
            if (!fn) {
                return Promise.resolve();
            }
            try {
                return Promise.resolve(fn(ctx, dispatch.bind(null, index + 1)));
            } catch (e) {
                return Promise.reject(e);
            }
        };

        dispatch(0);
    }
}
