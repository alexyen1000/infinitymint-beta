import { InfinityMintConsole } from "./config";
import { debugLog, log } from "./helpers";
import { InfinityMintWindow } from "./window";
import hre, { ethers } from "hardhat";

//windows
import ConsoleWindow from "./windows/logs";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const blessed = require("blessed");
export default class Console {
	private screen: any;
	private options?: InfinityMintConsole;

	protected currentWindow?: InfinityMintWindow;
	protected canExit: boolean;

	private interval?: any;
	private network?: HardhatRuntimeEnvironment["network"];
	private signers?: SignerWithAddress[];

	constructor(options?: InfinityMintConsole) {
		this.screen = blessed.screen(
			options?.blessed || {
				smartCRS: true,
				dockBorders: true,
			}
		);
		this.canExit = true;
		this.options = options;
	}

	public changeNetwork() {}

	public getSigner(): SignerWithAddress {
		if (this.signers === undefined)
			throw new Error(
				"signers must be initialized before getting signer"
			);

		return this.signers[0];
	}

	public getSigners(): SignerWithAddress[] {
		if (this.signers === undefined)
			throw new Error(
				"signers must be initialized before getting signer"
			);

		return this.signers;
	}

	public async initialize() {
		if (this.network !== undefined)
			throw new Error("console already initialized");

		this.network = hre.network;
		log(
			"initializing InfinityConsole chainId " +
				this.network.config.chainId +
				" network name " +
				this.network.name
		);

		debugLog("getting signers");
		this.signers = await ethers.getSigners();
		debugLog("found " + this.signers.length + " signers");
		this.signers.forEach((signer, index) => {
			debugLog(`${index} => ${signer.address}`);
		});
		log("default account: " + this.signers[0].address);

		//register escape key
		this.screen.key(["escape", "q", "C-c"], (ch: string, key: string) => {
			if (this.canExit) return process.exit(0);
			else debugLog("not allowed to exit but user wants to exit");
		});

		this.currentWindow = ConsoleWindow;
		this.currentWindow.setScreen(this.screen);
		debugLog("creating initial window: " + this.currentWindow.name);
		await this.currentWindow.create();

		this.screen.render();

		this.interval = setInterval(() => {
			if (this.currentWindow) this.currentWindow.update();
			this.screen.render();
		}, 33);
	}
}
