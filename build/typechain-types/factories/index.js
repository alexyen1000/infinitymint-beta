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
exports.StickerOracle__factory = exports.Royalty__factory = exports.RandomNumber__factory = exports.NewStickers__factory = exports.Minter__factory = exports.IntegrityInterface__factory = exports.InfinityMintWallet__factory = exports.InfinityMintValues__factory = exports.InfinityMintStorage__factory = exports.InfinityMintProject__factory = exports.InfinityMintLinker__factory = exports.InfinityMintAsset__factory = exports.InfinityMintApi__factory = exports.InfinityMint__factory = exports.IERC165__factory = exports.ERC721__factory = exports.ERC165__factory = exports.Authentication__factory = exports.Asset__factory = exports.royalty = exports.random = exports.minter = exports.legacy = exports.assets = exports.ierc721Sol = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
exports.ierc721Sol = __importStar(require("./IERC721.sol"));
exports.assets = __importStar(require("./assets"));
exports.legacy = __importStar(require("./legacy"));
exports.minter = __importStar(require("./minter"));
exports.random = __importStar(require("./random"));
exports.royalty = __importStar(require("./royalty"));
var Asset__factory_1 = require("./Asset__factory");
Object.defineProperty(exports, "Asset__factory", { enumerable: true, get: function () { return Asset__factory_1.Asset__factory; } });
var Authentication__factory_1 = require("./Authentication__factory");
Object.defineProperty(exports, "Authentication__factory", { enumerable: true, get: function () { return Authentication__factory_1.Authentication__factory; } });
var ERC165__factory_1 = require("./ERC165__factory");
Object.defineProperty(exports, "ERC165__factory", { enumerable: true, get: function () { return ERC165__factory_1.ERC165__factory; } });
var ERC721__factory_1 = require("./ERC721__factory");
Object.defineProperty(exports, "ERC721__factory", { enumerable: true, get: function () { return ERC721__factory_1.ERC721__factory; } });
var IERC165__factory_1 = require("./IERC165__factory");
Object.defineProperty(exports, "IERC165__factory", { enumerable: true, get: function () { return IERC165__factory_1.IERC165__factory; } });
var InfinityMint__factory_1 = require("./InfinityMint__factory");
Object.defineProperty(exports, "InfinityMint__factory", { enumerable: true, get: function () { return InfinityMint__factory_1.InfinityMint__factory; } });
var InfinityMintApi__factory_1 = require("./InfinityMintApi__factory");
Object.defineProperty(exports, "InfinityMintApi__factory", { enumerable: true, get: function () { return InfinityMintApi__factory_1.InfinityMintApi__factory; } });
var InfinityMintAsset__factory_1 = require("./InfinityMintAsset__factory");
Object.defineProperty(exports, "InfinityMintAsset__factory", { enumerable: true, get: function () { return InfinityMintAsset__factory_1.InfinityMintAsset__factory; } });
var InfinityMintLinker__factory_1 = require("./InfinityMintLinker__factory");
Object.defineProperty(exports, "InfinityMintLinker__factory", { enumerable: true, get: function () { return InfinityMintLinker__factory_1.InfinityMintLinker__factory; } });
var InfinityMintProject__factory_1 = require("./InfinityMintProject__factory");
Object.defineProperty(exports, "InfinityMintProject__factory", { enumerable: true, get: function () { return InfinityMintProject__factory_1.InfinityMintProject__factory; } });
var InfinityMintStorage__factory_1 = require("./InfinityMintStorage__factory");
Object.defineProperty(exports, "InfinityMintStorage__factory", { enumerable: true, get: function () { return InfinityMintStorage__factory_1.InfinityMintStorage__factory; } });
var InfinityMintValues__factory_1 = require("./InfinityMintValues__factory");
Object.defineProperty(exports, "InfinityMintValues__factory", { enumerable: true, get: function () { return InfinityMintValues__factory_1.InfinityMintValues__factory; } });
var InfinityMintWallet__factory_1 = require("./InfinityMintWallet__factory");
Object.defineProperty(exports, "InfinityMintWallet__factory", { enumerable: true, get: function () { return InfinityMintWallet__factory_1.InfinityMintWallet__factory; } });
var IntegrityInterface__factory_1 = require("./IntegrityInterface__factory");
Object.defineProperty(exports, "IntegrityInterface__factory", { enumerable: true, get: function () { return IntegrityInterface__factory_1.IntegrityInterface__factory; } });
var Minter__factory_1 = require("./Minter__factory");
Object.defineProperty(exports, "Minter__factory", { enumerable: true, get: function () { return Minter__factory_1.Minter__factory; } });
var NewStickers__factory_1 = require("./NewStickers__factory");
Object.defineProperty(exports, "NewStickers__factory", { enumerable: true, get: function () { return NewStickers__factory_1.NewStickers__factory; } });
var RandomNumber__factory_1 = require("./RandomNumber__factory");
Object.defineProperty(exports, "RandomNumber__factory", { enumerable: true, get: function () { return RandomNumber__factory_1.RandomNumber__factory; } });
var Royalty__factory_1 = require("./Royalty__factory");
Object.defineProperty(exports, "Royalty__factory", { enumerable: true, get: function () { return Royalty__factory_1.Royalty__factory; } });
var StickerOracle__factory_1 = require("./StickerOracle__factory");
Object.defineProperty(exports, "StickerOracle__factory", { enumerable: true, get: function () { return StickerOracle__factory_1.StickerOracle__factory; } });
//# sourceMappingURL=index.js.map