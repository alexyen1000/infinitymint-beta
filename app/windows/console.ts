import { log } from "../helpers";
import Logging from "../logging";
import { InfinityMintWindow } from "../window";

let lastLength = 0;
const Console = new InfinityMintWindow(
	"Console",
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

Console.think = (window, frame, blessed) => {
	log("test " + Math.random());
	let element = window.getElement("console");
	let lines = Logging.getPipe(window.options.pipe).logs;
	//bleseed push line doesnt work for some reason so we have to do it this way
	if (lastLength !== lines.length) {
		let content = ``;
		lines.forEach((line) => (content = content + line.toString() + "\n"));
		element.setContent(content);
		element.focus();
		lastLength = lines.length;
		if (window.options.alwaysScroll === true) element.setScroll(lastLength);
	}

	window
		.getElement("gotoEnd")
		.setContent("Goto End [" + lastLength + " lines]");
};

//initializes the console
Console.initialize = (window, frame, blessed) => {
	//initial settings
	window.options.alwaysScroll = true;
	window.options.pipe = "default";
	frame.setContent(
		" {bold}InfinityMint - Console{/bold} | current pipe: default"
	);

	let console = window.registerElement(
		"console",
		blessed.box({
			width: "95%",
			height: "65%",
			padding: 1,
			left: "center",
			draggable: true,
			top: 4,
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
			content: "Goto End [" + 0 + " lines]",
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

	let form = window.registerElement(
		"form",
		blessed.form({
			keys: true,
			left: "center",
			top: "center",
			width: "shrink",
			height: "shrink",
			padding: 2,
			border: "line",
			bg: "black",
			content: "Please Select Pipe",
		})
	);
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
			content: "Change Pipe (current: " + window.options.pipe + ")",
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
	changePipe.setFront();
	changePipe.on("click", () => {
		form.setFront();
		form.toggle();
	});

	//always scroll
	window.think(window, frame, blessed); //do think once
};

export default Console;
