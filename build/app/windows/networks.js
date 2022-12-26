"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const window_1 = require("../window");
const hardhat_1 = __importDefault(require("hardhat"));
const helpers_1 = require("../helpers");
const web3_1 = require("../web3");
const Networks = new window_1.InfinityMintWindow("Networks");
Networks.initialize = async (window, frame, blessed) => {
    let form = window.registerElement("form", blessed.list({
        label: " {bold}{white-fg}Select Network{/white-fg} (Enter/Double-Click to select){/bold}",
        tags: true,
        top: "center",
        left: "center",
        width: "95%",
        height: "60%",
        padding: 2,
        keys: true,
        vi: true,
        mouse: true,
        border: "line",
        scrollbar: {
            ch: " ",
            track: {
                bg: "black",
            },
            style: {
                inverse: true,
            },
        },
        style: {
            bg: "grey",
            fg: "white",
            item: {
                hover: {
                    bg: "white",
                },
            },
            selected: {
                bg: "white",
                bold: true,
            },
        },
    }));
    let keys = Object.keys(hardhat_1.default.config.networks);
    form.setItems(keys);
    form.on("select", async (el, selected) => {
        let session = (0, helpers_1.readSession)();
        try {
            (0, web3_1.changeNetwork)(keys[selected]);
        }
        catch (error) {
            console.error(error);
        }
        session.environment.defaultNetwork = keys[selected];
        (0, helpers_1.saveSession)(session);
        await window.getContainer().reload();
    });
};
exports.default = Networks;
//# sourceMappingURL=networks.js.map