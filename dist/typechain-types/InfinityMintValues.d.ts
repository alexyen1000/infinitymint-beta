import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export interface InfinityMintValuesInterface extends utils.Interface {
    functions: {
        "getValue(string)": FunctionFragment;
        "isTrue(string)": FunctionFragment;
        "setBooleanValue(string,bool)": FunctionFragment;
        "setValue(string,uint256)": FunctionFragment;
        "setupValues(string[],uint256[],string[],bool[])": FunctionFragment;
        "tryGetValue(string)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getValue" | "isTrue" | "setBooleanValue" | "setValue" | "setupValues" | "tryGetValue"): FunctionFragment;
    encodeFunctionData(functionFragment: "getValue", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isTrue", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setBooleanValue", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setValue", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setupValues", values: [
        PromiseOrValue<string>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<string>[],
        PromiseOrValue<boolean>[]
    ]): string;
    encodeFunctionData(functionFragment: "tryGetValue", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "getValue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isTrue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setBooleanValue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setValue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setupValues", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tryGetValue", data: BytesLike): Result;
    events: {};
}
export interface InfinityMintValues extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: InfinityMintValuesInterface;
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
        getValue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        isTrue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        setBooleanValue(key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setValue(key: PromiseOrValue<string>, value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setupValues(keys: PromiseOrValue<string>[], _values: PromiseOrValue<BigNumberish>[], booleanKeys: PromiseOrValue<string>[], _booleanValues: PromiseOrValue<boolean>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        tryGetValue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    getValue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    isTrue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    setBooleanValue(key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setValue(key: PromiseOrValue<string>, value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setupValues(keys: PromiseOrValue<string>[], _values: PromiseOrValue<BigNumberish>[], booleanKeys: PromiseOrValue<string>[], _booleanValues: PromiseOrValue<boolean>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    tryGetValue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        getValue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isTrue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        setBooleanValue(key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setValue(key: PromiseOrValue<string>, value: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setupValues(keys: PromiseOrValue<string>[], _values: PromiseOrValue<BigNumberish>[], booleanKeys: PromiseOrValue<string>[], _booleanValues: PromiseOrValue<boolean>[], overrides?: CallOverrides): Promise<void>;
        tryGetValue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {};
    estimateGas: {
        getValue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isTrue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        setBooleanValue(key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setValue(key: PromiseOrValue<string>, value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setupValues(keys: PromiseOrValue<string>[], _values: PromiseOrValue<BigNumberish>[], booleanKeys: PromiseOrValue<string>[], _booleanValues: PromiseOrValue<boolean>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        tryGetValue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        getValue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isTrue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setBooleanValue(key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setValue(key: PromiseOrValue<string>, value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setupValues(keys: PromiseOrValue<string>[], _values: PromiseOrValue<BigNumberish>[], booleanKeys: PromiseOrValue<string>[], _booleanValues: PromiseOrValue<boolean>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        tryGetValue(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=InfinityMintValues.d.ts.map