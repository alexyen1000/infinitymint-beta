"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const window_1 = require("../window");
const Browser = new window_1.InfinityMintWindow("Browser", {
    fg: "white",
    bg: "yellow",
    border: {
        fg: "#f0f0f0",
    },
}, {
    type: "line",
});
Browser.initialize = async (window, frame, blessed) => {
    let background = window.registerElement("console", blessed.box({
        width: "100%",
        height: "100%-8",
        padding: 1,
        top: 4,
        label: "{bold}{white-fg}Browser{/white-fg}{/bold}",
        left: "center",
        keys: true,
        tags: true,
        scrollable: true,
        mouse: true,
        scrollbar: window.getScrollbar() || {},
        border: window.getBorder() || {},
        style: {
            fg: "white",
            bg: "transparent",
            border: {
                fg: "#f0f0f0",
            },
        },
    }));
    background.setBack();
};
exports.default = Browser;
//# sourceMappingURL=browser.js.map