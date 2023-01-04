import { debugLog, isInfinityMint, warning } from "../helpers";
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
	if (window.getInfinityConsole() === undefined) return;
	//gets the music window
	let musicWindow = window.getInfinityConsole().getWindow("Music");
	musicWindow.options.currentTrack =
		tracks[Math.floor(Math.random() * tracks.length)];
	musicWindow.options.clock = 0;

	//stops any audio
	if (window.getInfinityConsole().hasAudio()) {
		await window.getInfinityConsole().stopAudio();
	}

	//plays audio
	window
		.getInfinityConsole()
		.playAudio(musicWindow.options.currentTrack, onFinished);
	window.getInfinityConsole().getCurrentWindow()?.updateFrameTitle();
};
Music.initialize = async (window, frame, blessed) => {
	if (clockInterval) clearInterval(clockInterval);
	window.options.clock = 0;

	clockInterval = setInterval(() => {
		if (window.getInfinityConsole() === undefined) return;

		try {
			window.options.clock = window.options.clock + 1;
			window.getInfinityConsole().getCurrentWindow()?.updateFrameTitle();
		} catch (error) {
			warning(error.message);
		}
	}, 1000);

	if (window.getInfinityConsole().hasAudio()) {
		await window.getInfinityConsole().stopAudio();
	}

	window.options.currentTrack =
		tracks[Math.floor(Math.random() * tracks.length)];

	//continues playing tracks
	window
		.getInfinityConsole()
		.playAudio(window.options.currentTrack, onFinished);
	window.on("destroy", () => {
		if (window.getInfinityConsole().hasAudio())
			window.getInfinityConsole().stopAudio();

		clearInterval(clockInterval);
	});
};
Music.setBackgroundThink(true);
Music.setShouldInstantiate(true);
export default Music;
