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
Menu.initialize = (window, frame) => {};
export default Menu;
