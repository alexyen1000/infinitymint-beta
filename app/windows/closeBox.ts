import { debugLog } from "../helpers";
import { InfinityMintWindow } from "../window";

const CloseBox = new InfinityMintWindow(
	"CloseBox",
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

CloseBox.initialize = async (window, frame, blessed) => {
	let text = window.registerElement(
		"text",
		blessed.box({
			left: "center",
			top: "center",
			width: "shrink",
			height: "shrink",
			padding: 2,
			content: "Are You Sure You Would You Like To Close InfinityMint?",
		})
	);

	//create buttons
	let closeInfinityMint = window.registerElement(
		"close",
		blessed.box({
			bottom: 0,
			left: 0,
			shrink: true,
			width: "shrink",
			height: "shrink",
			padding: 1,
			content: "Close InfinityMint",
			tags: true,
			border: {
				type: "line",
			},
			style: {
				fg: "white",
				bg: "red",
				border: {
					fg: "#ffffff",
				},
				hover: {
					bg: "grey",
				},
			},
		})
	);
	closeInfinityMint.on("click", () => {
		process.exit(0);
	});

	let keepInfinityMint = window.registerElement(
		"keepOpen",
		blessed.box({
			bottom: 0,
			right: 0,
			shrink: true,
			width: "shrink",
			height: "shrink",
			padding: 1,
			content: "Keep InfinityMint Open",
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
	keepInfinityMint.on("click", async () => {
		await window.openWindow(window.options.currentWindow || "Menu");
	});
};

export default CloseBox;
