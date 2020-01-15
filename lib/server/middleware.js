"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Middleware = /** @class */ (function () {
    function Middleware() {
        this.middlewares = [];
    }
    /**
     * register middleware
     * @param middleware
     */
    Middleware.prototype.use = function (middleware) {
        this.middlewares.push(middleware);
    };
    Middleware.prototype.run = function (ctx, next) {
        var _this = this;
        var flag = -1;
        var dispatch = function (index) {
            if (flag >= index) {
                throw new Error("multile call next function");
            }
            flag = index;
            var fn = _this.middlewares[index];
            if (index === _this.middlewares.length) {
                fn = next;
            }
            if (!fn) {
                return Promise.resolve();
            }
            try {
                return Promise.resolve(fn(ctx, dispatch.bind(null, index + 1)));
            }
            catch (e) {
                return Promise.reject(e);
            }
        };
        dispatch(0);
    };
    return Middleware;
}());
exports.Middleware = Middleware;
