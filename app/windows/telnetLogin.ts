import { getInfinityMintVersion } from "@app/helpers";
import { InfinityMintWindow } from "../window";

const Login = new InfinityMintWindow(
	"Login",
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

Login.initialize = async (window, frame, bessed) => {
	window.createElement("form", {
		width: "shrink",
		height: "shrink",
		left: "center",
		top: "center",
		padding: 2,
		tags: true,
		content: `InfinityMint ${getInfinityMintVersion()} {underline}Telnet Server{/underline}\n\n{white-fg}Please Login:{/white-fg}`,
		border: "line",
		style: {
			fg: "green",
			bg: "black",
			border: {
				fg: "green",
			},
		},
	});

	window.key("C-c", () => {
		//destroys the InfinityConsole
		window.getInfinityConsole().destroy();
	});
};

Login.setForcedOpen(true);
Login.setHideRefreshButton(true);
Login.setHideMinimizeButton(true);
Login.setHideCloseButton(true);

export default Login;
