import Logging from "../logging";
import { InfinityMintWindow } from "../window";

const Menu = new InfinityMintWindow(
	"Menu",
	{
		fg: "white",
		bg: "blue",
		border: {
			fg: "#f0f0f0",
		},
	},
	{
		type: "line",
	}
);

Menu.initialize = (window, frame, blessed) => {
	let background = window.registerElement(
		"console",
		blessed.box({
			width: "100%",
			height: "100%-8",
			padding: 1,
			top: 4,
			label: " {bold}{white-fg}Menu{/white-fg}{/bold}",
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
	background.setBack();

	window.registerElement(
		"deploy",
		blessed.box({
			top: "center",
			left: 2,
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
		})
	);

	window.registerElement(
		"test",
		blessed.box({
			top: "center",
			left: 2 + 10,
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
		})
	);

	window.registerElement(
		"export",
		blessed.box({
			top: "center",
			left: 2 + 10 + 8,
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
		})
	);

	window.registerElement(
		"scripts",
		blessed.box({
			top: "center",
			left: 2 + 10 + 8 + 10,
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
		})
	);

	window.registerElement(
		"projects",
		blessed.box({
			top: "center",
			left: 2 + 10 + 8 + 8 + 13,
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
		})
	);

	window.registerElement(
		"deployments",
		blessed.box({
			top: "center",
			left: 2 + 10 + 8 + 8 + 8 + 17,
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
		})
	);

	window.registerElement(
		"networks",
		blessed.box({
			top: "center",
			left: 2 + 10 + 8 + 8 + 8 + 10 + 22,
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
		})
	);
};

export default Menu;
