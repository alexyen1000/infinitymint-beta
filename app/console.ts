import { InfinityMintConsole } from "./config";
import { log } from "./helpers";
import { InfinityMintWindow } from "./window";

//windows
import Menu from "./windows/menu";
import ConsoleWindow from "./windows/console";

const blessed = require("blessed");

export default class Console {
	private screen: any;
	private options?: InfinityMintConsole;

	protected currentWindow?: InfinityMintWindow;
	protected canExit: boolean;

	private interval?: any;

	constructor(options?: InfinityMintConsole) {
		this.screen = blessed.screen(
			options?.blessed || {
				smartCRS: true,
			}
		);
		this.canExit = true;
		this.options = options;
	}

	public initialize() {
		//register escape key
		this.screen.key(["escape", "q", "C-c"], (ch: string, key: string) => {
			if (this.canExit) return process.exit(0);
			else console.log("cannot exit");
		});

		this.currentWindow = ConsoleWindow;
		this.currentWindow.setScreen(this.screen);
		this.currentWindow.create();

		this.screen.render();

		this.interval = setInterval(() => {
			if (this.currentWindow) this.currentWindow.update();
			this.screen.render();
		}, 33);
	}
}
