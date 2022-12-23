import Pipes, { Pipe } from "./pipes";
import fsExtra from "fs-extra";
import fs from "fs";
import {
	InfinityMintConfig,
	InfinityMintProject,
	InfinityMintProjectJavascript,
	InfinityMintSession,
} from "./interfaces";
import { generateMnemonic } from "bip39";
import { Dictionary } from "form-data";
import { HardhatUserConfig } from "hardhat/types";
import { InfinityMintWindow } from "./window";

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

/**
 * A very experimentael prototype typescript interfaced for the blessed-js terminal-kit library. Most of the methods
 * on here are probably not going to work.
 *
 * @experimental
 */
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
	/**
	 * Doesn't appear to function
	 */
	pushLine: Function;
	disableMouse: Function;
	content: any;
	/**
	 * Returns the current window this element is assigned too. Will be undefined if the element has not been registered with an InfinityMintWindow
	 */
	window: InfinityMintWindow;
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
	/**
	 * Doesn't appear to function
	 */
	setLine: FuncDouble<number, string, Function>;
	/**
	 * Doesn't appear to function
	 */
	insertLine: FuncDouble<number, string, Function>;
	key: FuncDouble<string[], Function, Function>;
	onceKey: FuncDouble<string[], Function, Function>;
	onScreenEvent: FuncDouble<string, Function, Function>;
	unkey: FuncDouble<string[], Function, Function>;
}

/**
 * Interface for defining a typescript typesript type that is an anon function that takes one param and returns one result.
 */
export interface FuncSingle<T, TResult> {
	(param0: T): TResult;
}

/**
 * Interface for defining a typescript typesript type that is an anon function that takes two param and returns one result.
 */
export interface FuncDouble<T, T2, TResult> {
	(param0: T, param1: T2): TResult;
}

/**
 * Interface for defining a typescript typesript type that is an anon function that takes three param and returns one result.
 */
export interface FuncTripple<T, T2, T3, TResult> {
	(param0: T, param1: T2, param3: T3): TResult;
}

/**
 * Interface for defining a typescript typesript type that is an anon function that takes four param and returns one result.
 */
export interface FuncQuad<T, T2, T3, T4, TResult> {
	(param0: T, param1: T2, param3: T3, param4: T4): TResult;
}

/**
 * used in the InfinityMintWindow. Is the bounding box of the current window relative to the current terminal size (see {@link app/window.InfinityMintWindow}).
 */
export interface Rectangle {
	startX: number | string;
	endX: number | string;
	startY: number | string;
	endY: number | string;
	width: number | string;
	height: number | string;
	z: number;
}

/**
 * Logs a console message to the current pipe.
 * @param msg
 * @param pipe
 */
export const log = (msg: string, pipe?: string) => {
	Pipes.log(msg, pipe);
};

/**
 * Logs a debug message to the current pipe.
 * @param msg
 * @param pipe
 */
export const debugLog = (msg: string) => {
	log(msg, "debug");
};

/**
 * Reads the current .session file in the cwd which holds settings relating to the current instance of InfinityMint.
 * @returns
 */
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

/**
 * Overwrites default behaviour of console.log and console.error
 */
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

/**
 * Returns safely the infinity mint config file
 * @returns
 */
export const getConfigFile = () => {
	let res = require(process.cwd() + "/infinitymint.config");
	res = res.default || res;
	return res as InfinityMintConfig;
};

/**
 * Returns a compiled InfinityMintProject ready to be deployed, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 */
export const getCompiledProject = (projectName: string) => {
	let res = require(process.cwd() +
		"/projects/compiled/" +
		projectName +
		".compiled.json");
	res = res.default || res;
	//
	if (res.compiled !== true)
		throw new Error(`project ${projectName} has not been compiled`);

	return res as InfinityMintProject;
};

/**
 * Returns a deployed InfinityMintProject, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 */
export const getDeployedProject = (projectName: string, version?: any) => {
	let res = require(process.cwd() +
		"/projects/deployed/" +
		projectName +
		`@${version}.json`);
	res = res.default || res;
	//
	if (res.deployed !== true)
		throw new Error(`project ${projectName} has not been deployed`);

	return res as InfinityMintProject;
};

/**
 * Returns an InfinityMintProject file relative to the /projects/ folder, see {@link app/interfaces.InfinityMintProject}. Will return type of InfinityMintProjectClassic if second param is true.
 * @param projectName
 * @param isJavaScript
 */
export const getProject = (projectName: string, isJavaScript?: boolean) => {
	let res = require(process.cwd() +
		"/projects/" +
		projectName +
		(isJavaScript ? ".js" : ".ts"));
	res = res.default || res;

	if (isJavaScript) return res as InfinityMintProjectJavascript;
	return res as InfinityMintProject;
};

/**
 * Loads the infinitymint.config.js and prepares the hardhat response. Only to be used inside of hardhat.config.ts.
 * @returns
 */
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
		(process.env.SOLIDITY_FOLDER || "alpha");
	let solidityFolder =
		process.cwd() + "/" + (process.env.SOLIDITY_FOLDER || "alpha");

	if (isEnvTrue("SOLIDITY_USE_NODE_MODULE")) {
		if (
			fs.existsSync(process.cwd() + "/package.json") &&
			readJson(process.cwd() + "/package.json").name === "infinitymint"
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
		process.env.SOLIDITY_FOLDER !== undefined &&
		session.environment.solidityNamespace !== undefined &&
		session.environment.solidityNamespace !== process.env.SOLIDITY_FOLDER
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

		session.environment.solidityNamespace = process.env.SOLIDITY_FOLDER;
	}

	//set the solidity namespace
	if (session.environment.solidityNamespace === undefined)
		session.environment.solidityNamespace =
			process.env.SOLIDITY_FOLDER || "alpha";

	saveSession(session);
	return infinityMintConfig as InfinityMintConfig;
};

/**
 * Loaded when hardhat is being initialized, essentially creates an infinitymint.config if one is not available, generates a new ganache mnemonic and overwrites console.log and console.error to be piped to what ever pipe is currently default.
 *
 * @see {@link app/interfaces.InfinityMintConfig}
 * @see {@link app/pipes.Pipe}
 * @param useJavascript Will return infinitymint.config.js instead of infinitymint.config.ts
 * @param useInternalRequire  Will use require('./app/interfaces') instead of require('infinitymint/dist/app/interfaces')
 */
export const loadInfinityMint = (
	useJavascript?: boolean,
	useInternalRequire?: boolean
) => {
	createInfinityMintConfig(useJavascript, useInternalRequire);
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

export const createInfinityMintConfig = (
	useJavascript?: boolean,
	useInternalRequire?: boolean
) => {
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

	let requireStatement = useInternalRequire
		? "./app/interfaces"
		: "infinitymint/dist/app/interfaces";
	let filename = useJavascript
		? "infinitymint.config.js"
		: "infinitymint.config.ts";
	let stub = useJavascript
		? `\n
		const { InfinityMintConfig } = require("${requireStatement}");

		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config = {
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		module.exports = config;`
		: `\n
		import { InfinityMintConfig } from "${requireStatement}";

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
		process.env.SOLIDITY_FOLDER ||
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
