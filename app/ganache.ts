import {
	Web3Provider,
	JsonRpcProvider,
	ExternalProvider,
} from "@ethersproject/providers";
import ganache, { Server, ServerOptions } from "ganache";
import hre, { ethers } from "hardhat";
import { debugLog, log, logDirect, readSession, warning } from "./helpers";
import Pipes from "./pipes";
const { tcpPingPort } = require("tcp-ping-port");

export class GanacheServer {
	public server?: Server;
	public options?: ServerOptions;
	public port?: number;
	public provider?: Web3Provider | any;

	async start(
		options: ServerOptions,
		port?: number
	): Promise<Web3Provider | JsonRpcProvider> {
		this.options = options;
		this.port = parseInt(
			(port || process.env.GANACHE_PORT || 8545).toString()
		);

		if ((await tcpPingPort("localhost", this.port)).online === true) {
			log(
				"previous ganache server alive at => http://localhost:" +
					this.port
			);

			this.provider = ethers.providers.getDefaultProvider(
				"http://localhost:" + this.port
			);
			return this.provider;
		}

		return await this.createProvider(options);
	}

	/**
	 *
	 * @param options
	 * @returns
	 */
	async createProvider(options: any): Promise<Web3Provider> {
		await new Promise((resolve, reject) => {
			this.server = ganache.server(options as any);
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
										params &&
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
				this.provider = provider as Web3Provider;
				log(
					"{green-fg}{bold}Ganache Online{/bold}{/green-fg} => http://localhost:" +
						this.port
				);
				resolve(this.provider as Web3Provider);
			});
		});
		return this.provider;
	}

	getProvider() {
		if (this.provider == undefined)
			throw new Error("invalid ethers provider");

		return this.provider;
	}
}

export default new GanacheServer();
