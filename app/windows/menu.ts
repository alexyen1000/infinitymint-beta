import {
	calculateWidth,
	debugLog,
	getPackageJson,
	getSolidityFolder,
	isEnvTrue,
	isTypescript,
	warning,
} from "../helpers";
import { InfinityMintWindow } from "../window";
import hre from "hardhat";
import { getDefaultAccountIndex } from "../web3";

const Menu = new InfinityMintWindow(
	"Menu",
	{
		fg: "white",
		bg: "grey",
		border: {
			fg: "#f0f0f0",
		},
	},
	{
		type: "line",
	}
);

let createButtons = (window) => {
	let deploy = window.createElement("deploy", {
		bottom: 0,
		left: 0,
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Deploy Projects",
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
	deploy.on("click", async () => {
		await window.openWindow("Deploy");
	});

	let browser = window.createElement("browser", {
		bottom: 0,
		left: calculateWidth(deploy),
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Download Projects",
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
	browser.on("click", async () => {
		await window.openWindow("Browser");
	});

	let compile = window.createElement("compile", {
		bottom: 0,
		left: calculateWidth(deploy, browser),
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Compile Projects",
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

	let scripts = window.createElement("scripts", {
		bottom: 0,
		left: calculateWidth(deploy, browser, compile),
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Run Scripts",
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
	scripts.on("click", async () => {
		await window.openWindow("Scripts");
	});

	let deployments = window.createElement("deployments", {
		bottom: 0,
		left: calculateWidth(deploy, browser, compile, scripts),
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "All Deployments",
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
	deployments.on("click", async () => {
		await window.openWindow("Deployments");
	});

	let networks = window.createElement("networks", {
		bottom: 0,
		right: 0,
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Change Network",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: "cyan",
			border: {
				fg: "#ffffff",
			},
			hover: {
				bg: "grey",
			},
		},
	});
	networks.on("click", async () => {
		await window.openWindow("Networks");
	});
};

Menu.think = (window, frame, blessed) => {
	if (window.getElement("timeLabel")) {
		window
			.getElement("timeLabel")
			.setContent(
				`{white-bg}{black-fg}${new Date(
					Date.now()
				).toString()}{/black-fg}{/white-bg}`
			);
	}
};

Menu.initialize = async (window, frame, blessed) => {
	let background = window.createElement("background", {
		width: "100%",
		height: "100%-" + (frame.top + frame.bottom + 8),
		padding: 1,
		top: 4,
		label: "{bold}{white-fg}Menu{/white-fg}{/bold}",
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
	});
	background.setBack();

	let packageVersion = "1.0.1";
	try {
		packageVersion = getPackageJson()?.version || "1.0.1";
	} catch (error) {
		if (isEnvTrue("THROW_ALL_ERRORS")) throw error;

		window.warning("could not get package json: " + error.name);
	}

	let container = window.createElement("container", {
		width: "100%-" + (frame.left + frame.right + 10),
		height: "100%-" + (frame.top + frame.bottom + 12),
		top: 6,
		left: 4,
		style: {
			fg: "white",
			bg: Math.random() * 10 > 5 ? "blue" : "cyan",
			border: {
				fg: "#f0f0f0",
			},
		},
	});

	window.createElement("stripe", {
		width: 8,
		height: "100%-" + (container.top + container.bottom - 2),
		parent: container,
		top: -2,
		style: {
			fg: "white",
			bg: "black",
			border: {
				fg: "#f0f0f0",
			},
		},
	});

	let logoWidth = Math.floor(
		Math.floor(151 * 0.2) + container.height * 0.2 + container.width * 0.1
	);
	if (container.height >= 18) {
		//hide logo if screen too small
		if (container.width > 120)
			window.createElement(
				"logo",
				{
					top: container.top - 2,
					left: frame.left + frame.right + 20,
					width: logoWidth,
					height: logoWidth / 3,
					file: "./resources/logo.gif",
					animate: true,
					style: {
						bg: "gray",
					},
					search: true,
				},
				"image"
			);

		window.createElement(
			"title",
			{
				right: container.right,
				bottom: container.bottom + 3,
				width: "shrink",
				height: "shrink",
				tags: true,
				bold: true,
				style: {
					fg: "white",
				},
				content: `infinitymint`,
			},
			"bigtext"
		);
	} else
		window.createElement("tinyTitle", {
			right: container.right,
			bottom: container.bottom + 3,
			width: "shrink",
			height: "shrink",
			tags: true,
			bold: true,
			style: {
				fg: "white",
			},
			content: `I N F I N I T Y  M I N T by {underline}0x0zAgency{/underline}`,
		});

	window.createElement("versionLabel", {
		right: container.right,
		bottom: container.bottom + 2,
		width: "shrink",
		height: "shrink",
		tags: true,
		bold: true,
		style: {
			fg: "white",
		},
		content: `version ${packageVersion}`,
	});

	window.createElement("companyLabel", {
		left: container.left + 2,
		top: container.top,
		width: "shrink",
		height: "shrink",
		tags: true,
		bold: true,
		style: {
			fg: "white",
		},
		content: `0x0z`,
	});

	window.createElement("cwdAndSolidityLabel", {
		left: 2,
		bottom: 1,
		parent: container,
		width: "shrink",
		height: "shrink",
		tags: true,
		bold: true,
		style: {
			fg: "white",
		},
		content: `{gray-bg}{magenta-fg}cwd =>{/magenta-fg} {white-fg}${process.cwd()}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}solidity_folder =>{/magenta-fg} {white-fg}${getSolidityFolder()}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}default_account =>{/magenta-fg} {white-fg}${getDefaultAccountIndex()}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}loaded_scripts =>{/magenta-fg} {white-fg}${
			window.getInfinityConsole().getScripts().length
		}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}typescript =>{/magenta-fg} {white-fg}${
			isTypescript() ? "true" : "false"
		}{/white-fg}{/gray-bg}`,
	});

	window.createElement("networkLabel", {
		right: container.right,
		bottom: container.bottom + 1,
		width: "shrink",
		height: "shrink",
		tags: true,
		bold: true,
		style: {
			fg: "white",
		},
		content: `{white-bg}{black-fg}${hre.network.name}{/black-fg}{/white-bg}`,
	});
	window.createElement("timeLabel", {
		right: container.right,
		bottom: container.bottom,
		width: "shrink",
		height: "shrink",
		tags: true,
		bold: true,
		style: {
			fg: "white",
		},
		content: `{white-bg}{black-fg}${new Date(
			Date.now()
		).toString()}{/black-fg}{/white-bg}`,
	});

	createButtons(window);
};

export default Menu;
