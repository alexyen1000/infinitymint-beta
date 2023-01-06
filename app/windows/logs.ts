import {
	Blessed,
	BlessedElement,
	calculateWidth,
	log,
	readSession,
	saveSession,
	saveSessionVariable,
} from "../helpers";
import Pipes from "../pipes";
import { InfinityMintWindow } from "../window";

let pipeViewerThink = (
	window: InfinityMintWindow,
	element: BlessedElement,
	blessed: Blessed
) => {
	let lines = Pipes.getPipe(element.options.pipe).logs;
	element.options.currentCount = 0;
	//bleseed push line doesnt work for some reason so we have to do it this way

	//counts lined changes
	if (element.options.showDuplicateEntries !== true)
		lines.forEach((object) => {
			element.options.currentCount =
				element.options.currentCount + object.count;
		});

	element.setLabel(
		"{bold}{white-fg}Pipe: {/white-fg}" + element.options.pipe + "{/bold}"
	);

	if (
		element.options.currentCount !== element.options.lastCount ||
		element.options.lastLength !== lines.length
	) {
		element.options.lastCount = 0;
		lines
			.slice(
				element.options.lastLength - 1 < 0
					? 0
					: element.options.lastLength - 1
			)
			.forEach((object) => {
				let line = object.message;
				element.options.lastCount =
					element.options.lastCount + object.count;
				let lineCount = (indexCount: number | string) => {
					return `{white-bg}{black-fg}${indexCount
						.toString()
						.padEnd(6, " ")}{/black-fg}{/white-bg} `;
				};

				if (
					object.count <= 1 ||
					element.options.showDuplicateEntries !== true
				) {
					let finalLine = lineCount(object.index) + line.toString();
					finalLine =
						finalLine +
						` {blue-fg}{bold}${
							element.options.showDuplicateEntries !== true &&
							object.count > 1
								? "x" + object.count
								: ""
						}{/bold}{/blue-fg}`;
					finalLine =
						object.index % 2 === 0
							? `{white-fg}${finalLine}{/white-fg}`
							: `{black-bg}${finalLine}{/black-bg}`;

					element.setLine(
						object.index + element.options.extraLines,
						finalLine
					);
				} else {
					let currentExtraLines = element.options.extraLines;
					for (let i = 0; i < object.count; i++) {
						let finalLine =
							lineCount(object.index + " " + i) + line.toString();
						finalLine =
							(object.index + i) % 2 === 0
								? `{white-fg}${finalLine}{/white-fg}`
								: `{black-bg}${finalLine}{/black-bg}`;

						element.setLine(
							object.index + currentExtraLines + i,
							finalLine
						);
						if (
							i > 0 &&
							element.options.lastLength !== lines.length
						)
							element.options.extraLines++;
					}
				}
			});

		if (element.options.alwaysScroll === true) {
			element.setScrollPerc(100);
			element.options.selectedLine = lines.length - 1;
		}

		element.options.lastLength = lines.length;
	}
};
const Logs = new InfinityMintWindow(
	"Logs",
	{
		fg: "white",
		bg: "grey",
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

//initializes the console
Logs.initialize = async (window, frame, blessed) => {
	window.unkey("up");
	window.key("up", (ch: string, key: string) => {
		let console = window.data.log;
		if (console === undefined || console === null) return;

		//don't if we are invisible
		if (window.isVisible() === false) return;

		if (window.data.log.options.alwaysScroll) {
			window.data.log.options.alwaysScroll = false;
			window.saveOptions();
		}

		window.data.log.options.selectedLine = Math.max(
			0,
			window.data.log.options.selectedLine - 1
		);
	});

	window.unkey("down");
	window.key("down", (ch: string, key: string) => {
		let console = window.data.log;
		if (console === undefined || console === null) return;
		if (window.isVisible() === false) return;

		window.data.log.options.selectedLine = Math.min(
			(Pipes.pipes[window.data.log.options.pipe]?.logs || [""]).length -
				1,
			window.data.log.options.selectedLine + 1
		);
	});

	//centers the scroll of the console to the selected line position when you do Control-Q
	window.unkey("C-q");
	window.key("C-q", (ch: string, key: string) => {
		let console = window.data.log;
		if (console === undefined || console === null) return;
		if (window.isVisible() === false) return;

		let selectedLinePosition = [
			...(Pipes.pipes[window.data.log.options.pipe]?.logs || [""]),
		]
			.slice(0, window.data.log.options.selectedLine)
			.join("\n")
			.split("\n").length;

		console.setScroll(selectedLinePosition);
	});

	//register the console first
	let consoleStyle = {
		height: "100%-" + (frame.top + frame.bottom + 8),
		padding: 0,
		top: 4,
		label: `{bold}{white-fg}Pipe: {/white-fg}${"undefined"}{/bold}`,
		keys: true,
		tags: true,
		scrollable: true,
		vi: true,
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
	};

	let logs = [window.createElement("console0", consoleStyle)];

	logs.forEach((log) => {
		log.options.lastLength = 0;
		log.options.extraLines = 0;
		log.options.lastCount = 0;
		log.think = pipeViewerThink;
		log.setBack();
	});

	window.data.log = logs[0];
	window.data.log.focus();
	//load the options with default values
	window.loadOptions(null, {
		console0: {
			alwaysScroll: true,
			scrollToSelectedLine: false,
			showDuplicateEntries: false,
			pipe: "default",
			selectedLine: 0,
		},
	});

	//save to file default values if written
	window.saveOptions();

	//create buttons
	let alwaysScroll = window.createElement("alwaysScroll", {
		bottom: 0,
		left: 0,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content:
			"Auto Scroll [" +
			(window.data.log.options.alwaysScroll ? "O" : "X") +
			"]",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: window.data.log.options.alwaysScroll ? "green" : "red",
			border: {
				fg: "#ffffff",
			},
			hover: {
				bg: "grey",
			},
		},
	});

	let alwaysScrollUpdate = () => {
		//change style
		alwaysScroll.style.bg = window.data.log.options.alwaysScroll
			? "green"
			: "red";
		alwaysScroll.setContent(
			"Auto Scroll [" +
				(window.data.log.options.alwaysScroll ? "O" : "X") +
				"]"
		);
	};

	alwaysScroll.on("click", () => {
		//save option
		window.data.log.options.alwaysScroll =
			!window.data.log.options.alwaysScroll;
		window.data.log.options.scrollToSelectedLine = false;
		window.saveOptions();
		alwaysScrollUpdate();
		window.getScreen().render();
	});
	alwaysScroll.setFront();

	let showDuplicateEntries = window.createElement("showDuplicateEntries", {
		bottom: 0,
		left: calculateWidth(alwaysScroll),
		width: "shrink",
		height: "shrink",
		padding: 1,
		content:
			"Show Dupe Entries [" +
			(window.data.log.options.showDuplicateEntries ? "O" : "X") +
			"]",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: window.data.log.options.showDuplicateEntries ? "green" : "red",
			border: {
				fg: "#ffffff",
			},
			hover: {
				bg: "grey",
			},
		},
	});
	showDuplicateEntries.on("click", () => {
		window.data.log.options.showDuplicateEntries =
			!window.data.log.options.showDuplicateEntries;
		//change style
		showDuplicateEntries.style.bg = window.data.log.options
			.showDuplicateEntries
			? "green"
			: "red";
		showDuplicateEntries.setContent(
			"Show Dupe Entries [" +
				(window.data.log.options.showDuplicateEntries ? "O" : "X") +
				"]"
		);

		window.data.log.options.lastLength = 0;
		window.data.log.options.extraLines = 0;
		window.data.log.options.lastCount = 0;

		window.data.log.setContent("");
		window.data.log.setScroll(0);
		window.saveOptions();
	});

	let form = window.createElement(
		"form",
		{
			label: " {bold}{white-fg}Pipes{/white-fg} (Enter/Double-Click to select){/bold}",
			tags: true,
			top: "center",
			left: "center",
			width: "100%-4",
			height: "100%-12",
			padding: 2,
			keys: true,
			vi: true,
			mouse: true,
			border: "line",
			scrollbar: {
				ch: " ",
				track: {
					bg: "black",
				},
				style: {
					inverse: true,
				},
			},
			style: {
				bg: "black",
				fg: "white",
				item: {
					hover: {
						bg: "green",
						fg: "black",
					},
				},
				selected: {
					bg: "grey",
					fg: "green",
					bold: true,
				},
			},
		},
		"list"
	);
	let keys = Object.keys(Pipes.pipes);
	form.setItems(keys);
	form.on("select", (el: any, selected: any) => {
		window.data.log.options.pipe = keys[selected];
		window.data.log.options.lastLength = 0;
		window.data.log.options.extraLines = 0;
		window.data.log.options.lastCount = 0;
		window.data.log.setContent("");
		window.saveOptions();
		form.hide();
	});
	form.hide();

	//create buttons
	let changePipe = window.createElement("changePipe", {
		top: 2,
		right: 16,
		width: "shrink",
		height: "shrink",
		padding: 0,
		content: "Change Pipe",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: "black",
			border: {
				fg: "#ffffff",
			},
			hover: {
				bg: "grey",
			},
		},
	});

	let save = window.createElement("save", {
		top: 2,
		right: 16 + calculateWidth(changePipe),
		width: "shrink",
		height: "shrink",
		padding: 0,
		content: "Save Pipe",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: "black",
			border: {
				fg: "#ffffff",
			},
			hover: {
				bg: "grey",
			},
		},
	});

	let onChangePipe = () => {
		if (!window.isVisible()) return;

		form.setFront();
		form.toggle();
		form.focus();
	};

	changePipe.setFront();
	changePipe.on("click", onChangePipe);

	//save when the window is destroyed
	window.on("destroy", () => {
		window.saveOptions();
	});

	//save when the window is hidden
	window.on("hide", () => {
		window.saveOptions();
	});

	window.key("p", onChangePipe);

	window.data.log.options.lastLength = 0;
	window.data.log.options.extraLines = 0;
	window.data.log.options.lastCount = 0;
};

Logs.setShouldInstantiate(false);
Logs.setBackgroundThink(false);

export default Logs;
