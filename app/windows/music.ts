import { getConfigFile, isInfinityMint, warning } from "../helpers";
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

export const tracks = ["contents.mp3", "menu.mp3"].map((file) =>
	isInfinityMint()
		? "/resources/ost/" + file
		: "/node_modules/infinitymint/resources/ost/" + file
);

let clockInterval: any;
const onFinished = async (window: InfinityMintWindow) => {
	if (!window.hasInfinityConsole()) return;
	//gets the music window
	let musicWindow = window.getInfinityConsole().getWindow("Music");
	musicWindow.options.currentTrack =
		tracks[Math.floor(Math.random() * tracks.length)];
	musicWindow.options.clock = 0;

	//stops any audio
	if (window.getInfinityConsole().hasAudio()) {
		await window.getInfinityConsole().stopAudio();
		if (!window.hasInfinityConsole()) return;
	}
	//plays audio
	window
		.getInfinityConsole()
		.playAudio(musicWindow.options.currentTrack, onFinished);

	if (window.getInfinityConsole().hasCurrentWindow())
		window.getInfinityConsole().getCurrentWindow()?.updateFrameTitle();
};
Music.initialize = async (window, frame, blessed) => {
	if (getConfigFile().music !== true) return;

	if (clockInterval) clearInterval(clockInterval);
	window.options.clock = 0;

	clockInterval = setInterval(() => {
		if (!window.hasInfinityConsole()) return;

		try {
			window.options.clock = window.options.clock + 1;

			if (window.getInfinityConsole().hasCurrentWindow())
				window
					.getInfinityConsole()
					.getCurrentWindow()
					.updateFrameTitle();
		} catch (error) {
			warning(error.message);
		}
	}, 1000);

	if (window.getInfinityConsole().hasAudio()) {
		await window.getInfinityConsole().stopAudio();
		if (!window.hasInfinityConsole()) return;
	}

	window.options.currentTrack =
		tracks[Math.floor(Math.random() * tracks.length)];

	//continues playing tracks
	window
		.getInfinityConsole()
		.playAudio(window.options.currentTrack, onFinished);
	window.on("destroy", async () => {
		if (window.getInfinityConsole().hasAudio())
			await window.getInfinityConsole().stopAudio();

		clearInterval(clockInterval);
	});
};
Music.setBackgroundThink(true);
Music.setShouldInstantiate(true);
Music.setHiddenFromMenu(getConfigFile().music !== true);
export default Music;
