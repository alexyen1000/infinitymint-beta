import Pipes, { Pipe } from "./pipes";
import fsExtra from "fs-extra";
import fs, { PathLike } from "fs";
import { Dictionary } from "form-data";
import path from "path";
import {
	InfinityMintConfig,
	KeyValue,
	InfinityMintEnvironmentKeys,
	InfinityMintProject,
	InfinityMintProjectJavascript,
	InfinityMintScript,
	InfinityMintSession,
	InfinityMintCompiledProject,
	InfinityMintTempProject,
	InfinityMintEventEmitter,
	InfinityMintScriptArguments,
	InfinityMintGemScript,
	InfinityMintDeployedProject,
} from "./interfaces";
import { generateMnemonic } from "bip39";
import { HardhatUserConfig } from "hardhat/types";
import { InfinityMintWindow } from "./window";
import {
	registerGasPriceHandler,
	registerTokenPriceHandler,
} from "./gasAndPrices";
import { glob } from "glob";
import { InfinityConsole } from "./console";

export interface Vector {
	x: number;
	y: number;
	z: number;
}

export interface Blessed {
	screen: (options: any) => BlessedElement;
	box: (options: BlessedElementOptions) => BlessedElement;
	button: (options: BlessedElementOptions) => BlessedElement;
	list: (options: BlessedElementOptions) => BlessedElement;
	image: (options: BlessedElementOptions) => BlessedElement;
	form: (options: BlessedElementOptions) => BlessedElement;
}

export type BlessedElementPadding = {
	top: string | number;
	left: string | number;
	right: string | number;
	bottom: string | number;
};

export interface BlessedElementOptions extends KeyValue {
	/**
	 * will always run the think hook of this blessed element even if it is hidden
	 */
	alwaysUpdate?: boolean;
	/**
	 * will make sure the element is always brung to the front
	 */
	alwaysFront?: boolean;
	/**
	 * will make sure the element is always at the back
	 */
	alwaysBack?: boolean;
	draggable?: boolean;
	tags?: boolean;
	bold?: boolean;
	mouse?: boolean;
	keyboard?: boolean;
	think?: FuncTripple<InfinityMintWindow, BlessedElement, Blessed, void>;
	options?: KeyValue;
	width?: string | number;
	height?: string | number;
	padding?: BlessedElementPadding | string | number;
	file?: PathLike;
	parent?: BlessedElement;
	style?: KeyValue;
	scrollbar?: KeyValue;
	label?: string;
	animate?: boolean;
	border?: KeyValue | string;
	content?: any;
}

/**
 * A very experimentael prototype typescript interfaced for the blessed-js terminal-kit library. Most of the methods
 * on here are probably not going to work.
 *
 * @experimental
 */
export interface BlessedElement extends BlessedElementOptions, KeyValue {
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
	/**
	 * Returns the current window this element is assigned too. Will be undefined if the element has not been registered with an InfinityMintWindow
	 */
	window: InfinityMintWindow;
	disableKeys: Function;
	setItems: Function;
	enterSelected: Function;
	enableKeys: Function;
	/**
	 * true if the window is hidden
	 */
	hidden: boolean;
	/**
	 * ture if the window should hide when the window is shown again, applied to elements which are hidden initially when the window is initialized and used to keep them hidden when we reshow the window later on.
	 */
	shouldUnhide: boolean;
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
	key: Function;
	onceKey: FuncDouble<string[], Function, Function>;
	onScreenEvent: FuncDouble<string, Function, Function>;
	unkey: Function;
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
export const log = (msg: string | object | number, pipe?: string) => {
	if (typeof msg === "object") msg = JSON.stringify(msg, null, 2);

	//if we aren't overwriting console methods and console is false
	if (
		isEnvTrue("OVERWRITE_CONSOLE_METHODS") === false &&
		getConfigFile().console === false &&
		isEnvTrue("PIPE_SILENCE") === false
	)
		console.log(msg);

	Pipes.log(msg.toString(), pipe);
};

/**
 * Logs a debug message to the current pipe.
 * @param msg
 * @param pipe
 */
export const debugLog = (msg: string | object | number) => {
	log(msg, "debug");
};

/**
 * Logs a debug message to the current pipe.
 * @param msg
 * @param pipe
 */
export const warning = (msg: string | object | number) => {
	log(
		`{yellow-fg}{underline}⚠️{/underline} ${msg}{/yellow-fg}`,
		isEnvTrue("PIPE_SEPERATE_WARNINGS") ? "warning" : "debug"
	);
};

export const getElementPadding = (
	element: BlessedElement,
	type: "left" | "right" | "up" | "down"
) => {
	if (element?.padding === undefined) return 0;

	if (element?.padding[type] === undefined) return 0;

	return parseInt(element?.padding[type].toString());
};

export const calculateWidth = (...elements: BlessedElement[]) => {
	let fin = 0;
	elements
		.map(
			(element) =>
				element.strWidth(element.content) +
				//for the border
				(element.border !== undefined ? 2 : 0) +
				getElementPadding(element, "left") +
				getElementPadding(element, "right")
		)
		.forEach((num) => (fin += num));
	return fin;
};

/**
 * Reads the current .session file in the cwd which holds settings relating to the current instance of InfinityMint.
 * @returns
 */
export const readSession = (): InfinityMintSession => {
	if (
		!fs.existsSync(process.cwd() + "/.session") &&
		memorySession === undefined
	)
		return { created: Date.now(), environment: {} };
	//returns memory version
	else if (memorySession) return memorySession;

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

	console.log = (msg: string | object) => {
		try {
			if (typeof msg === "object") msg = JSON.stringify(msg, null, 2);
		} catch (error) {
			msg = msg.toString();
		}

		if (
			msg.indexOf("<#DONT_LOG_ME$>") === -1 &&
			Pipes.pipes[Pipes.currentPipeKey] !== undefined
		)
			Pipes.getPipe(Pipes.currentPipeKey).log(msg);

		if (
			Pipes.pipes[Pipes.currentPipeKey]?.listen ||
			(Pipes.pipes[Pipes.currentPipeKey] === undefined &&
				!isEnvTrue("PIPE_SILENCE_UNDEFINED_PIPE"))
		)
			consoleLog(msg.replace("<#DONT_LOG_ME$>", ""));
	};

	let consoleError = console.error;
	console.error = (error: any | Error, dontSendToPipe?: boolean) => {
		if (Pipes.pipes[Pipes.currentPipeKey] && dontSendToPipe !== true)
			Pipes.getPipe(Pipes.currentPipeKey).error(error);

		if (
			isEnvTrue("PIPE_LOG_ERRORS_TO_DEBUG") ||
			isEnvTrue("PIPE_LOG_ERRORS_TO_DEFAULT")
		) {
			log(
				`{red-fg}{bold}⚠️ AN ERROR HAS OCCURED ⚠️{/bold}{/red-fg}`,
				isEnvTrue("PIPE_LOG_ERRORS_TO_DEBUG") ? "debug" : "default"
			);
			((error?.stack || error?.message || "unknown") as string)
				.split("\n")
				.forEach((line: string) =>
					log(
						`{red-fg}${line}{red-fg}`,
						isEnvTrue("PIPE_LOG_ERRORS_TO_DEBUG")
							? "debug"
							: "default"
					)
				);
		}

		if (
			Pipes.pipes[Pipes.currentPipeKey]?.listen ||
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
 * @throws
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

	return res as InfinityMintCompiledProject;
};

export const hasTempDeployedProject = (projectName: string) => {
	return fs.existsSync(
		process.cwd() + "/temp/projects/" + projectName + ".temp.json"
	);
};

export const hasTempCompiledProject = (projectName: string) => {
	return fs.existsSync(
		process.cwd() + "/temp/projects/" + projectName + ".compiled.temp.json"
	);
};

export const saveTempDeployedProject = (project: InfinityMintProject) => {
	log("saving " + project.name + ".temp.json", "fs");
	fs.writeFileSync(
		process.cwd() + "/temp/projects/" + project.name + ".temp.json",
		JSON.stringify(project)
	);
};

export const saveTempCompiledProject = (project: InfinityMintProject) => {
	log("saving " + project.name + ".compiled.temp.json", "fs");
	fs.writeFileSync(
		process.cwd() +
			"/temp/projects/" +
			project.name +
			".compiled.temp.json",
		JSON.stringify(project)
	);
};

/**
 * Returns a temporary deployed InfinityMintProject which can be picked up and completed.
 * @param projectName
 * @returns
 * @throws
 */
export const getTempDeployedProject = (projectName: string) => {
	try {
		let res = require(process.cwd() +
			"/temp/projects/" +
			projectName +
			".temp.deployed.json");
		res = res.default || res;
		return res as InfinityMintTempProject;
	} catch (error) {
		throw new Error(
			"could not load temp deployed project: " + error.message
		);
	}
};

/**
 * Returns a temporary compiled InfinityMintProject which can be picked up and completed.
 * @param projectName
 * @returns
 * @throws
 */
export const getTempCompiledProject = (projectName: string) => {
	try {
		let res = require(process.cwd() +
			"/temp/projects/" +
			projectName +
			".temp.compiled.json");
		res = res.default || res;

		return res as InfinityMintTempProject;
	} catch (error) {
		throw new Error(
			"could not load temp deployed project: " + error.message
		);
	}
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

	return res as InfinityMintDeployedProject;
};

/**
 * Returns an InfinityMintProject file relative to the /projects/ folder, see {@link app/interfaces.InfinityMintProject}. Will return type of InfinityMintProjectClassic if second param is true.
 * @param projectName
 * @param isJavaScript
 * @throws
 */
export const getProject = (projectPath: PathLike, isJavaScript: boolean) => {
	let res = require(projectPath as string);
	res = res.default || res;
	res.javascript = isJavaScript === true;

	if (isJavaScript) return res as InfinityMintProjectJavascript;
	return res as InfinityMintProject;
};

export const copyContractsFromNodeModule = (
	destination: PathLike,
	source: PathLike
) => {
	if (
		fs.existsSync(process.cwd() + "/package.json") &&
		readJson(process.cwd() + "/package.json").name === "infinitymint"
	)
		throw new Error("cannot use node modules in InfinityMint package");

	if (!fs.existsSync(source))
		throw new Error(
			"please npm i infinitymint and make sure " + module + "exists"
		);

	if (fs.existsSync(destination) && isEnvTrue("SOLIDITY_CLEAN_NAMESPACE")) {
		log("cleaning " + source, "fs");
		fs.rmdirSync(destination, {
			recursive: true,
			force: true,
		} as any);
	}

	if (!fs.existsSync(destination)) {
		log("copying " + source + " to " + destination, "fs");
		fsExtra.copySync(source, destination);
		fs.chmodSync(destination, 0o777);
	}
};

export const prepareHardhatConfig = (
	session: InfinityMintSession,
	config: InfinityMintConfig
) => {
	//fuck about with hardhat config
	config.hardhat.defaultNetwork =
		config.hardhat?.defaultNetwork || session.environment?.defaultNetwork;

	if (config.hardhat.networks === undefined) config.hardhat.networks = {};

	//copy ganache settings to localhost settings if ganache exists
	if (
		config.hardhat.networks.localhost === undefined &&
		config.hardhat.networks.ganache !== undefined
	)
		config.hardhat.networks.localhost = config.hardhat.networks.ganache;

	if (config.hardhat.paths === undefined) config.hardhat.paths = {};

	return config;
};

export const cleanCompilations = () => {
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
		if (isEnvTrue("THROW_ALL_ERRORS")) throw error;
		warning("unable to delete folder: " + error?.message || error);
	}
};

/**
 * Loads the infinitymint.config.js and prepares the hardhat response. Only to be used inside of hardhat.config.ts.
 * @returns
 */
export const prepareConfig = () => {
	//else, import the InfinityMint config
	let config = getConfigFile();
	let session = readSession();

	//
	prepareHardhatConfig(session, config);

	//overwrite the console methods
	if (config.console || isEnvTrue("OVERWRITE_CONSOLE_METHODS"))
		overwriteConsoleMethods();

	let solidityModuleFolder =
		process.cwd() +
		"/node_modules/infinitymint/" +
		(process.env.DEFAULT_SOLIDITY_FOLDER || "alpha");
	let solidityFolder =
		process.cwd() + "/" + (process.env.DEFAULT_SOLIDITY_FOLDER || "alpha");

	if (isEnvTrue("SOLIDITY_USE_NODE_MODULE"))
		copyContractsFromNodeModule(solidityFolder, solidityModuleFolder);

	//if the sources is undefined, then set the solidityFolder to be the source foot
	if (config.hardhat.paths.sources === undefined) {
		//set the sources
		config.hardhat.paths.sources = solidityFolder;

		//delete artifacts folder if namespace changes
		if (
			process.env.DEFAULT_SOLIDITY_FOLDER !== undefined &&
			session.environment.solidityFolder !== undefined &&
			session.environment.solidityFolder !==
				process.env.DEFAULT_SOLIDITY_FOLDER
		) {
			cleanCompilations();
			session.environment.solidityFolder =
				process.env.DEFAULT_SOLIDITY_FOLDER;
		}

		saveSession(session);
	} else {
		//if we have changed the sources file then clean up old stuff
		if (session.environment.solidityFolder !== config.hardhat.paths.sources)
			cleanCompilations();

		//if it is then set the solidityFolder to be the current value of the sources
		session.environment.solidityFolder = config.hardhat.paths.sources;

		saveSession(session);
	}

	//set the solidityFolder in the environment if it is undefined
	if (session.environment.solidityFolder === undefined)
		session.environment.solidityFolder =
			process.env.DEFAULT_SOLIDITY_FOLDER || "alpha";

	registerGasAndPriceHandlers(config);

	return config as InfinityMintConfig;
};

export const findWindows = async (roots?: PathLike[]) => {
	let searchLocations = [...(roots || [])] as string[];

	if (!isInfinityMint())
		searchLocations.push(
			process.cwd() +
				"/node_modules/infinitymint/dist/app/windows/**/*.js"
		);
	else searchLocations.push(process.cwd() + "/app/windows/**/*.ts");

	searchLocations.push(process.cwd() + "/windows/**/*.js");
	if (isTypescript())
		searchLocations.push(process.cwd() + "/windows/**/*.ts");

	let files = [];

	for (let i = 0; i < searchLocations.length; i++) {
		log("searching for windows with glob => " + searchLocations[i], "fs");
		files = [...files, ...(await findFiles(searchLocations[i]))];
	}

	return files;
};

export const getInfinityMintVersion = () => {
	if (isInfinityMint()) return getPackageJson()?.version || "1.0.0";

	if (
		!fs.existsSync(
			process.cwd() + "/node_modules/infinitymint/package.json"
		)
	)
		return "1.0.0";

	return (
		JSON.parse(
			fs.readFileSync(
				process.cwd() + "/node_modules/infinitymint/package.json",
				{ encoding: "utf-8" }
			)
		)?.version || "1.0.0"
	);
};

export const getPackageJson = () => {
	if (
		!fs.existsSync("./../package.json") &&
		!fs.existsSync(process.cwd() + "/package.json")
	)
		throw new Error("no package.json");

	return JSON.parse(
		fs.readFileSync(
			fs.existsSync("./../package.json")
				? "./../package.json"
				: process.cwd() + "/package.json",
			{
				encoding: "utf-8",
			}
		)
	);
};

/**
 *
 * @param globPattern
 * @returns
 */
export const findFiles = (globPattern: string) => {
	log("searching for files with glob pattern => " + globPattern, "glob");
	return new Promise<string[]>((resolve, reject) => {
		glob(globPattern, (err: Error, matches: string[]) => {
			if (err) throw err;
			resolve(matches);
		});
	});
};

export const isTypescript = () => {
	let session = readSession();

	return session.environment?.javascript !== true;
};

export const getFileImportExtension = () => {
	let session = readSession();

	if (session.environment?.javascript) return ".js";

	return ".ts";
};

/**
 * looks for scripts inside of cwd /scripts/ and if we aren't infinityMint and the env variable INFINITYMINT_s
 * @param extension
 * @param roots
 * @returns
 */
export const findScripts = async (roots?: string[]) => {
	let config = getConfigFile();
	roots = roots || [];

	if (!isInfinityMint() && isEnvTrue("INFINITYMINT_INCLUDE_SCRIPTS"))
		roots.push(
			process.cwd() + "/node_modules/infinitymint/dist/scripts/**/*.js"
		);

	if (isTypescript()) roots.push(process.cwd() + "/scripts/**/*.ts");
	roots.push(process.cwd() + "/scripts/**/*.js");
	roots = [
		...roots,
		...(config.roots || []).map(
			(root: string) =>
				process.cwd() +
				"/" +
				root +
				(root[root.length - 1] !== "/" ? "/scripts/" : "scripts/") +
				"**/*.ts"
		),
		...(config.roots || []).map(
			(root: string) =>
				process.cwd() +
				"/" +
				root +
				(root[root.length - 1] !== "/" ? "/scripts/" : "scripts/") +
				"**/*.js"
		),
	];

	let scanned = [];
	for (let i = 0; i < roots.length; i++) {
		let path = roots[i];
		log("searching for scripts with glob => " + path, "fs");
		scanned = [...scanned, ...(await findFiles(path))];
	}

	scanned = scanned.map((fullPath) => {
		return path.parse(fullPath);
	});

	return scanned as path.ParsedPath[];
};

/**
 * Returns the current project
 * @returns
 */
export const getCurrentProjectPath = () => {
	let session = readSession();

	if (session.environment.project === undefined) return undefined;
	return session.environment.project as path.ParsedPath;
};

export const getCurrentDeployedProject = () => {
	if (!getCurrentProjectPath()) throw new Error("no current project");

	return getDeployedProject(getCurrentProjectPath().name);
};

/**
 *
 * @returns
 */
export const getCurrentCompiledProject = () => {
	if (!getCurrentProjectPath()) throw new Error("no current project");

	return getCompiledProject(getCurrentProjectPath().name);
};

/**
 *
 * @param script
 * @param eventEmitter
 * @param gems
 * @param args
 * @param console
 */
export const executeScript = async (
	script: InfinityMintScript,
	eventEmitter: InfinityMintEventEmitter,
	gems?: Dictionary<InfinityMintGemScript>,
	args?: Dictionary<InfinityMintScriptArguments>,
	console?: InfinityConsole,
	onLog?: Function,
	onDebugLog?: Function
) => {
	if (!script.javascript)
		await script.execute({
			script: script,
			eventEmitter: eventEmitter,
			log: (msg, pipe) => {
				if (onLog) onLog(msg, pipe);

				log(msg, pipe);
			},
			gems: gems,
			args: args,
			debugLog: (msg) => {
				if (onDebugLog) onDebugLog(msg);
				debugLog(msg);
			},
			infinityConsole: console,
			project: getCurrentProject(),
		});
	else throw new Error("javascript files are not supported yet");
};

/**
 *
 * @returns
 */
export const getCurrentProject = () => {
	return getProject(
		getCurrentProjectPath().dir + "/" + getCurrentProjectPath().base,
		getCurrentProjectPath().ext === ".js"
	);
};

/**
 *
 * @param fileName
 * @returns
 */
export const requireWindow = (fileName: string) => {
	if (!fs.existsSync(fileName))
		throw new Error("cannot find script: " + fileName);

	if (require.cache[fileName]) {
		debugLog("deleting old cache  => " + fileName);
		delete require.cache[fileName];
	}

	debugLog("requiring => " + fileName);
	let result = require(fileName);
	result = result.default || result;
	result.setFileName(fileName);
	result.log("required");
	return result as InfinityMintWindow;
};

/**
 *
 * @param roots
 * @returns
 */
export const findProjects = async (roots?: PathLike[]) => {
	let config = getConfigFile();
	roots = roots || [];
	roots = [
		...roots,
		process.cwd() + "/projects/",
		...(config.roots || []).map(
			(root: string) =>
				process.cwd() +
				"/" +
				root +
				(root[root.length - 1] !== "/" ? "/projects/" : "projects/")
		),
	];

	let projects = [];
	for (let i = 0; i < roots.length; i++) {
		projects = [
			...projects,
			...(await findFiles(roots[i] + "**/*.ts")),
			...(await findFiles(roots[i] + "**/*.js")),
		];
	}

	return projects.map((filePath) => path.parse(filePath));
};

/**
 * Checks cwd for a /script/ folder and looks for a script with that name. if it can't find it will look in this repos deploy scripts and try and return that
 * @param fileName
 * @param root
 * @returns
 */
export const requireScript = async (
	fullPath: string,
	console?: InfinityConsole
) => {
	let hasReloaded = false;
	if (!fs.existsSync(fullPath))
		throw new Error("cannot find script: " + fullPath);

	if (require.cache[fullPath]) {
		debugLog("deleting old script cache of " + fullPath);
		delete require.cache[fullPath];
		hasReloaded = true;
	}

	let result = await require(fullPath);
	result = result.default || result;
	result.fileName = fullPath;

	if (console !== undefined && result.events !== undefined) {
		Object.keys(result.events).forEach((key) => {
			try {
				console.getEventEmitter().off(key, result.events[key]);
			} catch (error) {
				warning("could not turn off event emitter: " + error?.message);
			}
			debugLog("new event <EventEmitter>(" + key + ")");
			console.getEventEmitter().on(key, result.events[key]);
		});
	}

	if (result?.reloaded && hasReloaded) {
		debugLog("calling (reloaded) on " + fullPath);
		await (result as InfinityMintScript).reloaded({
			log,
			debugLog,
			console,
			script: result,
		});
	}

	if (result?.loaded !== undefined) {
		debugLog("calling (loaded) on " + fullPath);
		await (result as InfinityMintScript).loaded({
			log,
			debugLog,
			console,
			script: result,
		});
	}

	return result as InfinityMintScript;
};

export const isInfinityMint = () => {
	try {
		let packageJson = getPackageJson();
		if (packageJson?.name === "infinitymint") return true;
	} catch (error) {
		if (isEnvTrue("THROW_ALL_ERRORS")) throw error;

		return false;
	}
};

/**
 * Reads InfinityMint configuration file and and registers any gas and price handlers we have for each network
 * @param config
 */
export const registerGasAndPriceHandlers = (config: InfinityMintConfig) => {
	Object.keys(config?.settings?.networks || {}).forEach((key) => {
		let network = config?.settings?.networks[key];
		if (network.handlers === undefined) return;

		if (network.handlers.gasPrice)
			registerGasPriceHandler(key, network.handlers.gasPrice);

		if (network.handlers.tokenPrice)
			registerTokenPriceHandler(key, network.handlers.tokenPrice);
	});
};

/**
 * Loaded when hardhat is being initialized, essentially creates an infinitymint.config if one is not available, generates a new ganache mnemonic and overwrites console.log and console.error to be piped to what ever pipe is currently default.
 *
 * @see {@link app/interfaces.InfinityMintConfig}
 * @see {@link app/pipes.Pipe}
 * @param useJavascript Will return infinitymint.config.js instead of infinitymint.config.ts
 * @param useInternalRequire  Will use require('./app/interfaces') instead of require('infinitymint/dist/app/interfaces')
 * @returns
 */
export const loadInfinityMint = (
	useJavascript?: boolean,
	useInternalRequire?: boolean
) => {
	//try to automatically add module alias
	try {
		let projectJson = getPackageJson();
		if (projectJson._moduleAliases === undefined) {
			projectJson._moduleAliases = {
				"@app": "./node_modules/infinitymint/dist/app/",
			};
		}
		fs.writeFileSync(
			process.cwd() + "/package.json",
			JSON.stringify(projectJson, null, 2)
		);
	} catch (error) {}

	createInfinityMintConfig(useJavascript, useInternalRequire);
	preInitialize(useJavascript);
	initializeGanacheMnemonic();
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

export const createEnvFile = (source: any) => {
	source = source?.default || source;

	//dont do node modules
	if (isInfinityMint()) source.SOLIDITY_USE_NODE_MODULE = false;

	let stub = ``;
	Object.keys(source).forEach((key) => {
		stub = `${stub}${key.toUpperCase()}=${
			typeof source[key] === "string"
				? '"' + source[key] + '"'
				: source[key] !== undefined
				? source[key]
				: ""
		}\n`;
	});

	fs.writeFileSync(process.cwd() + "/.env", stub);
};

export const preInitialize = (isJavascript?: boolean) => {
	//creates dirs
	createDirs([
		"gems",
		"temp",
		"temp/settings",
		"temp/receipts",
		"temp/pipes",
		"temp/deployments",
		"temp/projects",
		"imports",
		"deployments",
		"projects",
	]);

	if (!fs.existsSync(process.cwd() + "/.env")) {
		//if it isn't javascript we can just include the .env.ts file, else if we aren't just copy the .env from the examples/js folder instead
		let path: PathLike;
		if (!isJavascript) {
			path = fs.existsSync(process.cwd() + "/examples/example.env.ts")
				? process.cwd() + "/examples/example.env.ts"
				: process.cwd() +
				  "/node_modules/infinitymint/dist/examples/example.env.js";

			if (!fs.existsSync(path))
				throw new Error(
					"could not find: " + path + " to create .env file with"
				);

			try {
				createEnvFile(require(path));
			} catch (error) {
				console.log(
					"Could not create .env file for typescript environment, falling back to .env"
				);
				preInitialize(true);
				return;
			}
		} else {
			path = fs.existsSync(process.cwd() + "/examples/js/example.env")
				? process.cwd() + "/examples/js/example.env"
				: process.cwd() +
				  "/node_modules/infinitymint/examples/js/example.env";

			if (!fs.existsSync(path))
				throw new Error(
					"could not find: " + path + " to create .env file with"
				);

			fs.copyFileSync(path, process.cwd() + "/.env");
		}

		debugLog("made /env from " + path);
	}
	//will log console.log output to the default pipe
	if (isEnvTrue("PIPE_ECHO_DEFAULT")) Pipes.getPipe("default").listen = true;

	let pipes = [
		"debug",
		"imports",
		"gems",
		"windows",
		"glob",
		"fs",
		"receipts",
	];
	pipes.forEach((pipe) =>
		Pipes.registerSimplePipe(pipe, {
			listen:
				envExists("PIPE_ECHO_" + pipe.toUpperCase()) &&
				process.env["PIPE_ECHO_" + pipe.toUpperCase()] === "true",
			save: true,
		})
	);

	if (isEnvTrue("PIPE_SEPERATE_WARNINGS"))
		Pipes.registerSimplePipe("warnings", {
			listen: isEnvTrue("PIPE_ECHO_WARNINGS"),
			save: true,
		});
};

export const initializeGanacheMnemonic = () => {
	let session = readSession();
	//if the ganache is not external and no mnemonic for ganache in the environment file then set one
	if (
		isEnvTrue("GANACHE_EXTERNAL") === false &&
		session.environment?.ganacheMnemonic === undefined
	)
		session.environment.ganacheMnemonic = generateMnemonic();

	saveSession(session);
	return session.environment?.ganacheMnemonic;
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
		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config = {
			console: true,
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		module.exports = config;`
		: `\n
		import { InfinityMintConfig } from "${requireStatement}";

		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config: InfinityMintConfig = {
			console: true,
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		export default config;`;

	//check if the infinity mint config file has not been created, if it hasn't then create a new config file with the values of the object above
	if (!fs.existsSync(process.cwd() + "/" + filename)) {
		fs.writeFileSync(process.cwd() + "/" + filename, stub);
	}
};

export const getSolidityFolder = () => {
	let session = readSession();

	return (
		session.environment?.solidityFolder ||
		process.env.DEFAULT_SOLIDITY_FOLDER ||
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

let memorySession: InfinityMintSession;
/**
 *
 * @param session Saves the InfinityMint Session
 */
export const saveSession = (session: InfinityMintSession) => {
	memorySession = session;
	fs.writeFileSync(process.cwd() + "/.session", JSON.stringify(session));
};

/**
 *
 * @param error Logs an error
 */
export const error = (error: string | Error) => {
	if (
		isEnvTrue("OVERWRITE_CONSOLE_METHODS") === false &&
		getConfigFile().console === false
	)
		console.error(error);

	Pipes.error(error);
};

export const envExists = (key: string) => {
	return (
		process.env[key] !== undefined && process.env[key]?.trim().length !== 0
	);
};

export const isEnvTrue = (key: InfinityMintEnvironmentKeys): boolean => {
	return process.env[key] !== undefined && process.env[key] === "true";
};

export const isEnvSet = (key: InfinityMintEnvironmentKeys): boolean => {
	return (
		process.env[key] !== undefined && process.env[key]?.trim().length !== 0
	);
};
