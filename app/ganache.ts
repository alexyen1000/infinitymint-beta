import ganache, { Server, ServerOptions, EthereumProvider } from 'ganache';
import { ethers } from 'hardhat';
import {
    debugLog,
    getConfigFile,
    log,
    readSession,
    saveSession,
    warning,
} from './helpers';
import { startNetworkPipe } from './web3';

//used to ping stuff to see if its online
const { tcpPingPort } = require('tcp-ping-port');
/**
 * ganache server
 */
export class GanacheServer {
    public server?: Server;
    public options?: ServerOptions;
    public port?: number;
    public provider: EthereumProvider;

    /**
     * stars the ganache server
     * @param options
     * @param port
     * @returns
     */
    async start(
        options: ServerOptions,
        port?: number
    ): Promise<EthereumProvider> {
        this.options = options;

        this.port = parseInt(
            (port || process.env.GANACHE_PORT || 8545).toString()
        );

        if (
            (await tcpPingPort('127.0.0.1', this.port)).online === true ||
            (await tcpPingPort('localhost', this.port)).online === true
        ) {
            log(
                '{cyan-fg}{bold}Previous Ganache Server{/bold}{/cyan-fg} => http://localhost:' +
                    this.port
            );

            //just import the current provider for ganache since hardhat manages this, doing it this way
            //seems to fix issues with ganache/hardhat starting before/after eachover
            return new Promise(async (resolve) => {
                resolve(
                    (await import('hardhat')).getProvider('ganache') as any
                );
            });
        }

        return await this.createServer(options);
    }

    /**
     * creates the ganache server and returns the provider
     * @param options
     * @returns
     */
    async createServer(
        options: ServerOptions<'ethereum'>
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
                        this.port
                );

                setTimeout(() => {
                    resolve(this.server.provider);
                }, 1000);
            });
        });
        return this.provider;
    }

    /**
     * returns the ganache provider
     * @returns
     */
    getProvider() {
        if (this.provider == undefined)
            throw new Error('invalid ethers provider');
        return this.provider;
    }
}

/**
 * gets the private keys from a mnemonic
 * @param mnemonic
 * @param walletLength
 * @returns
 */
export const getPrivateKeys = (mnemonic: any, walletLength?: number) => {
    let keys = [];
    walletLength = walletLength || 20;
    for (let i = 0; i < walletLength; i++) {
        keys.push(
            ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/` + i)
                .privateKey
        );
    }
    return keys;
};

/**
 * creates a default ganache server instance
 */
const GanacheServerInstance = new GanacheServer();

/**
 * method to start ganache
 */
export const startGanache = async () => {
    try {
        let session = readSession();
        let config = getConfigFile();
        //ask if they want to start ganache
        //start ganache here
        let obj = { ...config.ganache } as any;
        if (!obj.wallet) obj.wallet = {};
        if (!session.environment.ganacheMnemonic)
            throw new Error('no ganache mnemonic');

        obj.wallet.mnemonic = session.environment.ganacheMnemonic;
        saveSession(session);
        debugLog('starting ganache with menomic of: ' + obj.wallet.mnemonic);

        //get private keys and save them to file
        let keys = getPrivateKeys(session.environment.ganacheMnemonic);
        debugLog(
            'found ' +
                keys.length +
                ' private keys for mnemonic: ' +
                session.environment.ganacheMnemonic
        );
        keys.forEach((key, index) => {
            debugLog(`[${index}] => ${key}`);
        });
        session.environment.ganachePrivateKeys = keys;
        saveSession(session);

        let provider = await GanacheServerInstance.start(config.ganache || {});
        startNetworkPipe(provider, 'ganache');
    } catch (error) {
        warning('could not start ganache:\n' + error.stack);
    }
};

export default GanacheServerInstance;
