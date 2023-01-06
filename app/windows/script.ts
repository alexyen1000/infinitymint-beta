import Pipes from "../pipes";
import { executeScript, log } from "../helpers";
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

Script.setBackgroundThink(true);
Script.setHideRefreshButton(true);
Script.setCanRefresh(false);
Script.setHiddenFromMenu(true);
Script.initialize = async (window, frame, blessed) => {
	if (window.data.script === undefined)
		throw new Error("must be instantated with script in data field");

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
		scrollbar: window.getScrollbar() || {},
		border: window.getBorder() || {},
		style: {
			fg: "white",
			bg: "transparent",
			border: {
				fg: "#f0f0f0",
			},
		},
	});
	let startingOutputLine = Pipes.pipes["default"].logs.length;
	output.think = (window, element) => {
		if (window.data.processing || output.content.length === 0) {
			output.setContent(
				Pipes.pipes["default"].logs
					.slice(startingOutputLine)
					.map((obj) => obj.message)
					.join("\n")
			);
			output.setScrollPerc(100);
		}
	};

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
		scrollbar: window.getScrollbar() || {},
		border: window.getBorder() || {},
		style: {
			fg: "white",
			bg: "transparent",
			border: {
				fg: "#f0f0f0",
			},
		},
	});
	let startingDebugLine = Pipes.pipes["debug"].logs.length;
	outputDebug.think = (window, element) => {
		if (window.data.processing || outputDebug.content.length === 0) {
			outputDebug.setContent(
				Pipes.pipes["debug"].logs
					.slice(startingDebugLine)
					.map((obj) => obj.message)
					.join("\n")
			);
			outputDebug.setScrollPerc(100);
		}
	};

	let update = () => {
		outputDebug.setContent(
			Pipes.pipes["debug"].logs
				.slice(startingDebugLine)
				.map((obj) => obj.message)
				.join("\n")
		);
		output.setContent(
			Pipes.pipes["default"].logs
				.slice(startingOutputLine)
				.map((obj) => obj.message)
				.join("\n")
		);
		outputDebug.setScrollPerc(100);
		output.setScrollPerc(100);
	};

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

			update();
			window.data.processing = false;
			close.show();
		} catch (error) {
			retry.show();
			log(
				"{red-fg}{bold}script failed exectuion{/bold}\n" +
					error?.stack +
					"{/red-fg}"
			);
			window.getInfinityConsole().errorHandler(error);
			update();
			window.data.processing = false;
		}
	};
	(() => execute())();
};
export default Script;
