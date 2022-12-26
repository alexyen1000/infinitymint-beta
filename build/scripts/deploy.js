"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deployments_1 = require("@app/deployments");
const hardhat_1 = __importDefault(require("hardhat"));
const fs_1 = __importDefault(require("fs"));
const Deploy = {
    name: "Deploy",
    description: "Deploys InfinityMint or a specific InfinityMint contract related to the current project",
    execute: async (params) => {
        var _a, _b, _c;
        let deployments = [];
        //first, lets read the deployments
        let locations = [
            "./../",
            process.cwd() + "/",
            ...(((_c = (_b = (_a = params.config) === null || _a === void 0 ? void 0 : _a.settings) === null || _b === void 0 ? void 0 : _b.deploy) === null || _c === void 0 ? void 0 : _c.scriptFolders) || []),
        ].filter((location) => fs_1.default.existsSync(location));
        for (let i = 0; i < locations.length; i++) {
            let result = await (0, deployments_1.getDeploymentClasses)(params.project, hardhat_1.default.network.name, "./");
            deployments = [
                ...deployments,
                ...result,
            ];
        }
        let notUniqueAndImportant = deployments
            .filter((deployment) => deployment.isUnique() && deployment.isImportant())
            .filter((deployment) => deployments.filter((thatDeployment) => thatDeployment.getKey() === deployment.getKey()).length > 1);
        if (notUniqueAndImportant.length !== 0)
            throw new Error("1 or more conflicting unique and important deploy scripts: check " +
                notUniqueAndImportant
                    .map((deployment) => deployment.getKey() +
                    ":" +
                    deployment.getFilePath())
                    .join(","));
    },
};
exports.default = Deploy;
//# sourceMappingURL=deploy.js.map