"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const example_1 = __importDefault(require("./windows/example"));
const gem = {
    name: "Example Gem",
    deploy: async () => { },
    init: async (params) => {
        var _a;
        //add the example window to the InfinityConsole
        (_a = params === null || params === void 0 ? void 0 : params.console) === null || _a === void 0 ? void 0 : _a.addWindow(new example_1.default());
    },
    setup: async () => { },
    events: {
        gemPostDeploy: async () => {
            (0, helpers_1.log)("Example gem has deployed");
        },
        gemPostSetup: async () => {
            (0, helpers_1.log)("Example gem has been set up");
        },
    },
};
exports.default = gem;
//# sourceMappingURL=main.js.map