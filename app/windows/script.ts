import { executeScript } from "../helpers";
import { InfinityMintWindow } from "../window";

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
Script.setHiddenFromMenu(true);
Script.initialize = async (window, frame, blessed) => {
	if (window.data.script === undefined)
		throw new Error("must be instantated with script in data field");

	let output = window.createElement("output", {
		height: "100%-" + (frame.top + frame.bottom + 8),
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

		try {
			await executeScript(
				window.data.script,
				window.getInfinityConsole().getEventEmitter(),
				{},
				window.data.args || {},
				window.getInfinityConsole(),
				(msg) => {
					output.setContent(output.content + "\n" + msg);
				},
				(msg) => {
					output.setContent(output.content + "\n" + msg);
				}
			);
			output.setContent(
				output.content + "\n{green-fg}{bold}Success{/bold}{/green-fg}"
			);
			close.show();
		} catch (error) {
			retry.show();
			window.getInfinityConsole().errorHandler(error);
			output.setContent(
				output.content +
					"\n{red-fg}{bold}Failed{/bold}\n" +
					error?.stack +
					"{/red-fg}"
			);
		}
	};
	//run in the background
	(() => execute())();
};
export default Script;
