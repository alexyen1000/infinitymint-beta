import { InfinityMintEnvironment } from "@app/interfaces";

/**
 * this file is what is used in creating the default .env variables for infinity mint, not all of the environment variables are listed here. Its interface is defined in the interfaces file, see {@link app/interfaces.InfinityMintEnvironment}.
 */
const envs: InfinityMintEnvironment = {
	INFINITYMINT_PROJECT: undefined,
	ETHERSCAN_API_KEY: undefined,
	POLYGONSCAN_API_KEY: undefined,
	PIPE_ECHO_DEFAULT: false,
	PIPE_ECHO_DEBUG: false,
	PIPE_ECHO_ERRORS: true,
	PIPE_ECHO_WARNINGS: true,
	PIPE_LOG_ERRORS_TO_DEFAULT: true,
	PIPE_SILENCE_UNDEFINED_PIPE: false,
	PIPE_SEPERATE_WARNINGS: false,
	OVERWRITE_CONSOLE_METHODS: false,
	GANACHE_PORT: 8545,
	THROW_ALL_ERRORS: false,
	INFINITYMINT_CONSOLE: true,
	DEFAULT_SOLIDITY_FOLDER: "alpha",
	GANACHE_EXTERNAL: false,
	SOLIDITY_CLEAN_NAMESPACE: false,
	SOLIDITY_USE_NODE_MODULE: false,
	DEFAULT_WALLET_MNEMOMIC: undefined,
	BACKUP_WALLET_MNEMONIC: undefined,
};
export default envs;
