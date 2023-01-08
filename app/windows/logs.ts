import { calculateWidth } from "../helpers";
import Pipes from "../pipes";
import { InfinityMintWindow } from "../window";

let lastLogMessage: string;
let updateContent = (window: InfinityMintWindow) => {
	window.data.log.setContent(
		Pipes.pipes[window.data.log.options.pipe].logs
			.map((log, index) => {
				if (lastLogMessage && lastLogMessage === log.message)
					return (
						lineNumber(index, true) +
						`{grey-fg}${log.pure}{/grey-fg}`
					);
				else {
					lastLogMessage = log.message;
					return lineNumber(index) + log.message;
				}
			})
			.join("\n")
	);
};

let lineNumber = (indexCount: number | string, gray?: boolean) => {
	return `${gray ? "{white-bg}" : "{white-bg}"}{black-fg}${indexCount
		.toString()
		.padEnd(6, " ")}{/black-fg}${gray ? "{/white-bg}" : "{/white-bg}"}`;
};

/**
 * Allows you to view the output of pipes
 */
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

//initializes the logging window.
Logs.initialize = async (window, frame, blessed) => {
	//register the console first
	let consoleStyle = {
		height: "100%-" + (frame.top + frame.bottom + 8),
		padding: 0,
		top: 4,
		label: `{bold}{white-fg}Pipe: {/white-fg}${"(LOADING)"}{/bold}`,
		keys: true,
		tags: true,
		scrollable: true,
		vi: true,
		shouldFocus: true,
		mouse: true,
		alwaysScroll: true,
		scrollbar: {
			ch: " ",
			track: {
				bg: "black",
			},
			style: {
				inverse: true,
			},
		},
		border: "line",
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
		log.setFront();
		log.focus();
	});

	window.data.log = logs[0];
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
		alwaysScrollUpdate();
		window.getScreen().render();
	});
	alwaysScroll.setFront();

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
		window.data.log.setScroll(0);
		window.data.log.focus();
		updateContent(window);
		form.hide();
	});
	form.hide();

	let save = window.createElement("save", {
		top: 3,
		right: 2,
		width: "shrink",
		height: "shrink",
		padding: 0,
		content: "Save",
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

	//create buttons
	let changePipe = window.createElement("changePipe", {
		top: 3,
		right: calculateWidth(save) + 2,
		width: "shrink",
		height: "shrink",
		padding: 0,
		content: "Edit",
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

	//create buttons
	let newPipe = window.createElement("newPipe", {
		top: 3,
		right: calculateWidth(save, changePipe) + 2,
		width: "shrink",
		height: "shrink",
		padding: 0,
		content: "Split",
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

	let deletePipe = window.createElement("delete", {
		top: 3,
		right: calculateWidth(changePipe, save, newPipe) + 2,
		width: "shrink",
		height: "shrink",
		padding: 0,
		content: "Delete",
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
	deletePipe.on("click", () => {
		Pipes.getPipe(window.data.log.options.pipe).logs = [];
		Pipes.getPipe(window.data.log.options.pipe).log(
			"{red-fg}pipe deleted{/red-fg}"
		);

		window.data.log.setContent("");
		form.hide();
	});

	let onChangePipe = () => {
		if (!window.isVisible()) return;

		form.setFront();
		form.toggle();
		form.focus();
	};

	changePipe.setFront();
	changePipe.on("click", onChangePipe);
	window.key("p", onChangePipe);

	updateContent(window);

	window.data.log.setLabel(
		"{bold}{white-fg}Pipe: {/white-fg}" +
			window.data.log.options.pipe +
			"{/bold}"
	);
};

//runs after all elements have been appended and screen has been rendered
Logs.postInitialize = async (window, frame, blessed) => {
	let cb = (msg: string, pipe: string, index: number) => {
		if (!window.isVisible()) return;
		if (!window.data.log) return;

		if (pipe === window.data.log.options.pipe) {
			window.data.log.setLabel(
				"{bold}{white-fg}Pipe: {/white-fg}" +
					window.data.log.options.pipe +
					"{/bold}"
			);

			if (window.data.log.options.alwaysScroll)
				window.data.log.setScrollPerc(100);

			if (lastLogMessage === msg)
				window.data.log.pushLine(
					lineNumber(index, true) +
						`{gray-fg}${blessed.cleanTags(msg)}{/gray-fg}`
				);
			else window.data.log.pushLine(lineNumber(index) + msg);
			lastLogMessage = msg;
		}
	};
	Pipes.emitter.on("log", cb);

	//save when the window is destroyed
	window.on("destroy", () => {
		Pipes.emitter.off("log", cb);
	});

	//save when the window is hidden
	window.on("hide", () => {
		window.saveOptions();
	});

	//focus the log when the window is shown
	window.on("show", () => {
		window.data.log.focus();
	});

	window.unkey("up");
	window.key("up", (ch: string, key: string) => {
		let console = window.data.log;
		if (!console) return;

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

	//various keyboard commands

	window.unkey("down");
	window.key("down", (ch: string, key: string) => {
		let console = window.data.log;
		if (!console) return;
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
		if (!console) return;
		if (window.isVisible() === false) return;

		let selectedLinePosition = [
			...(Pipes.pipes[window.data.log.options.pipe]?.logs || [""]),
		]
			.slice(0, window.data.log.options.selectedLine)
			.join("\n")
			.split("\n").length;

		console.setScroll(selectedLinePosition);
	});

	if (window.data.log.options.alwaysScroll)
		window.data.log.setScrollPerc(100);
};

export default Logs;
