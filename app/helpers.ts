import Pipes from "./pipes";
import fsExtra from "fs-extra";
import fs from "fs";
import { InfinityMintConfig, InfinityMintSession } from "./interfaces";
import bip39, { generateMnemonic } from "bip39";
import { Dictionary } from "form-data";
import { HardhatUserConfig } from "hardhat/types";

export interface Vector {
	x: number;
	y: number;
	z: number;
}

export interface Blessed {
	screen: any;
	box: any;
	button: any;
	list: any;
	image: any;
	form: any;
}

export interface BlessedElement extends Element, Dictionary<any> {
	focus: Function;
	render: Function;
	hide: Function;
	setFront: Function;
	on: Function;
	off: Function;
	setBack: Function;
	setScroll: Function;
	removeLabel: Function;
	pushLine: Function;
	disableMouse: Function;
	content: any;
	disableKeys: Function;
	setItems: Function;
	enterSelected: Function;
	enableKeys: Function;
	width: number;
	hidden: boolean;
	height: number;
	shouldUnhide: boolean;
	style: any;
	setContent: Function;
	setLabel: Function;
	enableMouse: Function;
	enableInput: Function;
	enableDrag: Function;
	disableDrag: Function;
	show: Function;
	toggle: Function;
	destroy: Function;
	free: Function;
	setLine: FuncDouble<number, string, Function>;
	insertLine: FuncDouble<number, string, Function>;
	key: FuncDouble<string[], Function, Function>;
	onceKey: FuncDouble<string[], Function, Function>;
	onScreenEvent: FuncDouble<string, Function, Function>;
	unkey: FuncDouble<string[], Function, Function>;
}

/**
 * Can somebody educate me on a better way?
 *  - Lyds
 */
export interface FuncSingle<T, TResult> {
	(param0: T): TResult;
}

export interface FuncDouble<T, T2, TResult> {
	(param0: T, param1: T2): TResult;
}

export interface FuncTripple<T, T2, T3, TResult> {
	(param0: T, param1: T2, param3: T3): TResult;
}

export interface FuncQuad<T, T2, T3, T4, TResult> {
	(param0: T, param1: T2, param3: T3, param4: T4): TResult;
}

export interface Rectangle {
	startX: number;
	endX: number;
	startY: number;
	endY: number;
	width: number;
	height: number;
	z: number;
}
export const log = (msg: string, pipe?: string) => {
	Pipes.log(msg, pipe);
};

export const debugLog = (msg: string) => {
	log(msg, "debug");
};

export const readSession = (): InfinityMintSession => {
	if (!fs.existsSync(process.cwd() + "/.session"))
		return { created: Date.now(), environment: {} };

	try {
		return JSON.parse(
			fs.readFileSync(process.cwd() + "/.session", {
				encoding: "utf-8",
			})
		);
	} catch (error) {
		Pipes.error(error);
	}

	return {
		created: Date.now(),
		environment: {},
	};
};

export const overwriteConsoleMethods = () => {
	//overwrite console log
	let consoleLog = console.log;
	console.log = (msg: string, setPipe = true) => {
		if (setPipe && Pipes.logs[Pipes.currentPipe] !== undefined)
			Pipes.getPipe(Pipes.currentPipe).log(msg);

		if (
			Pipes.logs[Pipes.currentPipe]?.listen ||
			(Pipes.logs[Pipes.currentPipe] === undefined &&
				!isEnvTrue("PIPE_SILENCE_UNDEFINED_PIPE"))
		)
			consoleLog(msg);
	};

	let consoleError = console.error;
	console.error = (error: any | Error, setPipe = true) => {
		if (setPipe && Pipes.logs[Pipes.currentPipe])
			Pipes.getPipe(Pipes.currentPipe).error(error);

		if (isEnvTrue("PIPE_NOTIFY_ERRORS"))
			console.log("[error] " + error?.message);

		if (
			Pipes.logs[Pipes.currentPipe]?.listen ||
			isEnvTrue("PIPE_ECHO_ERRORS")
		)
			consoleError(error);
	};
};

export const getConfigFile = () => {
	return require(process.cwd() + "/infinitymint.config")
		.default as InfinityMintConfig;
};

export const initializeInfinitymintConfig = () => {
	//else, import the InfinityMint config
	const infinityMintConfig = getConfigFile();

	let session = readSession();
	//fuck about with hardhat config
	infinityMintConfig.hardhat.defaultNetwork =
		infinityMintConfig.hardhat?.defaultNetwork ||
		session.environment?.defaultNetwork;

	if (infinityMintConfig.hardhat.networks === undefined)
		infinityMintConfig.hardhat.networks = {};

	if (
		infinityMintConfig.hardhat.networks.localhost === undefined &&
		infinityMintConfig.hardhat.networks.ganache !== undefined
	)
		infinityMintConfig.hardhat.networks.localhost =
			infinityMintConfig.hardhat.networks.ganache;

	if (infinityMintConfig.hardhat.paths === undefined)
		infinityMintConfig.hardhat.paths = {};

	//do
	let solidityModuleFolder =
		process.cwd() +
		"/node_modules/infinitymint/" +
		process.env.SOLIDITY_NAMESPACE;
	let solidityFolder = process.cwd() + "/" + process.env.SOLIDITY_NAMESPACE;

	if (isEnvTrue("SOLIDITY_USE_NODE_MODULE")) {
		if (
			fs.existsSync("./../package.json") &&
			JSON.parse(
				fs.readFileSync("./../package.json", {
					encoding: "utf8",
				})
			).name === "infinitymint"
		)
			throw new Error("cannot use node modules in InfinityMint package");

		if (!fs.existsSync(solidityModuleFolder))
			throw new Error(
				"please npm i infinitymint and make sure " + module + "exists"
			);

		if (
			fs.existsSync(solidityFolder) &&
			isEnvTrue("SOLIDITY_CLEAN_NAMESPACE")
		)
			fs.rmdirSync(solidityFolder, {
				recursive: true,
				force: true,
			} as any);

		if (!fs.existsSync(solidityFolder)) {
			debugLog(
				"copying " + solidityModuleFolder + " to " + solidityFolder
			);
			fsExtra.copySync(solidityModuleFolder, solidityFolder);
			fs.chmodSync(solidityFolder, 0o777);
		}
	}

	//set the sources
	infinityMintConfig.hardhat.paths.sources = solidityFolder;

	//delete artifacts folder if namespace changes
	if (
		process.env.INFINITYMINT_SOLIDITY_NAMESPACE !== undefined &&
		session.environment.solidityNamespace !== undefined &&
		session.environment.solidityNamespace !==
			process.env.INFINITYMINT_SOLIDITY_NAMESPACE
	) {
		try {
			debugLog("removing ./artifacts");
			fs.rmdirSync(process.cwd() + "/artifacts", {
				recursive: true,
				force: true,
			} as any);
			debugLog("removing ./cache");
			fs.rmdirSync(process.cwd() + "/cache", {
				recursive: true,
				force: true,
			} as any);
			debugLog("removing ./typechain-types");
			fs.rmdirSync(process.cwd() + ".typechain-types", {
				recursive: true,
				force: true,
			} as any);
		} catch (error: any) {
			debugLog("unable to delete folder: " + error?.message || error);
		}

		session.environment.solidityNamespace =
			process.env.INFINITYMINT_SOLIDITY_NAMESPACE;
	}

	//set the solidity namespace
	if (session.environment.solidityNamespace === undefined)
		session.environment.solidityNamespace =
			process.env.INFINITYMINT_SOLIDITY_NAMESPACE;

	saveSession(session);
	return infinityMintConfig;
};

export const loadInfinityMint = (useJavascript?: boolean) => {
	createInfinityMintConfig(useJavascript);
	preInitialize();
	initializeGanacheMnemonic();
	overwriteConsoleMethods();
};

export const createDirs = (dirs: string[]) => {
	dirs.filter((dir: string) => !fs.existsSync(dir)).forEach((dir) =>
		fs.mkdirSync(process.cwd() + (dir[0] !== "/" ? "/" + dir : dir))
	);
};

export const readJson = (fileName: string) => {
	return JSON.parse(
		fs.readFileSync(fileName, {
			encoding: "utf8",
		})
	);
};

export const preInitialize = () => {
	//creates dirs
	createDirs([
		"gems",
		"temp",
		"temp/settings",
		"temp/receipts",
		"temp/deployments",
		"temp/projects",
		"projects",
	]);
	//copy the .env file from example if there is none
	if (
		!fs.existsSync(process.cwd() + "/.env") &&
		fs.existsSync(process.cwd() + "/.env.example")
	)
		fs.copyFileSync(
			process.cwd() + "/.env",
			process.cwd() + "/.env.example"
		);

	//will log console.log output to the default pipe
	if (isEnvTrue("PIPE_ECHO_DEFAULT")) Pipes.getPipe("default").listen = true;
	//create the debug pipe
	Pipes.registerSimplePipe("debug", {
		listen: isEnvTrue("PIPE_ECHO_DEBUG"),
		save: true,
	});
};

export const initializeGanacheMnemonic = () => {
	let session = readSession();
	//if the ganache is not external and no mnemonic for ganache in the environment file then set one
	if (
		isEnvTrue("GANACHE_EXTERNAL") === false &&
		session.environment?.ganacheMnemomic === undefined
	)
		session.environment.ganacheMnemomic = generateMnemonic();

	debugLog(
		"saving " + session.environment.ganacheMnemomic + " to .session file"
	);
	saveSession(session);
	return session.environment?.ganacheMnemomic;
};

export const createInfinityMintConfig = (useJavascript?: boolean) => {
	let config: HardhatUserConfig = {
		solidity: {
			version: "0.8.12",
			settings: {
				optimizer: {
					enabled: true,
					runs: 20,
				},
			},
		},
		paths: {
			tests: "./tests",
		},
	};

	let filename = useJavascript
		? "infinitymint.config.js"
		: "infinitymint.config.ts";
	let stub = useJavascript
		? `\n
		const { InfinityMintConfig } = require("./app/config");

		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config = {
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		module.exports = config;`
		: `\n
		import { InfinityMintConfig } from "./app/config";

		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config: InfinityMintConfig = {
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		export default config;`;

	//check if the infinity mint config file has not been created, if it hasn't then create a new config file with the values of the object above
	if (!fs.existsSync(process.cwd() + "/" + filename)) {
		fs.writeFileSync(process.cwd() + "/" + filename, stub);
	}
};

export const getSolidityNamespace = () => {
	let session = readSession();

	return (
		session.environment?.solidityNamespace ||
		process.env.INFINITYMINT_SOLIDITY_NAMESPACE ||
		"alpha"
	);
};

export const saveSessionVariable = (
	session: InfinityMintSession,
	key: string,
	value: any
) => {
	if (session.environment === undefined) session.environment = {};

	session.environment[key] = value;
	return session;
};

export const saveSession = (session: InfinityMintSession) => {
	fs.writeFileSync("./.session", JSON.stringify(session));
};

export const error = (error: string | Error) => {
	Pipes.log(error.toString());
};

export const isEnvTrue = (key: string): boolean => {
	return process.env[key] !== undefined && process.env[key] === "true";
};

export const isEnvSet = (key: string): boolean => {
	return (
		process.env[key] !== undefined && process.env[key]?.trim().length !== 0
	);
};
