//didnt work
import { IPFS, create, Options } from "ipfs-core";
import { getConfigFile, log, logDirect } from "./helpers";

export class IPFSNode {
	protected node: IPFS;
	protected lastError: Error;
	protected successful: boolean;

	async create(options?: Options) {
		let config = getConfigFile();
		try {
			log("💘 Starting IPFS Node", "ipfs");
			this.node = await create({
				...options,
				...(config.ipfs as Options),
				start: true,
			});

			log("💘 {green-fg}IPFS started{/green-fg}", "ipfs");
			let version = await this.node.version();
			Object.keys(version).forEach((key, index) => {
				if (key === "commit") return;
				log(`\t [${index}] => ${key} ${version[key]}`, "ipfs");
			});
			this.successful = true;
			log(
				"💘 {cyan-fg}IPFS running at http://localhost:4002{/cyan-fg}",
				"ipfs"
			);
		} catch (error) {
			this.lastError = error;
			throw error;
		}
	}

	public isRunning() {
		return this.successful;
	}

	public getLastError() {
		return this.lastError;
	}

	async put(fileName: string, contents: string) {
		log("💘 Uploading to IPFS " + fileName, "ipfs");
	}

	async get(cid: any): Promise<string> {
		const decoder = new TextDecoder();
		let content = "";

		log("💘 Fetching " + cid, "ipfs");
		for await (const chunk of this.node.cat(cid)) {
			content += decoder.decode(chunk, {
				stream: true,
			});
		}

		return content;
	}
}

export default new IPFSNode();
