import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface SeededRandomInterface extends utils.Interface {
    functions: {
        "getMaxNumber(uint256)": FunctionFragment;
        "getNumber()": FunctionFragment;
        "hasDeployed()": FunctionFragment;
        "randomnessFactor()": FunctionFragment;
        "returnNumber(uint256,uint256)": FunctionFragment;
        "salt()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getMaxNumber" | "getNumber" | "hasDeployed" | "randomnessFactor" | "returnNumber" | "salt"): FunctionFragment;
    encodeFunctionData(functionFragment: "getMaxNumber", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getNumber", values?: undefined): string;
    encodeFunctionData(functionFragment: "hasDeployed", values?: undefined): string;
    encodeFunctionData(functionFragment: "randomnessFactor", values?: undefined): string;
    encodeFunctionData(functionFragment: "returnNumber", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "salt", values?: undefined): string;
    decodeFunctionResult(functionFragment: "getMaxNumber", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNumber", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hasDeployed", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "randomnessFactor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "returnNumber", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "salt", data: BytesLike): Result;
    events: {};
}
export interface SeededRandom extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: SeededRandomInterface;
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
        getMaxNumber(maxNumber: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getNumber(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        hasDeployed(overrides?: CallOverrides): Promise<[boolean]>;
        randomnessFactor(overrides?: CallOverrides): Promise<[BigNumber]>;
        returnNumber(maxNumber: PromiseOrValue<BigNumberish>, _salt: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        salt(overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    getMaxNumber(maxNumber: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getNumber(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    hasDeployed(overrides?: CallOverrides): Promise<boolean>;
    randomnessFactor(overrides?: CallOverrides): Promise<BigNumber>;
    returnNumber(maxNumber: PromiseOrValue<BigNumberish>, _salt: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    salt(overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        getMaxNumber(maxNumber: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getNumber(overrides?: CallOverrides): Promise<BigNumber>;
        hasDeployed(overrides?: CallOverrides): Promise<boolean>;
        randomnessFactor(overrides?: CallOverrides): Promise<BigNumber>;
        returnNumber(maxNumber: PromiseOrValue<BigNumberish>, _salt: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        salt(overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {};
    estimateGas: {
        getMaxNumber(maxNumber: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getNumber(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        hasDeployed(overrides?: CallOverrides): Promise<BigNumber>;
        randomnessFactor(overrides?: CallOverrides): Promise<BigNumber>;
        returnNumber(maxNumber: PromiseOrValue<BigNumberish>, _salt: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        salt(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        getMaxNumber(maxNumber: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getNumber(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        hasDeployed(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        randomnessFactor(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        returnNumber(maxNumber: PromiseOrValue<BigNumberish>, _salt: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        salt(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=SeededRandom.d.ts.map