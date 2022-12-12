import { readSession, saveSession, saveSessionVariable } from "../helpers";
import Pipes from "../pipes";
import { InfinityMintWindow } from "../window";

let lastLength = 0;
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
	if (lastLength !== lines.length) {
		let content = ``;
		lines.forEach(
			(line, index) =>
				(content =
					content +
					`[${index.toString().padEnd(8, "0")}] ` +
					line.toString() +
					"\n")
		);
		element.setContent(content);
		element.focus();
		element.setLabel(
			"{bold}{white-fg}Pipe: {/white-fg}" +
				window.options.pipe +
				"{/bold}"
		);
		lastLength = lines.length;
		if (window.options.alwaysScroll === true) element.setScroll(lastLength);
	}
};

//initializes the console
Logs.initialize = async (window, frame, blessed) => {
	let session = readSession();
	//initial settings
	window.options.alwaysScroll = true;
	window.options.pipe = session?.environment?.pipe || "default";

	let console = window.registerElement(
		"console",
		blessed.box({
			width: "100%",
			height: "100%-8",
			padding: 1,
			top: 4,
			label: "{bold}{white-fg}Pipe: {/white-fg}undefined{/bold}",
			left: "center",
			keys: true,
			tags: true,
			scrollable: true,
			mouse: true,
			scrollbar: window.getScrollbar() || {},
			border: window.getBorder() || {},
			style: {
				fg: "white",
				bg: "transparent",
				border: {
					fg: "#f0f0f0",
				},
			},
		})
	);
	console.setBack();

	//create buttons
	let alwaysScroll = window.registerElement(
		"alwaysScroll",
		blessed.box({
			bottom: 0,
			left: 0,
			shrink: true,
			width: "shrink",
			height: "shrink",
			padding: 1,
			content:
				"Always Scroll [" +
				(window.options.alwaysScroll ? "O" : "X") +
				"]",
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
		})
	);
	alwaysScroll.on("click", () => {
		window.options.alwaysScroll = !window.options.alwaysScroll;
		alwaysScroll.style.bg = window.options.alwaysScroll ? "green" : "red";
		alwaysScroll.setContent(
			"Always Scroll [" + (window.options.alwaysScroll ? "O" : "X") + "]"
		);
		window.getScreen().render();
	});
	alwaysScroll.setFront();

	//create buttons
	let gotoEnd = window.registerElement(
		"gotoEnd",
		blessed.box({
			bottom: 0,
			left: 22,
			shrink: true,
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
				bg: "blue",
				border: {
					fg: "#ffffff",
				},
				hover: {
					bg: "grey",
				},
			},
		})
	);
	gotoEnd.setFront();
	gotoEnd.on("click", () => {
		console.setScroll(lastLength);
	});

	let gotoTop = window.registerElement(
		"gotoTop",
		blessed.box({
			bottom: 0,
			left: 22 + 18,
			shrink: true,
			width: "shrink",
			height: "shrink",
			padding: 1,
			content: "Scroll To Start",
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
		})
	);
	gotoTop.setFront();
	gotoTop.on("click", () => {
		console.setScroll(0);
	});

	let save = window.registerElement(
		"save",
		blessed.box({
			bottom: 0,
			left: 22 + 18 + 20,
			shrink: true,
			width: "shrink",
			height: "shrink",
			padding: 1,
			content: "Save Pipe",
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
		})
	);

	let load = window.registerElement(
		"load",
		blessed.box({
			bottom: 0,
			left: 22 + 18 + 20 + 14,
			shrink: true,
			width: "shrink",
			height: "shrink",
			padding: 1,
			content: "Load Pipe",
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
		})
	);

	let form = window.registerElement(
		"form",
		blessed.list({
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
		})
	);
	let keys = Object.keys(Pipes.logs);
	form.setItems(keys);
	form.on("select", (el: any, selected: any) => {
		window.options.pipe = keys[selected];
		//save the state of this option to the .session file so when the user relaunches infinity mint it goes to this pipe
		session = saveSessionVariable(session, "pipe", window.options.pipe);
		changePipe.setContent("Change Pipe (" + window.options.pipe + ")");
		console.setScroll(0);
		form.hide();
	});
	form.focus();
	form.hide();

	//create buttons
	let changePipe = window.registerElement(
		"changePipe",
		blessed.box({
			bottom: 0,
			right: 0,
			shrink: true,
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
		})
	);
	changePipe.setFront();
	changePipe.on("click", () => {
		form.setFront();
		form.toggle();
	});

	//always scroll
	window.think(window, frame, blessed); //do think once
};

export default Logs;
