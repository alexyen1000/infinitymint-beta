import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface SplitRoyaltyInterface extends utils.Interface {
    functions: {
        "SPLIT_TYPE_MINT()": FunctionFragment;
        "SPLIT_TYPE_STICKER()": FunctionFragment;
        "addSplit(address,uint256,uint256)": FunctionFragment;
        "approved(address)": FunctionFragment;
        "changePrice(uint256)": FunctionFragment;
        "counter(uint256)": FunctionFragment;
        "deployer()": FunctionFragment;
        "dispenseRoyalty(address)": FunctionFragment;
        "erc721Destination()": FunctionFragment;
        "freebies(uint256)": FunctionFragment;
        "getCount(uint256)": FunctionFragment;
        "getSplitCount()": FunctionFragment;
        "getSplits(address)": FunctionFragment;
        "incrementBalance(uint256,uint256)": FunctionFragment;
        "isAuthenticated(address)": FunctionFragment;
        "lastTokenPrice()": FunctionFragment;
        "multiApprove(address[])": FunctionFragment;
        "originalTokenPrice()": FunctionFragment;
        "registerFree(uint256)": FunctionFragment;
        "resetSplits()": FunctionFragment;
        "setPrivilages(address,bool)": FunctionFragment;
        "stickerSplit()": FunctionFragment;
        "tokenPrice()": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "values(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "SPLIT_TYPE_MINT" | "SPLIT_TYPE_STICKER" | "addSplit" | "approved" | "changePrice" | "counter" | "deployer" | "dispenseRoyalty" | "erc721Destination" | "freebies" | "getCount" | "getSplitCount" | "getSplits" | "incrementBalance" | "isAuthenticated" | "lastTokenPrice" | "multiApprove" | "originalTokenPrice" | "registerFree" | "resetSplits" | "setPrivilages" | "stickerSplit" | "tokenPrice" | "transferOwnership" | "values"): FunctionFragment;
    encodeFunctionData(functionFragment: "SPLIT_TYPE_MINT", values?: undefined): string;
    encodeFunctionData(functionFragment: "SPLIT_TYPE_STICKER", values?: undefined): string;
    encodeFunctionData(functionFragment: "addSplit", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "approved", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "changePrice", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "counter", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "dispenseRoyalty", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "erc721Destination", values?: undefined): string;
    encodeFunctionData(functionFragment: "freebies", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getCount", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getSplitCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "getSplits", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "incrementBalance", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isAuthenticated", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "lastTokenPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "multiApprove", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "originalTokenPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "registerFree", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "resetSplits", values?: undefined): string;
    encodeFunctionData(functionFragment: "setPrivilages", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "stickerSplit", values?: undefined): string;
    encodeFunctionData(functionFragment: "tokenPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "values", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "SPLIT_TYPE_MINT", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "SPLIT_TYPE_STICKER", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addSplit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changePrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "counter", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dispenseRoyalty", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "erc721Destination", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "freebies", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSplitCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSplits", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "incrementBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAuthenticated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lastTokenPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "originalTokenPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registerFree", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "resetSplits", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrivilages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stickerSplit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "values", data: BytesLike): Result;
    events: {
        "DispensedRoyalty(address,uint256,uint256)": EventFragment;
        "PermissionChange(address,address,bool)": EventFragment;
        "TransferedOwnership(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "DispensedRoyalty"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "PermissionChange"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransferedOwnership"): EventFragment;
}
export interface DispensedRoyaltyEventObject {
    sender: string;
    amount: BigNumber;
    newTotal: BigNumber;
}
export type DispensedRoyaltyEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber
], DispensedRoyaltyEventObject>;
export type DispensedRoyaltyEventFilter = TypedEventFilter<DispensedRoyaltyEvent>;
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
export interface SplitRoyalty extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: SplitRoyaltyInterface;
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
        SPLIT_TYPE_MINT(overrides?: CallOverrides): Promise<[number]>;
        SPLIT_TYPE_STICKER(overrides?: CallOverrides): Promise<[number]>;
        addSplit(addr: PromiseOrValue<string>, percentage: PromiseOrValue<BigNumberish>, splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        changePrice(_tokenPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        counter(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        deployer(overrides?: CallOverrides): Promise<[string]>;
        dispenseRoyalty(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        erc721Destination(overrides?: CallOverrides): Promise<[string]>;
        freebies(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getCount(splitType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getSplitCount(overrides?: CallOverrides): Promise<[BigNumber]>;
        getSplits(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber[]] & {
            split: BigNumber[];
        }>;
        incrementBalance(value: PromiseOrValue<BigNumberish>, splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        lastTokenPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        originalTokenPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
        registerFree(splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        resetSplits(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        stickerSplit(overrides?: CallOverrides): Promise<[BigNumber]>;
        tokenPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        values(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    SPLIT_TYPE_MINT(overrides?: CallOverrides): Promise<number>;
    SPLIT_TYPE_STICKER(overrides?: CallOverrides): Promise<number>;
    addSplit(addr: PromiseOrValue<string>, percentage: PromiseOrValue<BigNumberish>, splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    changePrice(_tokenPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    counter(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    deployer(overrides?: CallOverrides): Promise<string>;
    dispenseRoyalty(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    erc721Destination(overrides?: CallOverrides): Promise<string>;
    freebies(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    getCount(splitType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    getSplitCount(overrides?: CallOverrides): Promise<BigNumber>;
    getSplits(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber[]>;
    incrementBalance(value: PromiseOrValue<BigNumberish>, splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    lastTokenPrice(overrides?: CallOverrides): Promise<BigNumber>;
    multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    originalTokenPrice(overrides?: CallOverrides): Promise<BigNumber>;
    registerFree(splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    resetSplits(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    stickerSplit(overrides?: CallOverrides): Promise<BigNumber>;
    tokenPrice(overrides?: CallOverrides): Promise<BigNumber>;
    transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    values(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        SPLIT_TYPE_MINT(overrides?: CallOverrides): Promise<number>;
        SPLIT_TYPE_STICKER(overrides?: CallOverrides): Promise<number>;
        addSplit(addr: PromiseOrValue<string>, percentage: PromiseOrValue<BigNumberish>, splitType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        changePrice(_tokenPrice: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        counter(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        deployer(overrides?: CallOverrides): Promise<string>;
        dispenseRoyalty(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        erc721Destination(overrides?: CallOverrides): Promise<string>;
        freebies(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getCount(splitType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSplitCount(overrides?: CallOverrides): Promise<BigNumber>;
        getSplits(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber[]>;
        incrementBalance(value: PromiseOrValue<BigNumberish>, splitType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        lastTokenPrice(overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        originalTokenPrice(overrides?: CallOverrides): Promise<BigNumber>;
        registerFree(splitType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        resetSplits(overrides?: CallOverrides): Promise<void>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        stickerSplit(overrides?: CallOverrides): Promise<BigNumber>;
        tokenPrice(overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        values(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "DispensedRoyalty(address,uint256,uint256)"(sender?: PromiseOrValue<string> | null, amount?: null, newTotal?: null): DispensedRoyaltyEventFilter;
        DispensedRoyalty(sender?: PromiseOrValue<string> | null, amount?: null, newTotal?: null): DispensedRoyaltyEventFilter;
        "PermissionChange(address,address,bool)"(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        PermissionChange(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        "TransferedOwnership(address,address)"(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
        TransferedOwnership(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
    };
    estimateGas: {
        SPLIT_TYPE_MINT(overrides?: CallOverrides): Promise<BigNumber>;
        SPLIT_TYPE_STICKER(overrides?: CallOverrides): Promise<BigNumber>;
        addSplit(addr: PromiseOrValue<string>, percentage: PromiseOrValue<BigNumberish>, splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        changePrice(_tokenPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        counter(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        deployer(overrides?: CallOverrides): Promise<BigNumber>;
        dispenseRoyalty(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        erc721Destination(overrides?: CallOverrides): Promise<BigNumber>;
        freebies(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getCount(splitType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSplitCount(overrides?: CallOverrides): Promise<BigNumber>;
        getSplits(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        incrementBalance(value: PromiseOrValue<BigNumberish>, splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        lastTokenPrice(overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        originalTokenPrice(overrides?: CallOverrides): Promise<BigNumber>;
        registerFree(splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        resetSplits(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        stickerSplit(overrides?: CallOverrides): Promise<BigNumber>;
        tokenPrice(overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        values(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        SPLIT_TYPE_MINT(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        SPLIT_TYPE_STICKER(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        addSplit(addr: PromiseOrValue<string>, percentage: PromiseOrValue<BigNumberish>, splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        changePrice(_tokenPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        counter(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        dispenseRoyalty(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        erc721Destination(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        freebies(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCount(splitType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSplitCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSplits(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        incrementBalance(value: PromiseOrValue<BigNumberish>, splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lastTokenPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        originalTokenPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        registerFree(splitType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        resetSplits(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        stickerSplit(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokenPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        values(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=SplitRoyalty.d.ts.map