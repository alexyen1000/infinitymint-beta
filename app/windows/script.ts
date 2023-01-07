import Pipes from "../pipes";
import { debugLog, executeScript, log } from "../helpers";
import { InfinityMintWindow } from "../window";
import { InfinityMintScript } from "../interfaces";

const Script = new InfinityMintWindow(
	"Script",
	{
		fg: "white",
		bg: "black",
		border: {
			fg: "#f0f0f0",
		},
	},
	{
		type: "line",
	},
	{
		ch: " ",
		track: {
			bg: "black",
		},
		style: {
			inverse: true,
		},
	}
);

Script.initialize = async (window, frame, blessed) => {
	if (!window.data.script)
		throw new Error("must be instantated with script in data field");

	let think = (window, element) => {
		if (window.data.processing) {
			output.setScrollPerc(100);
			outputDebug.setScrollPerc(100);
		}
	};
	let output = window.createElement("output", {
		height: "100%-8",
		width: "50%",
		padding: 1,
		top: 4,
		label: `{bold}{white-fg}Output: {/white-fg}{/bold}`,
		keys: true,
		tags: true,
		scrollable: true,
		vi: true,
		instantlyAppend: true,
		shouldFocus: true,
		mouse: true,
		alwaysScroll: true,
		scrollbar: window.getScrollbar(),
		border: "line",
		style: {
			fg: "white",
			bg: "transparent",
			border: {
				fg: "#f0f0f0",
			},
		},
	});
	output.think = think;
	let outputDebug = window.createElement("outputDebug", {
		height: "100%-8",
		width: "50%+2",
		padding: 1,
		right: 0,
		top: 4,
		label: `{bold}{white-fg}Debug: {/white-fg}{/bold}`,
		keys: true,
		tags: true,
		scrollable: true,
		vi: true,
		instantlyAppend: true,
		shouldFocus: true,
		mouse: true,
		alwaysScroll: true,
		scrollbar: window.getScrollbar(),
		border: "line",
		style: {
			fg: "white",
			bg: "transparent",
			border: {
				fg: "#f0f0f0",
			},
		},
	});
	outputDebug.think = think;

	let retry = window.createElement("retry", {
		bottom: 0,
		left: 0,
		shrink: true,
		width: "shrink",
		alwaysFront: true,
		height: "shrink",
		padding: 1,
		content: "Retry Script",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: "red",
			border: {
				fg: "#ffffff",
			},
			hover: {
				bg: "grey",
			},
		},
	});
	retry.on("click", async () => {
		await window.getInfinityConsole().refreshScripts();
		//set the new script
		debugLog("{cyan-fg}retrying script{/cyan-fg}");
		window.data.script =
			window
				.getInfinityConsole()
				.getScripts()
				.filter(
					(script) => script.fileName === window.data.script.fileName
				)[0] || window.data.script;

		output.setContent("");
		execute();
	});
	retry.hide();

	let close = window.createElement("close", {
		bottom: 0,
		left: 0,
		shrink: true,
		width: "shrink",
		alwaysFront: true,
		height: "shrink",
		padding: 1,
		content: "Close Script",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: "green",
			border: {
				fg: "#ffffff",
			},
			hover: {
				bg: "grey",
			},
		},
	});
	close.on("click", () => {
		window.openWindow("Scripts");
		window.getInfinityConsole().destroyWindow(window);
	});
	close.hide();

	//executes the script
	const execute = async () => {
		retry.hide();
		//run in the background
		window.data.processing = true;
		try {
			log(
				`{bold}{cyan-fg}executing ${
					(window.data.script as InfinityMintScript).fileName
				}{/cyan-fg}{/bold}`
			);
			await executeScript(
				window.data.script,
				window.getInfinityConsole().getEventEmitter(),
				{},
				window.data.args || {},
				window.getInfinityConsole()
			);
			log(
				"{bold}{green-fg}script executed successfully{/green-fg}{/bold}"
			);
			window.setHideCloseButton(false);
			output.setScrollPerc(100);
			outputDebug.setScrollPerc(100);
			close.show();
			//stop logs after 1 second
			setTimeout(() => {
				window.data.processing = false;
			}, 1000);
		} catch (error) {
			log("{red-fg}{bold}script failed exectuion{/bold}{/red-fg}");
			window.getInfinityConsole().errorHandler(error);
			window.setHideCloseButton(false);
			output.setScrollPerc(100);
			outputDebug.setScrollPerc(100);
			setTimeout(() => {
				window.data.processing = false;
			}, 1000);
			retry.show();
		}
	};

	//when logs occur
	let cb = (msg: string, pipe: string) => {
		//keep showing debug
		if (pipe === "debug") outputDebug.pushLine(msg);

		if (!window.data.processing) return;
		if (pipe === "default") output.pushLine(msg);
	};
	Pipes.emitter.on("log", cb);
	//when this window is destroyed, destroy the output emitter
	window.on("destroy", () => {
		Pipes.emitter.off("log", cb);
	});
	(() => execute())();
};
Script.setBackgroundThink(true);
Script.setHideRefreshButton(true);
Script.setHideCloseButton(true);
Script.setCanRefresh(false);
Script.setHiddenFromMenu(true);
export default Script;
