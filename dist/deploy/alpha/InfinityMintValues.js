"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultValues = {
    maxSupply: 10,
    linkWalletIndex: 0,
    linkStickersIndex: 1,
};
const Values = {
    setup: async ({ project, debugLog, deployment }) => {
        var _a, _b, _c, _d;
        let variables = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, DefaultValues), (((_a = project.settings) === null || _a === void 0 ? void 0 : _a.assets) || {})), (((_b = project.settings) === null || _b === void 0 ? void 0 : _b.minter) || {})), (((_c = project.settings) === null || _c === void 0 ? void 0 : _c.erc721) || {})), (((_d = project.settings) === null || _d === void 0 ? void 0 : _d.values) || {}));
        let cleanedVariables = {};
        let values = Object.values(variables);
        let keys = Object.keys(variables);
        let singleLevelObjects = keys.filter((key) => typeof values[key] === "object");
        //only select numbers or booleans to be added
        keys.filter((key) => typeof values[key] === "number" ||
            typeof values[key] === "boolean").forEach((key) => (cleanedVariables[key] = values[key]));
        //add values from objects into the variables list
        singleLevelObjects
            .map((object) => {
            return { keys: Object.keys(values[object]), value: object };
        })
            .forEach((object) => {
            object.keys
                .filter((key) => typeof values[object.value][key] === "number" ||
                typeof values[object.value][key] === "boolean")
                .forEach((key) => {
                cleanedVariables[key] = values[object.value][key];
            });
        });
        debugLog("found " +
            Object.values(cleanedVariables).length +
            " on-chain variables");
        let booleans = Object.keys(cleanedVariables)
            .filter((key) => typeof cleanedVariables[key] === "boolean")
            .map((key) => cleanedVariables[key]);
        let numbers = Object.keys(cleanedVariables)
            .filter((key) => typeof cleanedVariables[key] === "number")
            .map((key) => cleanedVariables[key]);
        let contract = deployment.getContract();
        booleans = {
            keys: Object.keys(booleans),
            values: Object.values(booleans),
        };
        numbers = {
            keys: Object.keys(numbers),
            values: Object.values(numbers),
        };
    },
    dontRedeploy: true,
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