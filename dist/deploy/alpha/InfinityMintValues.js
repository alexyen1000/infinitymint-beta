"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultValues = {
    maxSupply: 10,
    linkWalletIndex: 0,
    linkStickersIndex: 1,
};
const Values = {
    setup: async ({ project, isFirstTime }) => {
        var _a;
        let values = Object.assign(Object.assign({}, DefaultValues), (((_a = project.settings) === null || _a === void 0 ? void 0 : _a.values) || {}));
    },
    //going to give
    instantlySetup: true,
    unique: true,
    important: true,
    module: "values",
    index: 0,
    solidityFolder: "alpha",
    permissions: ["approved"],
};
exports.default = Values;
//# sourceMappingURL=InfinityMintValues.js.map