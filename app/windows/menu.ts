import {
	calculateWidth,
	debugLog,
	getConfigFile,
	getPackageJson,
	getSolidityFolder,
	isEnvTrue,
	isInfinityMint,
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
		alwaysFront: true,
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
		alwaysFront: true,
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
		alwaysFront: true,
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
		alwaysFront: true,
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
		alwaysFront: true,
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
		alwaysFront: true,
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

const files = [
	"/resources/logos/fractal.gif",
	"/resources/logos/hypercube.gif",
	"/resources/logos/sectionz.png",
	"/resources/logos/pizza.gif",
	"/resources/logos/techno.gif",
	"/resources/logos/bio.gif",
	"/resources/logos/audio.gif",
	"/resources/logos/2032.gif",
];

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
		width: "100%",
		height: "100%-" + (frame.top + frame.bottom + 10),
		top: 5,
		left: 1,
		style: {
			fg: "white",
			bg: "black",
			border: {
				fg: "#f0f0f0",
			},
		},
	});

	let logoWidth = Math.floor(
		Math.floor(
			Math.floor(150 / 1.61803398875) +
				parseInt(container.width.toString()) *
					parseInt(container.height.toString()) *
					0.0125
		) / 2.75
	);
	let logoHeight = Math.floor(logoWidth / 2.45);

	window.createElement("stripe", {
		width: 8,
		height: "100%-" + (frame.top + frame.bottom + 10),
		left: 1,
		top: 5,
		style: {
			fg: "white",
			bg: "gray",
		},
	});

	//render screen
	window.getScreen().render();

	if (container.height > 16) {
		//hide logo if screen too small
		if (container.width > 120)
			window.createElement(
				"logo",
				{
					top: -1,
					parent: container,
					left: 8,
					draggable: true,
					width: logoWidth,
					height: logoHeight,
					padding: 0,
					file: isInfinityMint()
						? process.cwd() +
						  files[Math.floor(Math.random() * files.length)]
						: process.cwd() +
						  "/node_modules/infinitymint" +
						  files[Math.floor(Math.random() * files.length)],
					animate: true,
					style: {
						bg: "gray",
						border: {
							fg: "#f0f0f0",
						},
					},
					border: window.getBorder(),
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
				style: {
					fg: "green",
					bg: "black",
				},
				content: `∞mint`,
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
			content: `{bold}{green-fg}I N F I N I T Y  M I N T by {underline}0x0zAgency{/underline}{/green-fg}{/bold}`,
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
		left: container.left,
		top: container.top - 1,
		width: "shrink",
		height: "shrink",
		tags: true,
		bold: true,
		style: {
			fg: "white",
		},
		content: `0x0z`,
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

	if (container.height >= 9)
		window.createElement("infoLabel", {
			left: -1,
			bottom: 1,
			parent: container,
			width: "shrink",
			height: "shrink",
			tags: true,
			alwaysFront: true,
			bold: true,
			padding: 0,
			style: {
				border: {
					fg: "#f0f0f0",
				},
			},
			border: window.getBorder(),
			content: `{gray-bg}{magenta-fg}cwd =>{/magenta-fg} {white-fg}${process.cwd()}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}solidity_folder =>{/magenta-fg} {white-fg}${getSolidityFolder()}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}default_account =>{/magenta-fg} {white-fg}${getDefaultAccountIndex()}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}loaded_scripts =>{/magenta-fg} {white-fg}${
				window.getInfinityConsole().getScripts().length
			}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}typescript =>{/magenta-fg} {white-fg}${
				isTypescript() ? "true" : "false"
			}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}hardhat_tasks =>{/magenta-fg} {white-fg}${
				Object.keys(hre.tasks).length
			}{/white-fg}{/gray-bg}`,
		});

	createButtons(window);
};

export default Menu;
