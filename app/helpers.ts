import {defaultFactory, PipeFactory} from './pipes';
import fsExtra from 'fs-extra';
import fs, {PathLike} from 'fs';
import {Dictionary} from 'form-data';
import path from 'path';
import {
	InfinityMintConfig,
	KeyValue,
	InfinityMintEnvironmentKeys,
	InfinityMintScript,
	InfinityMintSession,
	InfinityMintEventEmitter,
	InfinityMintScriptArguments,
	InfinityMintGemScript,
	InfinityMintTempProject,
} from './interfaces';
import {generateMnemonic} from 'bip39';
import {HardhatUserConfig} from 'hardhat/types';
import {InfinityMintWindow} from './window';
import {
	registerGasPriceHandler,
	registerTokenPriceHandler,
} from './gasAndPrices';
import {glob} from 'glob';
import {InfinityConsole} from './console';
import {
	getCurrentProject,
	saveTempCompiledProject,
	saveTempDeployedProject,
} from './projects';

export interface Vector {
	x: number;
	y: number;
	z: number;
}

export interface Blessed {
	screen: (options: any) => BlessedElement;
	escape: (input: string) => string;
	stripTags: (input: string) => string;
	cleanTags: (input: string) => string;
	box: (options: BlessedElementOptions) => BlessedElement;
	layout: (options: BlessedElementOptions) => BlessedElement;
	loading: (options: BlessedElementOptions) => BlessedElement;
	button: (options: BlessedElementOptions) => BlessedElement;
	list: (options: BlessedElementOptions) => BlessedElement;
	listbox: (options: BlessedElementOptions) => BlessedElement;
	listtable: (options: BlessedElementOptions) => BlessedElement;
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
	 * will make sure the element is always focus
	 */
	alwayFocus?: boolean;
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
	instantlyCreate: boolean;
	instantlyAppend: boolean;
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
	if (typeof msg === 'object') msg = JSON.stringify(msg, null, 2);

	if (!defaultFactory?.log) {
		if ((console as any)?._log) (console as any)?._log(msg);
		else if (isEnvTrue('PIPE_IGNORE_CONSOLE')) console.log(msg);
		return;
	}

	//if we aren't overwriting console methods and console is false
	if (
		!isAllowPiping ||
		isEnvTrue('PIPE_IGNORE_CONSOLE') ||
		(!isEnvTrue('PIPE_IGNORE_CONSOLE') &&
			getConfigFile().console === false &&
			isEnvTrue('PIPE_SILENCE') === false)
	)
		console.log(
			msg + (pipe === 'default' || !pipe ? '' : ` <${pipe || 'unkown'}>`),
		);

	defaultFactory.log(msg.toString(), pipe);
};

/**
 * Logs a debug message to the current pipe.
 * @param msg
 * @param pipe
 */
export const debugLog = (msg: string | object | number) => {
	if (!defaultFactory?.pipes && (console as any)?._log) {
		(console as any)?._log(msg + ' <debug>');
		return;
	} else if (!defaultFactory?.pipes) {
		console.log(msg);
		return;
	}
	//throw away debug msgs if no pipe for it
	if (!defaultFactory.pipes['debug']) return;

	log(msg, 'debug');
};

/**
 * Logs a debug message to the current pipe.
 * @param msg
 * @param pipe
 */
export const warning = (msg: string | object | number, direct?: true) => {
	msg = `{yellow-fg}{underline}⚠️{/underline} ${msg}{/yellow-fg}`;
	if (direct) logDirect(msg);
	else log(msg, isEnvTrue('PIPE_SEPERATE_WARNINGS') ? 'warning' : 'debug');
};

export const getElementPadding = (
	element: BlessedElement,
	type: 'left' | 'right' | 'up' | 'down',
) => {
	if (!element.padding) return 0;
	if (!element?.padding[type]) return 0;
	return parseInt(element?.padding[type].toString());
};

export const calculateWidth = (...elements: BlessedElement[]) => {
	let fin = 0;
	elements
		.map(
			element =>
				element.strWidth(element.content) +
				//for the border
				(element.border ? 2 : 0) +
				getElementPadding(element, 'left') +
				getElementPadding(element, 'right'),
		)
		.forEach(num => (fin += num));
	return fin;
};

/**
 * Will return the current session file as stored in memorys. Make sure to specify if to forceRead from the .session file agead.
 * @returns
 */
export const readSession = (forceRead?: boolean): InfinityMintSession => {
	if (!fs.existsSync(process.cwd() + '/.session'))
		return {created: Date.now(), environment: {}};

	if (memorySession && !forceRead) return memorySession;

	try {
		let result = JSON.parse(
			fs.readFileSync(process.cwd() + '/.session', {
				encoding: 'utf-8',
			}),
		);
		memorySession = result;
		return result;
	} catch (error) {
		defaultFactory.error(error);
	}

	return {
		created: Date.now(),
		environment: {},
	};
};

/**
 *
 * @param msg
 */
const _blessed = require('blessed');
export const logDirect = (msg: any) => {
	if ((console as any)._log && isAllowPiping)
		(console as any)._log(_blessed.cleanTags(msg));

	console.log(msg);
};

/**
 *
 * @param stage
 * @param project
 * @param call
 * @param type
 * @param infinityConsole
 * @param forceRun
 * @returns
 */
export const stage = async (
	stage: string,
	project: InfinityMintTempProject,
	call: (isFirstTime?: boolean) => Promise<void>,
	type?: 'compile' | 'deploy',
	infinityConsole?: InfinityConsole,
	forceRun?: boolean,
	cleanup?: (isFirstTime?: boolean) => Promise<void>,
): Promise<Error | Error[] | boolean> => {
	type = type || 'compile';
	if (!project.stages) project.stages = {};
	let eventName = 'stage' + (stage[0].toUpperCase() + stage.substring(1));
	if (infinityConsole) infinityConsole.debugLog('executing stage => ' + stage);
	else debugLog('executing stage => ' + stage);

	if (infinityConsole) infinityConsole.emitAny(eventName);

	if (project?.stages[stage] === true && !forceRun) {
		if (infinityConsole)
			infinityConsole.debugLog('\t{cyan-fg}Skipped{/cyan-fg} => ' + stage);
		else debugLog('\t{cyan-fg}Skipped{/cyan-fg} => ' + stage);

		if (infinityConsole) infinityConsole.emitAny(eventName + 'Skipped');
		return true;
	}

	let isFirstTime = typeof project.stages[stage] !== 'object';
	project.stages[stage] = false;

	if (type === 'compile') saveTempCompiledProject(project);
	else saveTempDeployedProject(project);

	try {
		if (infinityConsole)
			infinityConsole.emitAny(eventName + 'Pre', isFirstTime);
		await call(isFirstTime);
		project.stages[stage] = true;

		if (infinityConsole)
			infinityConsole.emitAny(eventName + 'Post', isFirstTime);
		if (type === 'compile') saveTempCompiledProject(project);
		else saveTempDeployedProject(project);

		if (infinityConsole)
			infinityConsole.debugLog('\t{green-fg}Success{/green-fg} => ' + stage);
		else debugLog('\t{green-fg}Success{/green-fg} => ' + stage);
		if (infinityConsole) infinityConsole.emitAny(eventName + 'Success');
		return true;
	} catch (error) {
		project.stages[stage] = error;

		if (type === 'compile') saveTempCompiledProject(project);
		else saveTempDeployedProject(project);

		if (infinityConsole) infinityConsole.debugLog('\t{red-fg}Failure{/red-fg}');
		else debugLog('\t{red-fg}Failure{/red-fg} => ' + stage);
		if (infinityConsole)
			infinityConsole.emitAny(eventName + 'Failure', isFirstTime);

		if (cleanup) await cleanup();

		return error;
	}
};

const parseCache = {};
export const parse = (
	path: PathLike,
	useCache?: boolean,
	encoding?: string,
) => {
	if (parseCache[path.toString()] && useCache)
		return parseCache[path.toString()];

	let result = fs.readFileSync(
		process.cwd() + (path[0] !== '/' ? '/' + path : path),
		{
			encoding: (encoding || 'utf-8') as any,
		},
	);

	let parsedResult: string;
	if (typeof result === typeof Buffer)
		parsedResult = new TextDecoder().decode(result);
	else parsedResult = (result as any).toString();

	return JSON.parse(parsedResult);
};

/**
 *
 * @param path
 * @param object
 */
export const write = (path: PathLike, object: any) => {
	log('writing ' + path, 'fs');
	fs.writeFileSync(
		process.cwd() + (path[0] !== '/' ? '/' + path : path),
		typeof object === 'object' ? JSON.stringify(object) : object,
	);
};
/**
 * Overwrites default behaviour of console.log and console.error
 */
export const overwriteConsoleMethods = () => {
	//overwrite console log
	let _log = console.log;
	console.log = (msg: string) => {
		msg = msg.toString();
		if (!isAllowPiping) {
			_log(_blessed.cleanTags(msg));
			return;
		}

		if (
			msg.indexOf('<#DONT_LOG_ME$>') === -1 &&
			msg.toString().substring(0, 4) === 'eth_' &&
			defaultFactory.pipes['ganache']
		) {
			defaultFactory.log(msg, 'ganache');
			return;
		}

		try {
			if (typeof msg === 'object') msg = JSON.stringify(msg, null, 2);
		} catch (error) {
			msg = msg.toString();
		}

		if (
			msg.indexOf('<#DONT_LOG_ME$>') === -1 &&
			defaultFactory.pipes[defaultFactory.currentPipeKey]
		)
			defaultFactory.log(msg, defaultFactory.currentPipeKey);

		if (
			defaultFactory.pipes[defaultFactory.currentPipeKey]?.listen ||
			(!defaultFactory.pipes[defaultFactory.currentPipeKey] &&
				!isEnvTrue('PIPE_SILENCE_UNDEFINED_PIPE'))
		)
			_log(_blessed.cleanTags(msg.replace('<#DONT_LOG_ME$>', '')));
	};
	(console as any)._log = _log;

	let _error = console.error;
	console.error = (error: any | Error, dontSendToPipe?: boolean) => {
		if (!isAllowPiping) {
			_error(error);
			return;
		}
		if (defaultFactory.pipes[defaultFactory.currentPipeKey] && !dontSendToPipe)
			defaultFactory.getPipe(defaultFactory.currentPipeKey).error(error);

		if (
			isEnvTrue('PIPE_LOG_ERRORS_TO_DEBUG') ||
			isEnvTrue('PIPE_LOG_ERRORS_TO_DEFAULT')
		) {
			log(
				`{red-fg}{bold}⚠️ AN ERROR HAS OCCURED ⚠️{/bold}{/red-fg}`,
				isEnvTrue('PIPE_LOG_ERRORS_TO_DEBUG') ? 'debug' : 'default',
			);
			((error?.stack || error?.message || 'unknown') as string)
				.split('\n')
				.forEach((line: string) =>
					log(
						`{red-fg}${line}{red-fg}`,
						isEnvTrue('PIPE_LOG_ERRORS_TO_DEBUG') ? 'debug' : 'default',
					),
				);
		}

		if (
			defaultFactory.pipes[defaultFactory.currentPipeKey]?.listen ||
			isEnvTrue('PIPE_ECHO_ERRORS')
		)
			_error(error);
	};
	(console as any)._error = _error;
};

/**
 * Returns safely the infinity mint config file
 * @returns
 */
export const getConfigFile = () => {
	let res = require(process.cwd() + '/infinitymint.config');
	res = res.default || res;
	return res as InfinityMintConfig;
};

export const copyContractsFromNodeModule = (
	destination: PathLike,
	source: PathLike,
) => {
	if (
		fs.existsSync(process.cwd() + '/package.json') &&
		readJson(process.cwd() + '/package.json').name === 'infinitymint'
	)
		throw new Error('cannot use node modules in InfinityMint package');

	if (!fs.existsSync(source))
		throw new Error(
			'please npm i infinitymint and make sure ' + module + 'exists',
		);

	if (fs.existsSync(destination) && isEnvTrue('SOLIDITY_CLEAN_NAMESPACE')) {
		log('cleaning ' + source, 'fs');
		fs.rmdirSync(destination, {
			recursive: true,
			force: true,
		} as any);
	}

	if (!fs.existsSync(destination)) {
		log('copying ' + source + ' to ' + destination, 'fs');
		fsExtra.copySync(source, destination);
		fs.chmodSync(destination, 0o777);
	}
};

export const prepareHardhatConfig = (
	session: InfinityMintSession,
	config: InfinityMintConfig,
) => {
	if (!config.hardhat.networks) config.hardhat.networks = {};

	//copy ganache settings to localhost settings if ganache exists
	if (!config.hardhat.networks.localhost && config.hardhat.networks.ganache)
		config.hardhat.networks.localhost = config.hardhat.networks.ganache;

	if (!config.hardhat.paths) config.hardhat.paths = {};

	return config;
};

export const cleanCompilations = () => {
	try {
		debugLog('removing ./artifacts');
		fs.rmdirSync(process.cwd() + '/artifacts', {
			recursive: true,
			force: true,
		} as any);
		debugLog('removing ./cache');
		fs.rmdirSync(process.cwd() + '/cache', {
			recursive: true,
			force: true,
		} as any);
		debugLog('removing ./typechain-types');
		fs.rmdirSync(process.cwd() + '.typechain-types', {
			recursive: true,
			force: true,
		} as any);
	} catch (error: any) {
		if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
		warning('unable to delete folder: ' + error?.message || error);
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

	if (config.hardhat.defaultNetwork === undefined)
		config.hardhat.defaultNetwork =
			session.environment.defaultNetwork || 'hardhat';

	//
	prepareHardhatConfig(session, config);

	//overwrite the console methods
	if (!isEnvTrue('PIPE_IGNORE_CONSOLE')) overwriteConsoleMethods();

	let solidityModuleFolder =
		process.cwd() +
		'/node_modules/infinitymint/' +
		(process.env.DEFAULT_SOLIDITY_FOLDER || 'alpha');
	let solidityFolder =
		process.cwd() + '/' + (process.env.DEFAULT_SOLIDITY_FOLDER || 'alpha');

	if (isEnvTrue('SOLIDITY_USE_NODE_MODULE'))
		copyContractsFromNodeModule(solidityFolder, solidityModuleFolder);

	//if the sources is undefined, then set the solidityFolder to be the source foot
	if (!config.hardhat.paths.sources) {
		//set the sources
		config.hardhat.paths.sources = solidityFolder;

		//delete artifacts folder if namespace changes
		if (
			process.env.DEFAULT_SOLIDITY_FOLDER &&
			session.environment.solidityFolder &&
			session.environment.solidityFolder !== process.env.DEFAULT_SOLIDITY_FOLDER
		) {
			cleanCompilations();
			session.environment.solidityFolder = process.env.DEFAULT_SOLIDITY_FOLDER;
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
	if (!session.environment.solidityFolder)
		session.environment.solidityFolder =
			process.env.DEFAULT_SOLIDITY_FOLDER || 'alpha';

	registerGasAndPriceHandlers(config);

	return config as InfinityMintConfig;
};

export const findWindows = async (roots?: PathLike[]): Promise<string[]> => {
	let searchLocations = [...(roots || [])] as string[];

	if (!isInfinityMint())
		searchLocations.push(
			process.cwd() + '/node_modules/infinitymint/dist/app/windows/**/*.js',
		);
	else searchLocations.push(process.cwd() + '/app/windows/**/*.ts');

	searchLocations.push(process.cwd() + '/windows/**/*.js');
	if (isTypescript()) searchLocations.push(process.cwd() + '/windows/**/*.ts');

	let files = [];

	for (let i = 0; i < searchLocations.length; i++) {
		log('searching for windows with glob => ' + searchLocations[i], 'fs');
		files = [...files, ...(await findFiles(searchLocations[i]))];
	}

	return files;
};

export const getInfinityMintVersion = () => {
	if (isInfinityMint()) return getPackageJson()?.version || '1.0.0';

	if (!fs.existsSync(process.cwd() + '/node_modules/infinitymint/package.json'))
		return '1.0.0';

	return (
		JSON.parse(
			fs.readFileSync(
				process.cwd() + '/node_modules/infinitymint/package.json',
				{encoding: 'utf-8'},
			),
		)?.version || '1.0.0'
	);
};

export const getPackageJson = () => {
	if (
		!fs.existsSync('./../package.json') &&
		!fs.existsSync(process.cwd() + '/package.json')
	)
		throw new Error('no package.json');

	return JSON.parse(
		fs.readFileSync(
			fs.existsSync('./../package.json')
				? './../package.json'
				: process.cwd() + '/package.json',
			{
				encoding: 'utf-8',
			},
		),
	);
};

/**
 *
 * @param globPattern
 * @returns
 */
export const findFiles = (globPattern: string) => {
	log('searching for files with glob pattern => ' + globPattern, 'glob');
	return new Promise<string[]>((resolve, reject) => {
		glob(globPattern, (err: Error, matches: string[]) => {
			if (err) throw err;
			resolve(matches);
		});
	});
};

export const isTypescript = () => {
	let session = readSession();

	return !session.environment?.javascript;
};

export const getFileImportExtension = () => {
	let session = readSession();

	if (session.environment?.javascript) return '.js';

	return '.ts';
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

	if (!isInfinityMint() && isEnvTrue('INFINITYMINT_INCLUDE_SCRIPTS'))
		roots.push(
			process.cwd() + '/node_modules/infinitymint/dist/scripts/**/*.js',
		);

	if (isTypescript()) roots.push(process.cwd() + '/scripts/**/*.ts');
	roots.push(process.cwd() + '/scripts/**/*.js');
	roots = [
		...roots,
		...(config.roots || []).map(
			(root: string) =>
				process.cwd() +
				'/' +
				root +
				(root[root.length - 1] !== '/' ? '/scripts/' : 'scripts/') +
				'**/*.ts',
		),
		...(config.roots || []).map(
			(root: string) =>
				process.cwd() +
				'/' +
				root +
				(root[root.length - 1] !== '/' ? '/scripts/' : 'scripts/') +
				'**/*.js',
		),
	];

	let scanned = [];
	for (let i = 0; i < roots.length; i++) {
		let path = roots[i];
		log('searching for scripts with glob => ' + path, 'fs');
		scanned = [...scanned, ...(await findFiles(path))];
	}

	scanned = scanned.map(fullPath => {
		return path.parse(fullPath);
	});

	return scanned as path.ParsedPath[];
};

/**
 *
 * @param script
 * @param eventEmitter
 * @param gems
 * @param args
 * @param infinityConsole
 */
export const executeScript = async (
	script: InfinityMintScript,
	eventEmitter: InfinityMintEventEmitter,
	gems?: Dictionary<InfinityMintGemScript>,
	args?: Dictionary<InfinityMintScriptArguments>,
	infinityConsole?: InfinityConsole,
) => {
	let _exit = (process as any).exit;
	let _log = console.log;
	let _error = console.error;
	(process as any).exit = code => {
		if (infinityConsole) infinityConsole.log('halted exit code: ' + code);
		else warning('halted exit code: ' + 0);
	};
	try {
		if (infinityConsole)
			console.log = (msg: string) => {
				infinityConsole.getLogs().log(msg, 'default');
			};
		if (infinityConsole)
			console.error = (error: any) => {
				infinityConsole.errorHandler(error);
			};

		await script.execute({
			script: script,
			eventEmitter: eventEmitter,
			gems: gems,
			args: args,
			log: (msg: string) => {
				if (!infinityConsole.isTelnet()) infinityConsole.log(msg);
				else infinityConsole.getLogs().log(msg, 'default');
			},
			debugLog: (msg: string) => {
				if (!infinityConsole.isTelnet()) infinityConsole.debugLog(msg);
				else infinityConsole.getLogs().log(msg, 'debug');
			},
			infinityConsole: infinityConsole,
			project: getCurrentProject(true),
		});
		(process as any).exit = _exit;
		console.log = _log;
		console.error = _error;
	} catch (error) {
		(process as any).exit = _exit;
		console.log = _log;
		console.error = _error;
		throw error;
	}
};

/**
 *
 * @param fileName
 * @returns
 */
export const requireWindow = (
	fileName: string,
	infinityConsole?: InfinityConsole,
	keepCache?: boolean,
) => {
	if (!fs.existsSync(fileName))
		throw new Error('cannot find script: ' + fileName);

	if (!keepCache && require.cache[fileName]) {
		if (infinityConsole)
			infinityConsole.debugLog('\tdeleting old cache  => ' + fileName);
		else debugLog('\tdeleting old cache  => ' + fileName);
		delete require.cache[fileName];
	} else if (keepCache)
		if (infinityConsole)
			infinityConsole.debugLog('\tkeeping old cache  => ' + fileName);
		else debugLog('\tkeeping old cache  => ' + fileName);

	if (infinityConsole) infinityConsole.debugLog('\trequiring => ' + fileName);
	else debugLog('\trequiring  => ' + fileName);
	let result = require(fileName);
	result = result.default || result;
	result.setFileName(fileName);
	return result;
};

/**
 * Checks cwd for a /script/ folder and looks for a script with that name. if it can't find it will look in this repos deploy scripts and try and return that
 * @param fileName
 * @param root
 * @returns
 */

export const requireScript = async (
	fullPath: string,
	infinityConsole?: InfinityConsole,
	keepCache?: boolean,
) => {
	let hasReloaded = false;

	if (!fs.existsSync(fullPath))
		throw new Error('cannot find script: ' + fullPath);

	if (!keepCache && require.cache[fullPath]) {
		infinityConsole
			? infinityConsole.debugLog('\tdeleting old script cache => ' + fullPath)
			: debugLog('\tdeleting old script cache of ' + fullPath);
		delete require.cache[fullPath];
		hasReloaded = true;
	} else if (keepCache) {
		infinityConsole
			? infinityConsole.debugLog('\tkeeping old script cache => ' + fullPath)
			: debugLog('\tkeeping old script cache => ' + fullPath);
	}

	let result = await require(fullPath);
	result = result.default || result;
	if (hasReloaded && keepCache && infinityConsole.isTelnet())
		result = Object.create(result); //clone this object if it has been reloaded, and keeping cache, and we are telnet

	result.fileName = fullPath;

	if (infinityConsole && result.events) {
		Object.keys(result.events).forEach(key => {
			try {
				infinityConsole.getEventEmitter().off(key, result.events[key]);
			} catch (error) {
				warning('could not turn off event emitter: ' + error?.message);
			}

			infinityConsole
				? infinityConsole.debugLog(
						'\tnew event registered<EventEmitter>(' + key + ')',
				  )
				: debugLog('\tnew event registered <EventEmitter>(' + key + ')');

			infinityConsole.getEventEmitter().on(key, result.events[key]);
		});
	}

	try {
		if (result?.reloaded && hasReloaded) {
			if (infinityConsole)
				infinityConsole.debugLog('\tcalling (reloaded) => ' + fullPath);
			else debugLog('\tcalling (reloaded) => ' + fullPath);
			await (result as InfinityMintScript).reloaded({
				log,
				debugLog,
				console: infinityConsole,
				script: result,
			});
		}

		if (result?.loaded) {
			if (infinityConsole)
				infinityConsole.debugLog('\tcalling (loaded) => ' + fullPath);
			else debugLog('\tcalling (loaded) => ' + fullPath);

			await (result as InfinityMintScript).loaded({
				log,
				debugLog,
				console: infinityConsole,
				script: result,
			});
		}
	} catch (error) {
		warning('bad reload/loaded: ' + error.message);
	}

	return result as InfinityMintScript;
};

export const isInfinityMint = () => {
	try {
		let packageJson = getPackageJson();
		if (packageJson?.name === 'infinitymint') return true;
	} catch (error) {
		if (isEnvTrue('THROW_ALL_ERRORS')) throw error;

		return false;
	}
};

let isAllowPiping = false;
export const allowPiping = () => {
	isAllowPiping = true;
};

/**
 * Reads InfinityMint configuration file and and registers any gas and price handlers we have for each network
 * @param config
 */
export const registerGasAndPriceHandlers = (config: InfinityMintConfig) => {
	Object.keys(config?.settings?.networks || {}).forEach(key => {
		let network = config?.settings?.networks[key];
		if (!network.handlers) return;

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
	useInternalRequire?: boolean,
) => {
	initializeGanacheMnemonic();
	//create default pipes
	createPipes(defaultFactory);

	//try to automatically add module alias
	try {
		let projectJson = getPackageJson();
		if (!projectJson._moduleAliases) {
			projectJson._moduleAliases = {
				'@app': './node_modules/infinitymint/dist/app/',
			};
		}
		fs.writeFileSync(
			process.cwd() + '/package.json',
			JSON.stringify(projectJson, null, 2),
		);
	} catch (error) {}

	createInfinityMintConfig(useJavascript, useInternalRequire);
	preInitialize(useJavascript);
};

export const createDirs = (dirs: string[]) => {
	dirs
		.filter((dir: string) => !fs.existsSync(dir))
		.forEach(dir =>
			fs.mkdirSync(process.cwd() + (dir[0] !== '/' ? '/' + dir : dir)),
		);
};

export const readJson = (fileName: string) => {
	return JSON.parse(
		fs.readFileSync(fileName, {
			encoding: 'utf8',
		}),
	);
};

export const createEnvFile = (source: any) => {
	source = source?.default || source;

	//dont do node modules
	if (isInfinityMint()) source.SOLIDITY_USE_NODE_MODULE = false;

	let stub = ``;
	Object.keys(source).forEach(key => {
		stub = `${stub}${key.toUpperCase()}=${
			typeof source[key] === 'string'
				? '"' + source[key] + '"'
				: source[key]
				? source[key]
				: ''
		}\n`;
	});

	fs.writeFileSync(process.cwd() + '/.env', stub);
};

export const preInitialize = (isJavascript?: boolean) => {
	//creates dirs
	createDirs([
		'gems',
		'temp',
		'temp/settings',
		'temp/receipts',
		'temp/pipes',
		'temp/deployments',
		'temp/projects',
		'imports',
		'deployments',
		'projects',
	]);

	if (!fs.existsSync(process.cwd() + '/.env')) {
		//if it isn't javascript we can just include the .env.ts file, else if we aren't just copy the .env from the examples/js folder instead
		let path: PathLike;
		if (!isJavascript) {
			path = fs.existsSync(process.cwd() + '/examples/example.env.ts')
				? process.cwd() + '/examples/example.env.ts'
				: process.cwd() +
				  '/node_modules/infinitymint/dist/examples/example.env.js';

			if (!fs.existsSync(path))
				throw new Error(
					'could not find: ' + path + ' to create .env file with',
				);

			try {
				createEnvFile(require(path));
			} catch (error) {
				console.log(
					'Could not create .env file for typescript environment, falling back to .env',
				);
				preInitialize(true);
				return;
			}
		} else {
			path = fs.existsSync(process.cwd() + '/examples/js/example.env')
				? process.cwd() + '/examples/js/example.env'
				: process.cwd() + '/node_modules/infinitymint/examples/js/example.env';

			if (!fs.existsSync(path))
				throw new Error(
					'could not find: ' + path + ' to create .env file with',
				);

			fs.copyFileSync(path, process.cwd() + '/.env');
		}

		console.log('made .env from ' + path);
	}
};

export const createPipes = (factory: PipeFactory) => {
	let pipes = [
		'debug',
		'imports',
		'gems',
		'windows',
		'glob',
		'fs',
		'ipfs',
		'receipts',
	];

	if (!factory.pipes['default']) factory.registerSimplePipe('default');

	//will log console.log output to the default pipe
	if (isEnvTrue('PIPE_ECHO_DEFAULT')) factory.getPipe('default').listen = true;

	//removes debug pipe
	if (isEnvTrue('PIPE_SILENCE_DEBUG')) pipes = pipes.slice(1);

	pipes.forEach(pipe => {
		if (!factory.pipes[pipe])
			factory.registerSimplePipe(pipe, {
				listen:
					envExists('PIPE_ECHO_' + pipe.toUpperCase()) &&
					process.env['PIPE_ECHO_' + pipe.toUpperCase()] === 'true',
				save: true,
			});
	});

	if (isEnvTrue('PIPE_SEPERATE_WARNINGS'))
		factory.registerSimplePipe('warnings', {
			listen: isEnvTrue('PIPE_ECHO_WARNINGS'),
			save: true,
		});
};

export const initializeGanacheMnemonic = () => {
	let session = readSession();
	session.environment.ganacheMnemonic = getGanacheMnemonic();
	saveSession(session);
	return session.environment?.ganacheMnemonic;
};

export const createInfinityMintConfig = (
	useJavascript?: boolean,
	useInternalRequire?: boolean,
) => {
	let config: HardhatUserConfig = {
		solidity: {
			version: '0.8.12',
			settings: {
				optimizer: {
					enabled: true,
					runs: 20,
				},
			},
		},
		paths: {
			tests: './tests',
		},
	};

	let requireStatement = useInternalRequire
		? './app/interfaces'
		: 'infinitymint/dist/app/interfaces';
	let filename = useJavascript
		? 'infinitymint.config.js'
		: 'infinitymint.config.ts';
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
	if (!fs.existsSync(process.cwd() + '/' + filename)) {
		fs.writeFileSync(process.cwd() + '/' + filename, stub);
	}
};

export const getSolidityFolder = () => {
	let session = readSession();

	return (
		session.environment?.solidityFolder ||
		process.env.DEFAULT_SOLIDITY_FOLDER ||
		'alpha'
	);
};

export const saveSessionVariable = (
	session: InfinityMintSession,
	key: string,
	value: any,
) => {
	if (!session.environment) session.environment = {};

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
	fs.writeFileSync(process.cwd() + '/.session', JSON.stringify(session));
};

/**
 * gets ganache mnemonic
 * @returns
 */
export const getGanacheMnemonic = () => {
	if (readSession()?.environment?.ganacheMnemonic)
		return readSession()?.environment?.ganacheMnemonic;

	return fs.existsSync(process.cwd() + '/.mnemonic')
		? fs.readFileSync(process.cwd() + '/.mnemonic', {
				encoding: 'utf-8',
		  })
		: generateMnemonic();
};

/**
 *
 * @param error Logs an error
 */
export const error = (error: string | Error) => {
	if (
		isEnvTrue('PIPE_IGNORE_CONSOLE') ||
		(!isEnvTrue('PIPE_IGNORE_CONSOLE') && getConfigFile().console === false)
	)
		console.error(error);

	defaultFactory.error(error);
};

/**
 * Since InfinityMintEnvironmentKeys is need as a type for both isEnvSet and isEnvTrue you can use this one to look any env up
 * @param
 * @returns
 */
export const envExists = (key: string) => {
	return isEnvSet(key as any);
};

export const envTrue = (key: string) => {
	return isEnvTrue(key as any);
};

export const isEnvTrue = (key: InfinityMintEnvironmentKeys): boolean => {
	return process.env[key] && process.env[key] === 'true';
};

export const isEnvSet = (key: InfinityMintEnvironmentKeys): boolean => {
	return process.env[key] && process.env[key]?.trim().length !== 0;
};
