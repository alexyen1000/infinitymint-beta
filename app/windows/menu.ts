import { calculateWidth, debugLog } from "../helpers";
import { InfinityMintWindow } from "../window";

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

Menu.think = (window, frame, blessed) => {};

Menu.initialize = async (window, frame, blessed) => {
	let background = window.createElement("background", {
		width: frame.width,
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

	let deploy = window.createElement("deploy", {
		bottom: 0,
		left: 0,
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Deploy",
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
	deploy.on("click", async () => {
		await window.openWindow("Deploy");
	});

	let test = window.createElement("test", {
		bottom: 0,
		left: calculateWidth(deploy),
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Test",
		tags: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			bg: "yellow",
			border: {
				fg: "#ffffff",
			},
			hover: {
				bg: "grey",
			},
		},
	});
	test.on("click", async () => {
		await window.openWindow("Test");
	});

	let exportButton = window.createElement("export", {
		bottom: 0,
		left: calculateWidth(deploy, test),
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Export",
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

	let scripts = window.createElement("scripts", {
		bottom: 0,
		left: calculateWidth(deploy, test, exportButton),
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Scripts",
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

	let projects = window.createElement("projects", {
		bottom: 0,
		left: calculateWidth(deploy, test, exportButton, scripts),
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Projects",
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
	projects.on("click", async () => {
		await window.openWindow("Projects");
	});

	let deployments = window.createElement("deployments", {
		bottom: 0,
		left: calculateWidth(deploy, test, exportButton, scripts, projects),
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Deployments",
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
		left: calculateWidth(
			deploy,
			test,
			exportButton,
			scripts,
			projects,
			deployments
		),
		shrink: true,
		width: "shrink",
		height: "shrink",
		padding: 1,
		content: "Networks",
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
	networks.on("click", async () => {
		await window.openWindow("Networks");
	});
};

export default Menu;
