"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ganache_1 = __importDefault(require("ganache"));
const hardhat_1 = require("hardhat");
const helpers_1 = require("./helpers");
const pipes_1 = __importDefault(require("./pipes"));
const GanacheServer = new (class {
    start(options, port) {
        return new Promise((resolve, reject) => {
            let session = (0, helpers_1.readSession)();
            this.server = ganache_1.default.server(options);
            this.options = options;
            this.port = parseInt((port || process.env.GANACHE_PORT || 8545).toString());
            (0, helpers_1.debugLog)("starting ganache server on http://localhost:" + this.port);
            //start the listen server on that port
            this.server.listen(this.port, async (err) => {
                if (err)
                    throw err;
                //creates a new ethers provider with the logger piping to ganache
                let provider = new hardhat_1.ethers.providers.Web3Provider(ganache_1.default.provider(Object.assign({ logging: {
                        debug: true,
                        verbose: true,
                        logger: {
                            log: (msg, ...params) => {
                                pipes_1.default.log(`${msg
                                    .toString()
                                    .replace(/>/g, "")
                                    .replace(/\n/g, "")
                                    .replace(/  /g, " ")
                                    .trim()}`, "ganache");
                                if (params !== undefined &&
                                    Object.values(params).length !== 0)
                                    pipes_1.default.log(JSON.stringify(params, null, 2), "ganache");
                            },
                        },
                    } }, options)));
                this.provider = provider;
                resolve(this.provider);
            });
        });
    }
    getProvider() {
        if (this.provider == undefined)
            throw new Error("invalid ethers provider");
        return this.provider;
    }
})();
exports.default = GanacheServer;
//# sourceMappingURL=ganacheServer.js.map