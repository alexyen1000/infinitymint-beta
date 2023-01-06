import { InfinityMintWindow } from "../window";

const Script = new InfinityMintWindow(
	"Script",
	{
		fg: "white",
		bg: "black",
		border: {
			fg: "#f0f0f0",
		},
	},
	{
		type: "line",
	}
);

Script.setBackgroundThink(true);
Script.setHiddenFromMenu(true);
Script.think = (window) => {};
Script.initialize = async (window, frame, blessed) => {
	if (window.data.script === undefined)
		throw new Error("must be instantated with script in data field");
};
export default Script;
