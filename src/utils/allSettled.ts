export function allSettled(waitWorks: Array<Promise<any>>): Promise<any> {
    const settledResult: any[] = [];
    let increaseNumber: number = 0;
    let selfResolve: (value?: any) => void;
    const wkMap: WeakMap<Promise<any>, number> = new WeakMap();

    const pe =  new Promise<any>((resolve) => {
        selfResolve = resolve;
    });

    function increase(work: Promise<any>, res: any) {
        increaseNumber++;
        settledResult[wkMap.get(work) as number] = res;
        if (increaseNumber === waitWorks.length) {
            selfResolve(settledResult);
        }
    }

    waitWorks.forEach((wk, i) => {
        wkMap.set(wk, i);
        ((work) => {
            wk.then((res) => {
                increase(work, res);
            }).catch((e) => {
                increase(work, e);
            });
        })(wk);
    });

    return pe;
}
