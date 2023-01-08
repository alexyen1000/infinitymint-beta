import { Web3Storage, getFilesFromPath } from "web3.storage";
import { getConfigFile, log } from "./helpers";
import { InfinityMintIPFSOptions } from "./interfaces";
const { tcpPingPort } = require("tcp-ping-port");

class IPFS {
	private kuboAvailable: boolean;
	private web3Storage: Web3Storage;

	private favourKubo: boolean;
	private favourWeb3Storage: boolean;

	public async start() {
		let config = getConfigFile();
		if (this.isKuboAvailable()) {
			log("local IPFS resolver found", "ipfs");
			this.kuboAvailable = true;
		}

		if ((config.ipfs as InfinityMintIPFSOptions).kubo.useAlways)
			this.favourKubo = true;

		if ((config.ipfs as InfinityMintIPFSOptions).web3Storage.useAlways)
			this.favourWeb3Storage = true;

		if (
			(config.ipfs as InfinityMintIPFSOptions).web3Storage?.token !==
			undefined
		) {
			log("creating web3.storage controller", "ipfs");
			this.web3Storage = new Web3Storage({
				token: (config.ipfs as InfinityMintIPFSOptions).web3Storage
					?.token,
			});
		}
	}

	/**
	 * Returns the CID as an array buffer
	 * @param cid
	 * @returns
	 */
	public async get(cid: string) {
		if (!this.kuboAvailable && !this.web3Storage) {
			//try and fetch it via IPFS web2 endpoint
		}

		if (this.kuboAvailable && !this.favourWeb3Storage) {
		} else {
			return await (await this.web3Storage.get(cid)).arrayBuffer();
		}
	}

	public async isKuboAvailable() {
		return (await tcpPingPort("localhost", 5001)).online === true;
	}
}
