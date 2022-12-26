import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export declare namespace InfinityMintObject {
    type InfinityObjectStruct = {
        pathId: PromiseOrValue<BigNumberish>;
        pathSize: PromiseOrValue<BigNumberish>;
        currentTokenId: PromiseOrValue<BigNumberish>;
        owner: PromiseOrValue<string>;
        colours: PromiseOrValue<BigNumberish>[];
        mintData: PromiseOrValue<BytesLike>;
        assets: PromiseOrValue<BigNumberish>[];
        names: PromiseOrValue<string>[];
        destinations: PromiseOrValue<string>[];
    };
    type InfinityObjectStructOutput = [
        number,
        number,
        number,
        string,
        number[],
        string,
        number[],
        string[],
        string[]
    ] & {
        pathId: number;
        pathSize: number;
        currentTokenId: number;
        owner: string;
        colours: number[];
        mintData: string;
        assets: number[];
        names: string[];
        destinations: string[];
    };
}
export interface InfinityMintApiInterface extends utils.Interface {
    functions: {
        "allPreviews(address)": FunctionFragment;
        "allTokens(address)": FunctionFragment;
        "assetController()": FunctionFragment;
        "balanceOf(address)": FunctionFragment;
        "erc721()": FunctionFragment;
        "get(uint32)": FunctionFragment;
        "getBalanceOfWallet(uint32)": FunctionFragment;
        "getLink(uint32,uint256)": FunctionFragment;
        "getPreview(uint32)": FunctionFragment;
        "getPreviewCount(address)": FunctionFragment;
        "getPreviewTimestamp(address)": FunctionFragment;
        "getPrice()": FunctionFragment;
        "getRaw(uint32)": FunctionFragment;
        "getStickerContract(uint32)": FunctionFragment;
        "getWalletContract(uint32)": FunctionFragment;
        "isMintsEnabled()": FunctionFragment;
        "isPreviewBlocked(address)": FunctionFragment;
        "ownerOf(uint32)": FunctionFragment;
        "royaltyController()": FunctionFragment;
        "storageController()": FunctionFragment;
        "totalMints()": FunctionFragment;
        "totalSupply()": FunctionFragment;
        "valuesController()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "allPreviews" | "allTokens" | "assetController" | "balanceOf" | "erc721" | "get" | "getBalanceOfWallet" | "getLink" | "getPreview" | "getPreviewCount" | "getPreviewTimestamp" | "getPrice" | "getRaw" | "getStickerContract" | "getWalletContract" | "isMintsEnabled" | "isPreviewBlocked" | "ownerOf" | "royaltyController" | "storageController" | "totalMints" | "totalSupply" | "valuesController"): FunctionFragment;
    encodeFunctionData(functionFragment: "allPreviews", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "allTokens", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "assetController", values?: undefined): string;
    encodeFunctionData(functionFragment: "balanceOf", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "erc721", values?: undefined): string;
    encodeFunctionData(functionFragment: "get", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getBalanceOfWallet", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getLink", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getPreview", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getPreviewCount", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getPreviewTimestamp", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRaw", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getStickerContract", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getWalletContract", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isMintsEnabled", values?: undefined): string;
    encodeFunctionData(functionFragment: "isPreviewBlocked", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "ownerOf", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "royaltyController", values?: undefined): string;
    encodeFunctionData(functionFragment: "storageController", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalMints", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "valuesController", values?: undefined): string;
    decodeFunctionResult(functionFragment: "allPreviews", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "allTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "assetController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "erc721", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBalanceOfWallet", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLink", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPreview", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPreviewCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPreviewTimestamp", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRaw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStickerContract", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWalletContract", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isMintsEnabled", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isPreviewBlocked", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "royaltyController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "storageController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalMints", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "valuesController", data: BytesLike): Result;
    events: {};
}
export interface InfinityMintApi extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: InfinityMintApiInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        allPreviews(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number[]]>;
        allTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number[]] & {
            tokens: number[];
        }>;
        assetController(overrides?: CallOverrides): Promise<[string]>;
        balanceOf(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        erc721(overrides?: CallOverrides): Promise<[string]>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[InfinityMintObject.InfinityObjectStructOutput]>;
        getBalanceOfWallet(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getLink(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getPreview(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[InfinityMintObject.InfinityObjectStructOutput]>;
        getPreviewCount(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber] & {
            count: BigNumber;
        }>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
        getRaw(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getStickerContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string] & {
            result: string;
        }>;
        getWalletContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string] & {
            result: string;
        }>;
        isMintsEnabled(overrides?: CallOverrides): Promise<[boolean]>;
        isPreviewBlocked(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        ownerOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string] & {
            result: string;
        }>;
        royaltyController(overrides?: CallOverrides): Promise<[string]>;
        storageController(overrides?: CallOverrides): Promise<[string]>;
        totalMints(overrides?: CallOverrides): Promise<[number]>;
        totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
        valuesController(overrides?: CallOverrides): Promise<[string]>;
    };
    allPreviews(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
    allTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
    assetController(overrides?: CallOverrides): Promise<string>;
    balanceOf(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    erc721(overrides?: CallOverrides): Promise<string>;
    get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
    getBalanceOfWallet(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    getLink(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getPreview(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
    getPreviewCount(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getRaw(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getStickerContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getWalletContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    isMintsEnabled(overrides?: CallOverrides): Promise<boolean>;
    isPreviewBlocked(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    ownerOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    royaltyController(overrides?: CallOverrides): Promise<string>;
    storageController(overrides?: CallOverrides): Promise<string>;
    totalMints(overrides?: CallOverrides): Promise<number>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    valuesController(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        allPreviews(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
        allTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
        assetController(overrides?: CallOverrides): Promise<string>;
        balanceOf(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        erc721(overrides?: CallOverrides): Promise<string>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
        getBalanceOfWallet(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getLink(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getPreview(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
        getPreviewCount(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPrice(overrides?: CallOverrides): Promise<BigNumber>;
        getRaw(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getStickerContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getWalletContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        isMintsEnabled(overrides?: CallOverrides): Promise<boolean>;
        isPreviewBlocked(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        ownerOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        royaltyController(overrides?: CallOverrides): Promise<string>;
        storageController(overrides?: CallOverrides): Promise<string>;
        totalMints(overrides?: CallOverrides): Promise<number>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        valuesController(overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        allPreviews(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        allTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        assetController(overrides?: CallOverrides): Promise<BigNumber>;
        balanceOf(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        erc721(overrides?: CallOverrides): Promise<BigNumber>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getBalanceOfWallet(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getLink(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreview(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreviewCount(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPrice(overrides?: CallOverrides): Promise<BigNumber>;
        getRaw(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getStickerContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getWalletContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isMintsEnabled(overrides?: CallOverrides): Promise<BigNumber>;
        isPreviewBlocked(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        ownerOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        royaltyController(overrides?: CallOverrides): Promise<BigNumber>;
        storageController(overrides?: CallOverrides): Promise<BigNumber>;
        totalMints(overrides?: CallOverrides): Promise<BigNumber>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        valuesController(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        allPreviews(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        allTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        assetController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        balanceOf(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        erc721(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getBalanceOfWallet(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getLink(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPreview(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPreviewCount(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRaw(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStickerContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getWalletContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isMintsEnabled(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isPreviewBlocked(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        ownerOf(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        royaltyController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        storageController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        totalMints(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        valuesController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=InfinityMintApi.d.ts.map