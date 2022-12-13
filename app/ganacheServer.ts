import { LogLevel } from "@ethersproject/logger";
import { Web3Provider } from "@ethersproject/providers";
import ganache, { Server, ServerOptions } from "ganache";
import { ethers } from "hardhat";
import { InfinityMintConfigGanache } from "./config";
import { debugLog, log } from "./helpers";
import Pipes from "./pipes";
import { startNetworkPipe } from "./web3";

const GanacheServer = new (class {
	public server?: Server;
	public options?: InfinityMintConfigGanache;
	public port?: number;
	public ethersProvider?: Web3Provider;

	start(options: InfinityMintConfigGanache) {
		if (options.logging == undefined) options.logging = {};

		options.logging.quiet = true;
		this.server = ganache.server({
			logging: {
				quiet: true,
			},
		});
		this.options = options;
		this.port = parseInt(
			(options?.port || process.env.GANACHE_PORT || 8545).toString()
		);
		debugLog("starting ganache server on https://localhost:" + this.port);
		//start the listen server on that port
		this.server.listen(this.port, async (err: any) => {
			if (err) throw err;

			this.ethersProvider = new ethers.providers.Web3Provider(
				ganache.provider({
					logging: {
						logger: {
							log: (msg: any) => {
								Pipes.log(msg, "ganache");
							}, // don't do anything
						},
					},
				}) as any
			);
			startNetworkPipe(this.ethersProvider, "ganache");
		});
	}

	getProvider() {
		if (this.ethersProvider == undefined)
			throw new Error("invalid ethers provider");

		return this.ethersProvider;
	}
})();
export default GanacheServer;
