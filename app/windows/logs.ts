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
let lastSelectedLine = 0;
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
	//bleseed push line doesnt work for some reason so we have to do it this way

	if (window.options.alwaysScroll)
		window.options.selectedLine = lines.length - 1;

	if (
		lastLength !== lines.length ||
		window.options.selectedLine !== lastSelectedLine
	) {
		element.setContent(
			lines
				.map((line, index) => {
					let lineCount = `{white-bg}{black-fg}${index
						.toString()
						.padEnd(6, " ")}{/black-fg}{/white-bg} `;

					if (index === window.options.selectedLine)
						lineCount = `{yellow-bg}{black-fg}${index
							.toString()
							.padEnd(6, " ")}{/black-fg}{/yellow-bg} `;

					let finalLine = lineCount + line.toString();

					if (index === window.options.selectedLine)
						return `{blue-bg}{white-fg}${finalLine}{/black-fg}{/blue-bg}`;

					return index % 2 === 0
						? `{white-fg}${finalLine}{/white-fg}`
						: `{black-bg}${finalLine}{/black-bg}`;
				})
				.join("\n")
		);

		let actualLength = element.content.split("\n").length;
		lastLength = actualLength;
		lastSelectedLine = window.options.selectedLine;

		element.focus();
		element.setLabel(
			"{bold}{white-fg}Pipe: {/white-fg}" +
				window.options.pipe +
				"{/bold}"
		);
		if (window.options.alwaysScroll === true) {
			element.setScroll(actualLength);
		}
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
			(Pipes.logs[window.options.pipe]?.logs || [""]).length - 1,
			window.options.selectedLine + 1
		);
	});

	//centers the scroll of the console to the selected line position when you do Control-Q
	window.unkey("C-q");
	window.key("C-q", (ch: string, key: string) => {
		if (window.isVisible() === false) return;

		let selectedLinePosition = [
			...(Pipes.logs[window.options.pipe]?.logs || [""]),
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
		pipe: "default",
		selectedLine: 0,
	});
	//save to file default values if written
	window.saveOptions();

	let console = window.createElement("console", {
		width: frame.width,
		height: "100%-" + (frame.top + frame.bottom + 8),
		padding: 1,
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

	//create buttons
	let alwaysScroll = window.createElement("alwaysScroll", {
		bottom: 0,
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
		left: calculateWidth(alwaysScroll),
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Goto End",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: "blue",
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
			(Pipes.logs[window.options.pipe]?.logs || [""]).length - 1;
	});

	let gotoTop = window.createElement("gotoTop", {
		bottom: 0,
		left: calculateWidth(alwaysScroll, gotoEnd),
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Goto Top",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: "blue",
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
		left: calculateWidth(alwaysScroll, gotoEnd, gotoTop),
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Goto Selected",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: "blue",
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
			...(Pipes.logs[window.options.pipe]?.logs || [""]),
		]
			.slice(0, window.options.selectedLine)
			.join("\n")
			.split("\n").length;

		console.setScroll(selectedLinePosition);
	});

	let save = window.createElement("save", {
		bottom: 0,
		left: "center",
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
			bg: "magenta",
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
				bg: "grey",
				fg: "white",
				item: {
					hover: {
						bg: "white",
					},
				},
				selected: {
					bg: "white",
					bold: true,
				},
			},
		},
		"list"
	);
	let keys = Object.keys(Pipes.logs);
	form.setItems(keys);
	form.on("select", (el: any, selected: any) => {
		window.options.pipe = keys[selected];
		window.saveOptions();
		changePipe.setContent("Change Pipe (" + window.options.pipe + ")");
		console.setScroll(0);
		form.hide();
	});
	form.focus();
	form.hide();

	//create buttons
	let changePipe = window.createElement("changePipe", {
		bottom: 0,
		right: 0,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Change Pipe (" + window.options.pipe + ")",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "black",
			bg: "white",
			border: {
				fg: "#ffffff",
			},
			hover: {
				bg: "grey",
			},
		},
	});
	changePipe.setFront();
	changePipe.on("click", () => {
		form.setFront();
		form.toggle();
		window.options.selectedLine = 0;
		window.saveOptions();
	});

	window.think(window, frame, blessed); //do think once

	//save when the window is destroyed
	window.on("destroy", () => {
		window.saveOptions();
	});

	//save when the window is hidden
	window.on("hide", () => {
		window.saveOptions();
	});
};

Logs.setShouldInstantiate(true);
Logs.setBackgroundThink(true);

export default Logs;
