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

		return await this.createProvider(options);
	}

	/**
	 *
	 * @param options
	 * @returns
	 */
	async createProvider(options: any): Promise<EthereumProvider> {
		await new Promise((resolve, reject) => {
			this.server = ganache.server(options as any);
			this.server.listen(this.port, async (err: any) => {
				if (err) throw err;
				//creates a new ethers provider with the logger piping to ganache
				this.provider = ganache.provider({
					logging: {
						debug: true,
						verbose: true,
						logger: {
							log: (msg: any, ...params) => {
								log(
									`${msg
										.toString()
										.replace(/>/g, '')
										.replace(/\n/g, '')
										.replace(/  /g, ' ')
										.trim()}`,
									'ganache',
								);
								if (params && Object.values(params).length !== 0)
									log(JSON.stringify(params, null, 2), 'ganache');
							},
						},
						quiet: true,
					},
				});
				log(
					'{green-fg}{bold}Ganache Online{/bold}{/green-fg} => http://localhost:' +
						this.port,
				);
				resolve(this.provider);
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
