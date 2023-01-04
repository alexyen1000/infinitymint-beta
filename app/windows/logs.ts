import {
	calculateWidth,
	log,
	readSession,
	saveSession,
	saveSessionVariable,
} from "../helpers";
import Pipes from "../pipes";
import { InfinityMintWindow } from "../window";

let lastLength = 0;
let lastCount = 0;
let extraLines = 0;
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

Logs.think = (window, frame, blessed) => {
	let element = window.getElement("console");
	let lines = Pipes.getPipe(window.options.pipe).logs;
	let currentCount = 0;

	//bleseed push line doesnt work for some reason so we have to do it this way

	//counts lined changes
	if (window.options.showDuplicateEntries !== true)
		lines.forEach((object) => {
			currentCount = currentCount + object.count;
		});

	element.setLabel(
		"{bold}{white-fg}Pipe: {/white-fg}" + window.options.pipe + "{/bold}"
	);

	if (currentCount !== lastCount || lastLength !== lines.length) {
		lastCount = 0;
		lines
			.slice(lastLength - 1 < 0 ? 0 : lastLength - 1)
			.forEach((object) => {
				let line = object.message;
				lastCount = lastCount + object.count;
				let lineCount = (indexCount: number | string) => {
					return `{white-bg}{black-fg}${indexCount
						.toString()
						.padEnd(6, " ")}{/black-fg}{/white-bg} `;
				};

				if (
					object.count <= 1 ||
					window.options.showDuplicateEntries !== true
				) {
					let finalLine = lineCount(object.index) + line.toString();
					finalLine =
						finalLine +
						` {blue-fg}{bold}${
							window.options.showDuplicateEntries !== true &&
							object.count > 1
								? "x" + object.count
								: ""
						}{/bold}{/blue-fg}`;
					finalLine =
						object.index % 2 === 0
							? `{white-fg}${finalLine}{/white-fg}`
							: `{black-bg}${finalLine}{/black-bg}`;

					element.setLine(object.index + extraLines, finalLine);
				} else {
					let currentExtraLines = extraLines;
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
						if (i > 0 && lastLength !== lines.length) extraLines++;
					}
				}
			});

		if (window.options.alwaysScroll === true) {
			element.setScrollPerc(100);
			window.options.selectedLine = lines.length - 1;
		}

		lastLength = lines.length;
	}
};

//initializes the console
Logs.initialize = async (window, frame, blessed) => {
	window.unkey("up");
	window.key("up", (ch: string, key: string) => {
		//don't if we are invisible
		if (window.isVisible() === false) return;

		if (window.options.alwaysScroll) {
			window.options.alwaysScroll = false;
			alwaysScrollUpdate();
			window.saveOptions();
		}

		window.options.selectedLine = Math.max(
			0,
			window.options.selectedLine - 1
		);
	});

	window.unkey("down");
	window.key("down", (ch: string, key: string) => {
		if (window.isVisible() === false) return;

		window.options.selectedLine = Math.min(
			(Pipes.pipes[window.options.pipe]?.logs || [""]).length - 1,
			window.options.selectedLine + 1
		);
	});

	//centers the scroll of the console to the selected line position when you do Control-Q
	window.unkey("C-q");
	window.key("C-q", (ch: string, key: string) => {
		if (window.isVisible() === false) return;

		let selectedLinePosition = [
			...(Pipes.pipes[window.options.pipe]?.logs || [""]),
		]
			.slice(0, window.options.selectedLine)
			.join("\n")
			.split("\n").length;

		console.setScroll(selectedLinePosition);
	});

	//load the options with default values
	window.loadOptions({
		alwaysScroll: true,
		scrollToSelectedLine: false,
		showDuplicateEntries: false,
		pipe: "default",
		selectedLine: 0,
	});
	//save to file default values if written
	window.saveOptions();

	let console = window.createElement("console", {
		width: "100%",
		height: "100%-" + (frame.top + frame.bottom + 8),
		padding: 0,
		top: 4,
		label: `{bold}{white-fg}Pipe: {/white-fg}${
			window.options?.pipe || "undefined"
		}{/bold}`,
		left: "center",
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
	});
	console.setBack();
	console.focus();

	//create buttons
	let alwaysScroll = window.createElement("alwaysScroll", {
		bottom: 0,
		left: 0,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content:
			"Auto Scroll [" + (window.options.alwaysScroll ? "O" : "X") + "]",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: window.options.alwaysScroll ? "green" : "red",
			border: {
				fg: "#ffffff",
			},
			hover: {
				bg: "grey",
			},
		},
	});

	let showDuplicateEntries = window.createElement("showDuplicateEntries", {
		bottom: 0,
		left: calculateWidth(alwaysScroll),
		width: "shrink",
		height: "shrink",
		padding: 1,
		content:
			"Show Dupe Entries [" +
			(window.options.showDuplicateEntries ? "O" : "X") +
			"]",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: window.options.showDuplicateEntries ? "green" : "red",
			border: {
				fg: "#ffffff",
			},
			hover: {
				bg: "grey",
			},
		},
	});
	showDuplicateEntries.on("click", () => {
		window.options.showDuplicateEntries =
			!window.options.showDuplicateEntries;
		//change style
		showDuplicateEntries.style.bg = window.options.showDuplicateEntries
			? "green"
			: "red";
		showDuplicateEntries.setContent(
			"Show Dupe Entries [" +
				(window.options.showDuplicateEntries ? "O" : "X") +
				"]"
		);
		console.setContent("");
		console.setScroll(0);
		lastLength = 0;
		extraLines = 0;
		lastCount = 0;
		window.saveOptions();
	});

	let alwaysScrollUpdate = () => {
		//change style
		alwaysScroll.style.bg = window.options.alwaysScroll ? "green" : "red";
		alwaysScroll.setContent(
			"Auto Scroll [" + (window.options.alwaysScroll ? "O" : "X") + "]"
		);
	};

	alwaysScroll.on("click", () => {
		//save option
		window.options.alwaysScroll = !window.options.alwaysScroll;
		window.options.scrollToSelectedLine = false;

		window.saveOptions();

		alwaysScrollUpdate();

		window.getScreen().render();
	});
	alwaysScroll.setFront();

	//create buttons
	let gotoEnd = window.createElement("gotoEnd", {
		bottom: 0,
		left: calculateWidth(alwaysScroll, showDuplicateEntries),
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Scroll To End",
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
	gotoEnd.setFront();
	gotoEnd.on("click", () => {
		console.setScroll(lastLength);
		window.options.selectedLine =
			(Pipes.pipes[window.options.pipe]?.logs || [""]).length - 1;
	});

	let gotoTop = window.createElement("gotoTop", {
		bottom: 0,
		left: calculateWidth(alwaysScroll, showDuplicateEntries, gotoEnd),
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Scroll To Top",
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
	gotoTop.setFront();
	gotoTop.on("click", () => {
		console.setScroll(0);
		window.options.selectedLine = 0;
	});

	let gotoSelected = window.createElement("gotoSelected", {
		bottom: 0,
		left: calculateWidth(
			alwaysScroll,
			showDuplicateEntries,
			gotoEnd,
			gotoTop
		),
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Scroll To Selected",
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
	gotoSelected.on("click", () => {
		let selectedLinePosition = [
			...(Pipes.pipes[window.options.pipe]?.logs || [""]),
		]
			.slice(0, window.options.selectedLine)
			.join("\n")
			.split("\n").length;

		console.setScroll(selectedLinePosition);
	});

	let save = window.createElement("save", {
		bottom: 0,
		left: calculateWidth(
			alwaysScroll,
			showDuplicateEntries,
			gotoEnd,
			gotoTop,
			gotoSelected
		),
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Save Output To File",
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

	let form = window.createElement(
		"form",
		{
			label: " {bold}{white-fg}Pipes{/white-fg} (Enter/Double-Click to select){/bold}",
			tags: true,
			top: "center",
			left: "center",
			width: "95%",
			height: "50%",
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
		window.options.pipe = keys[selected];
		window.saveOptions();
		form.hide();
		console.setContent("");
		console.setScroll(0);
		lastLength = 0;
		extraLines = 0;
		lastCount = 0;
		console.focus();
	});
	form.hide();

	//create buttons
	let changePipe = window.createElement("changePipe", {
		bottom: 0,
		left: calculateWidth(
			alwaysScroll,
			showDuplicateEntries,
			gotoEnd,
			gotoTop,
			gotoSelected,
			save
		),
		width: "shrink",
		height: "shrink",
		padding: 1,
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

	lastLength = 0;
	extraLines = 0;
	lastCount = 0;
};

Logs.setShouldInstantiate(false);
Logs.setBackgroundThink(false);

export default Logs;
