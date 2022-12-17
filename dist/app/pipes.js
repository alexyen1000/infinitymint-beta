"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const Pipes = new (class {
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
        if (this.logs[actualPipe] == undefined)
            throw new Error("bad pipe: " + actualPipe);
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
        let pipe = this.createPipe(key, options);
        process.stdout?.on("data", (str) => {
            pipe.log(str);
        });
        process.stderr?.on("data", (str) => {
            pipe.error(str);
        });
        process.stdout?.on("end", (code) => {
            if (code === 1)
                pipe.error("exited with code 1 probably error");
            pipe.log("execited with code: " + code);
            if (options?.autoClose)
                this.closePipe(pipe);
        });
        return pipe;
    }
    createPipe(key, options) {
        this.logs[key] = new Pipe(key);
        this.logs[key].save = options?.save || true;
        this.logs[key].listen = options?.listen || false;
        this.logs[key].appendDate = options?.appendDate || true;
        if (this.currentPipe === "" || options?.setAsCurrentPipe)
            this.currentPipe = key;
        return this.logs[key];
    }
})();
exports.default = Pipes;
//# sourceMappingURL=pipes.js.map