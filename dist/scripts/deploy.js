"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deployments_1 = require("./deployments");
const hardhat_1 = __importDefault(require("hardhat"));
const Deploy = {
    name: "Deploy",
    description: "Deploys InfinityMint or a specific InfinityMint contract related to the current project",
    execute: async (params) => {
        //first, lets read the deployments
        let deployments = await (0, deployments_1.getDeployments)(params.project, hardhat_1.default.network.name);
    },
};
exports.default = Deploy;
//# sourceMappingURL=deploy.js.map