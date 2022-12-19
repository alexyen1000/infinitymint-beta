"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfinityMintWindow = void 0;
const helpers_1 = require("./helpers");
const hardhat_1 = __importStar(require("hardhat"));
const web3_1 = require("./web3");
const { v4: uuidv4 } = require("uuid");
const blessed = require("blessed");
class InfinityMintWindow {
    constructor(name, style, border, scrollbar, options) {
        this.name = name || this.constructor.name;
        this.width = 100;
        this.height = 100;
        this.x = 1;
        this.y = 1;
        this.destroyed = false;
        this.z = 0;
        this.style = style;
        this.border = border;
        this.scrollbar = scrollbar;
        this.backgroundThink = false;
        this.initialized = false;
        this.destroyId = true;
        this.autoInstantiate = false;
        this.options = options || {};
        this.initialCreation = Date.now();
        this.elements = {};
        //replace with GUID
        this.id = this.generateId();
        this.initialize = async () => { };
        this.think = () => { };
    }
    generateId() {
        return uuidv4();
    }
    setScreen(screen) {
        this.screen = screen;
    }
    setBackgroundThink(backgroundThink) {
        this.backgroundThink = backgroundThink;
    }
    setShouldInstantiate(instantiateInstantly) {
        this.autoInstantiate = instantiateInstantly;
    }
    ///TODO: needs to be stricter
    hasContainer() {
        return this.container !== undefined;
    }
    shouldInstantiate() {
        return this.autoInstantiate;
    }
    shouldBackgroundThink() {
        return this.backgroundThink;
    }
    setDestroyId(shouldDestroyId) {
        this.destroyId = shouldDestroyId;
    }
    setContainer(container) {
        this.container = container;
    }
    async openWindow(name) {
        var _a;
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.setWindow(name);
    }
    getCreation() {
        return this.creation;
    }
    getInitialCreation() {
        return this.initialCreation;
    }
    loadOptions(defaultOptions) {
        let session = (0, helpers_1.readSession)();
        this.options = session.environment["Window_" + this.name] || {};
        Object.keys(defaultOptions).forEach((key) => {
            if (this.options[key] === undefined)
                this.options[key] = defaultOptions[key];
        });
    }
    saveOptions() {
        let session = (0, helpers_1.readSession)();
        session.environment["Window_" + this.name] = this.options;
        (0, helpers_1.debugLog)("saving settings to session for " + `<${this.name}>[${this.id}]`);
        (0, helpers_1.saveSession)(session);
    }
    getContainer() {
        if (this.container === undefined)
            throw new Error("container is undefined");
        return this.container;
    }
    setBorder(border) {
        this.border = border;
    }
    getBorder() {
        return this.border;
    }
    setWidth(num) {
        this.width = num;
    }
    getId() {
        return this.id;
    }
    isEqual(thatWindow) {
        return this.id === thatWindow.id;
    }
    toString() {
        return this.id;
    }
    setHeight(num) {
        this.height = num;
    }
    getRectangle() {
        return {
            startX: this.x,
            endX: this.x + this.width,
            startY: this.y,
            endY: this.y + this.height,
            width: this.width,
            height: this.height,
            z: this.z,
        };
    }
    getStyle() {
        return this.style;
    }
    setStyle(style) {
        this.style = style;
    }
    getWidth() {
        return this.width;
    }
    etX() {
        return this.x;
    }
    get() {
        return { x: this.y, y: this.y, z: this.z };
    }
    getY() {
        return this.y;
    }
    getHeight() {
        return this.height;
    }
    hide() {
        (0, helpers_1.debugLog)(`hiding <${this.name}>[${this.id}]`);
        Object.values(this.elements).forEach((element) => {
            if (!element.hidden) {
                element.shouldUnhide = true;
                element.hide();
            }
            try {
                element.disableMouse();
            }
            catch (error) {
                //element might not have disable mouse method
            }
        });
    }
    show() {
        (0, helpers_1.debugLog)(`showing <${this.name}>[${this.id}]`);
        Object.values(this.elements).forEach((element) => {
            if (element.shouldUnhide) {
                element.shouldUnhide = false;
                element.show();
            }
            try {
                element.enableMouse();
            }
            catch (error) {
                //element might not have enable mouse method so
            }
        });
    }
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }
    registerElement(key, element) {
        if (this.elements[key] !== undefined)
            throw new Error("key already registered in window: " + key);
        if (element.parent === undefined)
            element.parent = this.screen;
        (0, helpers_1.debugLog)("registering element (" +
            element.constructor.name +
            ") for " +
            `<${this.name}>[${this.id}]`);
        //does the same a above
        element.oldOn = element.on;
        element.on = (param1, cb) => {
            if (typeof cb === typeof Promise)
                this.elements[key].oldOn(param1, async (...any) => {
                    try {
                        await cb(...any);
                    }
                    catch (error) {
                        this.getContainer().errorHandler(error);
                    }
                });
            else
                this.elements[key].oldOn(param1, (...any) => {
                    try {
                        cb(...any);
                    }
                    catch (error) {
                        this.getContainer().errorHandler(error);
                    }
                });
        };
        this.elements[key] = element;
        return this.elements[key];
    }
    getElement(key) {
        return this.elements[key];
    }
    getScrollbar() {
        return this.scrollbar;
    }
    update() {
        if (this.think)
            this.think(this, this.getElement("frame"), blessed);
    }
    getScreen() {
        return this.screen;
    }
    destroy() {
        (0, helpers_1.debugLog)(`destroying <${this.name}>[${this.id}]`);
        this.destroyed = true; //window needs to be set as destroyed
        Object.keys(this.elements).forEach((index) => {
            (0, helpers_1.debugLog)("destroying element (" +
                this.elements[index].constructor.name +
                ") for " +
                `<${this.name}>[${this.id}]`);
            try {
                this.elements[index].free(); //unsubscribes to events saving memory
            }
            catch (error) { }
            try {
                this.elements[index].destroy();
            }
            catch (error) { }
            delete this.elements[index];
        });
        this.elements = {};
    }
    registerKey() { }
    isAlive() {
        return this.destroyed === false && this.initialized;
    }
    hasInitialized() {
        return this.initialized && this.destroyed === false;
    }
    on(event, listener) {
        if (this.getElement("frame") === undefined)
            throw new Error("frame has not been created");
        return this.getElement("frame").on(event, listener);
    }
    off(event, listener) {
        if (this.getElement("frame") === undefined)
            return;
        this.getElement("frame").off(event, listener);
    }
    isVisible() {
        var _a;
        return ((_a = this.getElement("frame")) === null || _a === void 0 ? void 0 : _a.hidden) === false;
    }
    async setFrameContent() {
        let defaultSigner = await (0, web3_1.getDefaultSigner)();
        let balance = await defaultSigner.getBalance();
        let getAccountIndex = (0, web3_1.getDefaultAccountIndex)();
        (0, helpers_1.debugLog)("main account: [" +
            getAccountIndex +
            "] => " +
            defaultSigner.address);
        let etherBalance = hardhat_1.ethers.utils.formatEther(balance);
        (0, helpers_1.debugLog)("balance of account: " + etherBalance);
        this.getElement("frame").setContent(` {bold}${this.name}{/bold} | {yellow-fg}[${getAccountIndex}]{/yellow-fg} {underline}${defaultSigner.address}{/underline} | {magenta-bg}${hardhat_1.default.network.name}{/magenta-bg} | gas: {red-fg}50gwei{/red-fg} balance: {green-fg}${etherBalance} ETH{/green-fg} | Solidity Namespace: {cyan-fg}${(0, helpers_1.getSolidityNamespace)()}{/cyan-fg}`);
    }
    async create() {
        if (this.initialized && this.destroyed === false)
            throw new Error("already initialized");
        if (this.screen === undefined)
            throw new Error("cannot create window with undefined screen");
        if (this.initialized && this.destroyed && this.destroyId) {
            let oldId = this.id;
            this.id = this.generateId();
            (0, helpers_1.debugLog)(`old id <${this.name}>[${oldId}] destroyed`);
        }
        this.creation = Date.now();
        (0, helpers_1.debugLog)(`creating <${this.name}>[${this.id}]`);
        //set the title
        this.screen.title = this.name;
        // Create the frame which all other components go into
        let frame = this.registerElement("frame", blessed.box({
            top: "center",
            left: "center",
            width: "100%",
            height: "100%",
            tags: true,
            parent: this.screen,
            padding: 1,
            scrollbar: this.scrollbar || {},
            border: this.border || {},
            style: this.style || {},
        }));
        frame.setBack();
        await this.setFrameContent();
        let close = this.registerElement("closeButton", blessed.box({
            top: 0,
            right: 0,
            width: "shrink",
            height: "shrink",
            tags: true,
            padding: 1,
            content: "[x]",
            border: this.border || {},
            style: {
                bg: "red",
                fg: "white",
                hover: {
                    bg: "grey",
                },
            },
        }));
        close.on("click", () => {
            this.destroy();
        });
        close.focus();
        let hide = this.registerElement("hideButton", blessed.box({
            top: 0,
            right: 6,
            width: "shrink",
            height: "shrink",
            tags: true,
            padding: 1,
            content: "[-]",
            border: this.border || {},
            style: {
                bg: "yellow",
                fg: "white",
                hover: {
                    bg: "grey",
                },
            },
        }));
        hide.on("click", () => {
            this.hide();
        });
        hide.focus();
        (0, helpers_1.debugLog)(`calling initialize on <${this.name}>[${this.id}]`);
        await this.initialize(this, frame, blessed);
        this.initialized = true;
        this.destroyed = false;
        //append each element
        Object.values(this.elements).forEach((element) => {
            (0, helpers_1.debugLog)(`appending element to screen of <${this.name}>[${this.id}]: ` +
                element.constructor.name);
            this.screen.append(element);
        });
    }
}
exports.InfinityMintWindow = InfinityMintWindow;
//# sourceMappingURL=window.js.map