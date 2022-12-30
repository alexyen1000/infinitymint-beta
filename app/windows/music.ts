import { debugLog, warning } from "../helpers";
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

export const tracks = ["f10_f2.mp3", "contents.mp3", "shakes.mp3"].map(
	(file) => "/resources/ost/" + file
);

let clockInterval;

const onFinished = async (window: InfinityMintWindow) => {
	console.log("test");
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
		window.options.clock = window.options.clock + 1;
		window.getInfinityConsole().getCurrentWindow()?.updateFrameTitle();
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
	});

	window.key("p", async () => {
		if (window.getInfinityConsole().isAwaitingKill()) {
			warning("awaiting audio to be killed, cannot change track");
			return;
		}

		await onFinished(window);
	});
};
Music.setBackgroundThink(true);
Music.setShouldInstantiate(true);
export default Music;
