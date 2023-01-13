import {Dictionary} from 'form-data';
import {
	Rectangle,
	FuncTripple,
	debugLog,
	readSession,
	saveSession,
	calculateWidth,
	warning,
	BlessedElementOptions,
	getConfigFile,
	log,
	logDirect,
} from './helpers';
import {getCurrentProjectPath} from './projects';
import {BlessedElement, Blessed} from './helpers';
import hre, {ethers} from 'hardhat';
import InfinityConsole from './console';
import {KeyValue} from './interfaces';
import {UserEntry} from './telnet';

const {v4: uuidv4} = require('uuid');
const blessed = require('blessed') as Blessed;

/**
 * @experimental
 */
export class InfinityMintWindow {
	public initialize: FuncTripple<
		InfinityMintWindow,
		BlessedElement,
		Blessed,
		Promise<void>
	>;
	public postInitialize: FuncTripple<
		InfinityMintWindow,
		BlessedElement,
		Blessed,
		Promise<void>
	>;
	public think: FuncTripple<InfinityMintWindow, BlessedElement, Blessed, void>;
	public name: string;
	public elements: Dictionary<BlessedElement>;
	/**
	 * data which is saved to session file
	 */
	public options: KeyValue;
	/**
	 * data which is not saved
	 */
	public data: KeyValue;

	protected hideCloseButton: boolean;
	protected hideMinimizeButton: boolean;
	protected hideRefreshButton: boolean;
	protected hideFromMenu: boolean;
	protected _canRefresh: boolean;
	protected screen: BlessedElement;
	protected container?: InfinityConsole;
	protected inputKeys?: Dictionary<Array<Function>>;
	protected permissions: Array<string>;

	private id: any;
	private destroyed: boolean;
	private backgroundThink: boolean;
	private destroyId: boolean;
	private forcedOpen: boolean;
	private initialized: boolean;
	private creation: any;
	private initialCreation: any;
	private _shouldInstantiate: boolean;
	private fileName: string;

	constructor(
		name?: string,
		style?: KeyValue,
		border?: KeyValue | string,
		scrollbar?: KeyValue,
		padding?: number | string,
		options?: KeyValue,
		data?: KeyValue,
	) {
		this.name = name || this.constructor.name;
		this.destroyed = false;
		this.backgroundThink = false;
		this.initialized = false;
		this.destroyId = true;
		this._shouldInstantiate = false;
		this._canRefresh = true;
		this.options = options || {};
		this.data = data || {};
		this.initialCreation = Date.now();
		this.elements = {};
		this.permissions = ['all'];

		this.data.style = style || {};
		this.data.scrollbar = scrollbar || {};
		this.data.border = border || {};
		this.data.padding = padding || 1;

		//replace with GUID
		this.id = this.generateId();
		this.initialize = async () => {
			this.log('window initialized');
		};
	}

	public setPermissions(permissions: string[]) {
		this.permissions = permissions;
	}

	public canAccess(user: UserEntry) {
		return (
			this.permissions.filter(
				thatPerm =>
					thatPerm === 'all' ||
					thatPerm.toLowerCase() === user.group.toLowerCase(),
			).length !== 0
		);
	}

	public createFrame() {
		if (this.elements['frame']) {
			this.elements['frame'].free();
			this.elements['frame'].destroy();
			delete this.elements['frame'];
		}
		// Create the frame which all other components go into
		this.elements['frame'] = this.registerElement(
			'frame',
			blessed.layout({
				top: this.getX(),
				left: this.getY(),
				width: this.getWidth(),
				height: this.getHeight(),
				layout: 'grid',
				tags: true,
				parent: this.screen,
				padding: 1,
				scrollbar: this.options.scrollbar || this.data.scrollbar || {},
				border: this.options.border || this.data.border || {},
				style: this.options.style || this.data.style || {},
			}),
			true,
		);
		this.screen.append(this.elements['frame']);
		this.screen.render();
		//send frame to back
		this.elements['frame'].setBack();
	}

	public setFileName(fileName?: string) {
		this.fileName = fileName || __filename;
	}

	public getFileName() {
		return this.fileName;
	}

	public setHiddenFromMenu(hidden: boolean) {
		this.hideFromMenu = hidden;
	}

	public isHiddenFromMenu() {
		return this.hideFromMenu;
	}

	public setForcedOpen(forcedOpen: boolean) {
		this.forcedOpen = forcedOpen;
	}

	public isForcedOpen() {
		return this.forcedOpen;
	}
	/**
	 * Will hide the close button if true, can be called when ever but be aware screen must be re-rendered in some circumstances.
	 * @param hideCxloseButton
	 */
	public setHideCloseButton(hideCloseButton: boolean) {
		this.hideCloseButton = hideCloseButton;

		if (!this.elements['closeButton'] && !this.elements['hideButton']) return;

		if (this.hideCloseButton) {
			this.elements['closeButton'].hide();
			this.elements['hideButton'].right = 0;
		} else {
			this.elements['closeButton'].show();
			this.elements['hideButton'].right =
				calculateWidth(this.elements['closeButton']) + 2;
		}
	}

	/**
	 * Will hide the minimize button if true, can be called when ever but be aware screen must be re-rendered in some circumstances
	 * @param hideMinimizeButton
	 */
	public setHideMinimizeButton(hideMinimizeButton: boolean) {
		this.hideMinimizeButton = hideMinimizeButton;

		if (!this.elements['hideButton']) return;
	}

	private generateId() {
		return uuidv4();
	}

	public setScreen(screen: any) {
		if (this.screen)
			this.warning(`setting screen with out window object first`);

		this.screen = screen;
	}

	public setScrollbar(scrollbar: any) {
		this.data.scrollbar = scrollbar;
	}

	public setBackgroundThink(backgroundThink: boolean) {
		this.backgroundThink = backgroundThink;
	}

	public setShouldInstantiate(instantiateInstantly: boolean) {
		this._shouldInstantiate = instantiateInstantly;
	}

	///TODO: needs to be stricter
	public hasContainer() {
		return !!this.container;
	}

	/**
	 *
	 * @returns
	 */
	public shouldInstantiate(): boolean {
		return this._shouldInstantiate;
	}

	/**
	 *
	 * @returns
	 */
	public shouldBackgroundThink(): boolean {
		return this.backgroundThink;
	}

	/**
	 * sets if the window should destroy its id upon being destoryed. or have a persistant id.
	 * @param shouldDestroyId
	 */
	public setDestroyId(shouldDestroyId: boolean) {
		this.destroyId = shouldDestroyId;
	}

	/**
	 * Set the current window container / infinityconsole / terminal container for this window
	 * @param container
	 */
	public setContainer(container: InfinityConsole) {
		if (this.container)
			throw new Error('cannot set container with out destroying window first');

		this.container = container;
	}

	/**
	 * Opens another infinity mint window, closing this one.
	 * @param name
	 */
	public async openWindow(name: string) {
		this.container?.gotoWindow(name);
	}

	/**
	 *
	 * @returns
	 */
	public getCreation() {
		return this.creation;
	}

	/**
	 *
	 * @returns
	 */
	public getInitialCreation() {
		return this.initialCreation;
	}

	/**
	 * Will log a message to the current InfinityConsoles logger. This is because in telnet mode InfinityMint would combine all log messages together. By default, always use the log, debugLog provided to you on the various console/script classes. If you use the import for log/debug the the log will only be seen by the defaultFactory
	 * @param msg
	 */
	public debugLog(msg: string) {
		if (
			!this.hasInfinityConsole() &&
			this.hasInfinityConsole() &&
			this.getInfinityConsole().isTelnet()
		)
			debugLog(msg);

		this.getInfinityConsole().debugLog(msg);
	}

	/**
	 * A fully mutable object which can hold options which persist between InfinityMint terminal sessions. You can use this along with saveOptions to write variables to the .session file.
	 *
	 * See {@link app/interfaces.InfinityMintSession}
	 * @param defaultOptions
	 */
	public loadOptions(
		defaultOptions?: Dictionary<any>,
		elementDefaultOptions?: Dictionary<KeyValue>,
	) {
		let session = readSession();
		let settings = session.environment['Window_' + this.name] || {};

		this.options = {
			...this.options,
			...settings,
		};
		if (settings.style) this.setStyle(settings.style);
		if (settings.border) this.setBorder(settings.border);
		if (settings.scrollbar) this.setScrollbar(settings.scrollbar);

		Object.keys(defaultOptions || {}).forEach(key => {
			if (!this.options[key]) this.options[key] = defaultOptions[key];
		});
		this.screen.render();

		Object.keys(this.elements).forEach(key => {
			try {
				let element = this.elements[key];

				element.options =
					session.environment['Window_' + this.name + '_' + key] || {};

				if (elementDefaultOptions[key])
					Object.keys(elementDefaultOptions[key] || {}).forEach(elementKey => {
						if (!element.options[elementKey])
							element.options[elementKey] =
								elementDefaultOptions[key][elementKey];
					});
			} catch (error) {
				warning('cannot load settings for element: ' + error.message);
			}
		});
	}

	/**
	 *
	 */
	public saveOptions() {
		let session = readSession();

		if (!this.options.style && this.data.style)
			this.options.style = this.data.style;
		if (!this.options.border && this.data.border)
			this.options.border = this.data.border;
		if (!this.options.scrollbar && this.data.scrollbar)
			this.options.scrollbar = this.data.scrollbar;
		if (this.options.padding == undefined && this.data.padding)
			this.options.padding = this.data.padding;

		session.environment['Window_' + this.name] = this.options;
		Object.keys(this.elements).forEach(key => {
			let element = this.elements[key];
			let options = {...(element.options || {})};

			if (options.parent) delete options.parent;
			try {
				JSON.stringify(options);
			} catch (error) {
				warning(
					`cannot stringify ${element.constructor.name}: ` + error.message,
				);
				return;
			}
			session.environment['Window_' + this.name + '_' + key] = options;
		});

		this.log('saving window options');
		saveSession(session);
	}

	/**
	 *
	 * @returns
	 */
	public getPadding() {
		return this.data?.padding || this.elements['frame']?.padding;
	}

	/**
	 * Returns a clone of this window
	 * @param options
	 * @param data
	 * @returns
	 */
	public clone(name?: string, style?: {}, options?: {}, data?: {}) {
		let clone = new InfinityMintWindow(
			name || this.name,
			style || this.getStyle(),
			this.getBorder(),
			this.getScrollbar(),
			this.getPadding(),
			{...this.options, ...(options || {})},
		);
		clone.initialize = this.initialize;
		clone.think = this.think;
		clone.setBackgroundThink(this.backgroundThink);
		clone.setShouldInstantiate(this._shouldInstantiate);
		clone.setHideMinimizeButton(this.hideMinimizeButton);
		clone.setHideCloseButton(this.hideCloseButton);
		clone.setHideRefreshButton(this.hideRefreshButton);
		clone.setCanRefresh(this._canRefresh);
		clone.data = {...this.data, ...(data || {})};
		clone.data.clone = true;
		return clone;
	}

	/**
	 * Returns true if this window can be refreshed
	 * @returns
	 */
	public canRefresh() {
		return this._canRefresh;
	}

	/**
	 * Sets if this window can be refreshed
	 * @param canRefresh
	 */
	public setCanRefresh(canRefresh: boolean) {
		this._canRefresh = canRefresh;
	}

	/**
	 * Returns true if we have an InfinityConole set on this window
	 * @returns
	 */
	public hasInfinityConsole() {
		return !!this.container;
	}

	/**
	 * Get the infinity console this window is contained in. Through the InfinityConsole you can change the network, refresh web3 and do a lot more!
	 * @returns
	 */
	public getInfinityConsole() {
		if (!this.container)
			throw new Error('no infinityconsole associated with this window');

		return this.container;
	}

	public setBorder(border: any) {
		this.options.border = border;
		this.data.border = border;
	}

	public getBorder() {
		return (
			this.data?.border || this.options?.border || this.elements['frame'].border
		);
	}

	public setWidth(num: number | string) {
		this.elements['frame'].width = num;
		if (this.options.style) this.options.style.width = num;
		if (this.data.style) this.data.style.width = num;
	}

	public setPadding(num: number | string) {
		this.elements['frame'].padding = num;
	}

	public getId() {
		return this.id;
	}

	public isEqual(thatWindow: InfinityMintWindow) {
		return this.id === thatWindow.id;
	}

	public toString() {
		return this.id;
	}

	public getFrame() {
		return this.elements['frame'];
	}

	public setHeight(num: number | string) {
		this.elements['frame'].height = num;
		if (this.options.style) this.options.style.height = num;
		if (this.data.style) this.data.style.height = num;
	}

	public getRectangle(): Rectangle {
		return {
			startX: this.getCalculatedX(),
			endX: this.getCalculatedX() + this.getCalculatedWidth(),
			startY: this.getCalculatedY(),
			endY: this.getCalculatedY() + this.getCalculatedHeight(),
			width: this.getCalculatedWidth(),
			height: this.getCalculatedHeight(),
			z: 1,
		};
	}

	public getStyle(): object {
		return (
			this.options?.style ||
			this.data?.style ||
			this?.elements['frame']?.style ||
			{}
		);
	}

	public setStyle(style: any) {
		this.elements['frame'].style = style;
		this.options.style = style;
		this.data.style = style;
	}

	public getWidth() {
		return this.options?.style?.width || this.data?.style?.width || '100%';
	}

	public getCalculatedWidth() {
		return this.elements['frame'].cols || 0;
	}

	public getCalculatedHeight() {
		return this.elements['frame'].rows || 0;
	}

	public getHeight() {
		return this.options?.style?.height || this.data?.style?.height || '100%';
	}

	public getCalculatedX() {
		return this.elements['frame'].left || 0;
	}

	public getCalculatedY() {
		return this.elements['frame'].top || 0;
	}

	public getX() {
		return this.options?.style?.left || this.options?.data?.left || 0;
	}

	public getY() {
		return this.options?.style?.top || this.options?.data?.top || 0;
	}

	public hide() {
		this.log('hiding');
		Object.values(this.elements).forEach(element => {
			if (!element.hidden) {
				element.shouldUnhide = true;
				element.hide();
			}
		});
	}

	public show() {
		this.log(`showing`);
		Object.values(this.elements).forEach(element => {
			if (element.shouldUnhide) {
				element.shouldUnhide = false;
				element.show();
			}
		});

		try {
			this.updateFrameTitle();
		} catch (error) {
			warning('ciuld not update frame title:' + error.message);
		}
	}

	public setSize(width: number | string, height: number | string) {
		this.setWidth(width);
		this.setHeight(height);
	}

	public log(string?: string | string[], window?: any, returnString?: boolean) {
		window = window || this;
		if (typeof string === typeof Array) string = (string as string[]).join(' ');

		if (returnString) return string + ` => <${window.name}>[${window.getId()}]`;

		if (!this.hasInfinityConsole())
			log(string + ` => <${window.name}>[${window.getId()}]`, 'windows');
		else
			this.getInfinityConsole()
				.getLogs()
				.log(string + ` => <${window.name}>[${window.getId()}]`, 'windows');
	}

	/**
	 * Warnings are logged to the default pipe
	 * @param string
	 * @param window
	 * @param returnString
	 * @returns
	 */
	public warning(
		string?: string | string[],
		window?: any,
		returnString?: boolean,
	) {
		window = window || this;
		if (typeof string === typeof Array) string = (string as string[]).join(' ');
		if (returnString) return string + ` => <${window.name}>[${window.getId()}]`;

		warning(string + ` => <${window.name}>[${window.getId()}]`);
	}

	/**
	 * Registers a new blessed element with the window.
	 * @param key
	 * @param element
	 * @returns
	 */
	public registerElement(
		key: string,
		element: BlessedElement,
		dontRegister?: boolean,
	): BlessedElement {
		if (this.elements[key])
			throw new Error('key already registered in window: ' + key);

		if (element.window)
			throw new Error(
				this.log(
					'element (' +
						element.constructor.name +
						') is already registered to ',
					null,
					true,
				),
			);

		if (this.elements['frame'] && !element.parent)
			element.parent = this.elements['frame'];

		this.log('registering element (' + element.constructor.name + ')');

		element.window = this;
		//does the same a above
		element.oldOn = element.on;
		element.on = (param1: any, cb: any) => {
			if (typeof cb === typeof Promise)
				this.elements[key].oldOn(param1, async (...any: any[]) => {
					try {
						await cb(...any);
					} catch (error) {
						this.getInfinityConsole().errorHandler(error);
					}
				});
			else
				this.elements[key].oldOn(param1, (...any: any[]) => {
					try {
						cb(...any);
					} catch (error) {
						this.getInfinityConsole().errorHandler(error);
					}
				});
		};
		element?.focus();

		if (dontRegister) return element;

		this.elements[key] = element;
		return this.elements[key];
	}

	public getElement(key: string): BlessedElement {
		return this.elements[key];
	}

	/**
	 *
	 * @returns
	 */
	public getScrollbar() {
		return this.data.scrollbar || this.options.scrollbar || true;
	}

	public update() {
		if (this.think) {
			this.think(this, this.getElement('frame'), blessed);
		}
	}

	public getScreen() {
		return this.screen;
	}

	public destroy() {
		this.log('destroying');
		this.destroyed = true;
		this.initialized = false;

		//save options on destroy
		this.saveOptions();
		//unkeys everything to do with the window
		if (this.inputKeys)
			Object.keys(this.inputKeys).forEach(key => {
				Object.values(this.inputKeys[key]).forEach(cb => {
					this.unkey(key, cb);
				});
			});

		Object.keys(this.elements).forEach(index => {
			this.log(
				'destroying element (' + this.elements[index].constructor.name + ')',
			);

			try {
				this.elements[index].free(); //unsubscribes to events saving memory
			} catch (error) {}
			try {
				this.elements[index].destroy();
			} catch (error) {}
			delete this.elements[index];
		});

		this.container = undefined;
		this.screen = undefined;
		this.elements = {};

		//keep settings for this window saved
		this.options.style = this.data.style;
		this.options.scrollbar = this.data.scrollbar;
		this.options.padding = this.data.padding;
		this.options.border = this.data.border;

		//clear data
		this.data = {};
	}

	/**
	 * Registers a key command to the window which then executes a function
	 * @param key
	 * @param cb
	 */

	public key(key: string, cb: Function) {
		if (!this.inputKeys) this.inputKeys = {};

		this.getInfinityConsole().key(key, cb);

		if (!this.inputKeys[key]) this.inputKeys[key] = [];
		this.inputKeys[key].push(cb);
	}

	/**
	 * Removes a key bindi fng on the window, pass it a callback of the key to only remove that one. Else will remove all keys
	 * @param key
	 * @param cb
	 * @returns
	 */
	public unkey(key: string, cb?: Function) {
		if (!this.inputKeys || !this.inputKeys[key]) return;

		if (cb) this.getInfinityConsole().unkey(key, cb);
		else {
			//unmap all keys
			Object.values(this.inputKeys[key]).forEach(cb => {
				this.getInfinityConsole().unkey(key, cb);
			});
			this.inputKeys[key] = [];
			return;
		}

		if (this.inputKeys[key].length <= 1) this.inputKeys[key] = [];
		else {
			this.inputKeys[key] = this.inputKeys[key].filter(
				thatCb => thatCb.toString() === cb.toString(),
			);
		}
	}

	public isAlive() {
		return this.initialized && !this.destroyed;
	}

	public hasInitialized() {
		return this.initialized;
	}

	public on(event: string, listener: Function): Function {
		if (!this.getElement('frame'))
			throw new Error('frame has not been created');

		return this.getElement('frame').on(event, listener);
	}

	public off(event: string, listener?: Function) {
		if (!this.getElement('frame')) return;
		this.getElement('frame').off(event, listener);
	}

	public isVisible() {
		return this.getElement('frame')?.hidden === false;
	}

	public async updateFrameTitle() {
		if (!this.hasInfinityConsole()) return;
		let account = this.getInfinityConsole().getAccount();
		let balance = this.getInfinityConsole().getBalance();
		let etherBalance = ethers.utils.formatEther(balance || 0);
		let musicOptions = this.getInfinityConsole().windowExists('Music')
			? this.getInfinityConsole().getWindow('Music').options
			: {
					currentTrack: 'nothing',
			  };
		let seconds = musicOptions.clock || 0;
		let minutes = seconds <= 0 ? 0 : Math.floor(musicOptions.clock / 60);

		this.elements['frame'].setContent(
			`{bold}${this.name}{/bold} {magenta-fg}=>{/magenta-fg} {yellow-fg}${
				hre.network.name
			}[${this.getInfinityConsole().getCurrentChainId()}] {underline}${account?.address.substring(
				0,
				16,
			)}...{/underline}{/yellow-fg} {black-bg}{white-fg}${
				getCurrentProjectPath()?.base || '{red-fg}NO CURRENT PROJECT{red-fg}'
			}{/white-fg}{/black-bg} {white-fg}{bold}${etherBalance.substring(
				0,
				8,
			)} ETH ($${(parseFloat(etherBalance) * 2222).toFixed(
				2,
			)}){/bold}{/white-fg} {black-bg}{red-fg}{bold}150.2 gwei{/bold}{/red-fg}{/black-bg} {black-bg}{yellow-fg}{bold}120.2 gwei{/bold}{/yellow-fg}{/black-bg} {black-bg}{green-fg}{bold}110.2 gwei{/bold}{/green-fg}{/black-bg} {bold}{cyan-fg}♫{/cyan-fg}{/bold} {underline}{cyan-fg}${
				!getConfigFile().music ? 'music disabled' : musicOptions.currentTrack
			}{/cyan-fg}{/underline} {black-bg}{white-fg}${(minutes % 60)
				.toString()
				.padStart(2, '0')}:${(seconds % 60)
				.toString()
				.padStart(2, '0')}{/white-fg}{/black-bg}`,
		);
	}

	/**
	 *
	 * @param hideRefreshButton
	 */
	public setHideRefreshButton(hideRefreshButton?: boolean) {
		this.hideRefreshButton = hideRefreshButton;

		if (this.elements['refreshButton']) {
			if (this.hideRefreshButton || !this.canRefresh)
				this.elements['refreshButton'].hide();
			else {
				this.elements['refreshButton'].show();
			}
		}
	}

	/**
	 *
	 * @param key
	 * @param options
	 * @param type - default of `box`
	 * @returns
	 */
	public createElement(
		key: string,
		options: BlessedElementOptions,
		type?:
			| 'box'
			| 'list'
			| 'image'
			| 'bigtext'
			| 'listbar'
			| 'listtable'
			| 'layout',
	) {
		type = type || 'box';

		if (!options.parent) options.parent = this.screen;

		if (!blessed[type] || typeof blessed[type] !== 'function')
			throw new Error('bad blessed element: ' + type);

		let element = this.registerElement(key, blessed[type](options));
		if (element?.options.parent) delete element.options.parent;

		if (options.alwaysFront) element.alwaysFront = options.alwaysFront;
		if (options.alwaysBack) element.alwaysBack = options.alwaysBack;
		if (options.alwaysUpdate) element.alwaysUpdate = options.alwaysUpdate;
		if (options.think) element.think = options.think;
		if (options.alwaysFocus) element.alwaysFocus = options.alwaysFront;

		if (options.instantlyCreate || options.instantlyAppend) {
			this.screen.append(element);
			this.screen.render();
		}

		if (options.mouse || options.keys) element.enableInput();

		return element;
	}

	public async create() {
		if (this.initialized && this.destroyed === false)
			throw new Error('already initialized');
		if (!this.screen)
			throw new Error('cannot create window with undefined screen');
		if (this.initialized && this.destroyed && this.destroyId) {
			let oldId = this.id;
			this.id = this.generateId();
			this.debugLog(`old id <${this.name}>[${oldId}] destroyed`);
		}
		this.destroyed = false;
		this.creation = Date.now();
		this.log('calling initialize');
		try {
			//update the title and frame
			this.elements['frame'].setFront();
			await this.initialize(this, this.elements['frame'], blessed);
			this.initialized = true;
		} catch (error) {
			this.getInfinityConsole().errorHandler(error);
		}

		//append each element
		Object.keys(this.elements).forEach(key => {
			let element = this.elements[key];

			try {
				if (
					key !== 'frame' &&
					!element.instantlyAppend &&
					!element.instantlyCreate
				) {
					this.screen.append(element);
					this.screen.render();
				}

				if (element.shouldFocus) element.focus();
				if (element.alwaysBack) element.setBack();
				if (element.alwaysFront) element.setFront();
			} catch (error) {
				warning(error.message);
			}
		});

		//frame title
		await this.updateFrameTitle();

		let closeButton = this.createElement('closeButton', {
			top: -1,
			right: 2,
			width: 3,
			height: 3,
			shouldFocus: true,
			tags: true,
			padding: 0,
			alwaysFront: true,
			content: ' ',
			border: 'line',
			style: {
				bg: 'red',
				fg: 'white',
				hover: {
					bg: 'grey',
				},
			},
		});
		closeButton.on('click', () => {
			this.getInfinityConsole().destroyWindow(this);
		});

		let hideButton = this.createElement('hideButton', {
			top: -1,
			right: this.hideCloseButton
				? 2
				: calculateWidth(this.elements['closeButton']) + 2,
			width: 3,
			height: 3,
			alwaysFront: true,
			shouldFocus: true,
			tags: true,
			padding: 0,
			instantlyAppend: true,
			content: ' ',
			border: 'line',
			style: {
				bg: 'yellow',
				fg: 'white',
				hover: {
					bg: 'grey',
				},
			},
		});
		hideButton.on('click', () => {
			this.hide();
		});

		let refreshButton = this.createElement('refreshButton', {
			top: -1,
			right: this.hideCloseButton
				? calculateWidth(this.elements['hideButton']) + 2
				: calculateWidth(
						this.elements['hideButton'],
						this.elements['closeButton'],
				  ) + 2,
			width: 3,
			height: 3,
			alwaysFront: true,
			shouldFocus: true,
			instantlyAppend: true,
			tags: true,
			padding: 0,
			content: ' ',
			border: 'line',
			style: {
				bg: 'blue',
				fg: 'white',
				hover: {
					bg: 'grey',
				},
			},
		});
		refreshButton.on('click', () => {
			this.getInfinityConsole().reloadWindow(this);
		});

		if (this.hideCloseButton) this.elements['closeButton'].hide();
		if (this.hideMinimizeButton) this.elements['hideButton'].hide();
		if (this.hideRefreshButton || !this.canRefresh)
			this.elements['refreshButton'].hide();

		this.elements['hideButton'].setFront();
		this.elements['closeButton'].setFront();

		//run post initialize
		if (this.postInitialize) {
			this.log('calling post initialize');
			await this.postInitialize(this, this.elements['frame'], blessed);
		}
	}
}
