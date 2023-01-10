import ganache, {Server, ServerOptions} from 'ganache';
import {EthereumProvider} from 'ganache';
import {log} from './helpers';

const {tcpPingPort} = require('tcp-ping-port');
export class GanacheServer {
	public server?: Server;
	public options?: ServerOptions;
	public port?: number;
	public provider: EthereumProvider;

	async start(
		options: ServerOptions,
		port?: number,
	): Promise<EthereumProvider> {
		this.options = options;
		this.port = parseInt((port || process.env.GANACHE_PORT || 8545).toString());

		if ((await tcpPingPort('localhost', this.port)).online === true) {
			log(
				'{cyan-fg}{bold}Previous Ganache Server{/bold}{/cyan-fg} => http://localhost:' +
					this.port,
			);
			return (await import('hardhat')).getProvider('ganache') as any;
		}

		return await this.createServer(options);
	}

	/**
	 *
	 * @param options
	 * @returns
	 */
	async createServer(options: any): Promise<EthereumProvider> {
		await new Promise((resolve, reject) => {
			this.server = ganache.server(options as any);
			this.server.listen(this.port, async (err: any) => {
				if (err) throw err;
				log(
					'{green-fg}{bold}Ganache Online{/bold}{/green-fg} => http://localhost:' +
						this.port,
				);

				//return the hardhat ganache provider
				resolve((await import('hardhat')).getProvider('ganache'));
			});
		});
		return this.provider;
	}

	getProvider() {
		if (this.provider == undefined) throw new Error('invalid ethers provider');
		return this.provider;
	}
}

export default new GanacheServer();
