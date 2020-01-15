"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function allSettled(waitWorks) {
    var settledResult = [];
    var increaseNumber = 0;
    var selfResolve;
    var wkMap = new WeakMap();
    var pe = new Promise(function (resolve) {
        selfResolve = resolve;
    });
    function increase(work, res) {
        increaseNumber++;
        settledResult[wkMap.get(work)] = res;
        if (increaseNumber === waitWorks.length) {
            selfResolve(settledResult);
        }
    }
    waitWorks.forEach(function (wk, i) {
        wkMap.set(wk, i);
        (function (work) {
            wk.then(function (res) {
                increase(work, res);
            }).catch(function (e) {
                increase(work, e);
            });
        })(wk);
    });
    return pe;
}
exports.allSettled = allSettled;
