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
	let content =
		"{red-bg}ARE YOU SURE YOU WANT TO CLOSE INFINITYMINT?{/red-bg}\nMake sure that you are done with your current ganache deployments as they could be lost when this window is closed.";

	window.registerElement(
		"text",
		blessed.box({
			left: "center",
			top: "center",
			width: "shrink",
			height: "shrink",
			padding: 2,
			tags: true,
			content: content,
		})
	);

	//create buttons
	let closeInfinityMint = window.registerElement(
		"close",
		blessed.box({
			bottom: 2,
			left: 2,
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
			bottom: 2,
			right: 2,
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
