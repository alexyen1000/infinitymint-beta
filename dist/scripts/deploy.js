"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deployments_1 = require("./deployments");
const Deploy = {
    name: "Deploy",
    description: "Deploys InfinityMint or a specific InfinityMint contract related to the current project",
    execute: async (params) => {
        //first, lets read the deployments
        let deployments = await (0, deployments_1.getDeploymentScripts)();
    },
};
exports.default = Deploy;
//# sourceMappingURL=deploy.js.map