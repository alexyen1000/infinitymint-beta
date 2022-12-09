import Logging from "../logging";
import { InfinityMintWindow } from "../window";

const Menu = new InfinityMintWindow(
	"Menu",
	{
		fg: "white",
		bg: "yellow",
		border: {
			fg: "#f0f0f0",
		},
	},
	{
		type: "line",
	}
);

export default Menu;
