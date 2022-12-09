import { log } from "../helpers";
import Logging from "../logging";
import { InfinityMintWindow } from "../window";
import hre, { ethers } from "hardhat";

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
	let lines = Logging.getPipe(window.options.pipe).logs;
	//bleseed push line doesnt work for some reason so we have to do it this way
	if (lastLength !== lines.length) {
		let content = ``;
		lines.forEach(
			(line, index) =>
				(content =
					content +
					`[${index.toString().padEnd(8, "0")}]: ` +
					line.toString() +
					"\n")
		);
		element.setContent(content);
		element.focus();
		lastLength = lines.length;
		if (window.options.alwaysScroll === true) element.setScroll(lastLength);
	}
};

//initializes the console
Logs.initialize = async (window, frame, blessed) => {
	//initial settings
	window.options.alwaysScroll = true;
	window.options.pipe = "default";

	let console = window.registerElement(
		"console",
		blessed.box({
			width: "100%",
			height: "100%-8",
			padding: 1,
			top: 4,
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
		window.options.pipe = "debug";
		changePipe.setContent(
			"Change Pipe (current: " + window.options.pipe + ")"
		);
	});

	//always scroll
	window.think(window, frame, blessed); //do think once
};

export default Logs;
