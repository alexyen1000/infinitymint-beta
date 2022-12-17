"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const window_1 = require("../window");
const Music = new window_1.InfinityMintWindow("Music", {
    fg: "white",
    bg: "green",
    border: {
        fg: "#f0f0f0",
    },
}, {
    type: "line",
});
Music.setBackgroundThink(true);
Music.setShouldInstantiate(true);
exports.default = Music;
//# sourceMappingURL=music.js.map