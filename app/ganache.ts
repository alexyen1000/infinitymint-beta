import ganache, {Server, ServerOptions, EthereumProvider} from 'ganache';
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
	async createServer(
		options: ServerOptions<'ethereum'>,
	): Promise<EthereumProvider> {
		await new Promise((resolve, reject) => {
			//make sure to set
			if (!(options as any).wallet)
				(options as any).wallet = {
					totalAccounts: 20,
					defaultBalance: 69420,
				};

			//make sure to set default balance
			if (
				!(options as any)?.wallet.defaultBalance ||
				(options as any)?.wallet.defaultBalance <= 0
			)
				(options as any).wallet.defaultBalance = 69420;

			this.server = ganache.server(options);
			this.server.listen(this.port, async (err: any) => {
				if (err) throw err;
				log(
					'{green-fg}{bold}Ganache Online{/bold}{/green-fg} => http://localhost:' +
						this.port,
				);

				resolve(this.server.provider);
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
