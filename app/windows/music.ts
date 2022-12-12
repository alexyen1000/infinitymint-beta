import { debugLog } from "../helpers";
import { InfinityMintWindow } from "../window";

const Music = new InfinityMintWindow(
	"Music",
	{
		fg: "white",
		bg: "green",
		border: {
			fg: "#f0f0f0",
		},
	},
	{
		type: "line",
	}
);
Music.setBackgroundThink(true);

export default Music;
