"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipes = void 0;
/**
 * The log pipe class
 */
class Pipe {
    /**
     *
     * @param pipe
     */
    constructor(pipe) {
        this.logs = [];
        this.pipe = pipe;
        this.save = true;
        this.listen = false;
        this.errors = [];
        this.appendDate = false;
        this.created = Date.now();
        this.logHandler = (str) => {
            if (this.listen)
                console.log(str, false);
            if (this.appendDate)
                str =
                    `{underline}${new Date(Date.now()).toLocaleTimeString()}{/underline} ` + str;
            this.logs.push(str);
        };
        this.errorHandler = (str) => {
            if (this.listen)
                console.error(str, false);
            this.errors.push(str);
        };
        this.terminationHandler = () => { };
    }
    toString() {
        return this.pipe;
    }
    getCreation() {
        return new Date(this.created);
    }
    log(msg) {
        this.logHandler(msg);
    }
    error(error) {
        this.errorHandler(error);
    }
}
/**
 * Logging factory class
 */
exports.Pipes = new (class {
    constructor() {
        this.logs = {};
        this.currentPipe = "default";
        //registers the default pipe
        this.registerSimplePipe("default");
    }
    setCurrentPipe(key) {
        if (this.logs[key] === undefined)
            throw new Error("undefined pipe key: " + key);
        this.currentPipe = key;
    }
    error(error) {
        //go back to the default pipe
        if (this.currentPipe === undefined ||
            this.logs[this.currentPipe] === undefined)
            this.currentPipe = "default";
        this.logs[this.currentPipe].error(error.toString());
    }
    log(msg, pipe, dontHighlight) {
        let actualPipe = pipe || this.currentPipe;
        if (this.logs[actualPipe] === undefined &&
            this.logs["default"] === undefined)
            throw new Error("bad pipe: " + actualPipe);
        else if (this.logs[actualPipe] === undefined)
            return this.log(msg, "default");
        if (dontHighlight !== true)
            msg = msg
                .replace(/\[/g, "{yellow-fg}[")
                .replace(/\]/g, "]{/yellow-fg}")
                .replace(/\</g, "{cyan-fg}<")
                .replace(/\>/g, ">{/cyan-fg}")
                .replace(/\(/g, "{cyan-fg}(")
                .replace(/\)/g, "){/cyan-fg}")
                .replace(/=>/g, "{magenta-fg}=>{/magenta-fg}");
        this.logs[actualPipe].log(msg);
    }
    getPipe(key) {
        return this.logs[key];
    }
    registerSimplePipe(key, options) {
        let pipe = this.createPipe(key, options);
        return pipe;
    }
    closePipe(pipe) {
        delete this.logs[pipe.toString()];
    }
    registerPipe(key, process, options) {
        var _a, _b, _c;
        let pipe = this.createPipe(key, options);
        (_a = process.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (str) => {
            pipe.log(str);
        });
        (_b = process.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (str) => {
            pipe.error(str);
        });
        (_c = process.stdout) === null || _c === void 0 ? void 0 : _c.on("end", (code) => {
            if (code === 1)
                pipe.error("exited with code 1 probably error");
            pipe.log("execited with code: " + code);
            if (options === null || options === void 0 ? void 0 : options.autoClose)
                this.closePipe(pipe);
        });
        return pipe;
    }
    createPipe(key, options) {
        this.logs[key] = new Pipe(key);
        this.logs[key].save = (options === null || options === void 0 ? void 0 : options.save) || true;
        this.logs[key].listen = (options === null || options === void 0 ? void 0 : options.listen) || false;
        this.logs[key].appendDate = (options === null || options === void 0 ? void 0 : options.appendDate) || true;
        if (this.currentPipe === "" || (options === null || options === void 0 ? void 0 : options.setAsCurrentPipe))
            this.currentPipe = key;
        return this.logs[key];
    }
})();
exports.default = exports.Pipes;
//# sourceMappingURL=pipes.js.map