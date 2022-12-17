"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./app/helpers");
//the session
let session = (0, helpers_1.readSession)();
//please visit docs.infinitymint.app
const config = {
    project: "example",
    hardhat: {
        solidity: {
            version: "0.8.12",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 20,
                },
            },
        },
        networks: {
            ganache: {
                url: "http://localhost:8545",
                accounts: {
                    mnemonic: (_a = session.environment) === null || _a === void 0 ? void 0 : _a.ganacheMnemomic,
                },
            },
        },
        paths: {
            tests: "./tests",
        },
    },
    ganache: {
        chain: {
            chainId: 1337,
        },
        wallet: {
            totalAccounts: 20,
            defaultBalance: 69420,
        },
    },
    imports: [],
    settings: {
        networks: {
            hardhat: {
                defaultAccount: 0,
            },
            ganache: {
                defaultAccount: 0,
            },
        },
        build: {},
        deploy: {},
    },
};
(0, helpers_1.debugLog)("loaded infinitymint.config.ts");
exports.default = config;
//# sourceMappingURL=infinitymint.config.js.map