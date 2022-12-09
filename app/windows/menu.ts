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
};

export default Menu;
