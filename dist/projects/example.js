"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const example = {
    name: "example",
    price: "$1",
    modules: {
        random: "SeededRandom",
        assets: "SimpleSVG",
        minter: "DefaultMinter",
        royalty: "DefaultRoyalty",
    },
    information: {
        tokenSymbol: "†",
        tokenSingular: "Example",
    },
    permissions: {
        all: [],
    },
    paths: [
        {
            name: "Example Token",
            fileName: "test.svg",
        },
    ],
    events: {
        failure: async ({ log, event: error }) => {
            log("failed to launch successfully");
            console.error(error);
        },
        success: async ({ log }) => {
            log("successfully launched example project");
        },
    },
};
exports.default = example;
//# sourceMappingURL=example.js.map