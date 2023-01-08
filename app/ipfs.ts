//didnt work
import { IPFS, create } from "ipfs-core";
import { logDirect } from "./helpers";

export class IPFSNode {
	protected node: IPFS;
	async create() {
		logDirect("💘 Starting IPFS Node");
		this.node = await create();
		logDirect("💘 IPFS started");
		let version = await this.node.version();
		Object.keys(version).forEach((key, index) => {
			if (key === "commit") return;
			logDirect(`\t [${index}] => ${key} ${version[key]}`);
		});
	}

	async get(ipfs: IPFS, cid: any): Promise<string> {
		const decoder = new TextDecoder();
		let content = "";

		for await (const chunk of ipfs.cat(cid)) {
			content += decoder.decode(chunk, {
				stream: true,
			});
		}

		return content;
	}
}

export default new IPFSNode();
