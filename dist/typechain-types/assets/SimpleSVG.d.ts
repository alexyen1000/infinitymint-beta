import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export declare namespace Asset {
    type PartialStructStruct = {
        pathId: PromiseOrValue<BigNumberish>;
        pathSize: PromiseOrValue<BigNumberish>;
        assets: PromiseOrValue<BigNumberish>[];
        names: PromiseOrValue<string>[];
        colours: PromiseOrValue<BigNumberish>[];
        mintData: PromiseOrValue<BytesLike>;
    };
    type PartialStructStructOutput = [
        number,
        number,
        number[],
        string[],
        number[],
        string
    ] & {
        pathId: number;
        pathSize: number;
        assets: number[];
        names: string[];
        colours: number[];
        mintData: string;
    };
}
export interface SimpleSVGInterface extends utils.Interface {
    functions: {
        "addAsset(uint256)": FunctionFragment;
        "addAssets(uint256[])": FunctionFragment;
        "addName(string)": FunctionFragment;
        "approved(address)": FunctionFragment;
        "assetsType()": FunctionFragment;
        "combineNames(string[])": FunctionFragment;
        "deployer()": FunctionFragment;
        "flatPathSections(uint32[])": FunctionFragment;
        "getColours(uint32,address)": FunctionFragment;
        "getMintData(uint32,uint32,address)": FunctionFragment;
        "getNames(uint256,address)": FunctionFragment;
        "getNextPath()": FunctionFragment;
        "getNextPathId(address)": FunctionFragment;
        "getPathSize(uint32)": FunctionFragment;
        "getRandomAsset(uint32,address)": FunctionFragment;
        "isAuthenticated(address)": FunctionFragment;
        "isValidPath(uint32)": FunctionFragment;
        "multiApprove(address[])": FunctionFragment;
        "pickPath(uint32,address)": FunctionFragment;
        "pickPath(uint32,uint32,address)": FunctionFragment;
        "pushSectionAssets(uint256[])": FunctionFragment;
        "resetAssets()": FunctionFragment;
        "resetNames()": FunctionFragment;
        "resetPaths()": FunctionFragment;
        "setLastAssets(uint32[])": FunctionFragment;
        "setLastPathId(uint32)": FunctionFragment;
        "setNames(string[])": FunctionFragment;
        "setNextPathId(uint32)": FunctionFragment;
        "setPathCount(uint256)": FunctionFragment;
        "setPathDisabled(uint32,bool)": FunctionFragment;
        "setPathSections(uint32[],uint256[][])": FunctionFragment;
        "setPathSize(uint32,uint32)": FunctionFragment;
        "setPathSizes(uint32[])": FunctionFragment;
        "setPrivilages(address,bool)": FunctionFragment;
        "setSectionAssets(uint32,uint256[])": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "addAsset" | "addAssets" | "addName" | "approved" | "assetsType" | "combineNames" | "deployer" | "flatPathSections" | "getColours" | "getMintData" | "getNames" | "getNextPath" | "getNextPathId" | "getPathSize" | "getRandomAsset" | "isAuthenticated" | "isValidPath" | "multiApprove" | "pickPath(uint32,address)" | "pickPath(uint32,uint32,address)" | "pushSectionAssets" | "resetAssets" | "resetNames" | "resetPaths" | "setLastAssets" | "setLastPathId" | "setNames" | "setNextPathId" | "setPathCount" | "setPathDisabled" | "setPathSections" | "setPathSize" | "setPathSizes" | "setPrivilages" | "setSectionAssets" | "transferOwnership"): FunctionFragment;
    encodeFunctionData(functionFragment: "addAsset", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "addAssets", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "addName", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "approved", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "assetsType", values?: undefined): string;
    encodeFunctionData(functionFragment: "combineNames", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "flatPathSections", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "getColours", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getMintData", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "getNames", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getNextPath", values?: undefined): string;
    encodeFunctionData(functionFragment: "getNextPathId", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getPathSize", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getRandomAsset", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isAuthenticated", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isValidPath", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "multiApprove", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "pickPath(uint32,address)", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "pickPath(uint32,uint32,address)", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "pushSectionAssets", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "resetAssets", values?: undefined): string;
    encodeFunctionData(functionFragment: "resetNames", values?: undefined): string;
    encodeFunctionData(functionFragment: "resetPaths", values?: undefined): string;
    encodeFunctionData(functionFragment: "setLastAssets", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "setLastPathId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setNames", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "setNextPathId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setPathCount", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setPathDisabled", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setPathSections", values: [PromiseOrValue<BigNumberish>[], PromiseOrValue<BigNumberish>[][]]): string;
    encodeFunctionData(functionFragment: "setPathSize", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setPathSizes", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "setPrivilages", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setSectionAssets", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "addAsset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addAssets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addName", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "assetsType", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "combineNames", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "flatPathSections", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getColours", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMintData", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNames", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNextPath", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNextPathId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPathSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRandomAsset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAuthenticated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isValidPath", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pickPath(uint32,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pickPath(uint32,uint32,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pushSectionAssets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "resetAssets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "resetNames", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "resetPaths", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setLastAssets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setLastPathId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setNames", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setNextPathId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPathCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPathDisabled", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPathSections", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPathSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPathSizes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrivilages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSectionAssets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    events: {
        "PermissionChange(address,address,bool)": EventFragment;
        "TransferedOwnership(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "PermissionChange"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransferedOwnership"): EventFragment;
}
export interface PermissionChangeEventObject {
    sender: string;
    changee: string;
    value: boolean;
}
export type PermissionChangeEvent = TypedEvent<[
    string,
    string,
    boolean
], PermissionChangeEventObject>;
export type PermissionChangeEventFilter = TypedEventFilter<PermissionChangeEvent>;
export interface TransferedOwnershipEventObject {
    from: string;
    to: string;
}
export type TransferedOwnershipEvent = TypedEvent<[
    string,
    string
], TransferedOwnershipEventObject>;
export type TransferedOwnershipEventFilter = TypedEventFilter<TransferedOwnershipEvent>;
export interface SimpleSVG extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: SimpleSVGInterface;
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
        addAsset(rarity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        addAssets(rarities: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        addName(name: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        assetsType(overrides?: CallOverrides): Promise<[string]>;
        combineNames(newNames: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        deployer(overrides?: CallOverrides): Promise<[string]>;
        flatPathSections(pathIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getColours(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getMintData(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getNames(nameCount: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getNextPath(overrides?: CallOverrides): Promise<[number]>;
        getNextPathId(randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getPathSize(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[number]>;
        getRandomAsset(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number[]] & {
            assetsId: number[];
        }>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        isValidPath(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "pickPath(uint32,address)"(currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "pickPath(uint32,uint32,address)"(pathId: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        pushSectionAssets(_assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        resetAssets(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        resetNames(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        resetPaths(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setLastAssets(assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setLastPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setNames(newNames: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setNextPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPathCount(newPathCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPathDisabled(pathId: PromiseOrValue<BigNumberish>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPathSections(pathIds: PromiseOrValue<BigNumberish>[], _sections: PromiseOrValue<BigNumberish>[][], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPathSize(pathId: PromiseOrValue<BigNumberish>, pathSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPathSizes(newPathSizes: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSectionAssets(sectionId: PromiseOrValue<BigNumberish>, _assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    addAsset(rarity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    addAssets(rarities: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    addName(name: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    assetsType(overrides?: CallOverrides): Promise<string>;
    combineNames(newNames: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    deployer(overrides?: CallOverrides): Promise<string>;
    flatPathSections(pathIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getColours(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getMintData(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getNames(nameCount: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getNextPath(overrides?: CallOverrides): Promise<number>;
    getNextPathId(randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getPathSize(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<number>;
    getRandomAsset(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
    isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    isValidPath(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "pickPath(uint32,address)"(currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "pickPath(uint32,uint32,address)"(pathId: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    pushSectionAssets(_assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    resetAssets(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    resetNames(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    resetPaths(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setLastAssets(assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setLastPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setNames(newNames: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setNextPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPathCount(newPathCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPathDisabled(pathId: PromiseOrValue<BigNumberish>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPathSections(pathIds: PromiseOrValue<BigNumberish>[], _sections: PromiseOrValue<BigNumberish>[][], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPathSize(pathId: PromiseOrValue<BigNumberish>, pathSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPathSizes(newPathSizes: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSectionAssets(sectionId: PromiseOrValue<BigNumberish>, _assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        addAsset(rarity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        addAssets(rarities: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        addName(name: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        assetsType(overrides?: CallOverrides): Promise<string>;
        combineNames(newNames: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        deployer(overrides?: CallOverrides): Promise<string>;
        flatPathSections(pathIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        getColours(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
        getMintData(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getNames(nameCount: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string[]>;
        getNextPath(overrides?: CallOverrides): Promise<number>;
        getNextPathId(randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
        getPathSize(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<number>;
        getRandomAsset(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isValidPath(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        "pickPath(uint32,address)"(currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<Asset.PartialStructStructOutput>;
        "pickPath(uint32,uint32,address)"(pathId: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<Asset.PartialStructStructOutput>;
        pushSectionAssets(_assets: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        resetAssets(overrides?: CallOverrides): Promise<void>;
        resetNames(overrides?: CallOverrides): Promise<void>;
        resetPaths(overrides?: CallOverrides): Promise<void>;
        setLastAssets(assets: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        setLastPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setNames(newNames: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        setNextPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setPathCount(newPathCount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setPathDisabled(pathId: PromiseOrValue<BigNumberish>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setPathSections(pathIds: PromiseOrValue<BigNumberish>[], _sections: PromiseOrValue<BigNumberish>[][], overrides?: CallOverrides): Promise<void>;
        setPathSize(pathId: PromiseOrValue<BigNumberish>, pathSize: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setPathSizes(newPathSizes: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setSectionAssets(sectionId: PromiseOrValue<BigNumberish>, _assets: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "PermissionChange(address,address,bool)"(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        PermissionChange(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        "TransferedOwnership(address,address)"(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
        TransferedOwnership(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
    };
    estimateGas: {
        addAsset(rarity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        addAssets(rarities: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        addName(name: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        assetsType(overrides?: CallOverrides): Promise<BigNumber>;
        combineNames(newNames: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        deployer(overrides?: CallOverrides): Promise<BigNumber>;
        flatPathSections(pathIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getColours(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getMintData(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getNames(nameCount: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getNextPath(overrides?: CallOverrides): Promise<BigNumber>;
        getNextPathId(randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getPathSize(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getRandomAsset(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isValidPath(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "pickPath(uint32,address)"(currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "pickPath(uint32,uint32,address)"(pathId: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        pushSectionAssets(_assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        resetAssets(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        resetNames(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        resetPaths(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setLastAssets(assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setLastPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setNames(newNames: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setNextPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPathCount(newPathCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPathDisabled(pathId: PromiseOrValue<BigNumberish>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPathSections(pathIds: PromiseOrValue<BigNumberish>[], _sections: PromiseOrValue<BigNumberish>[][], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPathSize(pathId: PromiseOrValue<BigNumberish>, pathSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPathSizes(newPathSizes: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSectionAssets(sectionId: PromiseOrValue<BigNumberish>, _assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        addAsset(rarity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        addAssets(rarities: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        addName(name: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        assetsType(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        combineNames(newNames: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        flatPathSections(pathIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getColours(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getMintData(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getNames(nameCount: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getNextPath(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getNextPathId(randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getPathSize(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRandomAsset(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isValidPath(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "pickPath(uint32,address)"(currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "pickPath(uint32,uint32,address)"(pathId: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        pushSectionAssets(_assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        resetAssets(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        resetNames(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        resetPaths(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setLastAssets(assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setLastPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setNames(newNames: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setNextPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPathCount(newPathCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPathDisabled(pathId: PromiseOrValue<BigNumberish>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPathSections(pathIds: PromiseOrValue<BigNumberish>[], _sections: PromiseOrValue<BigNumberish>[][], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPathSize(pathId: PromiseOrValue<BigNumberish>, pathSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPathSizes(newPathSizes: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSectionAssets(sectionId: PromiseOrValue<BigNumberish>, _assets: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=SimpleSVG.d.ts.map