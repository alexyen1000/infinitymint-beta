import { LogLevel } from "@ethersproject/logger";
import { Web3Provider } from "@ethersproject/providers";
import ganache, { Server, ServerOptions } from "ganache";
import hre, { ethers } from "hardhat";
import { debugLog, log, readSession } from "./helpers";
import Pipes from "./pipes";
import { startNetworkPipe } from "./web3";

export class GanacheServer {
	public server?: Server;
	public options?: ServerOptions;
	public port?: number;
	public provider?: Web3Provider;

	start(options: ServerOptions, port?: number): Promise<Web3Provider> {
		return new Promise((resolve, reject) => {
			let session = readSession();
			this.server = ganache.server(options as any);
			this.options = options;
			this.port = parseInt(
				(port || process.env.GANACHE_PORT || 8545).toString()
			);
			debugLog(
				"starting ganache server on http://localhost:" + this.port
			);
			//start the listen server on that port
			this.server.listen(this.port, async (err: any) => {
				if (err) throw err;

				//creates a new ethers provider with the logger piping to ganache
				let provider = new ethers.providers.Web3Provider(
					ganache.provider({
						logging: {
							debug: true,
							verbose: true,
							logger: {
								log: (msg: any, ...params) => {
									Pipes.log(
										`${msg
											.toString()
											.replace(/>/g, "")
											.replace(/\n/g, "")
											.replace(/  /g, " ")
											.trim()}`,
										"ganache"
									);
									if (
										params !== undefined &&
										Object.values(params).length !== 0
									)
										Pipes.log(
											JSON.stringify(params, null, 2),
											"ganache"
										);
								},
							},
						},
						...options,
					}) as any
				);
				this.provider = provider;
				resolve(this.provider);
			});
		});
	}

	getProvider() {
		if (this.provider == undefined)
			throw new Error("invalid ethers provider");

		return this.provider;
	}
}
export default new GanacheServer();
